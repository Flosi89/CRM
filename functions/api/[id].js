export async function onRequestDelete(context) {
  const { DB } = context.env;
  const { id } = context.params;

  await DB.prepare("DELETE FROM customers WHERE id = ?")
    .bind(id)
    .run();

  return Response.json({ success: true });
}
