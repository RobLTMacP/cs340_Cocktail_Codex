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
        category: categoryValue
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
            updateRow(xhttp.response, data.id);

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

    let table = document.getElementById("cocktails-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == ID) {

            // Get the location of the row where we found the matching ingredient ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of values
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            let td4 = updateRowIndex.getElementsByTagName("td")[6];

            // Reassign description to our value we updated to
            td1.innerHTML = parsedData[0].name;
            td2.innerHTML = parsedData[0].instructions;
            td3.innerHTML = parsedData[0].glass;
            td4.innerHTML = parsedData[0].category;

            // Update dropdown menu
            selectMenu = document.getElementById("select-cocktail");
            selectMenu.options[i].text = parsedData[0].name;
        }
    }
}