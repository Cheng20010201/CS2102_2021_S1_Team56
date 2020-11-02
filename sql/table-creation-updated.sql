CREATE TABLE collaborators (email VARCHAR PRIMARY KEY, name VARCHAR NOT NULL);

CREATE TABLE users(
  email VARCHAR PRIMARY KEY, 
  password VARCHAR NOT NULL 
);

CREATE TABLE petowner (
  email VARCHAR PRIMARY KEY REFERENCES users(email), 
  pname VARCHAR NOT NULL, 
  phonenum VARCHAR(8) NOT NULL, 
  creditnum VARCHAR, 
  area VARCHAR NOT NULL
);

CREATE TABLE caretaker (
  email VARCHAR PRIMARY KEY REFERENCES users(email), 
  cname VARCHAR NOT NULL, 
  phonenum VARCHAR(8) NOT NULL, 
  rating NUMERIC CHECK(rating IS NULL OR (0 <= rating AND rating <= 5)), 
  /*petnum INTEGER NOT NULL CHECK(0 <= petnum AND petnum<= 5), */
  maxpetnum INTEGER NOT NULL CHECK(0 <= maxpetnum AND maxpetnum <= 5),
  timetype VARCHAR(9) NOT NULL CHECK( 
    timetype = 'full time' 
    OR timetype = 'part time' 
  ), 
  area VARCHAR NOT NULL
);

CREATE TABLE pscadmin (
  email VARCHAR PRIMARY KEY REFERENCES users(email), 
  pname VARCHAR NOT NULL
); 

CREATE TABLE category (
    type VARCHAR PRIMARY KEY,
    bprice NUMERIC(6,2) NOT NULL CHECK(bprice >= 0)
);

CREATE TABLE pet (
    name VARCHAR NOT NULL,
    poemail VARCHAR REFERENCES petowner(email) ON DELETE CASCADE,
    type VARCHAR REFERENCES category,
    gender BOOLEAN,
    age INTEGER CHECK (age IS NULL OR age >= 0),
    req TEXT,
    PRIMARY KEY (name, poemail)
);
/*
CREATE OR REPLACE FUNCTION 
overlap(VARCHAR, DATE)
RETURNS BOOLEAN
AS
  $$BEGIN
    IF EXISTS ( SELECT 1 FROM available 
      WHERE ctemail = $1 AND $2 BETWEEN startDate AND endDate ) THEN
      RETURN false;
    END IF;
    RETURN true;
  END;$$
LANGUAGE plpgsql;
*/
/*
CREATE TABLE available (
    ctemail VARCHAR REFERENCES caretaker(email),
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    PRIMARY KEY (ctemail, startDate, endDate),
    CHECK(endDate >= startDate),
    CHECK(overlap(ctemail, startDate))
);
*/

CREATE TABLE available (
    ctemail VARCHAR REFERENCES caretaker(email),
    at DATE NOT NULL,
    avl BOOLEAN,
    PRIMARY KEY (ctemail, at)
);

CREATE TABLE caretaker_cares_at (
    ctemail VARCHAR REFERENCES caretaker(email),
    at DATE NOT NULL REFERENCES available(at),
    pet_owner VARCHAR,
    pet_name VARCHAR,
    FOREIGN KEY (pet_owner, pet_name) REFERENCES pet(poemail, name)
);


CREATE TABLE capable (
    ctemail VARCHAR REFERENCES caretaker(email),
    type VARCHAR REFERENCES category(type),
    dprice NUMERIC(6, 2) NOT NULL CHECK(dprice >= 0),
    PRIMARY KEY(ctemail, type)
);

CREATE TABLE salary (
    ctemail VARCHAR REFERENCES caretaker(email) ON DELETE CASCADE,
    amount NUMERIC(6, 2) NOT NULL CHECK(amount >= 0),
    year INTEGER NOT NULL CHECK(year > 1900 and year < 2100),
    month INTEGER NOT NULL CHECK(month <= 12 and month >= 1),
    PRIMARY KEY(ctemail, year, month)
);

/*
CREATE TABLE period (
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  PRIMARY KEY (startDate, endDate)
);
*/


CREATE TABLE bids (
  startDate DATE,
  endDate DATE,
  ctemail VARCHAR,
  name VARCHAR,
  poemail VARCHAR,
  rating NUMERIC(6, 2) CHECK(rating IS NULL OR (rating >= 0 AND rating <= 5)),
  reviews TEXT,
  success BOOLEAN,
  duration VARCHAR NOT NULL,
  transfer_method VARCHAR NOT NULL,
  payment_method VARCHAR NOT NULL,
  price NUMERIC(6, 2) NOT NULL,
  PRIMARY KEY (startDate, endDate, ctemail, name, poemail),
  FOREIGN KEY (ctemail, startDate) REFERENCES available(ctemail, at),
  FOREIGN KEY (ctemail, endDate) REFERENCES available(ctemail, at),
  FOREIGN KEY (name, poemail) REFERENCES pet(name, poemail)
);

CREATE TABLE receives_payment (
  pscEmail VARCHAR NOT NULL REFERENCES pscadmin(email),
  amount NUMERIC(6, 2) NOT NULL CHECK(amount >= 0),
  startDate DATE,
  endDate DATE,
  ctemail VARCHAR,
  name VARCHAR,
  poemail VARCHAR,
  PRIMARY KEY(pscEmail, startDate, endDate, ctemail, name, poemail),
  FOREIGN KEY(startDate, endDate, ctemail, name, poemail)
  REFERENCES bids(startDate, endDate, ctemail, name, poemail)
);