const INPUT_TASK = document.getElementById("input_task");
const LIST = document.getElementById("list");
const DATE = document.getElementById("date");

var tasks_count = 0;

function add_task() {
  let title = INPUT_TASK.querySelector("input").value;
  LIST.appendChild(create_task(title));
}

function create_task(title) {
  let div = document.createElement("div");

  tasks_count++;

  div.setAttribute("class", "task");
  div.setAttribute("data-id", `task-${tasks_count}`);

  div.innerHTML = `
    <span>${title}</span>
    <div class="buttons">
      <button>V</button>
      <button>X</button>
    </div>
  `;

  buttons = div.querySelectorAll(".buttons button");

  buttons[0].onclick = () => {
    div.classList.toggle("check");
  };
  buttons[1].onclick = () => {
    div.parentNode.removeChild(div);
  };

  return div;
}

var date = new Date(Date.now())

DATE.innerText = date.toLocaleDateString()
INPUT_TASK.querySelector("button").onclick = add_task;