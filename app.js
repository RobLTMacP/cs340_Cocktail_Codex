// App.js

/*
    Code adapted from the provided GitHub repository:
    github.com/osu-cs340-ecampus/nodejs-starter-app
*/


/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));
PORT = 9731;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./database/db-connector')
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const { getOptions } = require('forever/lib/forever/cli');
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

/*INDEX*/
app.get('/', function (req, res) {
    res.render('index');                  // Render the index.hbs file, and also send the renderer
});

/*COCKTAILS*/
app.get('/cocktails', function (req, res) {
    let query1 = `SELECT 
    Cocktails.id,
    Cocktails.name,
    Cocktails.instructions,
    Cocktails.glassUsed,
    DrinkCategories.category AS Category_Name,
    GROUP_CONCAT(DISTINCT CONCAT(Ingredients.ingredientName, ': ', Cocktail_has_Ingredients.amountUsed) ORDER BY Cocktail_has_Ingredients.cocktailIngredientsID SEPARATOR ', ') AS Ingredients_Amounts,
    GROUP_CONCAT(DISTINCT Tools.toolName ORDER BY Cocktail_has_Tools.cocktailToolID SEPARATOR ', ') AS Tools_Used
FROM 
    Cocktails
LEFT JOIN 
    Cocktail_has_Ingredients ON Cocktails.id = Cocktail_has_Ingredients.cocktailID
LEFT JOIN 
    Ingredients ON Cocktail_has_Ingredients.ingredientID = Ingredients.id
LEFT JOIN 
    Cocktail_has_Tools ON Cocktails.id = Cocktail_has_Tools.cocktailID
LEFT JOIN 
    Tools ON Cocktail_has_Tools.toolID = Tools.id
    LEFT JOIN 
    DrinkCategories ON Cocktails.drinkCategoryID = DrinkCategories.id
    GROUP BY 
    Cocktails.id;`;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            let data = rows;
            let query2 = `SELECT id, category FROM DrinkCategories;`;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    let categories = rows;
                    res.render('cocktails', { data, categories });
                }
            })
        }
    })
});

