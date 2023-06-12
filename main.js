const INPUT_TASK = document.getElementById("input_task");
const LIST = document.getElementById("list");
const DETAILS = document.getElementById("details");
const DATE = document.getElementById("date");
const TITLE_PAGE = document.querySelector(".header span");

var tasks = [];
var config = { tasks }

if(localStorage.getItem("config") == null){
  localStorage.setItem("config", JSON.stringify(config));  
}
else{
  config = JSON.parse(localStorage.getItem("config"));
  let task_storage = config.tasks;

  task_storage.forEach(e => {
    add_task(e.title, e.check)
  });

  toggleList();
}


var date = new Date(Date.now());
var details_textareas = DETAILS.querySelectorAll("textarea");

details_textareas.forEach((e) => {
  e.onkeyup = () => {
    rezise_textarea(e);
  };
  e.onkeypress = () => {
    rezise_textarea(e);
  };
  e.onblur = () => {
    toggle_spellcheck(e);
  };
  e.onfocus = () => {
    toggle_spellcheck(e);
  };
  e.onchange = () => {
    getAndSaveDetails();
  };
});

var current_task = 0;
var order = false;

DATE.innerText = date.toLocaleDateString();
INPUT_TASK.querySelector("button").onclick = add_task_by_input;
DETAILS.querySelector("button").onclick = close_details;

// FUNCTIONS ---------------------------------------------
function save(){
  config.tasks = tasks;
  localStorage.setItem("config", JSON.stringify(config));
}

/**
 * @param {Element} element 
 */
function show_details(element){
  current_task = getTaskIndex(element);

  details_textareas[0].innerText = tasks[current_task].title;
  details_textareas[1].innerText = tasks[current_task].description;

  LIST.classList.add("d-none");
  INPUT_TASK.classList.add("d-none");
  DETAILS.classList.remove("d-none");
  TITLE_PAGE.innerText = "Detalhes"
}

function close_details() {
  details_textareas[0].innerText = "";
  details_textareas[1].innerText = "";

  LIST.classList.remove("d-none");
  INPUT_TASK.classList.remove("d-none");
  DETAILS.classList.add("d-none");
  TITLE_PAGE.innerText = "Tarefas";
}

/**
 * @param {Element} element
 */
function getAndSaveDetails() {
  tasks[current_task].title = DETAILS.querySelector('[name="title"]').value;
  tasks[current_task].description = DETAILS.querySelector(
    '[name="description"]'
  ).value;
  
  tasks[current_task].element.querySelector("span").innerText = tasks[current_task].title;

  save();
}

/**
 *
 * @param {Element} element
 */
function toggle_spellcheck(element) {
  let spell = element.getAttribute("spellcheck") ?? "false";

  element.setAttribute("spellcheck", spell == "false" ? "true" : "false");
}

/**
 * @param {String} title 
 */
function add_task(title, check) {
  let task = create_task({
    title,
    check
  });

  tasks.push(task);
  LIST.appendChild(task.element);
}

function add_task_by_input(){
  let title = INPUT_TASK.querySelector("input").value;

  if (title === "") title = `Task ${tasks.length}`;

  add_task(title, false);

  save();

  toggleList();

  INPUT_TASK.querySelector("input").value = "";
}

/**
 * @param {String} param0
 * @returns {Object}
 */
function create_task({ title, check }) {
  let element = document.createElement("div");
  let description = "Adicione uma descrição mais detalhada..."

  element.setAttribute("class", "task" + check ? " check" : "");

  element.innerHTML = `
    <span>${title}</span>
    <div class="buttons menu ${order ? "d-none" : ""}">
      <button><i class="fa-solid fa-info"></i></button>
      <button><i class="fa-solid fa-arrows-up-down"></i></button>
      <button><i class="fa-regular fa-trash-can"></i></button>
    </div>
    <div class="buttons nav ${!order ? "d-none" : ""}">
      <button><i class="fa-solid fa-arrow-up"></i></button>
      <button><i class="fa-solid fa-arrow-down"></i></button>
      <button><i class="fa-solid fa-xmark"></i></button>
    </div>
  `;

  buttons = {
    menu: element.querySelectorAll(".buttons.menu button"),
    nav: element.querySelectorAll(".buttons.nav button"),
  };

  buttons.menu[0].onclick = () => {
    show_details(element)
  };
  buttons.menu[1].onclick = () => {
    toggleOrder();
  };
  buttons.menu[2].onclick = () => {
    deleteTask(element);
  };

  buttons.nav[0].onclick = () => {
    moveTask(element, -1);
  };
  buttons.nav[1].onclick = () => {
    moveTask(element, 1);
  };
  buttons.nav[2].onclick = () => {
    toggleOrder();
  };
  element.querySelector("span").onclick = () => {
    let index = getTaskIndex(element);

    if(tasks[index].check){
      element.classList.remove("check")
      tasks[index].check = false;
    }
    else{
      element.classList.add("check")
      tasks[index].check = true;
    }

    save();
  }

  return { title, element, description, check };
}

function toggleOrder() {
  tasks.forEach((e) => {
    if(order){
      e.element.querySelector(".buttons.nav").classList.add("d-none")
      e.element.querySelector(".buttons.menu").classList.remove("d-none");
    }else{
      e.element.querySelector(".buttons.nav").classList.remove("d-none")
      e.element.querySelector(".buttons.menu").classList.add("d-none");
    }

  });

  order = !order;
}

/**
 * @param {Element} element
 */
function deleteTask(element) {
  let index = getTaskIndex(element);
  element.parentNode.removeChild(element);
  tasks.splice(index, 1);
  toggleList();
  save()
}

/**
 * @param {Element} element
 * @param {Number} direction -1 = UP | 1 = DOWN
 * @returns {[Boolean, Void]}
 */
function moveTask(element, direction) {
  if(tasks.length <= 1) return false;

  let from = getTaskIndex(element);
  let to = 0;
  let position = "";
  let scroll = 0;

  if (direction == -1) {
    to = from - 1;
    position = "beforebegin";

    scroll = -(element.clientHeight + 20);

    if (from == 0) return false;
  } else {
    to = from + 1;
    position = "afterend";

    scroll = element.clientHeight + 20;

    if (from == tasks.length) return false;
  }

  let neighboor = tasks[to].element;

  window.scroll(0, window.pageYOffset + scroll);
  neighboor.insertAdjacentElement(position, element);
  moveArrayElement(tasks, from, to);
  save();
}

/**
 * @param {Element} element
 * @returns {Number}
 */
function getTaskIndex(element) {
  let arrList = Array.from(LIST.children);
  return arrList.indexOf(element);
}

/**
 * @param {Array} arr
 * @param {Number} from
 * @param {Number} to
 */
function moveArrayElement(arr, from, to) {
  let el = arr[from];
  arr.splice(from, 1);
  arr.splice(to, 0, el);
}

function toggleList() {
  if (LIST.childElementCount <= 0) {
    LIST.setAttribute("style", "display:none;");
  } else {
    LIST.setAttribute("style", "");
  }
}

/**
 * @param {Element} element
 */
function rezise_textarea(element) {
  let height = 35;

  element.setAttribute("style", `height: ${height}px`);

  while (element.clientHeight !== element.scrollHeight) {
    height += 1;
    element.setAttribute("style", `height: ${height}px`);
  }
}
