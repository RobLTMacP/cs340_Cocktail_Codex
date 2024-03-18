/*
    Code adapted from the provided GitHub repository:
    github.com/osu-cs340-ecampus/nodejs-starter-app
*/

let updateCocktailToolForm = document.getElementById("update-cocktailTool-form-ajax");

updateCocktailToolForm.addEventListener("submit", function (e) {

    e.preventDefault();

    // Get form fields we need to get data from
    let inputCocktailToolID = document.getElementById("select-cocktailtoolID");
    let inputcocktailID = document.getElementById("input-update-cocktailID");
    let inputToolID = document.getElementById("input-update-toolID");

    // Get the values from the form fields
    let cocktailToolIDValue = inputCocktailToolID.value;
    let cockIDValue = inputcocktailID.value;
    let toolIDValue = inputToolID.value;

    console.log("updatejs has vals: ", cocktailToolIDValue, toolIDValue, cockIDValue );

    // Put our data we want to send in a javascript object
    let data = {
        cocktailToolID: cocktailToolIDValue,
        cocktailID: cockIDValue,
        toolID: toolIDValue
    }

    console.log("DATA on js side is: ", data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-cocktailTool-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response);

            // Clear the input fields for another transaction
            inputcocktailID.value = '';
            inputToolID.value = '';


        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data) {
    let parsedData = JSON.parse(data);
    let ID = parsedData[0].cocktailToolID;
    console.log(parsedData);

    let table = document.getElementById("cocktailTools-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == ID) {

            // Get the location of the row where we found the matching ingredient ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of values
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign description to our value we updated to
            td1.innerHTML = parsedData[0].cocktailID;
            td2.innerHTML = parsedData[0].toolID;
        }
    }
}