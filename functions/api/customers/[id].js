// DELETE /api/customers/:id  |  PUT /api/customers/:id

export async function onRequestDelete({ params, env }) {
  const id = Number(params.id);
  await env.DB.prepare("DELETE FROM customers WHERE id = ?1").bind(id).run();
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPut({ params, request, env }) {
  const id = Number(params.id);
  const { name, email, phone } = await request.json();

  if (!name) {
    return new Response(JSON.stringify({ error: "name required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await env.DB.prepare(
    "UPDATE customers SET name = ?1, email = ?2, phone = ?3 WHERE id = ?4"
  ).bind(name, email || null, phone || null, id).run();

  // Optional: aktualisierte Liste zurückgeben
  const { results } = await env.DB
    .prepare("SELECT id, name, email, phone, created_at FROM customers ORDER BY id DESC")
    .all();

  return new Response(JSON.stringify({ ok: true, customers: results }), {
    headers: { "Content-Type": "application/json" },
  });
}