// add a cocktail
app.post('/add-cocktail-ajax', function (req, res) {
    // capture incoming data and parse it back to a JS object
    let data = req.body;
    console.log("Data is: ", data);

    // capture null values

    // create a query and run it on the DB   
    let query1 = "INSERT INTO Cocktails(name, instructions, glassUsed, drinkCategoryID) VALUES (?, ?, ?, ?)";
    let query2 = `SELECT 
    Cocktails.*, 
    GROUP_CONCAT(DISTINCT CONCAT(Ingredients.ingredientName, ': ', Cocktail_has_Ingredients.amountUsed) ORDER BY Cocktail_has_Ingredients.cocktailIngredientsID SEPARATOR ', ') AS Ingredients_Amounts,
    GROUP_CONCAT(DISTINCT Tools.toolName ORDER BY Cocktail_has_Tools.cocktailToolID SEPARATOR ', ') AS Tools_Used
FROM 
    Cocktails
LEFT JOIN 
    Cocktail_has_Ingredients ON Cocktails.id = Cocktail_has_Ingredients.cocktailID
LEFT JOIN 
    Ingredients ON Cocktail_has_Ingredients.ingredientID = Ingredients.id
LEFT JOIN 
    Cocktail_has_Tools ON Cocktails.id = Cocktail_has_Tools.cocktailID
LEFT JOIN 
    Tools ON Cocktail_has_Tools.toolID = Tools.id
GROUP BY 
    Cocktails.id;`;
    db.pool.query(query1, [data.name, data.instructions, data.glass, data.category], function (error, rows, results) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        }

        else {
            db.pool.query(query2, function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
})

// Delete Cocktail
app.delete('/delete-cocktail-ajax', function (req, res, next) {
    let data = req.body;
    let cocktailID = parseInt(data.id);
    let query1 = `DELETE FROM Cocktails WHERE id = ?`;

    db.pool.query(query1, [cocktailID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
})

// Update Cocktail 
app.put('/update-cocktail-ajax', function (req, res, next) {
    let data = req.body;
    console.log(req.body);
    let cocktailID = parseInt(data.id);
    let categoryID = parseInt(data.drinkCategory)

    queryUpdateCocktail = `UPDATE Cocktails SET name = ?, instructions = ?, glassUsed = ?, drinkCategoryID = ? WHERE id = ?;`;

    db.pool.query(queryUpdateCocktail, [data.name, data.instructions, data.glass, categoryID, data.id], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            console.log(rows);
            res.send(rows);
        }
    })
})


/*CUSTOMERS*/
app.get('/customers', function (req, res) {
    let query1 = "SELECT Customers.*, DrinkCategories.category AS cocktailCategory FROM Customers LEFT JOIN DrinkCategories_has_Customers ON Customers.id = DrinkCategories_has_Customers.customerID LEFT JOIN DrinkCategories ON DrinkCategories_has_Customers.drinkCategoryID = DrinkCategories.id";               // Define our query
    let query2 = `SELECT * FROM DrinkCategories;`;


    db.pool.query(query1, function (error, rows, fields) {  // execute 1st query

        let customer = rows;

        // run second query
        db.pool.query(query2, (error, rows, fields) => {

            // save the categories
            let cat_data = rows;
            if (error) {
                console.log(error);
            }
            else {
                return res.render('customers', { data: customer, categories: cat_data });
            }
        })
    })
});

// Add Customer
app.post('/add-customers-ajax', function (req, res) {
    // capture incoming data and parse it back to a JS object
    let data = req.body;
    console.log("Data is: ", data);

    // create a query and run it on the DB   
    query1 = "INSERT INTO Customers (firstName, lastName) VALUES (?, ?)";

    query2 = `INSERT INTO DrinkCategories_has_Customers (customerID, drinkCategoryID) VALUES ( ?, ?);`;

    query3 = "SELECT Customers.*, DrinkCategories.category AS cocktailCategory FROM Customers LEFT JOIN DrinkCategories_has_Customers ON Customers.id = DrinkCategories_has_Customers.customerID LEFT JOIN DrinkCategories ON DrinkCategories_has_Customers.drinkCategoryID = DrinkCategories.id";

    db.pool.query(query1, [data.firstName, data.lastName], function (error, results) {

        // error check
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            getIDQuery = `SELECT id FROM Customers WHERE Customers.firstName = ? AND Customers.lastName = ?;`;
            db.pool.query(getIDQuery, [data.firstName, data.lastName], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    console.log("ROWS = ", rows);
                    let id = rows[0].id;
                    console.log("ID: ", id);
                    db.pool.query(query2, [id, data.preferredCategory], function (error, rows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        }
                        else {
                            getCategoryQuery = `SELECT category FROM DrinkCategories WHERE id = ?;`;
                            db.pool.query(getCategoryQuery, [data.preferredCategory], function (error, rows, fields) {
                                if (error) {
                                    console.log(error);
                                    res.sendStatus(400);
                                }
                                else {
                                    console.log("CAT REQ: ", rows);
                                    let cat = rows[0].category;
                                    res.send({ customerid: id, firstName: data.firstName, lastName: data.lastName, preferredCategory: cat });
                                }
                            })
                        }
                    })
                }
            })
        }

    })
})

