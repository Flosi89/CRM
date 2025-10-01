export async function onRequestDelete({ params, env }) {
  await env.DB.prepare("DELETE FROM customers WHERE id = ?")
    .bind(params.id)
    .run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
