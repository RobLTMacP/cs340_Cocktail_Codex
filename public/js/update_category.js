let updateCategoryForm = document.getElementById('update-category-form-ajax');

// modify the objects we need
updateCategoryForm.addEventListener("submit", function (e) {

    //prevent form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("mySelect");
    let inputCategory = document.getElementById("input-update-name");
    let inputDescription = document.getElementById("input-update-description");

    // get the values from form fields
    let IDValue = inputID.value;
    let categoryValue = inputCategory.value;
    console.log(IDValue);
    let descriptionValue = inputDescription.value;

    // put data we want to send in a js object
    let data = {
        id: IDValue,
        category: categoryValue,
        description: descriptionValue
    }

    // setup ajax req
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-category-ajax", true);
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

    let table = document.getElementById("categories-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == ID) {

            // Get the location of the row where we found the matching category ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of description value
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign description to our value we updated to
            td1.innerHTML = parsedData[0].category;
            td2.innerHTML = parsedData[0].description;

            // Update dropdown menu
            selectMenu = document.getElementById("mySelect");
            selectMenu.options[i].text = parsedData[0].category;
        }
    }
}

function populateFields(categoryId) {
    const categoryData = Array.from(document.querySelectorAll("#categories-table tr")).find(row => row.dataset.value === categoryId); // for finding info
    const nameField = document.getElementById("input-update-name"); // for repeating name
    const descriptionField = document.getElementById("input-update-description"); // for repeating category
    console.log(nameField)
    if (categoryData) {
        const category = categoryData.children[1].textContent;
        const description = categoryData.children[2].textContent;
        nameField.value = category;
        descriptionField.value = description;
    } else {
        nameField.value = '';
        descriptionField.value = '';
    }
}