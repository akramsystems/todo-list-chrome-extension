// todo.js

// Keep track of the todo list items
let todoList = [];

// Add an item to the todo list
function addTodo(text) {
  todoList.push({
    text: text,
    completed: false
  });
  updateProgressBar();
}

// Remove an item from the todo list
function removeTodo(index) {
  todoList.splice(index, 1);
  updateProgressBar();
}

// Update the progress bar showing how many items are completed and remaining
function updateProgressBar() {
  let completedCount = todoList.filter(todo => todo.completed).length;
  let remainingCount = todoList.length - completedCount;
  let progressBar = document.getElementById('todo-progress');
  progressBar.style.width = `${(completedCount / todoList.length) * 100}%`;
  progressBar.innerHTML = `${completedCount}/${todoList.length} completed`;
}

// Mark an item as completed
function toggleCompleted(index) {
  todoList[index].completed = !todoList[index].completed;
  updateProgressBar();
}

// Render the todo list
function renderTodoList() {
  let todoListElement = document.getElementById('todo-list');
  todoListElement.innerHTML = '';
  todoList.forEach((todo, index) => {
    let todoElement = document.createElement('div');
    todoElement.classList.add('todo');
    if (todo.completed) {
      todoElement.classList.add('completed');
    }
    todoElement.innerHTML = `
      <input type="checkbox" onclick="toggleCompleted(${index})" ${todo.completed ? 'checked' : ''}>
      <span>${todo.text}</span>
      <button onclick="removeTodo(${index})">x</button>
    `;
    todoListElement.appendChild(todoElement);
  });
}

// Add a new todo item when the form is submitted
let form = document.getElementById('todo-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  let input = document.getElementById('todo-input');
  addTodo(input.value);
  input.value = '';
  renderTodoList();
});

// Initial render of the todo list
renderTodoList();
