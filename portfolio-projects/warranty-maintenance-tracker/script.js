document.getElementById("trackerForm").addEventListener("submit", function(event) {
  const itemName = document.getElementById("itemName").value.trim();
  const category = document.getElementById("category").value;
  const brand = document.getElementById("brand").value.trim();
  const purchaseDate = document.getElementById("purchaseDate").value;
  const price = document.getElementById("price").value;
  const warrantyEnd = document.getElementById("warrantyEnd").value;
  const maintenanceDate = document.getElementById("maintenanceDate").value;
  const notes = document.getElementById("notes").value.trim();

  const message = document.getElementById("message");

  if (itemName === "" || category === "" || purchaseDate === "" || price === "" || warrantyEnd === "") {
    event.preventDefault();
    message.textContent = "Please complete all required fields marked with *.";
    message.className = "error";
    return;
  }

  if (price <= 0) {
    event.preventDefault();
    message.textContent = "Purchase price must be greater than zero.";
    message.className = "error";
    return;
  }

  if (warrantyEnd < purchaseDate) {
    event.preventDefault();
    message.textContent = "Warranty end date cannot be before the purchase date.";
    message.className = "error";
    return;
  }

  const table = document.getElementById("itemTable");
  const row = table.insertRow();

  row.insertCell(0).textContent = itemName;
  row.insertCell(1).textContent = category;
  row.insertCell(2).textContent = brand || "N/A";
  row.insertCell(3).textContent = purchaseDate;
  row.insertCell(4).textContent = "$" + parseFloat(price).toFixed(2);
  row.insertCell(5).textContent = warrantyEnd;
  row.insertCell(6).textContent = maintenanceDate || "N/A";
  row.insertCell(7).textContent = notes || "N/A";

  message.textContent = "Sending item to the back-end database...";
  message.className = "success";
});
