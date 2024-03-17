/*
    Code adapted from the provided GitHub repository:
    github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let addCocktailForm = document.getElementById('add-cocktail-form-ajax');

// Modify the objects we need
addCocktailForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputInstructions = document.getElementById("input-instructions");
    let inputGlass = document.getElementById("input-glass");
    let inputCategory = document.getElementById("input-cocktail-category");

    console.log(inputCategory);

    // Get the values from the form fields
    let nameValue = inputName.value;
    let instructionValue = inputInstructions.value;
    let glassValue = inputGlass.value;
    let categoryValue = inputCategory.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        instructions: instructionValue,
        glass: glassValue,
        category: categoryValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-cocktail-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputInstructions.value = '';
            inputGlass.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record
addRowToTable = (data) => {
    console.log("Received data:", data);

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("cocktails-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log("Parsed data:", parsedData);
    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let instructionCell = document.createElement("TD");
    let glassCell = document.createElement("TD");
    let toolCell = document.createElement("TD");
    let ingredientsCell = document.createElement("TD");
    let categoryCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteCocktail(newRow.id);
    };

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    nameCell.innerText = newRow.name;
    instructionCell.innerText = newRow.instructions;
    glassCell.innerText = newRow.glassUsed;
    toolCell.innerText = newRow.Tools_Used;
    ingredientsCell.innerText = newRow.Ingredients_Amounts;
    categoryCell.innerText = newRow.drinkCategoryID;

    // Append the delete button to the deleteCell
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(instructionCell);
    row.appendChild(glassCell);
    row.appendChild(toolCell);
    row.appendChild(ingredientsCell);
    row.appendChild(categoryCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option,
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
}