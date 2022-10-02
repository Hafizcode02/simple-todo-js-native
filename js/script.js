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