// Delete Customer
app.delete('/delete-customer-ajax', function (req, res, next) {
    let data = req.body;
    let customerID = parseInt(data.id);
    let deleteCustomer = `DELETE FROM Customers WHERE id = ?;`;

    db.pool.query(deleteCustomer, [customerID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
})


// update customer
app.put('/put-customer-ajax', function (req, res, next) {
    let data = req.body;
    console.log("Put request updating: ", req.body);
    let customerID = parseInt(data.id);
    let categoryID = parseInt(data.newPreferredCategory);

    queryUpdateCustomer = `UPDATE Customers SET firstName = ?, lastName = ? WHERE id = ?`;

    queryUpdateCustomerCategory = `UPDATE DrinkCategories_has_Customers SET drinkCategoryID = ? WHERE customerID = ?`;

    selectCustomer = `SELECT Customers.*, DrinkCategories.category AS cocktailCategory FROM Customers LEFT JOIN DrinkCategories_has_Customers ON Customers.id = DrinkCategories_has_Customers.customerID LEFT JOIN DrinkCategories ON DrinkCategories_has_Customers.drinkCategoryID = DrinkCategories.id WHERE Customers.id = ?`;

    checkQuery = `SELECT drinkCategoriesCustomersID FROM DrinkCategories_has_Customers WHERE customerID = ?`;

    insertQuery = `INSERT INTO DrinkCategories_has_Customers (customerID, drinkCategoryID) VALUES (?, ?)`;

    // Update customer basic information
    db.pool.query(queryUpdateCustomer, [data.firstName, data.lastName, customerID], function (error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
            return;
        }

        // Check if a drink category exists for the customer
        db.pool.query(checkQuery, [customerID], function (checkError, checkResults) {
            if (checkError) {
                console.error('Error checking for existing category:', checkError);
                res.sendStatus(500); // Internal Server Error
                return;
            }

            if (checkResults.length > 0) {
                // An entry exists, update
                db.pool.query(queryUpdateCustomerCategory, [categoryID, customerID], function (updateCategoryError) {
                    if (updateCategoryError) {
                        console.log(updateCategoryError);
                        res.sendStatus(400);
                        return;
                    }
                    db.pool.query(selectCustomer, [customerID], function (error, rows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        }
                        else {
                            res.send(rows);
                        }
                    })
                });
            } else {
                // No entry exists, insert
                db.pool.query(insertQuery, [customerID, categoryID], function (insertError) {
                    if (insertError) {
                        console.error('Error inserting new category:', insertError);
                        res.sendStatus(500); // Internal Server Error
                        return;
                    }
                    db.pool.query(selectCustomer, [customerID], function (error, rows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        }
                        else {
                            res.send(rows);
                        }
                    })
                });
            }
        });
    });
});

