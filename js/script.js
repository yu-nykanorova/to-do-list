"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const body = document.querySelector("body");
    const container = document.querySelector("#container");
    const input = document.querySelector("#todo-input");
    const form = document.querySelector("#todo-form");
    const list = document.querySelector("#todo-list");
    const iconMoon = document.getElementById("moon");
    const iconSun = document.getElementById("sun");
    const tasksAmount = document.getElementById("amount");
    const btnClearAll = document.getElementById("clear-button");
    const filterContainer = document.getElementById("filter");
    
    let currentFilter = "all";
    let tasks = [];
    let isDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
     
    applyDarkMode(isDarkMode);
    renderTasks();

    // to toggle dark mode

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
    
    // to render task list

    function renderTasks () {
        list.innerHTML = "";
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        let filteredTasks = tasks;

        if (currentFilter === "done") {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (currentFilter === "active") {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        if (filteredTasks.length === 0) {
            list.innerHTML = "<p>No tasks yet...</p>";
            tasksAmount.classList.add("hidden");
            btnClearAll.classList.add("hidden");
            return;
        } else {
            tasksAmount.classList.remove("hidden");
            btnClearAll.classList.remove("hidden");
        }

        filteredTasks.forEach((task) => {
            addTask(task);
        });

        if (filteredTasks.length === 1) {
            tasksAmount.textContent = `${filteredTasks.length} task`;
        } else {
            tasksAmount.textContent = `${filteredTasks.length} tasks`;
        }
    }

    // to create task item

    function createTask () {
        const id = Date.now();
        const date = new Date(id);
        const task = {
            id: id,
            date: date.toLocaleString("uk-UA"),
            text: input.value,
            completed: false,
        }
        tasks.push(task);
    }

    // to add task to the DOM

    function addTask (newTask) {
        const newTaskContainer = document.createElement("li");
        newTaskContainer.dataset.id = newTask.id;
        const newTaskDate = document.createElement("span");
        const newTaskText = document.createElement("span");
        newTaskText.classList.add("span-text");
        const btnDel = document.createElement("button");
        const btnUpdate = document.createElement("button");
        newTaskText.textContent = newTask.text;
        newTaskDate.textContent = newTask.date;
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

    // to update task item

    function updateTask (liElement, taskToUpdate) {
        const btnUpdate = liElement.querySelector("button:first-of-type");
        const spanText = liElement.querySelector("span:nth-of-type(2)");
        const inputUpdate = document.createElement("input");
        inputUpdate.type = "text";
        inputUpdate.classList.add("input-update");
        inputUpdate.value = taskToUpdate.text;
        btnUpdate.textContent = "Save";
        console.log(btnUpdate);
        spanText.replaceWith(inputUpdate);
        inputUpdate.focus();

        inputUpdate.addEventListener("click", (e) => e.stopPropagation());

        function save () {
            const newValue = inputUpdate.value.trim();
        
            if (newValue && newValue !== taskToUpdate.text) {
                const updatedTask = tasks.find((task) => task.id === taskToUpdate.id);
                updatedTask.text = newValue;
                updateTaskList();
            } else {
                renderTasks();
            }
        }

        inputUpdate.addEventListener("blur", save);

        inputUpdate.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                save();
            } else if (e.key === "Escape") {
                renderTasks();
            }
        })
    }

    // to update task list (using localStorage)

    function updateTaskList() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }

    // to filter task list

    filterContainer.addEventListener("click", (e) => {
        const filterInput = e.target.closest("input");

        if (!filterInput) {
            return;
        }

        currentFilter = filterInput.value;
        renderTasks();
    });

    // submit event to create task

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        createTask();
        updateTaskList();
        form.reset();
    });

    // task list click events: 
    // - to mark task is done,
    // - to delete task,
    // - to update task,

    list.addEventListener("click", (e) => {
        const liElement = e.target.closest("li");
        const btnDel = e.target.classList.contains("delete-button");
        const btnUpdate = e.target.classList.contains("update-button");
        const text = e.target.classList.contains("span-text");
        
        if (!liElement) {
            return;
        }

        const taskId = Number(liElement.dataset.id);

        if (text) {
            const task = tasks.find((task) => task.id === taskId);
            task.completed = !task.completed;
            updateTaskList();
        }

        if (btnDel) {
            tasks = tasks.filter((task) => {
                return task.id !== taskId;
            });
            updateTaskList();
        }

        if (btnUpdate) {
            const taskToUpdate = tasks.find((task) => task.id === taskId);
            updateTask(liElement, taskToUpdate);
        }
    });

    // container click event:
    // - to toggle dark mode,
    // - to clear task list

    container.addEventListener("click", (e) => {
        const btnClear = e.target.closest("#clear-button");

        if (btnClear) {
            const answer = confirm("Delete all tasks?");
            if (!answer) {
                return;
            }

            tasks = [];
            localStorage.removeItem("tasks");
            renderTasks();
        }
        
        if (e.target.closest("#moon") || e.target.closest("#sun")) {
            isDarkMode = !isDarkMode;
            localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
            applyDarkMode(isDarkMode);
        }
    });
});


