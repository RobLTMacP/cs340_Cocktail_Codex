let updateCocktalIngredientsForm = document.getElementById("update-cocktailIngredient-form-ajax");

updateCocktalIngredientsForm.addEventListener("submit", function (e) {

    e.preventDefault;

    // Get form fields we need to get data from
    let inputCocktailIngredientID = document.getElementById("select-cocktailIngredientID");
    let inputAmount = document.getElementById("input-amount-update");

    // Get the values from the form fields
    let cocktailIngredientIDValue = inputCocktailIngredientID.value;
    let amountValue = inputAmount.value;

    console.log("AMOUNT IS: ", amountValue);

    // Put our data we want to send in a javascript object
    let data = {
        id: cocktailIngredientIDValue,
        amount: amountValue
    }
    
    console.log("DATA IN JS SIDE IS: ", data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-cocktailIngredients-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(data);

            // Clear the input fields for another transaction
            inputCocktailIngredientID.value = '';
            inputAmount.value = '';
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
    let ID = parsedData[0].id;
    console.log(parsedData);

    let table = document.getElementById("cocktailIngredients-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == ID) {

            // Get the location of the row where we found the matching ingredient ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of values
            let td1 = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign description to our value we updated to
            td1.innerHTML = parsedData[0].amount;
        }
    }
}