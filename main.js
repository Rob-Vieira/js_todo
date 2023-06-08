const inputTask = document.getElementById("input_task");
const list = document.getElementById("list");
const today = document.getElementById("date");

const tasks = [
  {
    title: "Task 01",
  },
  {
    title: "Task 02",
  },
];

var tasks_count = 0;
var firstLoad = true;

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

  if(tasks.length > 1){
    
    if(firstLoad){
      load({
        selector: "task",
        cloneFlag: "task-clone",
        drop: (element, under, dir) => {
          let canMove = true;
          let list = Array.from(element.parentNode.children);
          
          let clone = list.indexOf(document.querySelector(".task-clone"));
          list.splice(clone, 1);
          
          let from = list.indexOf(element);
          let to = list.indexOf(under);

          if(dir == -1 && from + 1 == to) canMove = false;
          if(dir == 1){
            if(to < list.length) to++;
            from--;
          }

          

          console.log(from, to, dir, canMove)

          if(canMove) moveArrayElement(tasks, from, to);
        }
      })
    }else{
      loadElements("task");
    }

  }

  inputTask.querySelector("input").value = "";
}

const createTask = (task, index) => {
  let div = document.createElement("div");

  tasks_count++;

  div.setAttribute("class", "task");

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
    list.parentNode.setAttribute("style", "display:none;");
  } else {
    list.parentNode.setAttribute("style", "");
  }
};

const moveArrayElement = (arr, from, to) => {
  let el = arr[from];
  arr.splice(from, 1);
  arr.splice(to, 0, el);
};

today.innerText = new Date(Date.now()).toLocaleDateString();
inputTask.querySelector("button").onclick = addTask;
