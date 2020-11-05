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
-- (b) Their expected salary for this month
SELECT sum(b.price * 0.75)
FROM bids as b, caretaker as c
WHERE b.ctemail = 'placeholder' and c.email = 'placeholder' and c.timetype = 'part-time' and b.success = true and EXTRACT (MONTH FROM b.endDate) = /*placeholder month number*/ 1;

SELECT  bonus,
        CASE bonus WHEN NULL then 3000
        ELSE bonus + 3000
        END
FROM (SELECT sum(b.price * 0.8)
        FROM bids as b, caretaker as c
        WHERE b.ctemail = 'placeholder' and c.email = 'placeholder' and c.timetype = 'full-time' and b.success = true and EXTRACT (MONTH FROM b.endDate) = /*placeholder month number*/ 1
        OFFSET 60) as bonus
-- (c) etc.
-- Before inserting a bid, check if the caretaker is free from start to end. (zhizhi)
-- If caretaker is free and full-time, set successful, insert to caretaker_cares_at
-- If caretaker is free and part-time, set not successful (yet)
-- If caretaker is not free, raise exception
CREATE OR REPLACE FUNCTION check_available_before_insert() RETURNS TRIGGER AS $$
DECLARE unavailable BOOLEAN;
DECLARE available_2 BOOLEAN;
DECLARE mail VARCHAR;
DECLARE timetype VARCHAR;
DECLARE max INT;
DECLARE count INT;
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

    IF unavailable IS NOT NULL OR NOT available_2 THEN
        NEW.success = false;
--         RAISE NOTICE 'check % and % and %', unavailable, available_2, count;
        RETURN NEW;
    ELSIF unavailable IS NULL AND available_2 AND timetype = 'part time' THEN
--         RAISE NOTICE 'check % and %', unavailable, available_2;
        NEW.success = null;
        RETURN NEW;
    ELSIF unavailable IS NULL AND available_2 AND timetype = 'full time' THEN
--         RAISE NOTICE 'check % and %', unavailable, available_2;
        NEW.success = true;
        INSERT INTO caretaker_cares_at
        SELECT NEW.ctemail, NEW.startDate + i, NEW.poemail, NEW.name
        FROM generate_series(0, (select NEW.endDate - NEW.startDate)) i;
        RETURN NEW;
    ELSE
        RAISE exception 'unexpected behaviour % % % %', unavailable IS NULL, available_2, count, timetype
            USING hint = 'please check if timetype is "part time" or "full time" % % %';
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

    IF unavailable IS NULL AND NEW.success = true THEN
        NEW.success = true;
        INSERT INTO caretaker_cares_at
        SELECT NEW.ctemail, NEW.startDate + i, NEW.poemail, NEW.name
        FROM generate_series(0, (select NEW.endDate - NEW.startDate)) i;
    ELSIF NEW.success = false THEN
        NEW.success = false;
    ELSIF max < 5 THEN
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
