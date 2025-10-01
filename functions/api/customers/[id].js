export async function onRequestDelete(context) {
  const id = context.params.id;
  try {
    await context.env.DB.prepare("DELETE FROM customers WHERE id = ?")
      .bind(id)
      .run();

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
