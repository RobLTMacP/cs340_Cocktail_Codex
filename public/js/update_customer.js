let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {

    //prevent form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("select-customer");
    let inputFirstName = document.getElementById("input-update-firstName");
    let inputLastName = document.getElementById("input-update-lastName");
    let category = document.getElementById("select-update-category");

    // get the values from form fields
    let IDValue = inputID.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let categoryValue = category.value;
    console.log("Category ID to update:", categoryValue);

    // put data we want to send in a js object
    let data = {
        id: IDValue,
        firstName: firstNameValue,
        lastName: lastNameValue,
        newPreferredCategory: categoryValue
    }

    console.log(data);

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
    let count = parsedData.length;
    let dataNeeded;
    console.log("Count is:", count);
    
    // we need to find the parsed data obj that refers to who is getting updated 
    for (let i = 0; i < count; i++){
        console.log(parsedData[i].id);
        if (parsedData[i].id == ID){
            dataNeeded = parsedData[i];
        }
    }

    console.log("Parsed data (updateRow): ", parsedData);

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
            let td3 = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign description to our value we updated to
            td1.innerHTML = dataNeeded.firstName;
            td2.innerHTML = dataNeeded.lastName;
            td3.innerHTML = dataNeeded.cocktailCategory;

            // Update dropdown menu
            // selectMenu = document.getElementById("mySelect");
            // selectMenu.options[i].text = parsedData[0].firstName;
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