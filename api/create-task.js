const { neon } = require('@neondatabase/serverless');

let sql;
try {
  sql = neon(process.env.POSTGRES_URL);
} catch (err) {
  console.error('[create-task] falha conectando ao banco:', err.message);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS task (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        description TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const { rows: [task] } = await sql`
      INSERT INTO task (name, description)
      VALUES (${name.trim()}, ${description?.trim() || null})
      RETURNING id
    `;

    console.log('[create-task] tarefa salva. id:', task.id);
    return res.status(200).json({ ok: true, task_id: task.id });
  } catch (err) {
    console.error('[create-task] erro no banco:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