/*INGREDIENTS*/
app.get('/ingredients', function (req, res) {
    let query1 = "SELECT * FROM Ingredients;";               // Define our query

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('ingredients', { data: rows });                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

app.post('/add-ingredient-ajax', function (req, res) {
    // capture incoming data and parse it back to a JS object
    let data = req.body;

    // capture null values
    let amountOnHand = parseFloat(data.amountOnHand);
    if (isNaN(amountOnHand)) {
        amountOnHand = 'NULL';
    }

    // create a query and run it on the DB   
    query1 = "INSERT INTO Ingredients (ingredientName, amountOnHand) VALUES (?, ?)";
    db.pool.query(query1, [data.name, amountOnHand], function (error, results) {

        // error check
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM Ingredients;`;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
})

// delete ingredient
app.delete('/delete-ingredient-ajax', function (req, res, next) {
    let data = req.body;
    let ingredientID = parseInt(data.id);
    let deleteIngredient = `DELETE FROM Ingredients WHERE id = ?`;

    db.pool.query(deleteIngredient, [ingredientID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
})

// update ingredient
app.put('/put-ingredient-ajax', function (req, res, next) {

    let data = req.body;

    let ingredientID = parseInt(data.id);
    let amount = parseFloat(data.amount);

    queryUpdateIngredient = `UPDATE Ingredients SET ingredientName = ?, amountOnHand = ? WHERE id = ?`;
    selectIngredient = `SELECT * from Ingredients WHERE id = ?`

    db.pool.query(queryUpdateIngredient, [data.name, amount, ingredientID], function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectIngredient, [ingredientID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
})


/*CATEGORIES*/
app.get('/categories', function (req, res) {
    let query1 = "SELECT * FROM DrinkCategories;";               // Define our query

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('categories', { data: rows });                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

app.post('/add-category-ajax', function (req, res) {
    // capture incoming data and parse it back to a JS object
    let data = req.body;

    // capture null values
    let description = data.description ? data.description : null;


    // create a query and run it on the DB   
    query1 = "INSERT INTO DrinkCategories (category, description) VALUES (?, ?)";
    db.pool.query(query1, [data.category, data.description], function (error, results) {

        // error check
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM DrinkCategories;`;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
})

// delete category
app.delete('/delete-category-ajax', function (req, res, next) {
    let data = req.body;
    let categoryID = parseInt(data.id);
    let deleteCategory = `DELETE FROM DrinkCategories WHERE id = ?`;

    db.pool.query(deleteCategory, [categoryID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
})

// update category
app.put('/put-category-ajax', function (req, res, next) {

    let data = req.body;
    console.log(req.body);
    let categoryID = parseInt(data.id);


    queryUpdateCategory = `UPDATE DrinkCategories SET category = ?, description = ? WHERE id = ?`;
    selectCategory = `SELECT * from DrinkCategories WHERE id = ?`

    db.pool.query(queryUpdateCategory, [data.category, data.description, categoryID], function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectCategory, [categoryID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
})


/*COCKTAIL INGREDIENTS*/
app.get('/cocktailIngredients', function (req, res) {
    let query1 = `SELECT 
    Cocktail_has_Ingredients.cocktailIngredientsID,
    Cocktails.name AS Cocktail_Name,
    Ingredients.ingredientName AS Ingredient_Name,
    Cocktail_has_Ingredients.amountUsed
FROM 
    Cocktail_has_Ingredients
LEFT JOIN 
    Cocktails ON Cocktail_has_Ingredients.cocktailID = Cocktails.id
LEFT JOIN 
    Ingredients ON Cocktail_has_Ingredients.ingredientID = Ingredients.id
ORDER BY 
    Cocktail_has_Ingredients.cocktailIngredientsID;`;
    let query2 = `SELECT id, ingredientName FROM Ingredients;`;
    let query3 = `SELECT id, name from Cocktails;`;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            let data = rows;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(error);
                }
                else {
                    let ingredients = rows;
                    db.pool.query(query3, function (error, rows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        }
                        else {
                            let cocktails = rows;
                            res.render('cocktailIngredients', { data, cocktails, ingredients })
                        }
                    })
                }
            })
        }
    })
});

// COCKTAILS INGREDIENTS ADD
app.post('/add-cocktailIngredient-ajax', function (req, res) {
    // capture incoming data and parse it back to a JS object
    let data = req.body;
    let cocktailID = parseInt(data.cocktailID);
    let ingredientID = parseInt(data.ingredientID);
    let amount = parseInt(data.amount);

    // create a query and run it on the DB
    let query1 = `INSERT INTO Cocktail_has_Ingredients (cocktailID, ingredientID, amountUsed) VALUES ( ?, ?, ?);`;

    db.pool.query(query1, [cocktailID, ingredientID, amount], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.send(400);
        }
        else {
            query2 = "SELECT * FROM Cocktail_has_Ingredients;";
            db.pool.query(query2, function (error, rows, fields) {
                res.send(rows);
            })
        }
    })
})

// DELETE Cocktail_Ingredient
app.delete('/delete-cocktailIngredient-ajax', function (req, res, next) {
    let data = req.body;
    let cocktailIngredientID = parseInt(data.id);
    let deleteRelationship = `DELETE FROM Cocktail_has_Ingredients WHERE cocktailIngredientsID = ?`;

    db.pool.query(deleteRelationship, [cocktailIngredientID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
})

// UPDATE Cocktail + Ingredient
app.put('/update-cocktailIngredients-ajax', function (req, res) {

    let data = req.body;
    console.log("data on app side is: ", data);
    let id = parseInt(data.id);
    let amount = parseFloat(data.amount);
    console.log(id);


    queryUpdateRelationship = `UPDATE Cocktail_has_Ingredients SET amountUsed = ? WHERE cocktailIngredientsID = ?;`;
    selectUpdate = `SELECT * from Cocktail_has_Ingredients WHERE cocktailIngredientsID = ?;`;

    db.pool.query(queryUpdateRelationship, [amount, id], function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectUpdate, [id], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
})

/*COCKTAIL TOOLS*/
app.get('/cocktailTools', function (req, res) {
    let query1 = `SELECT 
    Cocktail_has_Tools.cocktailToolID,
    Cocktails.name AS Cocktail_Name,
    Tools.toolName AS Tool_Name
FROM 
    Cocktail_has_Tools
LEFT JOIN 
    Cocktails ON Cocktail_has_Tools.cocktailID = Cocktails.id
LEFT JOIN 
    Tools ON Cocktail_has_Tools.toolID = Tools.id
ORDER BY 
    Cocktail_has_Tools.cocktailToolID;
`;
    let query2 = `SELECT id, name FROM Cocktails;`;
    let query3 = `SELECT id, toolName FROM Tools;`;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            let data = rows;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    let cocktails = rows;
                    db.pool.query(query3, function (error, rows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        }
                        else {
                            let tools = rows;
                            res.render('cocktailTools', { data, cocktails, tools });
                        }
                    })
                }
            })
        }
    })
});

