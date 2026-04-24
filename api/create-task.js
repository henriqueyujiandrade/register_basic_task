const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  if (!process.env.POSTGRES_URL) {
    return res.status(500).json({ error: 'POSTGRES_URL não configurado' });
  }

  const sql = neon(process.env.POSTGRES_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS task (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        description TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const [task] = await sql`
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
