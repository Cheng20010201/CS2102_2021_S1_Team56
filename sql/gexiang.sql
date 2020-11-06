--search for all caretakers
SELECT caretaker.cname, caretaker.email
FROM caretaker INNER JOIN available ON caretaker.email = available.ctemail
WHERE available.avl = TRUE
--search caretakers by FIRST name
AND caretaker.cname LIKE 'Jon%'
--search caretakers by Last name
AND caretaker.cname LIKE '%smith'
--search caretakers by area
AND caretaker.area = '12345'
--search caretakers by rating
AND caretaker.rating >= 4;

--number of pets taken care of per caretaker
--lowest(undererforming) caretaker at the top
SELECT caretaker.cname, caretaker.email, count(*) AS pets
FROM caretaker INNER JOIN caretaker_cares_at ON
    caretaker.email = caretaker_cares_at.ctemail
--specify month
WHERE EXTRACT(MONTH FROM caretaker_cares_at.at) = 10
GROUP BY caretaker.email
ORDER BY pets ASC;

--number of pets taken care of per month
SELECT to_char(at, 'Mon') AS mon, EXTRACT(year FROM at) AS year, count(*)
FROM caretaker_cares_at
GROUP BY 1,2;

--salary paid per ctemail
SELECT salary.ctemail, salary.amount
FROM salary;

--updates availability upon successful bid
CREATE OR REPLACE FUNCTION updateAvailability() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sucess = TRUE AND OLD.success = FALSE THEN
        UPDATE available
        SET avl = FALSE
        WHERE available.at >= NEW.startDate AND available.at <= NEW.endDate;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER updateAvailability 
    AFTER UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION updateAvailability();

--updates caretaker_cares_at table for all dates for the particular caretaker upon successful bid
CREATE OR REPLACE FUNCTION updatePets() RETURNS TRIGGER AS $$
DECLARE
    d date;
BEGIN
    IF NEW.success = TRUE AND OLD.success = FALSE THEN
        d := NEW.startDate;
        WHILE d <= NEW.endDate
        LOOP
            INSERT INTO caretaker_cares_at(ctemail, at, pet_owner, pet_name)
            VALUES(NEW.ctemail, d, NEW.poemail, NEW.name);
            d := d + interval '1 day';
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER updatePets
    AFTER UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION updatePets();

--update availability table if caretaker reaches max number of pets

--makes bid automatically successful if caretaker is free
CREATE OR REPLACE FUNCTION autoAccept() RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*)
        FROM NEW INNER JOIN caretaker ON caretaker.email = NEW.ctemail
        WHERE caretaker.timetype = 'full time') > 0 AND
        (SELECT COUNT(*)
         FROM available
         WHERE available.at >= NEW.startDate AND available.at <= NEW.endDate
         AND available.ctemail = NEW.ctemail) = (NEW.endDate - NEW.startDate) + 1
    THEN
        UPDATE bids
        SET success = TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER autoAccept
    AFTER INSERT ON bids
    FOR EACH ROW
    EXECUTE FUNCTION autoAccept();

--maintain non-overlap between admin and po/ct
CREATE OR REPLACE FUNCTION adminOverlap() RETURNS TRIGGER AS $$
DECLARE ctx NUMERIC;
BEGIN
    SELECT COUNT(*) INTO ctx
    FROM petowner, caretaker
    WHERE NEW.email = petowner.email OR NEW.email = caretaker.email;
    IF ctx > 0 THEN
        RETURN NULL;
    ELSE
        RETURN NEW;
    END IF; 
END;
$$ LANGUAGE plpgsql;
    

CREATE TRIGGER adminOverlap
    BEFORE INSERT OR UPDATE ON pcsadmin
    FOR EACH ROW EXECUTE FUNCTION adminOverlap();

--maintain covering constraint
CREATE OR REPLACE FUNCTION cover() RETURNS TRIGGER AS $$
DECLARE ctx NUMERIC;
BEGIN
    SELECT COUNT(*) INTO ctx
    FROM users
    WHERE users.email = NEW.email;
    IF ctx > 0 THEN
        RETURN NEW;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER coverAdmin
    BEFORE INSERT OR UPDATE ON pcsadmin
    FOR EACH ROW EXECUTE FUNCTION cover();

CREATE TRIGGER coverPO
    BEFORE INSERT OR UPDATE ON petowner
    FOR EACH ROW EXECUTE FUNCTION cover();

CREATE TRIGGER coverCT
    BEFORE INSERT OR UPDATE ON caretaker
    FOR EACH ROW EXECUTE FUNCTION cover();
