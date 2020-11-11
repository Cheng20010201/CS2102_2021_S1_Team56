/* Demo insertion of names */
INSERT INTO collaborators 
VALUES (1, 'Huang Ge Xiang'), (2, 'Sun Yu Cheng'), (3, 'Xu Zhi Zhi'), (4, 'Zhao Huan'), (5, 'Zhang Xin Yi');

-- Development testing phase

-- petowner: e0493630@u.nus.edu
-- caretaker: sunyuchengsyc@163.com

-- admin insertion
INSERT INTO users VALUES ('a@admin.com', 000000);
INSERT INTO users VALUES ('b@admin.com', 000000);
INSERT INTO users VALUES ('c@admin.com', 000000);
INSERT INTO pcsadmin VALUES ('a@admin.com', 'a');
INSERT INTO pcsadmin VALUES ('b@admin.com', 'b');
INSERT INTO pcsadmin VALUES ('c@admin.com', 'c');

-- category insertion
INSERT INTO category VALUES ('cat', 10.00);
INSERT INTO category VALUES ('dog', 15.00);
INSERT INTO category VALUES ('mouse', 20.00);
INSERT INTO category VALUES ('squirrel', 25.00);
INSERT INTO category VALUES ('pig', 30.00);
INSERT INTO category VALUES ('ferret', 35.00);
INSERT INTO category VALUES ('bird', 40.00);
INSERT INTO category VALUES ('insect', 45.00);
INSERT INTO category VALUES ('frog', 50.00);
INSERT INTO category VALUES ('turtle', 55.00);
INSERT INTO category VALUES ('fish', 60.00);
INSERT INTO category VALUES ('snake', 65.00);
INSERT INTO category VALUES ('lizzard', 70.00);

/*availability insertion*/
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-10', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-11', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-12', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-13', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-14', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-15', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-16', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-17', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-18', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-19', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-20', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-21', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-20', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-22', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-23', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-24', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-25', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-26', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-27', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-28', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-29', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@163.com', '2020-11-30', TRUE);

/*capable insertion*/
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'cat', 10.00 + 5);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'dog', 15.00);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'mouse', 20.00 + 5);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'squirrel', 25.00 + 5);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'pig', 30.00 + 5);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'ferret', 35.00 + 5);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'bird', 40.00 + 5);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'insect', 45.00 + 5);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'frog', 50.00 + 5);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'turtle', 55.00 + 5);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'fish', 60.00);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'snake', 65.00);
INSERT INTO capable VALUES ('sunyuchengsyc@163.com', 'lizzard', 70.00);

/*petowner insertion*/
INSERT INTO pet VALUES ('a', 'e0493630@u.nus.edu', 'cat', TRUE, 2, 'Not too much to worry about.');
INSERT INTO pet VALUES ('b', 'e0493630@u.nus.edu', 'dog', TRUE, 2, 'Not too much to worry about.');
INSERT INTO pet VALUES ('c', 'e0493630@u.nus.edu', 'mouse', TRUE, 2, 'Not too much to worry about.');
INSERT INTO pet VALUES ('d', 'e0493630@u.nus.edu', 'squirrel', TRUE, 2, 'Not too much to worry about.');
INSERT INTO pet VALUES ('e', 'e0493630@u.nus.edu', 'pig', TRUE, 2, 'Not too much to worry about.');
INSERT INTO pet VALUES ('f', 'e0493630@u.nus.edu', 'ferret', TRUE, 2, 'Not too much to worry about.');
INSERT INTO pet VALUES ('g', 'e0493630@u.nus.edu', 'bird', TRUE, 2, 'Not too much to worry about.');
INSERT INTO pet VALUES ('h', 'e0493630@u.nus.edu', 'insect', TRUE, 2, 'Not too much to worry about.');
INSERT INTO pet VALUES ('i', 'e0493630@u.nus.edu', 'turtle', TRUE, 2, 'Not too much to worry about.');
INSERT INTO pet VALUES ('j', 'e0493630@u.nus.edu', 'fish', TRUE, 2, 'Not too much to worry about.');
INSERT INTO pet VALUES ('k', 'e0493630@u.nus.edu', 'snake', TRUE, 2, 'Not too much to worry about.');
INSERT INTO pet VALUES ('l', 'e0493630@u.nus.edu', 'lizzard', TRUE, 2, 'Not too much to worry about.');

