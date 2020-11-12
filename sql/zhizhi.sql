-- 1. Support the creation/deletion/update of data for the different users (Pet Owner, Care Taker, and PCS Administrator).
INSERT INTO users VALUES ('email', 'password');
INSERT INTO petowner (email, pname, phonenum, creditnum, area)
VALUES ((SELECT email FROM users WHERE email = 'email'), '', '', '', '');
INSERT INTO caretaker (email, cname, phonenum, rating, timetype, area)
VALUES ((SELECT email FROM users WHERE email = 'email'), '', '', /*placeholder numeric*/1, '', '');
INSERT INTO pcsadmin (email, pname)
VALUES ((SELECT email FROM users WHERE email = 'email'), '');

INSERT INTO pet (name, poemail, type, gender, age, req)
VALUES ('name', 'poemail', 'type', /*placeholder gender*/ true, /*placeholder int*/1, 'text');

UPDATE users
SET password = 'new password'
WHERE email = 'email';
UPDATE petowner
SET pname = 'pname', phonenum = 'phonenum', creditnum = 'creditnum', area = 'area'
WHERE email = 'email';
UPDATE caretaker
SET cname = 'cname', phonenum = 'phonenum', rating = /*placeholder numeric*/1, timetype = 'part-time', area = 'area'
WHERE email = 'email';
UPDATE pcsadmin
SET pname = 'new name'
WHERE email = 'email';

UPDATE pet
SET name = 'new name', poemail = 'new email', type = 'type', gender = /*placeholder gender*/ true, age = /*placeholder int*/1, req = 'text'
WHERE poemail = 'email' and name = 'name';

