function deleteCocktail(cocktailID) {
    let data = {
        id: cocktailID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-cocktail-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // delete the row from the table
            deleteRow(cocktailID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input [IN delete_cocktail.js].")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(cocktailID) {

    let test = cocktailID;
    console.log("Made it this far: ", test);

    let table = document.getElementById("cocktails-table");
    for (let i = 1, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        console.log(table.rows[i].getAttribute("data-value"))

        if (table.rows[i].getAttribute("data-value") == cocktailID) {
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