/*bids info insertion*/
--- these should be immediate accepted
INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-10', '2020-11-11', 'sunyuchengsyc@163.com', 'a', 'e0493630@u.nus.edu', 2, 'deliver', 'cash', 60.00);

INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-10', '2020-11-11', 'sunyuchengsyc@163.com', 'b', 'e0493630@u.nus.edu', 2, 'pickup', 'cash', 60.00);

INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-10', '2020-11-11', 'sunyuchengsyc@163.com', 'c', 'e0493630@u.nus.edu', 2, 'pickup', 'cash', 60.00);

INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-10', '2020-11-11', 'sunyuchengsyc@163.com', 'd', 'e0493630@u.nus.edu', 2, 'physical', 'cash', 60.00);

INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-10', '2020-11-11', 'sunyuchengsyc@163.com', 'e', 'e0493630@u.nus.edu', 2, 'physical', 'cash', 60.00);

INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-12', '2020-11-15', 'sunyuchengsyc@163.com', 'a', 'e0493630@u.nus.edu', 4, 'deliver', 'card', 60.00);

INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-12', '2020-11-15', 'sunyuchengsyc@163.com', 'b', 'e0493630@u.nus.edu', 4, 'deliver', 'card', 60.00);

INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-12', '2020-11-15', 'sunyuchengsyc@163.com', 'c', 'e0493630@u.nus.edu', 4, 'deliver', 'card', 60.00);

INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-12', '2020-11-15', 'sunyuchengsyc@163.com', 'd', 'e0493630@u.nus.edu', 4, 'deliver', 'card', 60.00);

--- this one should be immediate rejected
INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-10', '2020-11-11', 'sunyuchengsyc@163.com', 'f', 'e0493630@u.nus.edu', 2, 'physical', 'cash', 60.00);

-- salary test data insertion
-- first need to receives_payment
INSERT INTO receives_payment 
VALUES 
('a@admin.com', 60, '2020-11-10', '2020-11-11', 'sunyuchengsyc@163.com', 'a', 'e0493630@u.nus.edu');

INSERT INTO receives_payment 
VALUES 
('a@admin.com', 60, '2020-11-12', '2020-11-15', 'sunyuchengsyc@163.com', 'd', 'e0493630@u.nus.edu');

-- then can just add salary, assuming we have reached the end of month
-- currently the entry is dummy :/
INSERT INTO salary VALUES ('sunyuchengsyc@163.com', 120, 2020, 11);


-- test bid functionality for part time user
INSERT INTO users VALUES ('sunyuchengsyc@gmail.com', 000914);
INSERT INTO caretaker VALUES 
('sunyuchengsyc@gmail.com', 'sun yu cheng part time', '00000000', NULL, 2, 'part time', 'Kent Ridge');
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'cat', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'dog', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'mouse', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'squirrel', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'pig', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'ferret', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'bird', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'insect', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'frog', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'fish', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'snake', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'lizzard', 100);
INSERT INTO capable VALUES ('sunyuchengsyc@gmail.com', 'turtle', 100);
INSERT INTO available VALUES ('sunyuchengsyc@gmail.com', '2020-11-21', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@gmail.com', '2020-11-22', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@gmail.com', '2020-11-23', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@gmail.com', '2020-11-24', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@gmail.com', '2020-11-25', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@gmail.com', '2020-11-26', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@gmail.com', '2020-11-27', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@gmail.com', '2020-11-28', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@gmail.com', '2020-11-29', TRUE);
INSERT INTO available VALUES ('sunyuchengsyc@gmail.com', '2020-11-30', TRUE);
INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-21', '2020-11-23', 'sunyuchengsyc@gmail.com', 'a', 'e0493630@u.nus.edu', 3, 'deliver', 'cash', 100);
INSERT INTO bids 
(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
VALUES
('2020-11-21', '2020-11-22', 'sunyuchengsyc@gmail.com', 'b', 'e0493630@u.nus.edu', 2, 'pickup', 'card', 100);