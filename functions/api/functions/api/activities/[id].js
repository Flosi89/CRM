// PUT /api/activities/:id   body: { subject?, type?, due_at?, done? }
// DELETE /api/activities/:id

export async function onRequestPut({ env, params, request }) {
  const id = Number(params.id);
  if (!id) return new Response("bad id", { status: 400 });

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const sets = [];
  const vals = [];

  if (body.subject != null) {
    sets.push("subject = ?");
    vals.push(String(body.subject));
  }
  if (body.type != null) {
    sets.push("type = ?");
    vals.push(String(body.type));
  }
  if (body.due_at != null) {
    sets.push("due_at = ?");
    vals.push(body.due_at || null);
  }
  if (body.done != null) {
    sets.push("done = ?");
    vals.push(body.done ? 1 : 0);
  }

  if (!sets.length) {
    return new Response("no fields", { status: 400 });
  }

  vals.push(id);
  await env.DB.prepare(
    `UPDATE activities SET ${sets.join(", ")} WHERE id = ?`
  ).bind(...vals).run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestDelete({ env, params }) {
  const id = Number(params.id);
  if (!id) return new Response("bad id", { status: 400 });

  await env.DB.prepare("DELETE FROM activities WHERE id = ?").bind(id).run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
