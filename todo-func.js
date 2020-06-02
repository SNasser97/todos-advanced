const TODO_METHODS = (function() {

  //* getSavedTodos
  function getSavedTodos() {
    const todosJSON = localStorage.getItem('todos');
    return todosJSON ? JSON.parse(todosJSON) : [];
  }
  
  //* saveTodos
  function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  //* deleteSavedTodos 
  function deleteSavedTodos(key) {
    localStorage.removeItem(key);
  }

  //* SORT
  //! sort Methods
  const sortActions = {
    byComplete(a, b) {
      if (a.isCompleted == b.isCompleted) {
        return 0;
      } else if (a.isCompleted > b.isCompleted) {
        return -1;
      } else {
        return 1;
      }
    },
    byNotComplete(a, b) {
      if (a.isCompleted < b.isCompleted) {
        return -1;
      } else if (a.isCompleted == b.isCompleted) {
        return 0;
      } else {
        return 1;
      }
    }
  }
  //! handles sorting of todos array
  function sortTodos(todos, { sortByComplete, sortByNotComplete }) {
    if (sortByComplete) {
      todos.sort((a, b) => sortActions.byComplete(a, b));
    } else if (sortByNotComplete) {
      todos.sort((a, b) => sortActions.byNotComplete(a, b));
    }
  }
  //! Sort by selected option - we add additional sorting option cases here
  function sortOptions(value, state) {
    switch (value) {
      case 'byComplete':
        state.sortByComplete = true;
        state.sortByNotComplete = false;
        break;
      case 'byNotComplete':
        state.sortByNotComplete = true;
        state.sortByComplete = false;
        break;
      default:
        state.sortByNotComplete = false;
        state.sortByComplete = false;
    }
  }

  //* TODOS SUMMARY
  function todosSummary(todos) {
    const todosInfo = document.querySelector('#todos-left');
    todosInfo.textContent = `You have ${todos.length} todos to complete! (In red)`;
  }

  //* REMOVE ALL TODOS
  function removeTodos(todos) {
    deleteSavedTodos('todos');
    document.querySelectorAll('p.todo').forEach(todo => todo.remove());
    todos.length = 0;
  }
  //* CREATE DELETE ELEMENT
  function createDeleteBtn() {
   
    return btnDelete;
  }
  //* CREATE TODO ELEMENT
  function createTodosDOM(todos) {
    const todoEl = document.createElement('div');
    const todoText = document.createElement('span');
    const todoDelete = document.createElement('button');
    const todoCheckbox = document.createElement('input');

    // setup text
    todoText.setAttribute('class','todo-text');
    todoText.textContent = todos.text;

    // setup delete btn
    todoDelete.setAttribute('class', 'delete');
    todoDelete.textContent = 'X';

    // setup checkbox
    todoCheckbox.setAttribute('class', 'todo-check');
    todoCheckbox.setAttribute('type', 'checkbox');

    // Append elements to div
    todoEl.setAttribute('class', 'todo');
    todoEl.appendChild(todoCheckbox);
    todoEl.appendChild(todoText);
    todoEl.appendChild(todoDelete);

    if (!todos.isCompleted) {
      todoText.classList.add('not-done');
    }
    return todoEl;
  }

  //* ADD todo 
  //! Validate todo value
  function validateInput(string) {
    // check if empty or one char
    if (string == null || string == "" || string.length <= 1) {
      return false;
    }
    return true;
  }

  function addTodo(value, todos) {
    const output = document.querySelector('#output');
    const newTodo = createTodosDOM(value);
    const results = document.querySelector('#todos');

    // my method - const input = document.querySelector('#input');
    if (validateInput(value)) {
      // push todos array to local, key 'todos'
      todos.push({ text: value, isCompleted: false });
      saveTodos(todos);
      results.appendChild(newTodo);
      output.textContent = `Added "${value}" to list!`;
    } else {
      output.textContent = `Cant add "${value}" to list!`;
    }
  }
  // 1. return methods for todo
  return {
    getSavedTodos,
    saveTodos,
    deleteSavedTodos,
    todosSummary,
    sortOptions,
    createTodosDOM,
    sortTodos,
    addTodo,
    removeTodos,
  }

})();