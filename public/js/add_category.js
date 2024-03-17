/*
    Code adapted from the provided GitHub repository:
    github.com/osu-cs340-ecampus/nodejs-starter-app
*/


// Get the objects we need to modify
let addCategoryForm = document.getElementById('add-category-form-ajax');
console.log(addCategoryForm);

// Modify the objects we need
addCategoryForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputDescription = document.getElementById("input-description");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let descriptionValue = inputDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        category: nameValue,
        description: descriptionValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-category-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputDescription.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {
    console.log("Received data:", data);

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("categories-table");

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
    let descriptionCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteCategory(newRow.id);
    };

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    nameCell.innerText = newRow.category;
    descriptionCell.innerText = newRow.description;

    console.log("ID Cell:", idCell.innerText);
    console.log("Name Cell:", nameCell.innerText);
    console.log("Description Cell:", descriptionCell.innerText);

    // Append the delete button to the deleteCell
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(descriptionCell);
    row.appendChild(deleteCell)

    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option,
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("category-select");
    let option = document.createElement("option");
    option.text = newRow.category;
    option.value = newRow.id;
    selectMenu.add(option);
}