-- 2. Support data access for the different users (
-- Pet Owner can view reviews of Care Taker, their own past orders,
SELECT /*'(placeholder)' as cte*/ b.ctemail, b.poemail, b.endDate, b.rating, b.reviews
FROM bids as b
WHERE b.ctemail = 'placeholder' and b.success = true;

SELECT /*'(placeholder)' as poemail*/ b.poemail, b.ctemail, b.name, b.startDate, b.endDate, b.price, b.payment_method, b.rating, b.reviews
FROM bids as b
WHERE b.poemail = 'placeholder' and b.success = true;

-- Care Taker can see their review, their past jobs, their salary, etc.
SELECT /*'(placeholder)' as cte*/ b.ctemail, b.poemail, b.name, b.startDate, b.endDate, b.rating, b.reviews
FROM bids as b
WHERE b.ctemail = 'placeholder' and b.success = true;

SELECT /*'(placeholder)' as cte*/ b.ctemail, b.poemail, b.name, b.startDate, b.endDate, b.price, b.payment_method, b.rating, b.reviews
FROM bids as b
WHERE b.ctemail = 'placeholder' and b.success = true;

SELECT /*'(placeholder)' as cte*/ s.ctemail, s.year, s.month, s.amount
FROM salary as s
WHERE s.ctemail = 'placeholder';

-- 3. Support the browsing of summary information for Care Taker. For instance, it can be one of the following:
-- (a) Total number of pet-day this month.
SELECT count(/*'(placeholder)' as cte*/ s.ctemail)
FROM caretaker_cares_at as s
WHERE s.ctemail = 'placeholder' and EXTRACT (MONTH FROM s.at) = /*placeholder month number*/ 1;
-- -- (b) Their expected salary for this month
CREATE OR REPLACE FUNCTION calc_salary(mail VARCHAR, month INT, year INT) RETURNS NUMERIC AS $$
DECLARE salary NUMERIC;
DECLARE ttype VARCHAR;
BEGIN
    SELECT timetype into ttype FROM caretaker WHERE email = mail;
    IF ttype = 'part time' THEN
        SELECT sum(b.price * (b.endDate - b.startDate + 1) * 0.75) into salary
        FROM bids as b
        WHERE b.ctemail = mail and b.success = true and EXTRACT (MONTH FROM b.endDate) = month and EXTRACT (YEAR FROM b.endDate) = year;
    ELSIF ttype = 'full time' THEN
        SELECT  CASE WHEN SUM(bonus.price) IS NULL then 3000
                ELSE SUM(bonus.price * 0.8) + 3000
                END into salary
        FROM (SELECT DISTINCT c.ctemail, c.at, c.pet_owner, c.pet_name, b.price
        FROM caretaker_cares_at as c JOIN bids as b on b.ctemail = c.ctemail and b.success and b.poemail = c.pet_owner and b.name = c.pet_name and c.at BETWEEN b.startDate AND b.endDate
        WHERE c.ctemail = mail and EXTRACT (MONTH FROM c.at) = month and EXTRACT (YEAR FROM c.at) = year
        OFFSET 60) as bonus;
    ELSE
        return null;
    END IF;
    RETURN salary;
END;
$$ LANGUAGE plpgsql;
-- (c) etc.
-- Before inserting a bid, check if the caretaker is free from start to end. (zhizhi)
-- If caretaker is free and full-time, set successful, insert to caretaker_cares_at
-- If caretaker is free and part-time, set not successful (yet)
-- If caretaker is not free, raise exception
/*
CREATE OR REPLACE FUNCTION check_available_before_insert() RETURNS TRIGGER AS $$
DECLARE unavailable BOOLEAN;
DECLARE available_2 BOOLEAN;
DECLARE mail VARCHAR;
DECLARE timetype VARCHAR;
DECLARE max INT;
DECLARE count INT;
DECLARE capable BOOLEAN;
BEGIN
    SELECT s.email, s.timetype, s.maxpetnum into mail, timetype, max
    FROM caretaker as s
    WHERE email = NEW.ctemail;

    SELECT s.at IS NULL into unavailable
    FROM caretaker_cares_at as s
    WHERE s.ctemail = mail AND s.at BETWEEN NEW.startDate AND NEW.endDate
    GROUP BY s.at
    HAVING count(*) >= max;

    SELECT COUNT(*) into count
    FROM available as s
    WHERE s.ctemail = mail AND s.avl = true AND s.at BETWEEN NEW.startDate AND NEW.endDate;

    SELECT count = NEW.endDate - NEW.startDate + 1 into available_2;

    SELECT COUNT(*) IS NOT NULL into capable
    FROM capable c
    WHERE c.ctemail = mail AND c.type = (SELECT type FROM pet WHERE pet.name = NEW.name);

    IF unavailable IS NOT NULL OR NOT available_2 OR NOT capable THEN
        NEW.success = false;
--         RAISE NOTICE 'check % and % and %', unavailable, available_2, count;
        RETURN NEW;
    ELSIF unavailable IS NULL AND available_2 AND capable AND timetype = 'part time' THEN
--         RAISE NOTICE 'check % and %', unavailable, available_2;
        NEW.success = null;
        RETURN NEW;
    ELSIF unavailable IS NULL AND available_2 AND capable AND timetype = 'full time' THEN
--         RAISE NOTICE 'check % and %', unavailable, available_2;
        NEW.success = true;
        INSERT INTO caretaker_cares_at
        SELECT NEW.ctemail, NEW.startDate + i, NEW.poemail, NEW.name
        FROM generate_series(0, (select NEW.endDate - NEW.startDate)) i;
        RETURN NEW;
    ELSE
        RAISE exception 'unexpected behaviour % % % %', unavailable IS NULL, available_2, count, timetype
            USING hint = 'please check if timetype is "part time" or "full time" and is capable of this type of pet.';
    END IF;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_available_before_insert
BEFORE
INSERT ON bids FOR EACH ROW EXECUTE PROCEDURE check_available_before_insert();

-- For part-time caretakers, check if available before accepting the bid
CREATE OR REPLACE FUNCTION check_available_before_update() RETURNS TRIGGER AS $$
DECLARE unavailable BOOLEAN;
DECLARE available_2 BOOLEAN;
DECLARE mail VARCHAR;
DECLARE timetype VARCHAR;
DECLARE max INT;
DECLARE capable BOOLEAN;
BEGIN
    SELECT s.email, s.timetype, s.maxpetnum into mail, timetype, max
    FROM caretaker as s
    WHERE email = NEW.ctemail;

    SELECT s.at IS NOT NULL into unavailable
    FROM caretaker_cares_at as s
    WHERE s.ctemail = mail AND s.at BETWEEN NEW.startDate AND NEW.endDate
    GROUP BY s.at
    HAVING count(*) >= max;

    SELECT COUNT(*) = NEW.endDate - NEW.startDate + 1 into available_2
    FROM available as s
    WHERE s.ctemail = mail AND s.avl = true AND s.at BETWEEN NEW.startDate AND NEW.endDate;

    SELECT COUNT(*) IS NOT NULL into capable
    FROM capable c
    WHERE c.ctemail = mail AND c.type = (SELECT type FROM pet WHERE pet.name = NEW.name);

    IF unavailable IS NULL AND NEW.success = true and capable THEN
        NEW.success = true;
        INSERT INTO caretaker_cares_at
        SELECT NEW.ctemail, NEW.startDate + i, NEW.poemail, NEW.name
        FROM generate_series(0, (select NEW.endDate - NEW.startDate)) i;
    ELSIF NEW.success = false THEN
        NEW.success = false;
    ELSIF max < 5 or NOT capable THEN
        NEW.success = null;
        RAISE NOTICE 'cannot accept bid as caretaker is not available for the duration';
    ELSE
        NEW.success = false;
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_available_before_update
BEFORE
UPDATE ON bids FOR EACH ROW EXECUTE PROCEDURE check_available_before_update();
*/
-- (c) etc.
-- Before inserting a bid, check if the caretaker is free from start to end. (zhizhi)
-- If caretaker is free and full-time, set successful, insert to caretaker_cares_at
-- If caretaker is free and part-time, set not successful (yet)
-- If caretaker is not free, raise exception
CREATE OR REPLACE FUNCTION check_available_before_insert() RETURNS TRIGGER AS $$
DECLARE available BOOLEAN;
DECLARE available_2 BOOLEAN;
DECLARE mail VARCHAR;
DECLARE timetype VARCHAR;
DECLARE max INT;
DECLARE count INT;
DECLARE capable BOOLEAN;
BEGIN
    SELECT s.email, s.timetype, s.maxpetnum into mail, timetype, max
    FROM caretaker as s
    WHERE email = NEW.ctemail;

    IF (SELECT (s.at)
    FROM caretaker_cares_at as s
    WHERE s.ctemail = mail AND s.at BETWEEN NEW.startDate AND NEW.endDate
    GROUP BY s.at
    HAVING count(*) >= max) IS NULL THEN available = true;
    ELSE
        available = false;
    END IF;

    SELECT COUNT(*) into count
    FROM available as s
    WHERE s.ctemail = mail AND s.avl = true AND s.at BETWEEN NEW.startDate AND NEW.endDate;

    SELECT count = NEW.endDate - NEW.startDate + 1 into available_2;

    SELECT COUNT(*) > 0 into capable
    FROM capable c
    WHERE c.ctemail = mail AND c.type = (SELECT type FROM pet WHERE pet.name = NEW.name);

    IF NOT available OR NOT available_2 OR NOT capable THEN
        NEW.success = false;
        -- RAISE NOTICE 'check % and % and %', available, available_2, capable;
        RETURN NEW;
    ELSIF available AND available_2 AND capable AND timetype = 'part time' THEN
        -- RAISE NOTICE 'check % and % %', available, available_2, capable;
        NEW.success = null;
        RETURN NEW;
    ELSIF available AND available_2 AND capable AND timetype = 'full time' THEN
        -- RAISE NOTICE 'check % and % %', available, available_2, capable;
        NEW.success = true;
        INSERT INTO caretaker_cares_at
        SELECT NEW.ctemail, NEW.startDate + i, NEW.poemail, NEW.name
        FROM generate_series(0, (select NEW.endDate - NEW.startDate)) i;
        RETURN NEW;
    ELSE
        RAISE exception 'unexpected behaviour % % % %', available, available_2, capable, timetype
            USING hint = 'please check if timetype is "part time" or "full time" and is capable of this type of pet.';
    END IF;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_available_before_insert
BEFORE
INSERT ON bids FOR EACH ROW EXECUTE PROCEDURE check_available_before_insert();

-- For part-time caretakers, check if available before accepting the bid
CREATE OR REPLACE FUNCTION check_available_before_update() RETURNS TRIGGER AS $$
DECLARE unavailable BOOLEAN;
DECLARE available_2 BOOLEAN;
DECLARE mail VARCHAR;
DECLARE timetype VARCHAR;
DECLARE max INT;
DECLARE capable BOOLEAN;
DECLARE isStatusUpdate BOOLEAN;
BEGIN
    SELECT s.email, s.timetype, s.maxpetnum into mail, timetype, max
    FROM caretaker as s
    WHERE email = NEW.ctemail;

    SELECT timetype = 'part time' AND (OLD.success IS NULL OR NEW.success <> OLD.success ) into isStatusUpdate;

    SELECT s.at IS NOT NULL into unavailable
    FROM caretaker_cares_at as s
    WHERE s.ctemail = mail AND s.at BETWEEN NEW.startDate AND NEW.endDate
    GROUP BY s.at
    HAVING count(*) >= max;

    SELECT COUNT(*) = NEW.endDate - NEW.startDate + 1 into available_2
    FROM available as s
    WHERE s.ctemail = mail AND s.avl = true AND s.at BETWEEN NEW.startDate AND NEW.endDate;

    SELECT COUNT(*) IS NOT NULL into capable
    FROM capable c
    WHERE c.ctemail = mail AND c.type = (SELECT type FROM pet WHERE pet.name = NEW.name);

    IF unavailable IS NULL AND NEW.success = true AND capable AND isStatusUpdate THEN
        NEW.success = true;
        INSERT INTO caretaker_cares_at
        SELECT NEW.ctemail, NEW.startDate + i, NEW.poemail, NEW.name
        FROM generate_series(0, (select NEW.endDate - NEW.startDate)) i;
    ELSIF NEW.success = false AND isStatusUpdate THEN
        NEW.success = false;
        DELETE FROM caretaker_cares_at as c
        WHERE c.ctemail = OLD.ctemail AND c.pet_owner = OLD.poemail AND c.pet_name = OLD.name AND (c.at BETWEEN OLD.startDate AND OLD.endDate);
    ELSIF (max < 5 OR NOT capable) AND isStatusUpdate THEN
        NEW.success = null;
        RAISE NOTICE 'cannot accept bid for now';
    ELSIF max >= 5 AND isStatusUpdate THEN
        NEW.success = false;
    ELSE
        NEW.success = OLD.success;
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_available_before_update
BEFORE
UPDATE ON bids FOR EACH ROW EXECUTE PROCEDURE check_available_before_update();

-- Delete all caretaker_cares_at inserted by the bid when the bid is deleted
CREATE OR REPLACE FUNCTION delete_relevant_rows() RETURNS TRIGGER AS $$
DECLARE ctmail VARCHAR;
DECLARE pomail VARCHAR;
DECLARE pname VARCHAR;
DECLARE sDate DATE;
DECLARE eDATE DATE;
BEGIN
    SELECT OLD.ctemail, OLD.poemail, OLD.name, OLD.startDate, OLD.endDate into ctmail, pomail, pname, sDate, eDATE;

    DELETE FROM caretaker_cares_at as c
    WHERE c.ctemail = ctmail AND c.pet_owner = pomail AND c.pet_name = pname AND (c.at BETWEEN sDate AND eDATE);
    RETURN OLD;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_relevant_rows
AFTER
DELETE ON bids FOR EACH ROW EXECUTE PROCEDURE delete_relevant_rows();

-- Before inserting to capable, check if price is more than base price;
CREATE OR REPLACE FUNCTION check_price() RETURNS TRIGGER AS $$
DECLARE base_price NUMERIC;
BEGIN
    SELECT c.bprice INTO base_price
    FROM category as c
    WHERE c.type = NEW.type;
    IF NEW.dprice < base_price THEN
        NEW.dprice = base_price;
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_price
BEFORE
INSERT ON capable FOR EACH ROW EXECUTE PROCEDURE check_price();
                                 
-- Before inserting to bids, check if creditnum exists for card payment option;
CREATE OR REPLACE FUNCTION check_creditnum() RETURNS TRIGGER AS $$
DECLARE num VARCHAR;
BEGIN
    SELECT creditnum into num
    FROM petowner
    WHERE email = NEW.poemail;
    IF NEW.payment_method = 'card' AND (num IS NULL OR length(num) = 0) THEN
        RAISE NOTICE '%', num;
        RAISE EXCEPTION 'no credit card number';
    ELSE
        RAISE NOTICE '%', num;
        RETURN NEW;
    END IF;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_creditnum
BEFORE
INSERT ON bids FOR EACH ROW EXECUTE PROCEDURE check_creditnum();
