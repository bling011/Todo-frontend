const BASE_URL = 'http://127.0.0.1:8000/api/todos/';

export const getTodos = async () => {
  const response = await fetch(BASE_URL);
  return response.json();
};

export const addTodo = async (title) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed: false }),
  });
  return response.json();
};

export const updateTodo = async (id, updatedFields) => {
  const response = await fetch(`${BASE_URL}${id}/`, {
    method: 'PATCH', // Ensure this is PATCH
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
};

export const deleteTodo = async (id) => {
  await fetch(`${BASE_URL}${id}/`, { method: 'DELETE' });
};
