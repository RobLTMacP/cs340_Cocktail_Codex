/*
    Code adapted from the provided GitHub repository:
    github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let addCocktailIngredientForm = document.getElementById('add-cocktail-ingredient-form-ajax');
console.log(addCocktailIngredientForm);

// Modify the objects we need
addCocktailIngredientForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCocktailID = document.getElementById("input-cocktailID");
    let inputIngredientID = document.getElementById("input-ingredientID");
    let inputAmount = document.getElementById("input-amount");

    // Get the values from the form fields
    let cocktailIDValue = inputCocktailID.value;
    let ingredientIDValue = inputIngredientID.value;
    let amountValue = inputAmount.value;

    // Put our data we want to send in a javascript object
    let data = {
        cocktailID: cocktailIDValue,
        ingredientID: ingredientIDValue,
        amount: amountValue
    }

    console.log("Data from js is: ", data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-cocktailIngredient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCocktailID.value = '';
            inputIngredientID.value = '';
            inputAmount.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from table
addRowToTable = (data) => {
    console.log("Received data:", data);

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("cocktailIngredients-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log("Parsed data:", parsedData);
    // Create a row and 4 cells
    let row = document.createElement("TR");
    let cocktailIngredientIDCell = document.createElement("TD");
    let cocktailIDCell = document.createElement("TD");
    let ingredientIDCell = document.createElement("TD");
    let amountCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteCocktailIngredient(newRow.id);
    };

    // Fill the cells with correct data
    cocktailIngredientIDCell.innerText = newRow.cocktailIngredientsID;
    cocktailIDCell.innerText = newRow.cocktailID;
    ingredientIDCell.innerText = newRow.ingredientID;
    amountCell.innerText = newRow.amountUsed;

    // Append the delete button to the deleteCell
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(cocktailIngredientIDCell);
    row.appendChild(cocktailIDCell);
    row.appendChild(ingredientIDCell);
    row.appendChild(amountCell);
    row.appendChild(deleteCell)

    row.setAttribute('data-value', newRow.cocktailIngredientsID);

    // Add the row to the table
    currentTable.appendChild(row);
}

