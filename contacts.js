
export async function onRequest(context) {
  const db = context.env.DB;
  const method = context.request.method;

  if (method === "POST") {
    const body = await context.request.json();
    await db.prepare("INSERT INTO contacts (customer_id, note) VALUES (?1,?2)")
            .bind(body.customer_id, body.note)
            .run();
    return Response.json({ ok: true });
  }

  if (method === "GET") {
    const url = new URL(context.request.url);
    const customer_id = url.searchParams.get("customer_id");
    if (!customer_id) {
      return Response.json({ error: "customer_id required" }, { status: 400 });
    }
    const { results } = await db.prepare("SELECT * FROM contacts WHERE customer_id = ?1")
                               .bind(customer_id)
                               .all();
    return Response.json(results);
  }

  return new Response("Method Not Allowed", { status: 405 });
}
