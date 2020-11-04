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