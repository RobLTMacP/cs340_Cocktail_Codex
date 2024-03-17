/*
    Code adapted from the provided GitHub repository:
    github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteTool(toolID) {
    let data = {
        id: toolID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-tool-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(toolID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(toolID) {

    let table = document.getElementById("tools-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == toolID) {
            table.deleteRow(i);
            break;
        }
    }

    // update dropdown menu
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.options.length; i++) {
        if (selectMenu.options[i].value == toolID) {
            selectMenu.remove(i);
            break;
        }
    }
}