// Select the elements
const clear = document.querySelector('.clear');
const dateElement = document.getElementById('date');
const list = document.getElementById('list');
const input = document.getElementById('input');

// Classes names
const checked = 'fa-check-circle';
const unchecked = 'fa-circle-thin';
const lineThrough = 'lineThrough';

// Show today's date
dateElement.innerHTML = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
});

// Variables
let todosList;
let id;

// get item from the local storage
let data = localStorage.getItem('todo');

if (data) {
  todosList = JSON.parse(data);
  id = todosList.length;
  loadList(todosList);
} else {
  todosList = [];
  id = 0;
}

// load items to the user's interface
function loadList(list) {
  list.forEach(item => addTodo(item.name, item.id, item.done, item.trash));
}

// clear the local storage
clear.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});

// event listener for enter key
document.addEventListener('keyup', event => {
  if (event.keyCode === 13) {
    const todo = input.value;

    if (todo) {
      addTodo(todo, id, false, false);

      todosList.push({
        name: todo,
        id: id,
        done: false,
        trash: false,
      });

      // add item to the local storage
      localStorage.setItem('todo', JSON.stringify(todosList));

      id++;
    }

    input.value = '';
  }
});

list.addEventListener('click', event => {
  const element = event.target;
  const action = event.target.dataset.action;

  if (action === 'complete') {
    completeTodo(element);
  }

  if (action === 'delete') {
    removeTodo(element);
  }

  // add item to the local storage
  localStorage.setItem('todo', JSON.stringify(todosList));
});

function addTodo(todo, id, done, trash) {
  if (trash) {
    return;
  }

  const isDone = done ? checked : unchecked;
  const line = done ? lineThrough : '';

  const item = `
    <li class="item">
      <i class="fa ${isDone} co" data-action="complete" id="${id}"></i>
      <p class="text ${line}">${todo}</p>
      <i class="fa fa-trash-o de" data-action="delete" id="${id}"></i>
    </li>
  `;
  list.insertAdjacentHTML('beforeend', item);
}

function completeTodo(element) {
  element.classList.toggle(checked);
  element.classList.toggle(unchecked);
  element.parentNode.querySelector('.text').classList.toggle(lineThrough);

  todosList[element.id].done = !todosList[element.id].done;
}

function removeTodo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);
  todosList[element.id].trash = true;
}