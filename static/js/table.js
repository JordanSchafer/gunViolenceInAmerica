
function buildTable(data) {
    // First, clear out any existing data
    tbody.html("");
  
    // Next, loop through each object in the data
    // and append a row and cells for each value in the row
    data.forEach((dataRow) => {
       //console.log(dataRow["n_killed"])
      // Append a row to the table body
      var row = tbody.append("tr");
      var cell1 = row.append("td");
      cell1.text(dataRow["state"]);
      var cell2 = row.append("td");
      cell2.text(dataRow["n_killed"]);
      var cell3 = row.append("td");
      cell3.text(dataRow["n_injured"]);
      var cell4 = row.append("td");
      cell4.text(dataRow["n_killed_per_mil"]);
      var cell5 = row.append("td");
      cell5.text(dataRow["n_injured_per_mil"]);
      var cell6 = row.append("td");
      cell6.text(dataRow["year"]);
    });
}


const tbody=d3.select("tbody");
d3.json('http://127.0.0.1:5000/data.json',(error,data) =>{
    buildTable(data);

 $(document).ready(function(){
     $('#myTable').DataTable({
         "pageLength":25,
         "order":[[5,'asc']]
     });
 });
});