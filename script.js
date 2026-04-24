const form = document.getElementById('task-form');
const feedback = document.getElementById('form-feedback');
const btnSubmit = document.getElementById('btn-submit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('task-name').value.trim();
  const description = document.getElementById('task-desc').value.trim();

  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Registrando…';
  hideFeedback();

  try {
    const res = await fetch('/api/create-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });

    const data = await res.json();

    if (res.ok) {
      showFeedback('Tarefa registrada! ID: ' + data.task_id, 'success');
      form.reset();
    } else {
      showFeedback(data.error || 'Erro ao registrar tarefa.', 'error');
    }
  } catch {
    showFeedback('Erro de conexão com o servidor.', 'error');
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Registrar';
  }
});

function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className = 'form-feedback ' + type;
}

function hideFeedback() {
  feedback.className = 'form-feedback hidden';
}
