const API_URL = "/api/customers";

async function loadCustomers() {
  const res = await fetch(API_URL);
  const customers = await res.json();

  const tbody = document.querySelector("#customers tbody");
  tbody.innerHTML = "";

  customers.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td><button onclick="deleteCustomer(${c.id})">Löschen</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function addCustomer() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  if (!name || !email) {
    alert("Bitte Name und Email eingeben!");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone })
  });

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";

  loadCustomers();
}

async function deleteCustomer(id) {
  await fetch(`/api/${id}`, { method: "DELETE" });
  loadCustomers();
}

document.addEventListener("DOMContentLoaded", loadCustomers);
