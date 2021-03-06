var user_token = localStorage.getItem('token')
//document.getElementById('add_red').addEventListener('submit', addRedflag);
//function addRedflag(e) {
//    e.preventDefault();

function addRedflag(){
    //capture user input
    var type = document.getElementById('incidentType').value;
    localStorage.setItem('type',type);
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var location = document.getElementById('location').value;
    var comment = document.getElementById('comment').value;
    var image = document.getElementById('image').value;
    if (name == "") {
        document.getElementById('message').innerHTML = "<p style='color: #f00; margin: 5px;'><strong>Error:</strong> Empty field detected</p>";
        document.getElementById('name').style.border = "2px #F00 solid";
    }

    if (description == "") {
        document.getElementById('message').innerHTML = "<p style='color: #f00; margin: 5px;'><strong>Error:</strong> Empty field detected</p>";
        document.getElementById('description').style.border = "2px #F00 solid";
    }

    if (location == "") {
        document.getElementById('message').innerHTML = "<p style='color: #f00; margin: 5px;'><strong>Error:</strong> Empty field detected</p>";
        document.getElementById('location').style.border = "2px #F00 solid";
    }

    if (comment == "") {
        document.getElementById('message').innerHTML = "<p style='color: #f00; margin: 5px;'><strong>Error:</strong> Empty field detected</p>";
        document.getElementById('comment').style.border = "2px #F00 solid";
    }

    if (image == "") {
        document.getElementById('message').innerHTML = "<p style='color: #f00; margin: 5px;'><strong>Error:</strong> Empty field detected</p>";
        document.getElementById('image').style.border = "2px #F00 solid";
    }

    else if (image == "" && comment == "" && location == "" && description == "" && name == "") {
        document.getElementById('message').innerHTML = "<p style='color: #f00; margin: 5px;'><strong>Error:</strong> Empty field detected</p>";
        document.getElementById('image').style.border = "2px #F00 solid";
    }
    else {
        var post_data = {
            name: name,
            description: description,
            location: location,
            images: image,
            comment: comment
        }
        fetch(`https://kjmkirepohost.herokuapp.com/api/v1/incidents/${type}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'x-access-token': user_token
            },
            body: JSON.stringify(post_data)
        })
            .then((response) => response.json())
            .then(function (message) {
                if (message['data'][0]['message'] === 'Created incident record') {
                    alert('Created red_flag record');
                    window.location.replace('user_profile.html');

                }
                else if (message['error'] === 'token is invalid!') {
                    alert('please log in again');
                    window.location.replace('index.html');

                }


            });

    }

}

window.onload = function GetRedFlags() {
    fetch(`https://kjmkirepohost.herokuapp.com/api/v1/incidents/redflags`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'x-access-token': user_token
        },
    })

        .then((response)=> response.json())
        .then(function (message){
            if(message['data']){
                table_output =`<table id="myTable">
                <tr class="header">
                    <th>Type</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Location</th>
                    <th>Comment</th>
                    <th>State</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr> `;
                message['data'].forEach(function (data){
                    var redflag_id =data.incident_id;
                    localStorage.setItem('redflag_id',redflag_id);
                    table_output+=`<tr>
                    <td>${data.type}</td>
                    <td>${data.name}</td>
                    <td>${data.description}</td>
                    <td>${data.images}</td>
                    <td>${data.location}</td>
                    <td>${data.comment}</td>
                    <td>${data.status}</td>
                    <td><a href="edit_location.html" id="submit" class="button2">Edit Location</a><br>
                    <a href="edit_comment.html" id="submit" class="button2">Edit Comment</a></td>
                    <td><a href="delete_redflag.html" id="submit" class="button2">Delete Redflag</a></td>
                </tr>`;
                });
                document.getElementById('redflagViews').innerHTML=table_output;
            }else{
                // display message to  the user incase they don't have any parcel orders
                document.getElementById('redflagViews').style.color="red";
                document.getElementById('redflagViews').innerHTML=`<h2>empty incidents list. You have not yet added any.</h2>`;
            }
        });
    }

function updateComment(redflag_id){
    var redflag_id = localStorage.getItem('redflag_id');
    console.log(redflag_id);
    var patched_comment = document.getElementById('ed_comment').value;

    if (patched_comment == "") {
        document.getElementById('message_comment').innerHTML = "<p style='color: #f00; margin: 5px;'><strong>Error:</strong> Empty field new comment</p>";
        document.getElementById('ed_comment').style.border = "2px #F00 solid";
    }
    var updatedComment ={
        comment: patched_comment
    }

    fetch(`https://kjmkirepohost.herokuapp.com/api/v1/incidents/redflags/${redflag_id}/comment`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json',
            'x-access-token': user_token
        },
        body: JSON.stringify(updatedComment)
    })
        .then((response) => response.json())
        .then(function (message) {
            if (message['data'][0]['message'] === "Updated incident's comment") {
                alert('Updated redflag comment');
                window.location.replace('user_profile.html');

            }
            else if (message['error'] === 'token is invalid!') {
                alert('please log in again');
                window.location.replace('index.html');

            }
            else{
                alert('redflag record not found');
                window.location.replace('user_profile.html')
            }


        });
    }

function updateLocation(redflag_id){
        var patched_location = document.getElementById('ed_location').value;
        var redflag_id = localStorage.getItem('redflag_id');
        var type = localStorage.getItem('type');
    
        if (patched_location == "") {
            document.getElementById('message_location').innerHTML = "<p style='color: #f00; margin: 5px;'><strong>Error:</strong> Empty field new location</p>";
            document.getElementById('ed_location').style.border = "2px #F00 solid";
        }
        var updated_location ={
            location: patched_location
        }
    
        fetch(`https://kjmkirepohost.herokuapp.com/api/v1/incidents/redflags/${redflag_id}/location`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'x-access-token': user_token
            },
            body: JSON.stringify(updated_location)
        })
            .then((response) => response.json())
            .then(function (message) {
                if (message['data'][0]['message'] === "Updated incident's location") {
                    alert('Updated record location');
                    window.location.replace('user_profile.html');
    
                }
                else if (message['error'] === 'token is invalid!') {
                    alert('please log in again');
                    window.location.replace('index.html');
    
                }
                else{
                    alert('record not found');
                    window.location.replace('user_profile.html')
                }
        
        
                });
}

function deleteRedflag(redflag_id){
    var redflag_id = localStorage.getItem('redflag_id');

    fetch(`https://kjmkirepohost.herokuapp.com/api/v1/incidents/redflags/${redflag_id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json',
            'x-access-token': user_token
        },
    })
        .then((response) => response.json())
        .then(function (message) {
            if (message['data'][0]['message'] === "Incident record has been deleted") {
                alert('Deleted record');
                window.location.replace('user_profile.html');

            }
            else if (message['error'] === 'token is invalid!') {
                alert('please log in again');
                window.location.replace('index.html');

            }
            else{
                alert('record not found');
                window.location.replace('user_profile.html')
            }
    
    
            });
}



    