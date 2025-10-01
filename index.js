const API_URL = "/api/customers";

function render(list) {
  const tbody = document.querySelector("#customers tbody");
  tbody.innerHTML = "";
  (list || []).forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name ?? ""}</td>
      <td>${c.email ?? ""}</td>
      <td>${c.phone ?? ""}</td>
      <td><button onclick="deleteCustomer(${c.id})">Löschen</button></td>`;
    tbody.appendChild(tr);
  });
}

async function loadCustomers() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    const t = await res.text();
    alert("GET /api/customers Fehler: " + t);
    return;
  }
  render(await res.json());
}

async function addCustomer(e) {
  e.preventDefault();
  const name  = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  if (!name) return alert("Name erforderlich");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return alert("POST fehlgeschlagen: " + (data.error || res.status));
  }

  // Liste aus Server-Antwort übernehmen (oder neu laden)
  if (data.customers) render(data.customers); else await loadCustomers();
  e.target.reset();
}

async function deleteCustomer(id) {
  const res = await fetch(`/api/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const t = await res.text();
    alert("DELETE fehlgeschlagen: " + t);
  }
  loadCustomers();
}

document.getElementById("customerForm").addEventListener("submit", addCustomer);
document.addEventListener("DOMContentLoaded", loadCustomers);
