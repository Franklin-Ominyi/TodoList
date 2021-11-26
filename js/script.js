const todoDOM = document.querySelector(".todo-list");
const noTodo = document.querySelector(".no-todo");
const addTodo = document.querySelector(".add-todo");
const editInputDOM = document.querySelector(".edit-input");
const editTodoDOM = document.querySelector(".edit-todo");
const addTodoBtn = document.querySelector(".add-todo-btn");
const errorDOM = document.querySelector(".error");
const inputErrorDOM = document.querySelector(".input-error");
const editTodoBtn = document.querySelector(".edit-btn");

let fetchData;
let editNoticeId;

const timeFormat = (hour, minutes) => {
  const amPm = hour >= 12 ? "Pm" : "Am";
  const addZero = (e) => {
    return (parseInt(e) < 10 ? "0" : "") + e;
  };
  const hourDOM = hour % 12 || 12;

  return `${addZero(hourDOM)}:${addZero(minutes)} ${amPm} `;
};

const toggleIsCompleted = (item, id) => {
  let data;
  if (item === "true") {
    data = { isCompleted: false, id };
  } else if (item === "false") {
    data = { isCompleted: true, id };
  }

  fetch("http://localhost:3000/api/v1/todos/update/iscompleted/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((res) => {
      addTodo.value = "";
      fetchAllTodo();
    })
    .catch((err) => {
      console.log(err);
    });
};

editTodoBtn.addEventListener("click", () => {
  if (editInputDOM.value !== undefined && editInputDOM.value !== "") {
    const data = { todo: editInputDOM.value, id: editNoticeId };
    fetch("http://localhost:3000/api/v1/todos/update/todo/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((res) => {
        editTodoDOM.style.display = "none";
        fetchAllTodo();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    editTodoDOM.style.display = "none";
  }
});

const fetchAllTodo = () => {
  fetch("http://localhost:3000/api/v1/todos")
    .then((response) => response.json())
    .then((res) => {
      const data = res;
      fetchData = res;
      if (data.length > 0) {
        noTodo.style.display = "none";
        todoDOM.style.display = "block";
        todoDOM.innerHTML = "";

        data.forEach((item, index) => {
          todoDOM.innerHTML += `
            <div class="todo-container ${
              item.isCompleted ? "todo-completed" : ""
            }">
              <div class="flex">
                <input type="checkbox" class="checkbox test" ${
                  item.isCompleted ? "checked" : ""
                } onclick="toggleIsCompleted('${item.isCompleted}','${
            item._id
          }')"/>
                <div class="todo-items">
                  <p class="todo">${item.todo}</p>
                  <span class="date">${timeFormat(
                    new Date(item.updatedAt).getHours(),
                    new Date(item.updatedAt).getMinutes()
                  )}${new Date(item.updatedAt).getDate()}/${
            new Date(item.updatedAt).getMonth() + 1
          }/${new String(new Date(item.updatedAt).getFullYear())}</span>
                </div>
              </div>
              <span class="flex"><i style="padding: 0; margin-right: 5px; margin-top: 2px;" class="fa fa-pencil-square-o" aria-hidden="true" onclick="updateTodo('${
                item._id
              }')"></i><i onclick="DeleteTodo('${
            item._id
          }')" class="fa fa-trash" aria-hidden="true"></i></span>
            </div>
          `;
        });
      } else {
        todoDOM.style.display = "none";
        noTodo.style.display = "block";
      }
    })
    .catch((err) => {
      if (err.message === "Failed to fetch") {
        errorDOM.style.display = "block";
      } else {
        errorDOM.style.display = "none";
      }
      console.log(err);
    });
};

const updateTodo = (id) => {
  editTodoDOM.style.display = "flex";
  editNoticeId = id;
  const editInput = fetchData.filter((check) => check._id === id)[0];
  editInputDOM.value = editInput.todo;
};

addTodoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (addTodo.value !== "" && addTodoBtn.value !== undefined) {
    const data = { todo: addTodo.value };
    fetch("http://localhost:3000/api/v1/todos/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((res) => {
        addTodo.value = "";
        fetchAllTodo();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    inputErrorDOM.style.display = "block";
    setTimeout(() => {
      inputErrorDOM.style.display = "none";
    }, 3000);
  }
});

const DeleteTodo = (id) => {
  const endpoint = "http://localhost:3000/api/v1/todos/" + id;
  fetch(endpoint, { method: "DELETE" })
    .then((res) => {
      fetchAllTodo();
    })
    .catch((err) => console.log(err));
};

window.addEventListener("load", () => {
  fetchAllTodo();
});
