// Initialize the todo list array

// what does the following line do ?
let todoList = [];


chrome.storage.local.get(['todoList'], function(result) {
  if (result.todoList) {
    todoList = result.todoList;
  }
  renderTodoList();
});

chrome.storage.onChanged.addListener(function(changes) {
  if ('todoList' in changes) {
    todoList = changes.todoList.newValue;
    console.log('Todo list reloaded from storage');
    renderTodoList();
  }
});

// Add a new item to the todo list
function addTodo(text) {
  todoList.push({
    text: text,
    completed: false
  });
  saveTodoList();
}

// Remove an item from the todo list
function removeTodo(index) {
  todoList.splice(index, 1);
  saveTodoList();
}

// Toggle the completed state of an item in the todo list
function toggleTodo(index) {
  todoList[index].completed = !todoList[index].completed;
  saveTodoList();
}

// Save the todo list to storage
function saveTodoList() {
  chrome.storage.local.set({'todoList': todoList}, function() {
    console.log('Todo list saved to storage');
  });
}

// Render the todo list
function renderTodoList() {
  // Clear the todo list element
  const todoListElement = document.getElementById('todo-list');
  todoListElement.innerHTML = '';

  // Render each item in the todo list
  for (let i = 0; i < todoList.length; i++) {
    const todo = todoList[i];

    // Create a list item element for the todo
    const todoElement = document.createElement('li');
    todoElement.classList.add('todo');
    if (todo.completed) {
      todoElement.classList.add('completed');
    }

    // Create a checkbox element for the todo
    const checkboxElement = document.createElement('input');
    checkboxElement.type = 'checkbox';
    checkboxElement.checked = todo.completed;
    checkboxElement.addEventListener('click', function() {
      toggleTodo(i);
      renderTodoList();
    });

    // Create a span element for the todo text
    const textElement = document.createElement('span');
    textElement.textContent = todo.text;

    // Create a button element for the remove button
    const removeButtonElement = document.createElement('button');
    removeButtonElement.textContent = 'Remove';
    removeButtonElement.addEventListener('click', function() {
      removeTodo(i);
      renderTodoList();
    });

    // Append the checkbox, text, and remove button to the todo element
    todoElement.appendChild(checkboxElement);
    todoElement.appendChild(textElement);
    todoElement.appendChild(removeButtonElement);

    // Append the todo element to the todo list element
    todoListElement.appendChild(todoElement);
  }

  

  // Update the progress bar
  const progressElement = document.getElementById('todo-progress');
  if (todoList.length === 0) {
    // Set the width to 0% if the todo list is empty
    progressElement.style.width = '0%';
  } else {
    // Calculate the percentage and set the width
    progressElement.style.width = (todoList.filter(function(todo) {
      return todo.completed;
    }).length / todoList.length * 100) + '%';
  }
  progressElement.setAttribute('data-label', todoList.filter(function(todo) {
    return todo.completed;
  }).length + '/' + todoList.length);
}

// Add a new item to the todo list when the form is submitted
const formElement = document.getElementById('todo-form');
formElement.addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the todo text from the form input
  const inputElement = document.getElementById('todo-input');
  const text = inputElement.value.trim();
  if (text !== '') {
    // Add the todo to the list and clear the input
    addTodo(inputElement.value);
    inputElement.value = '';
    renderTodoList();
  }
});

chrome.storage.local.get(['todoList'], function(result) {
  if (result.todoList) {
  todoList = result.todoList;
  } else {
  chrome.storage.local.set({'todoList': []});
  }
  renderTodoList();
});