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
    let clear = [];
    localStorage.setItem(key, JSON.stringify(clear));
    // localStorage.removeItem(key);
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
    },
    byRecent(a,b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    },
    byEdited(a,b) {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    },
    byAlphabetical(a,b) {
      if(a.text < b.text) {
        return -1;
      } else if (a.text > b.text) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  //! handles sorting of todos array - used in renderTodos
  function sortTodos(todos, state) {
    if (state.sortByComplete) {
      todos.sort((a, b) => sortActions.byComplete(a, b));
    } else if (state.sortByNotComplete) {
      todos.sort((a, b) => sortActions.byNotComplete(a, b));
    } else if (state.sortByRecent) {
      todos.sort((a,b) => sortActions.byRecent(a, b));
    } else if(state.sortByEdited) {
      todos.sort((a, b) => sortActions.byEdited(a, b));
    } else if(state.sortByAZ) {
      todos.sort((a,b) => sortActions.byAlphabetical(a,b));
    }
  }
  //! Invokes on change event, change bool from selected dropdown option - we change filter state for each sort here
  function sortOptions(value, state) {
    // convert state into array of obj - if html opt value matched set true
    let arrayState  = [...Object.entries(state).map(opt => {
      if(opt[0].includes(value)) {
        opt[1] = true;
        console.log(opt[1]);
      } else if (opt[0] === 'todosArrayObj') {
        opt[1] = [];
      } else if (opt[0] === 'searchText') {
        opt[1] = '';
      } else {
        opt[1] = false;
      }
      return {[opt[0]]:opt[1]};
    })];

    // destructure into obj
    let objState = {...arrayState};

    // assign key values to state based on objState
    Object.assign(state, {
      sortByComplete: objState[2].sortByComplete,
      sortByNotComplete: objState[3].sortByNotComplete,
      sortByRecent: objState[4].sortByRecent,
      sortByEdited: objState[5].sortByEdited,
      sortByAZ: objState[6].sortByAZ,
    })
  }

  //* TODOS SUMMARY
  function todosSummary(todos) {
    const todosInfo = document.querySelector('#todos-left');
    todosInfo.textContent = (
      todos.length ? `You have ${todos.length} 
      todo${todos.length !== 1 ? 's' : ''} remaining, get it done!` : 'Nothing to do!');
  }

  //* REMOVE ALL TODOS
  function removeAllTodos(todos) {
    deleteSavedTodos('todos');
    document.querySelectorAll('p.todo').forEach(todo => todo.remove());
    todos.length = 0;
  }

  //* REMOVE INDIVIDUAL TODO
  function removeItem(id) {
    // find index and remove based on current id matches uniqueId in array
    const todoIndex = TODO.todosArrayObj.findIndex(todo => todo.id == id);
    if (todoIndex >= 0) {
      TODO.todosArrayObj.splice(todoIndex, 1);
      TODO.editDiv.style.display='none';
    }
  }

  //* CHECK IF TODO IS COMPLETE 
  function toggleTodo(todo) {
    if (todo.isCompleted) {
      todo.isCompleted = false;
    } else {
      todo.isCompleted = true;
    }
  }
  //* CHANGE TODO
  function changeTodo(todos) {
    todos.filter((todo, i) => {
      if (todo.id === hash) {
        todo.text = TODO.editInput.value;
        todo.updatedAt = moment().valueOf();
        saveTodos(todos);
      }
    });
  }
  
  function updateElementTime(timestamp1, timestamp2) {
    let text = ''
    if (timestamp1 == timestamp2) {
      text = `Created ${moment(timestamp2).fromNow()}`
    } else {
      text = `Edited ${moment(timestamp1).fromNow()}`
    }
    return text
  }
  //* CREATE TODO ELEMENT
 
  function createTodosDOM(todo) {
    const todoEl = document.createElement('div');
    const todoText = document.createElement('a');
    const todoDelete = document.createElement('button');
    const todoCheckbox = document.createElement('input');
    const spanTime = document.createElement('span');
    const icon = document.createElement('span');

    //! setup icon span element
    icon.setAttribute('class', 'todo-icon--edit');
    icon.innerHTML = '<i class="far fa-edit"></i>';

    //!set up spanTime
    spanTime.setAttribute('class', 'todo-time');
    spanTime.textContent = updateElementTime(todo.updatedAt, todo.createdAt);
    //! event for selecting and editing specific note by id from list
    todoText.addEventListener('click', (e) => {
        if(e.target.hash) {
          hash = e.target.hash.substring(1); 
          TODO.editDiv.style.display = 'block';
          document.querySelector('.edit-overlay').style.display='block';
          todoEl.classList.add('highlight');
        } 
    });
    //! setup todo link
    todoText.setAttribute('class','todo-text');
    todoText.setAttribute('href', `#${todo.id}`);
    todoText.textContent = todo.text ? todo.text : '<Undefined Todo>';
    todoText.appendChild(icon);

    //! setup delete btn
    todoDelete.setAttribute('class', 'delete');
    todoDelete.textContent = 'X';
    todoDelete.addEventListener('click', () => {
      // remove on click, update localstorage and rerender new todos
      removeItem(todo.id, todo.isCompleted);
      saveTodos(TODO.todosArrayObj);
      TODO.renderTodos(TODO.todosArrayObj, TODO.state);
    })

    //! setup checkbox
    todoCheckbox.setAttribute('class', 'todo-check');
    todoCheckbox.setAttribute('type', 'checkbox');
    todoCheckbox.checked = todo.isCompleted;
    todoCheckbox.addEventListener('change', () => {
      // next element from checkbox - toggle span
      toggleTodo(todo);
      saveTodos(TODO.todosArrayObj);
      TODO.renderTodos(TODO.todosArrayObj, TODO.state);
    });

    //! Append elements to div
    todoEl.setAttribute('class', 'todo');
    todoEl.appendChild(todoCheckbox);
    todoEl.appendChild(todoText);
    todoEl.appendChild(todoDelete);
    todoEl.appendChild(spanTime);

    if (!todo.isCompleted) {
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

  //* Generate uniqueID
  function generateUniqueID() {
    const str = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueID = '';
    let idLength = 20;
    for (let i = 0; i < idLength; i++) {
      uniqueID += str[Math.floor(Math.random() * str.length)];
      if (uniqueID.length % 6 == 0) { 
        uniqueID += '-';
      }
    }
    return uniqueID;
  }
  
  function addTodo(value, todos) {
    const output = document.querySelector('#output');
    const newTodo = createTodosDOM(value);
    const results = document.querySelector('#todos');
    const uniqueID = generateUniqueID();
    const time = moment().valueOf();
    // my method - const input = document.querySelector('#input');
    if (validateInput(value)) {
      // push todos array to local, key 'todos'
      todos.push({
        id: uniqueID, 
        text: value, 
        isCompleted: false, 
        createdAt: time,
        updatedAt: time
      });

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
    removeAllTodos,
    changeTodo
  }
})();
