const API_URL = "/api/customers";

let allCustomers = [];    // vollständige Liste aus dem Server
let sortKey = "id";       // aktueller Sortierschlüssel
let sortAsc = false;      // Start: ID absteigend (neueste oben)
let searchTerm = "";      // Suchtext

// -------- Laden --------
async function loadCustomers() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Fehler beim Laden: ${res.status}`);
    allCustomers = await res.json();
    renderTable();
  } catch (err) {
    alert("Fehler beim Laden der Kunden: " + err.message);
  }
}

// -------- Tabellen-Rendering mit Suche & Sortierung --------
function renderTable() {
  const tbody = document.querySelector("#customers tbody");
  if (!tbody) return;

  // Filtern
  const term = searchTerm.toLowerCase();
  let list = allCustomers.filter(c => {
    const name  = (c.name  || "").toLowerCase();
    const email = (c.email || "").toLowerCase();
    const phone = (c.phone || "").toLowerCase();
    return !term || name.includes(term) || email.includes(term) || phone.includes(term);
  });

  // Sortieren
  list.sort((a, b) => {
    const av = (a[sortKey] ?? "").toString().toLowerCase();
    const bv = (b[sortKey] ?? "").toString().toLowerCase();
    if (av < bv) return sortAsc ? -1 : 1;
    if (av > bv) return sortAsc ? 1 : -1;
    return 0;
  });

  // Render
  tbody.innerHTML = "";
  list.forEach(c => tbody.appendChild(renderRow(c)));
}

// -------- Zeile normal --------
function renderRow(c) {
  const tr = document.createElement("tr");
  tr.dataset.id = c.id;
  tr.innerHTML = `
    <td>${c.id}</td>
    <td class="cell-name">${escapeHtml(c.name)}</td>
    <td class="cell-email">${escapeHtml(c.email || "")}</td>
    <td class="cell-phone">${escapeHtml(c.phone || "")}</td>
    <td class="actions">
      <button class="btn-edit">Bearbeiten</button>
      <button class="btn-del">Löschen</button>
    </td>
  `;
  tr.querySelector(".btn-del").addEventListener("click", () => deleteCustomer(c.id));
  tr.querySelector(".btn-edit").addEventListener("click", () => enterEditMode(tr, c));
  return tr;
}

// -------- Edit-Modus --------
function enterEditMode(tr, c) {
  tr.classList.add("editing");
  tr.innerHTML = `
    <td>${c.id}</td>
    <td><input class="inp-name" type="text" value="${escapeAttr(c.name)}" /></td>
    <td><input class="inp-email" type="email" value="${escapeAttr(c.email || "")}" /></td>
    <td><input class="inp-phone" type="text" value="${escapeAttr(c.phone || "")}" /></td>
    <td class="actions">
      <button class="btn-save">Speichern</button>
      <button class="btn-cancel">Abbrechen</button>
    </td>
  `;
  tr.querySelector(".btn-save").addEventListener("click", () => saveEdit(tr, c.id));
  tr.querySelector(".btn-cancel").addEventListener("click", loadCustomers);
}

async function saveEdit(tr, id) {
  const name  = tr.querySelector(".inp-name").value.trim();
  const email = tr.querySelector(".inp-email").value.trim();
  const phone = tr.querySelector(".inp-phone").value.trim();
  if (!name) { alert("Name ist Pflicht"); return; }

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });
    if (!res.ok) throw new Error(await safeText(res));
    const updated = await res.json();

    // Lokale Liste aktualisieren, dann neu rendern
    const idx = allCustomers.findIndex(x => x.id === id);
    if (idx >= 0) allCustomers[idx] = updated;
    renderTable();
  } catch (err) {
    alert("Update fehlgeschlagen: " + err.message);
  }
}

// -------- Anlegen --------
async function addCustomer() {
  const name = document.getElementById("name")?.value.trim() ?? "";
  const email = document.getElementById("email")?.value.trim() ?? "";
  const phone = document.getElementById("phone")?.value.trim() ?? "";
  if (!name) { alert("Bitte Name eingeben"); return; }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });
    if (!res.ok) throw new Error(await safeText(res));
    const created = await res.json();

    // lokal ergänzen & neu rendern
    allCustomers.unshift(created);
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    renderTable();
  } catch (err) {
    alert("Fehler beim Anlegen: " + err.message);
  }
}

// -------- Löschen --------
async function deleteCustomer(id) {
  if (!confirm("Wirklich löschen?")) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await safeText(res));
    allCustomers = allCustomers.filter(x => x.id !== id);
    renderTable();
  } catch (err) {
    alert("DELETE fehlgeschlagen: " + err.message);
  }
}

// -------- Suche & Sortier-Klicks --------
function initSearchAndSort() {
  document.getElementById("search")?.addEventListener("input", (e) => {
    searchTerm = e.target.value || "";
    renderTable();
  });

  // Klick auf Spaltenköpfe
  document.querySelectorAll("#customers thead th[data-sort]")?.forEach(th => {
    th.addEventListener("click", () => {
      const key = th.getAttribute("data-sort");
      if (sortKey === key) {
        sortAsc = !sortAsc; // Richtung umschalten
      } else {
        sortKey = key;
        sortAsc = true; // neue Spalte -> aufsteigend starten
      }
      renderTable();
    });
  });
}

// -------- Utils --------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[m]));
}
function escapeAttr(s) { return escapeHtml(s); }
async function safeText(res){ try{ return await res.text(); }catch{ return ""; } }

// -------- Init --------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addCustomerBtn")?.addEventListener("click", addCustomer);
  initSearchAndSort();
  loadCustomers();
});
