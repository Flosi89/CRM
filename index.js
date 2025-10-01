const API_URL = "/api/customers";

async function loadCustomers() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Fehler beim Laden: ${res.status}`);
    const customers = await res.json();

    const tbody = document.querySelector("#customers tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    customers.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.email ?? ""}</td>
        <td>${c.phone ?? ""}</td>
        <td class="actions">
          <button onclick="deleteCustomer(${c.id})">Löschen</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert("Fehler beim Laden der Kunden: " + err.message);
  }
}

async function addCustomer() {
  const name = document.getElementById("name")?.value.trim() ?? "";
  const email = document.getElementById("email")?.value.trim() ?? "";
  const phone = document.getElementById("phone")?.value.trim() ?? "";

  if (!name) {
    alert("Bitte Name eingeben");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });
    if (!res.ok) throw new Error(await res.text());

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";

    loadCustomers();
  } catch (err) {
    alert("Fehler beim Anlegen: " + err.message);
  }
}

async function deleteCustomer(id) {
  if (!confirm("Wirklich löschen?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const text = await res.text().catch(() => "");
    if (!res.ok) throw new Error(`${res.status} ${text}`);
    loadCustomers();
  } catch (err) {
    alert("DELETE fehlgeschlagen: " + err.message);
  }
}

window.deleteCustomer = deleteCustomer; // Button-Handler erreichbar machen

document.addEventListener("DOMContentLoaded", () => {
  // Falls Button fehlt, crasht es NICHT mehr
  document.getElementById("addCustomerBtn")?.addEventListener("click", addCustomer);
  loadCustomers();
});