//Cocktails+Tools ADD
app.post('/add-cocktailTool-ajax', function (req, res) {
    // capture incoming data and parse it back to a JS object
    let data = req.body;

    // create a query and run it on the DB
    let query1 = `INSERT INTO Cocktail_has_Tools (cocktailID, toolID) VALUES (?, ?);`;

    db.pool.query(query1, [data.cocktailID, data.toolID], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.send(400);
        }
        else {
            query2 = `SELECT * FROM Cocktail_has_Tools;`;
            db.pool.query(query2, function (error, rows, fields) {
                res.send(rows);
            })
        }
    })
})

// COCKTAIL+TOOLS UPDATE
app.put('/update-cocktailTool-ajax', function (req, res) {

    let data = req.body;
    console.log("data on app side is: ", data);
    let id = parseInt(data.cocktailToolID);
    let cocktailID = parseInt(data.cocktailID);
    let toolID = parseInt(data.toolID);
    console.log(id);


    queryUpdateRelationship = `UPDATE Cocktail_has_Tools SET cocktailID = ?, toolID = ? WHERE cocktailToolID = ?`;
    selectUpdate = `SELECT * from Cocktail_has_Tools WHERE cocktailToolID = ?`

    db.pool.query(queryUpdateRelationship, [cocktailID, toolID, id], function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectUpdate, [id], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
})

// cocktails + tools DELETE
app.delete('/delete-cocktailTool-ajax', function (req, res, next) {
    let data = req.body;
    let cocktailToolID = parseInt(data.id);
    let deleteRelationship = `DELETE FROM Cocktail_has_Tools WHERE cocktailToolID = ?`;

    db.pool.query(deleteRelationship, [cocktailToolID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
})


/*CUSTOMERS*/
app.get('/customers', function (req, res) {
    res.render('customers');
});

/*DRINK CATEGORIES CUSTOMERS*/
app.get('/drinkCategoriesCustomers', function (req, res) {
    let query1 = "SELECT * FROM DrinkCategories_has_Customers;";               // Define our query

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('drinkCategoriesCustomers', { data: rows });                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

/*TOOLS*/
app.get('/tools', function (req, res) {
    let query1 = "SELECT * FROM Tools;";               // Define our query

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('tools', { data: rows });                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});


app.post('/add-tool-ajax', function (req, res) {
    // capture incoming data and parse it back to a JS object
    let data = req.body;

    // create a query and run it on the DB   
    query1 = "INSERT INTO Tools (toolName) VALUES (?)";
    db.pool.query(query1, [data.toolName], function (error, results) {

        // error check
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM Tools;`;
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
})

// delete tool
app.delete('/delete-tool-ajax', function (req, res, next) {
    let data = req.body;
    let toolID = parseInt(data.id);
    let deleteTool = `DELETE FROM Tools WHERE id = ?`;

    db.pool.query(deleteTool, [toolID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
})

// update tool
app.put('/put-tool-ajax', function (req, res, next) {

    let data = req.body;
    console.log(req.body);
    let toolID = parseInt(data.id);


    queryUpdateTool = `UPDATE Tools SET toolName = ? WHERE id = ?`;
    selectTool = `SELECT * from Tools WHERE id = ?`

    db.pool.query(queryUpdateTool, [data.toolName, toolID], function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectTool, [toolID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
})



/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});