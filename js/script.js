"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector("#todo-input");
    const form = document.querySelector("#todo-form");
    const list = document.querySelector("#todo-list");
    
    let tasks = [];

    renderTasks();
    
    function renderTasks () {
        list.innerHTML = "";

        tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        if (tasks.length === 0) {
            list.innerHTML = "<p>No tasks yet...</p>";
            return;
        }

        tasks.forEach((task) => {
            addTask(task);
        });
    }

    function addTask (newTask) {
        const newTaskContainer = document.createElement("li");
        newTaskContainer.dataset.id = newTask.id;
        const newTaskDate = document.createElement("span");
        const newTaskText = document.createElement("span");
        newTaskText.classList.add("span-text");
        const btnDel = document.createElement("button");
        newTaskText.textContent = newTask.text;
        newTaskDate.textContent = newTask.id;
        btnDel.textContent = "Delete";
        btnDel.classList.add("delete-button");
        newTaskContainer.append(newTaskDate, newTaskText, btnDel);
        list.append(newTaskContainer);

        if (newTask.completed) {
            newTaskText.classList.add("done");
        }
    }

    function updateTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = Date.now();
        const date = new Date(id);
        const task = {
            id: date.toLocaleString("uk-UA"),
            text: input.value,
            completed: false,
        }
        tasks.push(task);
        form.reset();
        updateTasks();
    });

    list.addEventListener("click", (e) => {
        const liElement = e.target.closest("li");
        const btn = e.target.closest("button");
        const text = e.target.classList.contains("span-text");
        
        if (!liElement) {
            return;
        }

        const taskId = liElement.dataset.id;

        if (text) {
            const task = tasks.find((task) => task.id === taskId);
            task.completed = !task.completed;
            updateTasks();
        }

        if (btn) {
            tasks = tasks.filter((task) => {
                return task.id !== String(taskId);
            });
            updateTasks();
        }
    });
});


