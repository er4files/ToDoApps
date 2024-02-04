// script.js

// Constants
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

// Todo data
const todos = [];

// Utility Functions
function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted
  };
}

function findTodo(todoId) {
  return todos.find(todoItem => todoItem.id === todoId) || null;
}

function findTodoIndex(todoId) {
  return todos.findIndex(todoItem => todoItem.id === todoId);
}

function isStorageExist() {
  if (typeof Storage === 'undefined') {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData) || [];

  todos.length = 0;
  todos.push(...data);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeTodo(todoObject) {
  const { id, task, timestamp, isCompleted } = todoObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = task;

  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = timestamp;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `todo-${id}`);

  if (isCompleted) {
    const undoButton = createButton('undo-button', 'Undo', () => undoTaskFromCompleted(id));
    const trashButton = createButton('trash-button', 'Hapus', () => removeTaskFromCompleted(id));

    container.append(undoButton, trashButton);
  } else {
    const checkButton = createButton('check-button', 'Selesai', () => addTaskToCompleted(id));
    container.append(checkButton);
  }

  return container;
}

function createButton(className, text, clickHandler) {
  const button = document.createElement('button');
  button.classList.add(className);
  button.innerText = text;
  button.addEventListener('click', clickHandler);
  return button;
}

function addTodo() {
  const textTodo = document.getElementById('title').value;
  const timestamp = document.getElementById('date').value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId) {
  const todoTargetIndex = findTodoIndex(todoId);

  if (todoTargetIndex === -1) return;

  todos.splice(todoTargetIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  const listCompleted = document.getElementById('completed-todos');

  // Clearing list items
  uncompletedTODOList.innerHTML = '';
  listCompleted.innerHTML = '';

  todos.forEach(todoItem => {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  });
});
