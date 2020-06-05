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
    },
    byRecent(a,b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    },
    byEdited(a,b) {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  }
  //! handles sorting of todos array
  function sortTodos(todos, state) {
    console.log(todos, state);
    if (state.sortByComplete) {
      todos.sort((a, b) => sortActions.byComplete(a, b));
    } else if (state.sortByNotComplete) {
      todos.sort((a, b) => sortActions.byNotComplete(a, b));
    } else if (state.sortByRecent) {
      todos.sort((a,b) => sortActions.byRecent(a, b));
    } else if( state.sortByEdited) {
      todos.sort((a, b) => sortActions.byEdited(a, b));
    }
  }
  //! Sort by selected option - we add additional sorting option cases here
  function sortOptions(value, state) {
    switch (value) {
      case 'byComplete':
        state.sortByComplete = true;
        state.sortByNotComplete = false;
        state.sortByRecent = false;
        break;
      case 'byNotComplete':
        state.sortByNotComplete = true;
        state.sortByComplete = false;
        state.sortByRecent = false;
        break;
      case 'byRecent':
        state.sortByRecent = true;
        state.sortByNotComplete = false;
        state.sortByComplete = false;
        break;
      case 'byEdited':
        state.sortByEdited = true;
        state.sortByRecent = false;
        state.sortByNotComplete = false;
        state.sortByComplete = false;
        break;
      default:
        return Object.entries(state).map(a=> a.includes('sortBy') ? a[1] = false : '');
        state.sortByNotComplete = false;
        state.sortByComplete = false;
        state.sortByRecent = false;
        state.sortByEdited = false;
    }
  }

  //* TODOS SUMMARY
  function todosSummary(todos) {
    const todosInfo = document.querySelector('#todos-left');
    todosInfo.textContent = `You have ${todos.length} todos to complete! (In red)`;
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
    //!set up spanTime
    spanTime.textContent = updateElementTime(todo.updatedAt, todo.createdAt);

    //! event for selecting and editing specific note by id from list
    todoText.addEventListener('click', (e) => {
        hash = e.target.hash.substring(1);
        TODO.editDiv.style.display = 'block';
        todoEl.classList.add('highlight');
    });
    
    //! setup todo link
    todoText.setAttribute('class','todo-text');
    todoText.setAttribute('href', `#${todo.id}`);
    todoText.textContent = todo.text ? todo.text : '<Undefined Todo>';

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
