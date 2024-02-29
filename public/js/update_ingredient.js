let updateIngredientForm = document.getElementById('update-ingredient-form-ajax');

// modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {

    //prevent form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("mySelect");
    let inputAmount = document.getElementById("input-update-amount");

    // get the values from form fields
    let nameValue = inputName.value;
    let amountValue = inputAmount.value;

    // put data we want to send in a js object
    let data = {
        name: nameValue,
        amount: amountValue
    }

    // setup ajax req
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-ingredient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell ajax how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, nameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, personID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("ingredients-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == ingredientID) {

            // Get the location of the row where we found the matching ingredient ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of amount value
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign amount to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}