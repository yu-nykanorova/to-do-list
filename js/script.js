"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const body = document.querySelector("body");
    const container = document.querySelector("#container");
    const input = document.querySelector("#todo-input");
    const form = document.querySelector("#todo-form");
    const list = document.querySelector("#todo-list");
    const iconMoon = document.getElementById("moon");
    const iconSun = document.getElementById("sun");

    let tasks = [];
    let isDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
     
    applyDarkMode(isDarkMode);
    renderTasks();

    function applyDarkMode (darkMode) {
        if (darkMode) {
            body.classList.add("dark");
            iconMoon.style.display = "none";
            iconSun.style.display = "block";
        } else {
            body.classList.remove("dark");
            iconSun.style.display = "none";
            iconMoon.style.display = "block";
        }
    }    
    
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

    function createTask () {
        const id = Date.now();
        const date = new Date(id);
        const task = {
            id: date.toLocaleString("uk-UA"),
            text: input.value,
            completed: false,
        }
        tasks.push(task);
    }

    function addTask (newTask) {
        const newTaskContainer = document.createElement("li");
        newTaskContainer.dataset.id = newTask.id;
        const newTaskDate = document.createElement("span");
        const newTaskText = document.createElement("span");
        newTaskText.classList.add("span-text");
        const btnDel = document.createElement("button");
        const btnUpdate = document.createElement("button");
        newTaskText.textContent = newTask.text;
        newTaskDate.textContent = newTask.id;
        btnDel.textContent = "Delete";
        btnUpdate.textContent = "Update";
        btnDel.classList.add("delete-button");
        btnUpdate.classList.add("update-button");
        newTaskContainer.append(newTaskDate, newTaskText, btnUpdate, btnDel);
        list.append(newTaskContainer);

        if (newTask.completed) {
            newTaskText.classList.add("done");
        }
    }

    function updateTaskList() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        createTask();
        updateTaskList();
        form.reset();
    });

    list.addEventListener("click", (e) => {
        const liElement = e.target.closest("li");
        const btnDel = e.target.classList.contains("delete-button");
        const btnUpdate = e.target.classList.contains("update-button");
        const text = e.target.classList.contains("span-text");
        
        if (!liElement) {
            return;
        }

        const taskId = liElement.dataset.id;

        if (text) {
            const task = tasks.find((task) => task.id === taskId);
            task.completed = !task.completed;
            updateTaskList();
        }

        if (btnDel) {
            tasks = tasks.filter((task) => {
                return task.id !== String(taskId);
            });
            updateTaskList();
        }

        if (btnUpdate) {
            console.log("ok");
        }
    });

    container.addEventListener("click", (e) => {
        
        if (e.target.closest("#moon") || e.target.closest("#sun")) {
            isDarkMode = !isDarkMode;
            localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
            applyDarkMode(isDarkMode);
        }
    });
});


