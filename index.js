// -------------------------
// Kunden laden und anzeigen
// -------------------------
async function loadCustomers() {
  const tableBody = document.querySelector("#customers tbody");
  tableBody.innerHTML = "";

  try {
    const res = await fetch("/api/customers");
    if (!res.ok) {
      throw new Error(`Fehler beim Laden: ${res.status}`);
    }

    const customers = await res.json();

    customers.forEach((c) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone || ""}</td>
        <td>
          <button onclick="deleteCustomer(${c.id})">🗑️ Löschen</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    alert("Fehler beim Laden der Kunden: " + err.message);
  }
}

// -------------------------
// Kunde hinzufügen
// -------------------------
async function addCustomer() {
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const phone = document.querySelector("#phone").value.trim();

  if (!name) {
    alert("Bitte Namen eingeben!");
    return;
  }

  try {
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Fehler beim Anlegen: ${res.status} ${text}`);
    }

    document.querySelector("#name").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#phone").value = "";

    loadCustomers();
  } catch (err) {
    alert(err.message);
  }
}

// -------------------------
// Kunde löschen
// -------------------------
async function deleteCustomer(id) {
  if (!confirm("Wirklich löschen?")) return;

  try {
    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    const text = await res.text().catch(() => "");

    if (!res.ok) {
      throw new Error(`DELETE fehlgeschlagen: ${res.status} ${text}`);
    }

    loadCustomers();
  } catch (err) {
    alert(err.message);
  }
}

// -------------------------
// Initial laden
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadCustomers();
  document.querySelector("#addCustomerBtn").addEventListener("click", addCustomer);
});
