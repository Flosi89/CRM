export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare("SELECT * FROM customers").all();
  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost({ request, env }) {
  const data = await request.json();
  await env.DB.prepare(
    "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)"
  ).bind(data.name, data.email, data.phone).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
