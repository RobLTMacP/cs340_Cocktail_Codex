/*
    Code adapted from the provided GitHub repository:
    github.com/osu-cs340-ecampus/nodejs-starter-app
*/

let addCocktailToolForm = document.getElementById("add-cocktailTool-form-ajax");

addCocktailToolForm.addEventListener("submit", function (e) {

    e.preventDefault();

    // Get form fields we need to get data from
    let inputcocktailID = document.getElementById("input-cocktailID");
    let inputToolID = document.getElementById("input-toolID");

    // Get the values from the form fields
    let cockIDValue = inputcocktailID.value;
    let toolIDValue = inputToolID.value;

    // Put our data we want to send in a javascript object
    let data = {
        cocktailID: cockIDValue,
        toolID: toolIDValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-cocktailTool-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

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

addRowToTable = (data) => {
    console.log("Received data:", data);

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("cocktailTools-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log("Parsed data:", parsedData);
    // Create a row and 4 cells
    let row = document.createElement("TR");
    let cocktailToolIDCell = document.createElement("TD");
    let cocktailIDCell = document.createElement("TD");
    let toolIDCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteCocktailTool(newRow.id);
    };

    // Fill the cells with correct data
    cocktailToolIDCell.innerText = newRow.cocktailToolID;
    cocktailIDCell.innerText = newRow.cocktailID;
    toolIDCell.innerText = newRow.toolID;

    // Append the delete button to the deleteCell
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(cocktailToolIDCell);
    row.appendChild(cocktailIDCell);
    row.appendChild(toolIDCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.cocktailToolID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option,
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("select-cocktailtoolID");
    let option = document.createElement("option");
    option.text = newRow.cocktailToolID;
    option.value = newRow.cocktailToolID;
    selectMenu.add(option);
}// 