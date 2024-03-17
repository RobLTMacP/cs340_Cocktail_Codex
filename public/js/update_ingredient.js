/*
    Code adapted from the provided GitHub repository:
    github.com/osu-cs340-ecampus/nodejs-starter-app
*/


let updateIngredientForm = document.getElementById('update-ingredient-form-ajax');

// modify the objects we need
updateIngredientForm.addEventListener("submit", function (e) {

    //prevent form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("mySelect");
    let inputName = document.getElementById("input-update-name");
    let inputAmount = document.getElementById("input-update-amount");

    // get the values from form fields
    let IDValue = inputID.value;
    let nameValue = inputName.value;
    console.log(nameValue);
    let amountValue = inputAmount.value;

    // put data we want to send in a js object
    let data = {
        id: IDValue,
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
            updateRow(xhttp.response, IDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, ID) {
    let parsedData = JSON.parse(data);
    console.log(parsedData);

    let table = document.getElementById("ingredients-table");

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
            td1.innerHTML = parsedData[0].ingredientName;
            td2.innerHTML = parsedData[0].amountOnHand;

            // Update dropdown menu
            selectMenu = document.getElementById("mySelect");
            selectMenu.options[i].text = parsedData[0].ingredientName;
        }
    }
}

function populateFields(ingredientId) {
    const ingredientData = Array.from(document.querySelectorAll("#ingredients-table tr")).find(row => row.dataset.value === ingredientId); // for finding info
    const nameField = document.getElementById("input-update-name"); // for repeating name
    const amountField = document.getElementById("input-update-amount"); // for repeating ingredient
    console.log(nameField)
    if (ingredientData) {
        const ingredient = ingredientData.children[1].textContent;
        const amount = ingredientData.children[2].textContent;
        nameField.value = ingredient;
        amountField.value = amount;
    } else {
        nameField.value = '';
        amountField.value = '';
    }
}