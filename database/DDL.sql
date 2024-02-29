/*
    Team Gyudon (Group 67) -- Alex Blumenstock & Rob MacPherson
	PROJECT TITLE: CocktailsCodex
    CS 340 - Project Step 3
    Date: 3/1/2024
	
	DATA DEFINITION QUERIES + SAMPLE DATA
*/

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

CREATE OR REPLACE TABLE Ingredients 
(
  id INT NOT NULL AUTO_INCREMENT,
  ingredientName VARCHAR(50) NOT NULL,
  amountOnHand DECIMAL(10,2) NULL,
  PRIMARY KEY (`id`)
);



CREATE OR REPLACE TABLE Tools 
(
  id INT NOT NULL AUTO_INCREMENT,
  toolName VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
);


CREATE OR REPLACE TABLE DrinkCategories 
(
  id INT NOT NULL AUTO_INCREMENT,
  category VARCHAR(45) NOT NULL,
  description VARCHAR(225) NOT NULL, 
  PRIMARY KEY (`id`)
);



CREATE OR REPLACE TABLE Customers 
(
  id INT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
);



CREATE OR REPLACE TABLE Cocktails
(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(225) NOT NULL,
  instructions LONGTEXT NULL,
  glassUsed VARCHAR(225) NOT NULL,
  cocktailToolID INT NOT NULL,
  cocktailIngredientsID INT NOT NULL,
  drinkCategoryID INT NOT NULL,
  PRIMARY KEY (`id`)
);



CREATE OR REPLACE TABLE Cocktail_has_Ingredients 
(
  cocktailIngredientsID INT NOT NULL AUTO_INCREMENT,
  cocktailID INT NOT NULL,
  ingredientID INT NOT NULL,
  amountUsed DECIMAL (10,2),
  PRIMARY KEY (`cocktailIngredientsID`),
  FOREIGN KEY (`cocktailID`)
    REFERENCES `Cocktails` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  FOREIGN KEY (`ingredientID`)
    REFERENCES `Ingredients` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
);



CREATE OR REPLACE TABLE Cocktail_has_Tools 
(
  cocktailToolID INT NOT NULL AUTO_INCREMENT,
  cocktailID INT NOT NULL,
  toolID INT,
  PRIMARY KEY (`cocktailToolID`),
  FOREIGN KEY (`cocktailID`)
    REFERENCES `Cocktails` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  FOREIGN KEY (`toolID`)
    REFERENCES `Tools` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
);



