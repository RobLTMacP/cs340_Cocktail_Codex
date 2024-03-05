// App.js

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
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

/*INDEX*/
app.get('/', function (req, res) {
    res.render('index');                  // Render the index.hbs file, and also send the renderer
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
    res.render('cocktailIngredients');
});

/*COCKTAILS*/
app.get('/cocktails', function (req, res) {
    res.render('cocktails');
});

/*COCKTAIL TOOLS*/
app.get('/cocktailTools', function (req, res) {
    res.render('cocktailTools');
});

/*CUSTOMERS*/
app.get('/customers', function (req, res) {
    res.render('customers');
});

/*DRINK CATEGORIES CUSTOMERS*/
app.get('/drinkCategoriesCustomers', function (req, res) {
    res.render('drinkCategoriesCustomers');
});

/*TOOLS*/
app.get('/tools', function (req, res) {
    res.render('tools');
});



/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});