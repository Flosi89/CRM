export async function onRequestGet(context) {
  const { DB } = context.env;
  const { results } = await DB.prepare("SELECT * FROM customers").all();
  return Response.json(results);
}

export async function onRequestPost(context) {
  const { DB } = context.env;
  const body = await context.request.json();
  const { name, email, phone } = body;

  await DB.prepare(
    "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)"
  ).bind(name, email, phone).run();

  return Response.json({ success: true });
}
