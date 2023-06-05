const inputTask = document.getElementById("input_task");
const list = document.getElementById("list");
const today = document.getElementById("date");

const tasks = [
  {
    title: "teste de task",
  },
  {
    title: "teste de task 2",
  },
];

var tasks_count = 0;

const updateBoard = () => {
  let htmlList = tasks.map((e, i) => createTask(e, i));

  console.log(htmlList);

  list.innerText = "";
  list.append(...htmlList);
};

function addTask() {
  let title = inputTask.querySelector("input").value;

  if (title === "") return false;

  tasks.push({ title });

  updateBoard(tasks);
  toggleList();
  inputTask.querySelector("input").value = "";
}

const createTask = (task, index) => {
  let div = document.createElement("div");

  tasks_count++;

  div.setAttribute("class", "task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <span>${task.title}</span>
    <div class="buttons">
      <button><i class="fa-solid fa-check"></i></button>
      <button><i class="fa-solid fa-xmark"></i></button>
    </div>
  `;

  buttons = div.querySelectorAll(".buttons button");

  buttons[0].onclick = () => {
    div.classList.toggle("check");
  };
  buttons[1].onclick = () => {
    div.parentNode.removeChild(div);
    tasks.splice(index, 1);
    toggleList();
  };

  return div;
};

const toggleList = () => {
  if (list.childElementCount <= 0) {
    list.setAttribute("style", "display:none;");
  } else {
    list.setAttribute("style", "");
  }
};

const moveArrayElement = (arr, from, to) => {
  let el = arr[from];
  arr.splice(from, 1);
  arr.splice(to, 0, el);
};

list.addEventListener("dragover", (e) => {
 console.log(e.clientY);
})

today.innerText = new Date(Date.now()).toLocaleDateString();
inputTask.querySelector("button").onclick = addTask;
