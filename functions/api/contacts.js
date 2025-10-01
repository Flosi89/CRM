export async function onRequestGet(context) {
  const { DB } = context.env;
  const { results } = await DB.prepare("SELECT * FROM contacts").all();
  return Response.json(results);
}

export async function onRequestPost(context) {
  const { DB } = context.env;
  const body = await context.request.json();
  const { customer_id, note } = body;

  await DB.prepare(
    "INSERT INTO contacts (customer_id, note) VALUES (?, ?)"
  ).bind(customer_id, note).run();

  return Response.json({ success: true });
}
