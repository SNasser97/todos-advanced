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

  // edit
  const editDiv = document.querySelector('#edit');
  const editClose = document.querySelector('#edit-close');
  const editBtn = document.querySelector('#edit-btn');
  const editInput = document.querySelector('#edit-input');
  const editCheckbox = document.querySelector('#checkBody');
  let changeBodyText = false;

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
    changeTodo
  } = TODO_METHODS;

  const state = {
    searchText: '',
    hideCompleted: false,
    sortByNotComplete: false,
    sortByRecent: false,
    sortByEdited: false,
    sortByAZ: false,
    todosArrayObj: [],
  }
  
  //! check if localStorage contains todos else empty
  let { todosArrayObj } = state;
  todosArrayObj = getSavedTodos();
  const renderTodos = (todos, { searchText, hideCompleted }) => {
    //! Debugging purposes
    console.warn('<<<<<<<<<<<<< APP RENDERED START >>>>>>>>>>>>>>>> ');
    console.info('rendered at=>', new Date().toLocaleTimeString('en'));
    console.table(todos);
    console.warn('<<<<<<<<<<<<< APP RENDERED END >>>>>>>>>>>>>>>> \n');

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
    saveTodos,
    changeTodo,
    todosArrayObj,
    btnAdd,
    btnRemoveAll,
    inputSearch,
    state,
    form,
    checkbox,
    sortByDropdown,
    editDiv,
    editClose,
    editBtn,
    editInput,
    editCheckbox,
    changeBodyText,
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
  TODO.addTodo(e.target.elements.todo.value, TODO.todosArrayObj);
  TODO.renderTodos(TODO.todosArrayObj, TODO.state);
  e.target.elements.todo.value = '';
});
//* remove todos + clear
TODO.btnRemoveAll.addEventListener('click', (e) => {
  e.preventDefault();
  TODO.removeAllTodos(TODO.todosArrayObj);
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

// * Edit div functionality - hide on close + hide on btn change
TODO.editClose.addEventListener('click', () => {
    const todoDIv = document.querySelector('.todo');
    TODO.editDiv.style.display = 'none';
    todoDIv.classList.remove('highlight');
});

TODO.editInput.addEventListener('keyup', (e) => {
    // close using enter key 
    if(e.keyCode == 13) {
      TODO.editDiv.style.display='none';
    }
    // edit matching todo and save to local storage
    TODO.changeTodo(TODO.todosArrayObj);
    TODO.renderTodos(TODO.todosArrayObj, TODO.state);
})
