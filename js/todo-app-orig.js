//! BETTER COMMENTS EXTENTION IS USED
// Where our methods/functions + var declarations reside 
const TODO = (function () {
  const body = document.querySelector('body');
  const btnAdd = document.querySelector('#btn__add');
  const btnRemoveAll = document.querySelector('#btn__remove--all');
  const inputSearch = document.querySelector('#search');
  const results = document.querySelector('#todos');
  const form = document.querySelector('#todo-form');
  const checkbox = document.querySelector('#hideComplete');
  const sortByDropdown = document.querySelector('#sort-by');

  //! TODO STATE
  const state = {
    searchText: '',
    hideCompleted: false,
    sortByComplete: false,
    sortByNotComplete: false,
    todosArrayObj: [],
  }

  //! check if localStorage contains todos else empty
  let { todosArrayObj } = state;
  todosArrayObj = getSavedTodos();

  function getSavedTodos() {
    const todosJSON = localStorage.getItem('todos');
    return todosJSON ? JSON.parse(todosJSON) : [];
  }

  //! saveTodos
  function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  //! deleteSavedTodos 
  function deleteSavedTodos(key) {
    localStorage.removeItem(key);
  }

  const renderTodos = (todos, { searchText, hideCompleted }) => {
    //! Debugging purposes
    console.info('rendered at=>', new Date().toLocaleTimeString('en'));
    console.table(todosArrayObj);

    //! Where filter on search or by completed.
    const filtered = todos.filter(todo => {
      // if hideComplete state is true = show NOT-DONE, else show ALL
      const searchStrMatch = todo.text.toLowerCase().includes(searchText.toLowerCase());
      if (hideCompleted && searchStrMatch) {
        return !todo.isCompleted;
      }
      return searchStrMatch;
    });
    results.textContent = '';

    // sort based on sort state
    sortTodos(filtered, state);

    filtered.forEach(todo => {
      const todoEl = createTodosDOM(todo);
      results.appendChild(todoEl);
    });

    todosSummary(todosArrayObj);
  }

  //! obj of handling sort methods
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

  //! Remove all todos
  function removeTodos() {
    deleteSavedTodos('todos');
    document.querySelectorAll('p.todo').forEach(todo => todo.remove());
    todosArrayObj.length = 0;
  }

  //! createTodosDOM
  function createTodosDOM(todos) {
    const todoEl = document.createElement('p');
    todoEl.setAttribute('class', 'todo');
    if (!todos.isCompleted) {
      todoEl.classList.add('not-done');
    }
    todoEl.textContent = todos.text;
    return todoEl;
  }

  //! Validate todo value
  function validateInput(string) {
    // check if empty or one char
    if (string == null || string == "" || string.length <= 1) {
      return false;
    }
    return true;
  }

  //! ADD todo 
  function addTodo(value) {
    const output = document.querySelector('#output');
    const newTodo = createTodosDOM(value);
    // my method - const input = document.querySelector('#input');
    if (validateInput(value)) {
      // push todos array to local, key 'todos'
      todosArrayObj.push({ text: value, isCompleted: false });
      saveTodos(todosArrayObj);
      results.appendChild(newTodo);
      output.textContent = `Added "${value}" to list!`;
    } else {
      output.textContent = `Cant add "${value}" to list!`;
    }
  }

  //! print todos remaining (uses length)
  function todosSummary(todos) {
    const todosInfo = document.querySelector('#todos-left');
    todosInfo.textContent = `You have ${todos.length} todos to complete! (In red)`;
  }

  return {
    addTodo,
    removeTodos,
    renderTodos,
    sortOptions,
    todosArrayObj,
    btnAdd,
    btnRemoveAll,
    inputSearch,
    state,
    form,
    checkbox,
    sortByDropdown,
  }
})();

//* render init state + arrayObj onload
window.onload = () => {
  TODO.inputSearch.value = '';
  document.querySelector('#input').value = '';
  TODO.renderTodos(TODO.todosArrayObj, TODO.state);
  TODO.sortByDropdown.value = 'default';
}

//* add todo from Form element value
TODO.form.addEventListener('submit', (e) => {
  e.preventDefault();
  TODO.addTodo(e.target.elements.todo.value);
  TODO.renderTodos(TODO.todosArrayObj, TODO.state);
  e.target.elements.todo.value = '';
});

TODO.btnRemoveAll.addEventListener('click', (e) => {
  e.preventDefault();
  TODO.removeTodos();
  TODO.renderTodos(TODO.todosArrayObj, TODO.state);
});

//* on input re-render list matching text of todos obj
TODO.inputSearch.addEventListener('input', (e) => {
  TODO.state.searchText = e.target.value;
  TODO.renderTodos(TODO.todosArrayObj, TODO.state);
});
//* hide complete, re-render list
TODO.checkbox.addEventListener('change', (e) => {
  TODO.state.hideCompleted = e.target.checked;
  TODO.renderTodos(TODO.todosArrayObj, TODO.state);
});

//* sort by 
TODO.sortByDropdown.addEventListener('change', (e) => {
  console.log(e.target.value);
  TODO.sortOptions(e.target.value, TODO.state);
  TODO.renderTodos(TODO.todosArrayObj, TODO.state);
});
