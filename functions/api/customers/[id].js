// GET /api/customers/:id  -> einen Kunden holen (debug/optional)
export async function onRequestGet({ env, params }) {
  const id = Number(params.id);
  if (!id) return new Response("ungültige id", { status: 400 });
  const { results } = await env.DB.prepare(
    "SELECT id, name, email, phone FROM customers WHERE id = ?"
  ).bind(id).all();
  if (!results.length) return new Response("not found", { status: 404 });
  return new Response(JSON.stringify(results[0]), {
    headers: { "Content-Type": "application/json" },
  });
}

// DELETE /api/customers/:id -> Kunde löschen
export async function onRequestDelete({ env, params }) {
  try {
    const id = Number(params.id);
    if (!id) return new Response("ungültige id", { status: 400 });

    await env.DB.prepare("DELETE FROM customers WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT /api/customers/:id -> Kunde updaten
export async function onRequestPut({ env, params, request }) {
  try {
    const id = Number(params.id);
    if (!id) return new Response("ungültige id", { status: 400 });

    const body = await request.json().catch(() => ({}));
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim() || null;
    const phone = (body.phone ?? "").trim() || null;

    if (!name) return new Response("name ist Pflicht", { status: 400 });

    await env.DB.prepare(
      "UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?"
    ).bind(name, email, phone, id).run();

    const { results } = await env.DB.prepare(
      "SELECT id, name, email, phone FROM customers WHERE id = ?"
    ).bind(id).all();

    if (!results.length) return new Response("not found", { status: 404 });

    return new Response(JSON.stringify(results[0]), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
