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

    return container;
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompleteTODOList = document.getElementById('todos');
    uncompleteTODOList.innerHTML = "";

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        uncompleteTODOList.append(todoElement);
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