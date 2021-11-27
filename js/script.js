const todoDOM = document.querySelector(".todo-list");
const noTodo = document.querySelector(".no-todo");
const addTodo = document.querySelector(".add-todo");
const editInputDOM = document.querySelector(".edit-input");
const editTodoDOM = document.querySelector(".edit-todo");
const addTodoBtn = document.querySelector(".add-todo-btn");
const errorDOM = document.querySelector(".error");
const networkError = document.querySelector(".network-error");
const inputErrorDOM = document.querySelector(".input-error");
const editTodoBtn = document.querySelector(".edit-btn");
const todoLoader = document.querySelector(".todos-loader");
const otherLoader = document.querySelector(".other-loader");

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

window.addEventListener("load", () => {
  todoLoader.style.display = "block";
  fetchAllTodo();
});

const toggleIsCompleted = (item, id) => {
  otherLoader.style.display = "block";
  let data;
  if (item === "true") {
    data = { isCompleted: false, id };
  } else if (item === "false") {
    data = { isCompleted: true, id };
  }

  fetch(
    "https://young-gorge-82777.herokuapp.com/api/v1/todos/update/iscompleted/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((res) => {
      otherLoader.style.display = "none";
      addTodo.value = "";
      fetchAllTodo();
    })
    .catch((err) => {
      otherLoader.style.display = "none";
      if (err.message === "Failed to fetch") {
        networkError.style.display = "block";
        setTimeout(() => {
          networkError.style.display = "none";
        }, 3000);
      }
      console.log(err);
    });
};

editTodoBtn.addEventListener("click", () => {
  if (editInputDOM.value !== undefined && editInputDOM.value !== "") {
    otherLoader.style.display = "block";
    const data = { todo: editInputDOM.value, id: editNoticeId };
    fetch("https://young-gorge-82777.herokuapp.com/api/v1/todos/update/todo/", {
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
        otherLoader.style.display = "none";
        editTodoDOM.style.display = "none";
        fetchAllTodo();
      })
      .catch((err) => {
        console.log(err);
        otherLoader.style.display = "none";
        if (err.message === "Failed to fetch") {
          networkError.style.display = "block";
          setTimeout(() => {
            networkError.style.display = "none";
          }, 3000);
        }
      });
  } else {
    editTodoDOM.style.display = "none";
  }
});

const fetchAllTodo = () => {
  fetch("https://young-gorge-82777.herokuapp.com/api/v1/todos")
    .then((response) => response.json())
    .then((res) => {
      const data = res;
      fetchData = res;
      if (data.length > 0) {
        noTodo.style.display = "none";
        todoDOM.style.display = "block";
        todoDOM.innerHTML = "";
        todoLoader.style.display = "none";

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
                  <p class="todo" style="text-decoration-line:${
                    item.isCompleted ? " line-through" : ""
                  };">${item.todo}</p>
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
        todoLoader.style.display = "none";
        todoDOM.style.display = "none";
        noTodo.style.display = "block";
      }
    })
    .catch((err) => {
      if (err.message === "Failed to fetch") {
        errorDOM.style.display = "block";
        todoLoader.style.display = "none";
      } else {
        errorDOM.style.display = "none";
        todoLoader.style.display = "none";
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
    otherLoader.style.display = "block";
    const data = { todo: addTodo.value };
    fetch("https://young-gorge-82777.herokuapp.com/api/v1/todos/", {
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
        otherLoader.style.display = "none";
        addTodo.value = "";
        fetchAllTodo();
      })
      .catch((err) => {
        otherLoader.style.display = "none";

        if (err.message === "Failed to fetch") {
          networkError.style.display = "block";
          setTimeout(() => {
            networkError.style.display = "none";
          }, 3000);
        }
        console.log(err.message);
      });
  } else {
    otherLoader.style.display = "none";
    inputErrorDOM.style.display = "block";
    setTimeout(() => {
      inputErrorDOM.style.display = "none";
    }, 3000);
  }
});

const DeleteTodo = (id) => {
  otherLoader.style.display = "block";
  const endpoint = "https://young-gorge-82777.herokuapp.com/api/v1/todos/" + id;
  fetch(endpoint, { method: "DELETE" })
    .then((res) => {
      otherLoader.style.display = "none";
      fetchAllTodo();
    })
    .catch((err) => {
      otherLoader.style.display = "none";
      if (err.message === "Failed to fetch") {
        networkError.style.display = "block";
        setTimeout(() => {
          networkError.style.display = "none";
        }, 3000);
      }
      console.log(err);
    });
};
