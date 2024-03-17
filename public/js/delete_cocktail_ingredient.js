/*
    Code adapted from the provided GitHub repository:
    github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteCocktailIngredient(cocktailIngredientID) {
    let data = {
        id: cocktailIngredientID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-cocktailIngredient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // delete the row from the table
            deleteRow(cocktailIngredientID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input [IN delete_cocktail.js].")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(cocktailIngredientID) {

    let test = cocktailIngredientID;
    console.log("Made it this far: ", test);

    let table = document.getElementById("cocktailIngredients-table");
    for (let i = 1, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        console.log(table.rows[i].getAttribute("data-value"))

        if (table.rows[i].getAttribute("data-value") == cocktailIngredientID) {
            table.deleteRow(i);
            break;
        }
    }

    // update dropdown menu IMPLEMENT THIS LATER WHEN U DO UPDATE 
    // let selectMenu = document.getElementById("select-customer");
    // for (let i = 0; i < selectMenu.options.length; i++) {
    //     if (selectMenu.options[i].value == customerID) {
    //         selectMenu.remove(i);
    //         break;
    //     }
    // }
}