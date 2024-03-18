/*
    Code adapted from the provided GitHub repository:
    github.com/osu-cs340-ecampus/nodejs-starter-app
*/

let updateCocktailForm = document.getElementById('update-cocktail-form-ajax');

// modify the objects we need
updateCocktailForm.addEventListener("submit", function (e) {

    //prevent form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("select-cocktail");
    let inputName = document.getElementById("input-update-name");
    let inputInstructions = document.getElementById("input-update-instructions");
    let inputGlassUsed = document.getElementById("input-update-glass");
    let inputCategory = document.getElementById("input-update-category");

    // get the values from form fields
    let IDValue = inputID.value;
    let nameValue = inputName.value;
    let instructionValue = inputInstructions.value;
    let glassValue = inputGlassUsed.value;
    let categoryValue = inputCategory.value;
    
    // put data we want to send in a js object
    let data = {
        id: IDValue,
        name: nameValue,
        instructions: instructionValue,
        glass: glassValue,
        drinkCategory: categoryValue
    }

    console.log("data is: ", data);

    // setup ajax req
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-cocktail-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell ajax how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(data);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data) {
    let parsedData = data;
    console.log("Parsed Data: ", parsedData);

    let table = document.getElementById("cocktails-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == data.id) {

            // Get the location of the row where we found the matching ingredient ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of values
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            let td4 = updateRowIndex.getElementsByTagName("td")[6];

            // Reassign description to our value we updated to
            td1.innerHTML = parsedData.name;
            td2.innerHTML = parsedData.instructions;
            td3.innerHTML = parsedData.glass;
            td4.innerHTML = parsedData.category;

            // Update dropdown menu
            selectMenu = document.getElementById("select-cocktail");
            selectMenu.options[i].text = parsedData.name;
        }
    }
}

function populateFields(cocktailId) {
    const cocktailData = Array.from(document.querySelectorAll("#cocktails-table tr")).find(row => row.dataset.value === cocktailId); // for finding info
    const nameField = document.getElementById("input-update-name"); // for repeating name
    const instructionsField = document.getElementById("input-update-instructions");
    const glassField = document.getElementById("input-update-glass");
    const categoryField = document.getElementById("input-update-category"); // for repeating category
    console.log(nameField)
    console.log("Category Field:", categoryField);
    
    
    if (cocktailData) {
        const name = cocktailData.children[1].textContent;
        const instructions = cocktailData.children[2].textContent;
        const glass = cocktailData.children[3].textContent;
        const category = cocktailData.children[6].textContent;
        
        console.log("Category:", category);
        
        nameField.value = name;
        instructionsField.value = instructions;
        glassField.value = glass;
    
        //For the dropdown
        let categoryFound = false;
        for (const option of categoryField.options) {
            if (option.textContent === category) {
                option.selected = true;
                categoryFound = true;
                break;
            }
        }
    
        // Set default option if category not found
        if (!categoryFound) {
            categoryField.selectedIndex = 0;
        }
    
    } else {
        nameField.value = '';
        instructionsield.value = '';
        glassField.value = '';
        categoryField.value = '';
    }
}