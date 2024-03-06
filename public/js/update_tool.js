let updateToolForm = document.getElementById('update-tool-form-ajax');

// modify the objects we need
updateToolForm.addEventListener("submit", function (e) {

    //prevent form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("mySelect");
    let inputTool = document.getElementById("input-update-name");

    // get the values from form fields
    let IDValue = inputID.value;
    let toolValue = inputTool.value;
    console.log(IDValue);

    // put data we want to send in a js object
    let data = {
        id: IDValue,
        toolName: toolValue,
    }

    // setup ajax req
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-tool-ajax", true);
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

    let table = document.getElementById("tools-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == ID) {

            // Get the location of the row where we found the matching tool ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let td1 = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign to our value we updated to
            td1.innerHTML = parsedData[0].toolName;

            // Update dropdown menu
            selectMenu = document.getElementById("mySelect");
            selectMenu.options[i].text = parsedData[0].toolName;
        }
    }
}

function populateFields(toolId) {
    const toolData = Array.from(document.querySelectorAll("#tools-table tr")).find(row => row.dataset.value === toolId); // for finding info
    const nameField = document.getElementById("input-update-name"); // for repeating name
    console.log(nameField)
    if (toolData) {
        const tool = toolData.children[1].textContent;
        nameField.value = tool;
    } else {
        nameField.value = '';
    }
}