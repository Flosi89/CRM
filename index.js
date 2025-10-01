async function loadCustomers() {
  const res = await fetch("/api/customers");
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
      <td>
        <button onclick="deleteCustomer(${c.id})">Löschen</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function addCustomer() {
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const phone = document.querySelector("#phone").value;

  if (!name) {
    alert("Name ist erforderlich!");
    return;
  }

  const res = await fetch("/api/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone }),
  });

  if (res.ok) {
    document.querySelector("#name").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#phone").value = "";
    loadCustomers();
  } else {
    alert("Kunde anlegen fehlgeschlagen: " + (await res.text()));
  }
}

async function deleteCustomer(id) {
  if (!confirm("Wirklich löschen?")) return;

  const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });

  if (res.ok) {
    loadCustomers();
  } else {
    alert("DELETE fehlgeschlagen: " + (await res.text()));
  }
}

// Beim Laden der Seite sofort Kunden holen
window.onload = loadCustomers;
