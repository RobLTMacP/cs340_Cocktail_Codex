let updateCategoryForm = document.getElementById('update-customer-form-ajax');

// modify the objects we need
updateCategoryForm.addEventListener("submit", function (e) {

    //prevent form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("mySelect");
    let inputFirstName = document.getElementById("input-update-firstName");
    let inputLastName = document.getElementById("input-update-lastName");

    // get the values from form fields
    let IDValue = inputID.value;
    let firstNameValue = inputFirstName.value;
    console.log(IDValue);
    let lastNameValue = inputLastName.value;

    // put data we want to send in a js object
    let data = {
        id: IDValue,
        firstName: firstNameValue,
        lastName: lastNameValue
    }

    // setup ajax req
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
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

    let table = document.getElementById("customers-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == ID) {

            // Get the location of the row where we found the matching customer ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of description value
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign description to our value we updated to
            td1.innerHTML = parsedData[0].firstName;
            td2.innerHTML = parsedData[0].lastName;

            // Update dropdown menu
            selectMenu = document.getElementById("mySelect");
            selectMenu.options[i].text = parsedData[0].firstName;
        }
    }
}

function populateFields(customerId) {
    const customerData = Array.from(document.querySelectorAll("#customers-table tr")).find(row => row.dataset.value === customerId); // for finding info
    const firstNameField = document.getElementById("input-update-firstName"); // for repeating firstName
    const lastNameField = document.getElementById("input-update-lastName"); // for repeating lastName
    console.log(firstNameField)
    if (customerData) {
        const firstName = customerData.children[1].textContent;
        const lastName = customerData.children[2].textContent;
        firstNameField.value = firstName;
        lastNameField.value = lastName;
    } else {
        firstNameField.value = '';
        lastNameField.value = '';
    }
}