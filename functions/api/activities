// GET /api/activities?customer_id=123
// POST /api/activities  { customer_id, subject, type?, due_at? }

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const cid = url.searchParams.get("customer_id");

  const stmt = cid
    ? env.DB.prepare(
        "SELECT * FROM activities WHERE customer_id = ? ORDER BY created_at DESC"
      ).bind(Number(cid))
    : env.DB.prepare("SELECT * FROM activities ORDER BY created_at DESC");

  const { results } = await stmt.all();
  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost({ env, request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const customer_id = Number(body.customer_id);
  const subject = (body.subject || "").trim();
  const type = (body.type || "note").trim();
  const due_at = body.due_at || null;

  if (!customer_id || !subject) {
    return new Response("customer_id & subject required", { status: 400 });
  }

  await env.DB.prepare(
    "INSERT INTO activities (customer_id, subject, type, due_at) VALUES (?, ?, ?, ?)"
  ).bind(customer_id, subject, type, due_at).run();

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
