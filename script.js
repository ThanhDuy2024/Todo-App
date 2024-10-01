import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAROpJB4zy4RND8X7thZv10MSy5nCUyLls",
  authDomain: "todolistnew-ed3ef.firebaseapp.com",
  databaseURL: "https://todolistnew-ed3ef-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todolistnew-ed3ef",
  storageBucket: "todolistnew-ed3ef.appspot.com",
  messagingSenderId: "717923614830",
  appId: "1:717923614830:web:d445e7ed8b577708aa267f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

//completeButton
const completeButton = () => {
    const buttonComplete = document.querySelectorAll("[button-complete]");
    buttonComplete.forEach(button => {        
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-complete");
            update(ref(db, 'todos/' + id), { //update thi phai / mot cai o cuoi
                complete: true
            });
        });
    });
}

//undoButton
const undoButton = () => {
    const buttonUndo = document.querySelectorAll("[button-undo]");
    buttonUndo.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-undo");
            update(ref(db, 'todos/' + id), {
                complete: false,
            })
        });
    })
}


//Dua thong tin vao database
const todoCreate = document.querySelector("#todo-create");
todoCreate.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = event.target.elements.content.value;
    set(push(ref(db, 'todos')), {
        content: content,
        complete: false
    })
    event.target.elements.content.value = ``;
})

//Lay thong tin tu database
onValue(ref(db, 'todos'), (snapshot) => {
    let newTodo = ``;
    snapshot.forEach(childSnapshot => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        newTodo += `            
            <div class="todo-app__item ${childData.complete ? "todo-app__item--complete" : ""}">
                <div class="todo-app__item-content">
                    ${childData.content}
                </div>
                <div class="todo-app__item-action">
                    <button class="todo-app__item-button todo-app__item-button--edit"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="todo-app__item-button todo-app__item-button--complete" button-complete="${childKey}"><i class="fa-solid fa-check"></i></button>
                    <button class="todo-app__item-button todo-app__item-button--undo" button-undo = "${childKey}"><i class="fa-solid fa-rotate-left"></i></button>
                    <button class="todo-app__item-button todo-app__item-button--delete"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>`;
    });
    const todoList = document.querySelector("#todo-list");
    todoList.innerHTML = newTodo;

    completeButton();
    undoButton();
})

