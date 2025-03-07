//Author Management full js code
//....................................

//Get Authors Function
async function getAuthors(){

    let URL = "https://bs-api.sobuj.net/view/authors/readAuthors.php";
    let tableData = document.getElementById("AuthorList");

    try{
        //show loading message
        tableData.innerHTML = "<tr><td colspan='5'>Loading.....</td></tr>";

        //Fetch API from authors
        let response = await axios.get(URL);
        let authors = response.data;

        //Clear loading message
        tableData.innerHTML = "";

        //If no data exists .. show a text

        if(!authors.length){
            tableData.innerHTML = "<tr><td colspan='5'>No Author found</td></tr>";
            return;
        }

        //Append data to table

        authors.forEach((author)=>{
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${author['author_id']}</td>
                <td>${author['name']}</td>
                <td>${author['email']}</td>
                <td><button class="btn btn-success update-btn" data-id="${author['author_id']}">Update</button></td>
                <td><button class="btn btn-danger delete-btn" data-id="${author['author_id']}">Delete</button></td>
            `;
            tableData.appendChild(row);
        });

        //add event listener for update fetch
        document.querySelectorAll(".update-btn").forEach(btn=>{
            btn.addEventListener("click", function(){
                goToUpdate(this.dataset.id);
            });
        });

        //add event listener for delete fetch
        document.querySelectorAll(".delete-btn").forEach(btn=>{
            btn.addEventListener("click", function(){
                deleteAuthor(this.dataset.id)
            });
        });

    } catch(error){
        console.error("Error for authors:",error);
        tableData.innerHTML = "<tr><td colspan='5'>Failed to load author, try again</td></tr>";

    } finally{
        console.log("Authors Fetch Attempt Completed");
    };
};
// Get Author Call function
getAuthors();

// add author modal 
async function addAuthor(){
    let URL = "https://bs-api.sobuj.net/view/authors/insertAuthor.php";

    let authorName = document.getElementById("nameID").value.trim();
    let authorEmail = document.getElementById("emailID").value.trim();

    try{
        //validate
        if(!authorName || !authorEmail){
            alert ("All Data required");
            return;
        }

        //Append Data
        let formData = new FormData ();
        formData.append("name", authorName);
        formData.append("email", authorEmail);

        //send data request
        let response = await axios.post(URL,formData);

        //Check API Response
        if(response.status === 200){
            alert("Authors successfully inserted");
            document.getElementById("nameID").value = "";
            document.getElementById("emailID").value = "";

            //Close modal
            let modal = bootstrap.Modal.getInstance(document.getElementById("addAuthorModal"));
            modal.hide();

            // Refresh the list
            getAuthors();
        }else{
            alert("Failed to add author");
        }

    }catch(error){
        console.error("Error for adding author", error);
        alert("Failed, try again");

    }finally{
        console.log("Author addition process completed");
    };
}

//Get edit Authors
let editAuthorID = null; //Edit global variable ID
async function goToUpdate(authorID){
    let URL = `https://bs-api.sobuj.net/view/authors/getAuthorById.php?author_id=${authorID}`;

    try{
        let response = await axios.get(URL);
        let authorData = response.data;

        if(authorData){
            //populate data
            document.getElementById("nameEditID").value = authorData.name;
            document.getElementById("emailEditID").value = authorData.email;
            editAuthorID = authorID;

            //show modal
            let editModal = new bootstrap.Modal(document.getElementById("editAuthorModal"));
            editModal.show();
        }else{
            alert("Author not found");
        }
        
    } catch(error){
        console.error("Error for updating author", error);
        alert("Author load, Failed")
    } finally{
        console.log("Author updating process completed");
    }
}

//Get edit => update Authors
async function updateAuthor(){
    let URL = "https://bs-api.sobuj.net/view/authors/updateAuthor.php";

    let authorName = document.getElementById("nameEditID").value.trim();
    let authorEmail = document.getElementById("emailEditID").value.trim();

    try{
        //validate
        if(!authorName || !authorEmail){
            alert ("All Data required");
            return;
        }

        //Append Data
        let formData = new FormData ();
        formData.append("author_id", editAuthorID); //it is global variable ID
        formData.append("name", authorName);
        formData.append("email", authorEmail);

        //send data request
        let response = await axios.post(URL,formData);

        //Check API Response
        if(response.status === 200){
            alert("Authors successfully updated");
            document.getElementById("nameEditID").value = "";
            document.getElementById("emailEditID").value = "";

            //Close modal
            let modal = bootstrap.Modal.getInstance(document.getElementById("editAuthorModal"));
            modal.hide();

            // Refresh the list
            getAuthors();
        }else{
            alert("Failed to update author");
        }

    }catch(error){
        console.error("Error for updated author", error);
        alert("Failed, try again");

    }finally{
        console.log("Author updated process completed");
    }
}

//Delete modal show
let deleteAuthorID = null; // Delete global variable

function deleteAuthor(deleteID){
    deleteAuthorID = deleteID;
    //show delete modal
    let deleteModal = new bootstrap.Modal(document.getElementById("deleteAuthorModal"));
    deleteModal.show();

}

//Delete finally
async function deleteAuthorFinally(){
    let URL = "https://bs-api.sobuj.net/view/authors/deleteAuthor.php";

    try{
        if(!deleteAuthorID){
            alert("Invalid Author ID");
            return;
        }

        //Append Data
        let formData = new FormData();
        formData.append("author_id", deleteAuthorID);

        //send the request
        let response = await axios.post(URL,formData);

        //Check API Response
        if(response.status === 200){
            alert("successfully");

            //close the modal
            let modal = bootstrap.Modal.getInstance(document.getElementById("deleteAuthorModal"));
            modal.hide();

            //refresh
            getAuthors();
        }else{
            alert("failed to delete author");
        }
    } catch(error){
        console.error("Error for author delete", error);
        alert("delete failed try again");
    } finally{
        console.log("Successfully delete completed");
    }
}