const todos = [];
const RENDER_EVENT = 'render-todo';

const addTodo = () => {
    const textTodo = document.getElementById('title').value;
    const detailTodo = document.getElementById('detail').value;
    const timestamp = document.getElementById('date').value;

    const generateID = generateId();
    const todoObject = generateTodoObject(generateID, textTodo, detailTodo, timestamp, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

const generateId = () => {
    return +new Date();
}

const generateTodoObject = (id, task, detailTask, timestamp, isCompleted) => {
    return {
        id,
        task,
        detailTask,
        timestamp,
        isCompleted
    };
}

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

    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(todoObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
            addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }

    return container;
}

const addTaskToCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const removeTaskFromCompleted = (todoId) => {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const undoTaskFromCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const findTodo = (todoId) => {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem
        }
    }
    return null;
}

const findTodoIndex = (todoId) => {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }

    return -1;
}

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
});

document.addEventListener(RENDER_EVENT, function () {
    console.log(todos);
})