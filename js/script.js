const todos = [];
const RENDER_EVENT = 'render-todo';

const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

// menambahkan todo
const addTodo = () => {
    const textTodo = document.getElementById('title').value;
    const detailTodo = document.getElementById('detail').value;
    const timestamp = document.getElementById('date').value;

    // generate id
    const generateID = generateId();
    // make todo list as object
    const todoObject = generateTodoObject(generateID, textTodo, detailTodo, timestamp, false);
    // push to array todos
    todos.push(todoObject);

    // adding event render
    document.dispatchEvent(new Event(RENDER_EVENT));
    // save data
    saveData();
}

// generate id
const generateId = () => {
    return +new Date();
}

// make data as object 
const generateTodoObject = (id, task, detailTask, timestamp, isCompleted) => {
    return {
        id,
        task,
        detailTask,
        timestamp,
        isCompleted
    };
}

// function to make todo
const makeTodo = (todoObject) => {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;

    const textDetailTitle = document.createElement('h6');
    textDetailTitle.innerHTML = `${todoObject.detailTask} <br>`;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textDetailTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    // if todo is checked
    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        // adding event to undo todo if undobutton clicked
        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        // adding event to destroy todo if trashbutton clicked
        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(todoObject.id);
        });

        // including element to a container
        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        // adding finish button todo
        checkButton.addEventListener('click', function () {
            addTaskToCompleted(todoObject.id);
        });

        // including elemnent to container
        container.append(checkButton);
    }

    return container;
}

// add todo task completed
const addTaskToCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// add remove todo task 
const removeTaskFromCompleted = (todoId) => {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// add undo task completed
const undoTaskFromCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// find todo
const findTodo = (todoId) => {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem
        }
    }
    return null;
}

// find todo index
const findTodoIndex = (todoId) => {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }

    return -1;
}

// save data
const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}


// check is storage exist
const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

// load data from web storage
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const todo of data) {
            todos.push(todo);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


// adding listener event for render_event
document.addEventListener(RENDER_EVENT, function () {
    const uncompleteTODOList = document.getElementById('todos');
    uncompleteTODOList.innerHTML = "";

    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = "";

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted) {
            uncompleteTODOList.append(todoElement);
        } else {
            completedTODOList.append(todoElement);
        }
    }
});

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

document.addEventListener(RENDER_EVENT, function () {
    console.log(todos);
})

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
}) 