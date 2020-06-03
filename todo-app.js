//! BETTER COMMENTS EXTENTION IS USED
// Where our methods/functions + var declarations reside 
const {
  addTodo,
  removeAllTodos,
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
} = (function () {
  const body = document.querySelector('body');
  const btnAdd = document.querySelector('#btn__add');
  const btnRemoveAll = document.querySelector('#btn__remove--all');
  const inputSearch = document.querySelector('#search');
  const results = document.querySelector('#todos');
  const form = document.querySelector('#todo-form');
  const checkbox = document.querySelector('#hideComplete');
  const sortByDropdown = document.querySelector('#sort-by');

  // 2. TODO METHODS - 'imported' from todo-func.js'
  const {
    getSavedTodos,
    saveTodos,
    deleteSavedTodos,
    todosSummary,
    sortOptions,
    createTodosDOM,
    sortTodos,
    addTodo,
    removeAllTodos,
  } = TODO_METHODS;

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

  const renderTodos = (todos, { searchText, hideCompleted }) => {
    //! Debugging purposes
    console.info('rendered at=>', new Date().toLocaleTimeString('en'));
    console.table(todos);

    //! Where filter on search or by isCompleted.
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
    
    const todosRemaining = todos.filter(todo => !todo.isCompleted);
    todosSummary(todosRemaining);
    
  }

  /* 
    3. destructure methods from todo-func.js e.g. const {method_1} = TODO_METHODS;
      Then we return objects from TODO and accessed by method_1 or var
  */
  return {
    addTodo,
    removeAllTodos,
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
  inputSearch.value = '';
  document.querySelector('#input').value = '';
  renderTodos(todosArrayObj, state);
  sortByDropdown.value = 'default';
}

//* add todo from Form element value
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(e.target.elements.todo.value, todosArrayObj);
  renderTodos(todosArrayObj, state);
  e.target.elements.todo.value = '';
});
//* remove todos + clear
btnRemoveAll.addEventListener('click', (e) => {
  e.preventDefault();
  removeAllTodos(todosArrayObj);
  renderTodos(todosArrayObj, state);
});

//* on input re-render list matching text of todos obj
inputSearch.addEventListener('input', (e) => {
    state.searchText = e.target.value;
    renderTodos(todosArrayObj, state);
});
//* hide complete, re-render list
checkbox.addEventListener('change', (e) => {
  state.hideCompleted = e.target.checked;
  renderTodos(todosArrayObj, state);
});

//* sort by 
sortByDropdown.addEventListener('change', (e) => {
  console.log(e.target.value);
  sortOptions(e.target.value, state);
  renderTodos(todosArrayObj, state);
});