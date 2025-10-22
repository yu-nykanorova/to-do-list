"use strict";

document.addEventListener("DOMContentLoaded", function () {
    //const btnAdd = document.querySelector("#todo-add-button");
    const input = document.querySelector("#todo-input");
    const form = document.querySelector("#todo-form");
    const list = document.querySelector("#todo-list");

    const notes = [];

    function addNote (text, date) {
        const newNote = document.createElement("li");
        const newNoteDate = document.createElement("span");
        const newNoteText = document.createElement("span");
        const btnDel = document.createElement("button");
        newNoteText.textContent = text;
        newNoteDate.textContent = date;
        btnDel.textContent = "Delete";
        btnDel.classList.add("delete-button");
        newNote.append(newNoteDate, newNoteText, btnDel);
        list.append(newNote);

        console.log(notes);

        btnDel.addEventListener("click", () => {
            newNote.remove();
        });

        newNoteText.addEventListener("click", () => {
            newNoteText.classList.toggle("done");
        })
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = Date.now();
        const date = new Date(id);
        const note = {
            id: date.toLocaleDateString("uk-UA"),
            text: input.value,
            completed: false,
        }
        notes.push(note);
        addNote(note.text, note.id);
        form.reset();
    })
});


