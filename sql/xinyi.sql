get_nearby_caretakers: 'SELECT * FROM caretaker WHERE area = "current area of this customer"', 
get_nearby_petowners: 'SELECT * FROM petowner WHERE area = "current area of this customer" AND email != "current email of this customer"', 
get_pet_info: 'SELECT * FROM pets WHERE poemail = "current email of this customer"', 
--??? get_caretaker_ranked : 'SELECT * FROM caretaker CT WHERE EXISTS(SELECE * FROM available A WHERE CT.ctemail = A.ctemail AND date = A.at AND A.avl)' 
CREATE OR REPLACE FUNCTION update_rating() RETURNS TRIGGER AS $$ 
DECLARE rates NUMERIC; 
BEGIN 
SELECT AVG(rating) INTO rates 
FROM bids B 
WHERE NEW.ctemail = B.ctemail ; 
IF rates > 3 
  AND rates <= 4 THEN 
UPDATE caretaker 
SET rating = rates 
WHERE NEW.ctemail = email; 
-- UPDATE caretaker  
-- SET petnum = 3 
-- WHERE NEW.ctemail = email 
--   AND timetype = 'part time'; 
RETURN NEW;
ELSIF rates > 4
AND rates <= 4.5 THEN 
UPDATE caretaker 
SET rating = rates 
WHERE NEW.ctemail = email; 
-- UPDATE caretaker 
-- SET petnum = 4 
-- WHERE NEW.ctemail = email 
--   AND timetype = 'part time'; 
RETURN NEW; 
ELSIF rates > 4.5 THEN 
UPDATE caretaker 
SET rating = rates 
WHERE NEW.ctemail = email; 
-- UPDATE caretaker  
-- SET petnum = 5 
-- WHERE NEW.ctemail = email 
--   AND timetype = 'part time'; 
RETURN NEW; 
ELSE 
UPDATE caretaker 
SET rating = rates 
WHERE NEW.ctemail = email; 
-- UPDATE caretaker  
-- SET petnum = 2 
-- WHERE NEW.ctemail = email 
--   AND timetype = 'part time'; 
RETURN NEW; 
END IF; 
END; 
$$ LANGUAGE plpgsql; 
CREATE TRIGGER update_rate 
AFTER 
UPDATE ON bids FOR EACH ROW EXECUTE PROCEDURE update_rating();