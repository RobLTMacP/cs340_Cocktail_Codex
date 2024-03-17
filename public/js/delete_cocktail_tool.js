/*
    Code adapted from the provided GitHub repository:
    github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteCocktailTool(cocktailToolID) {
    let data = {
        id: cocktailToolID
    };

    console.log("Data is: (on delete.js) ", data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-cocktailTool-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // delete the data 
            deleteRow(cocktailToolID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(cocktailToolID) {

    let table = document.getElementById("cocktailTools-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate through rows
        // rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == cocktailToolID) {
            table.deleteRow(i);
            break;
        }
    }

    // update dropdown menu on categories page
    let selectMenu = document.getElementById("select-cocktailtoolID");
    for (let i = 0; i < selectMenu.options.length; i++) {
        if (selectMenu.options[i].value == cocktailToolID) {
            selectMenu.remove(i);
            break;
        }
    }
}