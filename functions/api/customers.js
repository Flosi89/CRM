// functions/api/customers.js
export async function onRequestGet({ env }) {
  const { results } = await env.DB
    .prepare("SELECT id, name, email, phone, created_at FROM customers ORDER BY id DESC")
    .all();
  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost({ request, env }) {
  try {
    const { name, email, phone } = await request.json();
    if (!name) {
      return new Response(JSON.stringify({ error: "name required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.DB
      .prepare("INSERT INTO customers (name, email, phone) VALUES (?1, ?2, ?3)")
      .bind(name, email || null, phone || null)
      .run();

    // gib den neuen Stand zurück
    const { results } = await env.DB
      .prepare("SELECT id, name, email, phone, created_at FROM customers ORDER BY id DESC")
      .all();

    return new Response(JSON.stringify({ ok: true, customers: results }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
