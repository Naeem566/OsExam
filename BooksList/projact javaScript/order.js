// Get order list
async function getOrders(){
    const URL = "https://bs-api.sobuj.net/view/orders/readOrders.php";
    let tableData = document.getElementById("orderList");

    try{
        //Show initial Loader
        tableData.innerHTML = "<tr><td colspan='7'>Loading........</td></tr>";

        //Fetch Orders From API
        let response = await axios.get(URL);
        let orders = response.data;  // console.log(data);
        
        //Clear Loading Message
        tableData.innerHTML = "";

        //If Not Data exists....Show a text
        if(!orders.length){
            tableData.innerHTML ="<tr><td colspan='7'>No Order found</td></tr>";
            return;
        };

        // Append Orders to the Table
        orders.forEach((order)=>{
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${order["order_id"]}</td>
                <td>${order["customer_name"]}</td>
                <td>${order["customer_email"]}</td>
                <td>${order["order_date"]}</td>
                <td>${order["total_amount"]}</td>
                <td><button class="btn btn-primary edit-btn" data-id="${order["order_id"]}">View</button></td>
                <td><button class="btn btn-danger delete-btn" data-id="${order["order_id"]}">Delete</button></td>
            `;
            tableData.appendChild(row);
        });

        //add event listener for View Button
        document.querySelectorAll(".edit-btn").forEach(btn=>{
            btn.addEventListener("click", function(){
                //get data id from data Attribute and pass to View order function
                viewOrderDetails(this.dataset.id);
            });
        });

        //add event listener for Delete Button
        document.querySelectorAll(".delete-btn").forEach(btn=>{
            btn.addEventListener("click", function(){
                //get data id from data Attribute and pass to Delete order function
                deleteOrder(this.dataset.id)
            });
        });

    }catch(error){

    }finally{

    }
};
getOrders();  // Get Order Call function

//Create Order
let bookData = [];
let customersData = [];

//Fetch Customer
async function fetchCustomer(){
    let customerSelect = document.getElementById("customerSelect");
    let customerURL = "https://bs-api.sobuj.net/view/customers/readCustomers.php";

    try{
        let response = await axios.get(customerURL);
        customersData = response.data;
        // console.log(customersData)

        customerSelect.innerHTML = `<option value="">Select a Customers</option>`;
        customersData.forEach((customer) => {
            // console.log(customer)

            customerSelect.innerHTML += `<option value="${customer.customer_id}">${customer.name} - ${customer.email}</option>`;
        })

    } catch(error){
        console.error("Error in fetching customers", error);
        alert ("Failed, try again");
    }finally{
        console.log("successfully Customer Fetched");
    }
}

//fetch Book
async function fetchBooks(){
    try{
        let bookURL = "https://bs-api.sobuj.net/view/books/readBook.php";
        let response = await axios.get(bookURL);
        bookData = response.data;
        // console.log(bookData);

    }catch(error){
        console.log("Error in fetching books", error);
    }finally{
        console.log("successfully");
    }
}

//Add Book's row
function addBookRow(){
    let Container = document.getElementById("booksContainer");
    let rowIndex = Container.children.length;

    //Creating Row
    let row = document.createElement("div");
    row.className = "row mb-2";

    row.innerHTML = `
        <div class="col-md-5">
            <select class="form-select book-select" onchange="updatePrice(${rowIndex})">
                <option value="">Select a book</option>
                    ${
                        bookData.map(
                            (book) =>{
                                return`<option value="${book.book_id}" data-price= "${book.price}" data-author=" ${book.author}"> ${book.title} - ${book.price} by ${book.author}</option>`
                            }

                        ).join("")
                    };
            </select>
        </div>

        <div class="col-md-3">
             <input type="number" class="form-control quantity-input" min="1" value="1" onchange="updatePrice(${rowIndex})">
             </input>       
        </div> 

        <div class="col-md-3">
            <input type="text" class="form-control line-total" value="0.00" readonly>
          </div>
        
        <div class="col-md-1">
            <button type="button" class="btn btn-danger" onClick="removeBookRow(this)">X</button>
          </div>
    `;
    Container.appendChild(row);
}

// Update Price based on the selected books
function updatePrice(index){
    let row = document.getElementById("booksContainer").children[index];
    let bookSelect = row.querySelector(".book-select");
    let quantityInput = row.querySelector(".quantity-input");
    let lineTotalInput = row.querySelector(".line-total");
   
    let selectedBook = bookSelect.options[bookSelect.selectedIndex];
    let price = parseFloat(selectedBook.getAttribute("data-price") || 0);
    let quantity = parseInt(quantityInput.value || 1);

    lineTotalInput.value = (price * quantity).toFixed(2);
}

// Remove book row from the modal
function removeBookRow(button){
    button.parentElement.parentElement.remove();
}

//Create Order Button
async function createOrder(){
    let customerId = document.getElementById("customerSelect").value;
    if(!customerId){
        alert("Please select a customer");
        return;
    }

    let orderDetails = [];
    document.querySelectorAll("#booksContainer .row").forEach((row) => {
        let bookSelect = row.querySelector(".book-select");
        let quantityInput = row.querySelector(".quantity-input");
        let lineTotalInput = row.querySelector(".line-total");

        if (bookSelect.value) {
            orderDetails.push({
              book_id: bookSelect.value,
              quantity: quantityInput.value,
              line_total: lineTotalInput.value,
            });
        }
    });

    //Check if order has a value
    if(orderDetails.length === 0){
        alert("Please add at least one book to the order")
        return;
    }

    // Prepare Order Data
    let orderData = {
        customer_id: customerId,
        order_details: orderDetails
    };

    console.log("sanding order data");

    // Sending Create API Request
    try{
        let createOrderURL = "https://bs-api.sobuj.net/view/orders/insertOrder.php";

        let response = await axios.post(createOrderURL, orderData, {
            Headers: {
                "Content-Type": "application/json",
            }
        });

        if(response.status === 200){
            alert("Order created successfully");
        }

        document.getElementById("booksContainer").innerHTML ="";
        let modal = bootstrap.Modal.getInstance(document.getElementById("createOrderModal"));
        modal.hide();

        // Call to Get Order list
        getOrders();

    }catch(error){
        console.error("Error in creating order", error);
    }finally{
        console.log("successfully Create");
    }
}


//Fetch Book and Customer
window.onload = () =>{
    fetchCustomer();
    fetchBooks();
};
//end::Fetch Book and Customer
//end::Create Order

//view Order Details
async function viewOrderDetails(orderID) {
    try{
        let URL = `https://bs-api.sobuj.net/view/orders/getOrderById.php?order_id=${orderID}`;

        //Getting Single Order Details
        let response = await axios.get(URL);
        let orderData = response.data;
        // console.log(orderData)
        
        // Populate the information's
        document.getElementById("customerName").innerHTML = orderData.customer_name;
        document.getElementById("customerEmail").innerHTML = orderData.customer_email;
        document.getElementById("orderDate").innerHTML = orderData.order_date;
        document.getElementById("totalAmount").innerHTML = orderData.total_amount;

        //Clear the table body before appending new rows
        let orderItemsTableBody = document.getElementById("orderItemsTableBody");

        orderItemsTableBody.innerHTML = "";
        // console.log(orderItemsTableBody)

        for(let item of orderData.order_details){
            let bookResponse = await axios.get(
                `https://bs-api.sobuj.net/view/books/getBookById.php?book_id=${item.book_id}`);
            
            let book = bookResponse.data;

            // Inserting book to the table row
            let row = document.createElement("tr");
            row.innerHTML =`
                <td>${book.title}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.line_total}</td>
            `;
            orderItemsTableBody.appendChild(row);
        }

        // Show the modal
        let modal = new bootstrap.Modal(document.getElementById("orderDetailsModal"));
        modal.show();

    }catch(error){
        console.error("Error in fetching order details", error);
    }finally{
        console.log("Order Details Fetched");
    }
};
//end::view Order Details

//Order Delete modal show
let deleteOrderID = null;  // Delete global variable
function deleteOrder(orderID){
    deleteOrderID = orderID;

    //show The delete modal
    let deleteModal = new bootstrap.Modal(document.getElementById("deleteOrderModal"));
    deleteModal.show();
     
};

//finally Order Delete
async function deleteOrderFinally(){
    let URL = "https://bs-api.sobuj.net/view/orders/deleteOrder.php";

    try{
        //Check the deleteOrder is Valid
        if(!deleteOrderID){
            alert("Invalid Order ID")
            return;
        };

        //prepare data to send the API
        let formData = new FormData();
        formData.append("order_id", deleteOrderID);

        //send the delete request
        let response = await axios.post(URL,formData);
        // console.log(response)

        // Check API Response
        if(response.status === 200){
            alert("successfully");

            //hide the order modal
            let modal = bootstrap.Modal.getInstance(document.getElementById("deleteOrderModal"));
            modal.hide();

            //refresh the order list
            getOrders();

        }else{
            alert("failed to delete Order");
        }

    } catch(error){
        console.error("Error for order delete", error);
        alert("delete failed try again");
    }finally{
        console.log("Successfully Order Delete");
    };
}
//end::Order Delete modal




