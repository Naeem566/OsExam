//Books Summary Report

async function getSummaryReport(){
    let URL = "https://bs-api.sobuj.net/view/reports/summaryReport.php";

    try{
        //Fetch Data from API
        let response = await axios.get(URL);
        let data = response.data;

        //update data in the template
        document.getElementById("total_books").innerHTML = data.total_books;
        document.getElementById("total_customers").innerHTML = data.total_customers;
        document.getElementById("total_orders").innerHTML = data.total_orders;
        document.getElementById("total_order_value").innerHTML = data.total_order_value;
        document.getElementById("todays_orders").innerHTML = data.todays_orders;
        document.getElementById("todays_order_value").innerHTML = data.todays_order_value;
        document.getElementById("monthly_orders").innerHTML = data.monthly_orders;
        document.getElementById("monthly_order_value").innerHTML = data.monthly_order_value;

    }catch(error){
        console.error("Error in Fetching Data", error);
        alert("Failed, try Again");
    }finally{
        console.log("Summary Report Fetched");
    }
}

//Call the function to get summary report
getSummaryReport();