CREATE OR REPLACE TABLE DrinkCategories_has_Customers 
(
  drinkCategoriesCustomersID INT NOT NULL AUTO_INCREMENT,
  drinkCategoryID INT NOT NULL,
  customerID INT NOT NULL,
  PRIMARY KEY (`drinkCategoriesCustomersID`),
  FOREIGN KEY (`drinkCategoryID`)
    REFERENCES `DrinkCategories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  FOREIGN KEY (`customerID`)
    REFERENCES `Customers` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
);

DESCRIBE Ingredients;
DESCRIBE Tools;
DESCRIBE DrinkCategories;
DESCRIBE Customers;
DESCRIBE Cocktails;
DESCRIBE Cocktail_has_Ingredients;
DESCRIBE Cocktail_has_Tools;
DESCRIBE DrinkCategories_has_Customers;


/*--------------------------------------------------*/
/*--------DATA--------DATA--------DATA--------*/
/*--------------------------------------------------*/

/*--------*/
INSERT INTO Ingredients (ingredientName, amountOnHand)
VALUES
('bourbon', 750),
('simple syrup', 1000),
('gin', 750),
('bitters', NULL),
('cherry', 28),
('orange peel', NULL),
('scotch', 1000),
('drambuie', 750),
('sugar', NULL),
('lemon peel', NULL),
('sweet vermouth', 750),
('campari', 750),
('brandy', 750),
('crème de cacao', 750),
('cream', 300),
('lemon', 7),
('soda', NULL),
('nutmeg', 2),
('old tom gin', 750);

/*--------*/
INSERT INTO Tools (toolName)
VALUES
('juicer'),
('shaker'),
('bar spoon'),
('mixing glass'),
('nutmeg grater');

/*--------*/
INSERT INTO DrinkCategories (category, description)
VALUES
('old fashioned', 'stirred spirit on ice with sweet component'),
('daiquiri', 'shaken spirit served with lime'),
('martini', 'stirred spirit served up with no sweetener'),
('highball', 'spirit with soda or bubbles on ice'),
('flip', 'spirit with cream and egg'),
('sidecar', 'spirit shaken with lemon');

/*--------*/
INSERT INTO Cocktails(name, instructions, glassUsed, drinkCategoryID)
VALUES

(
  'Old Fashioned', 
  'Muddle sugar, bitters, and cherry before adding bourbon. Garnish with orange twist.',
  'Rocks',
  1
),

(
  'Rusty Nail', 
  'Garnish with lemon twist.',
  'Rocks',
  1
),

(
  'Negroni', 
  'Garnish with orange twist.',
  'Rocks',
  1
),

(
  'Brandy Alexander', 
  'Shake and strain into chilled glass. Garnish with freshly grated nutmeg.',
  'Coupe',
  5
),

(
  'Tom Collins', 
  'Juice lemon. Mix. Top with soda. Garnish with lemon and cherry.',
  'Highball',
  4
);


/*--------*/
INSERT INTO Cocktail_has_Ingredients (cocktailID, ingredientID, amountUsed)
VALUES
  /*--Old Fashioned--*/
  (1, 1, 2), /*bourbon*/
  (1, 4, 2), /* bitters*/
  (1, 5, 1), /* cherry*/
  (1, 6, 1), /* orange peel*/
  
    /*--Rusty Nail--*/
  (2, 7, 1.5), /* scotch*/
  (2, 8, .75), /* drambuie*/
  (2, 16, 1), /* lemon peel*/
  
    /*--Negroni--*/
  (3, 3, 1), /* gin */
  (3, 12, 1), /* campari */
  (3, 11, 1), /* vermouth */
  (3, 6, 1), /* orange peel */
  
    /*--Brandy Alexander--*/
  (4, 13, 1), /* brandy */
  (4, 14, 1), /* crème de cacao */
  (4, 15, 1), /* cream */
  (4, 18, 1), /* nutmeg */
  
    /*--Tom Collins--*/
  (5, 19, 1.5), /* old tom gin */
  (5, 16, 1), /* lemon */
  (5, 2, .5), /* simple syrup */
  (5, 17, 2); /* soda */

/*--------*/
INSERT INTO Cocktail_has_Tools (cocktailID, toolID)
VALUES
  /*--Old Fashioned--*/
  (1, 3), /* bar spoon */

    /*--Rusty Nail--*/
  (2, 3), /* bar spoon */
  
    /*--Negroni--*/
  (3, 3), /* bar spoon */
  
    /*--Brandy Alexander--*/
  (4, 2), /* shaker */
  (4, 3), /* bar spoon */
  (4, 5), /* nutmeg grater */
  
    /*--Tom Collins--*/
  (5, 1), /* juicer */
  (5, 3); /* bar spoon */


/*--------*/
INSERT INTO Customers (firstName, lastName)
VALUES
  ('John', 'Smith'),
  ('Mary', 'Watson'),
  ('Karen', 'Carson');

/*--------*/
INSERT INTO DrinkCategories_has_Customers (customerID, drinkCategoryID)
VALUES
  (1, 4),
  (2, 3),
  (3, 6);
  
  
SET FOREIGN_KEY_CHECKS=1;
COMMIT;


SELECT * FROM Ingredients;
SELECT * FROM Tools;
SELECT * FROM DrinkCategories;
SELECT * FROM Customers;
SELECT * FROM Cocktails;
SELECT * FROM Cocktail_has_Ingredients;
SELECT * FROM Cocktail_has_Tools;
SELECT * FROM DrinkCategories_has_Customers;
