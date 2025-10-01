
export async function onRequest(context) {
  const db = context.env.DB;
  const url = new URL(context.request.url);
  const method = context.request.method;

  if (method === "GET") {
    const { results } = await db.prepare("SELECT * FROM customers").all();
    return Response.json(results);
  }

  if (method === "POST") {
    const body = await context.request.json();
    await db.prepare("INSERT INTO customers (name,email,phone) VALUES (?1,?2,?3)")
            .bind(body.name, body.email, body.phone)
            .run();
    return Response.json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
