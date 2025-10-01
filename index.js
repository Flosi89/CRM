const API_URL = "/api/customers";

// -------- Laden --------
async function loadCustomers() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Fehler beim Laden: ${res.status}`);
    const customers = await res.json();

    const tbody = document.querySelector("#customers tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    customers.forEach((c) => tbody.appendChild(renderRow(c)));
  } catch (err) {
    alert("Fehler beim Laden der Kunden: " + err.message);
  }
}

// -------- Zeile rendern (Normalmodus) --------
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

// -------- Edit-Modus in einer Zeile --------
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

  tr.querySelector(".btn-save").addEventListener("click", async () => {
    const id = Number(c.id);
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
      const fresh = renderRow(updated);
      tr.replaceWith(fresh);
    } catch (err) {
      alert("Update fehlgeschlagen: " + err.message);
    }
  });

  tr.querySelector(".btn-cancel").addEventListener("click", async () => {
    // Einfach neu laden oder Original wiederherstellen
    loadCustomers();
  });
}

// -------- Anlegen --------
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
    if (!res.ok) throw new Error(await safeText(res));

    // Felder leeren und Liste aktualisieren
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";

    loadCustomers();
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
    loadCustomers();
  } catch (err) {
    alert("DELETE fehlgeschlagen: " + err.message);
  }
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
  loadCustomers();
});
