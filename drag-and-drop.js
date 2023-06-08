// class DragAndDrop{

// }
// ----------------------------------------------------------
// DROP
// ----------------------------------------------------------

const drop = (x, y) => {
  dragAndDrop.elements.forEach((e) => {
    if (!e.classList.contains(dragAndDrop.draggingFlag)) {
      let box = e.getBoundingClientRect();
      let centerY = box.y + box.height / 2;
      let finalY = box.y + box.height;

      if (x >= box.x && x <= box.x + box.width) {
        if (y <= centerY && y >= box.y) {
          relocateElement(e, "beforebegin");
          dragAndDrop.drop(dragAndDrop.element, e, -1);
        }
        if (y >= centerY && y <= finalY) {
          relocateElement(e, "afterend");
          dragAndDrop.drop(dragAndDrop.element, e, 1);
        }
      }
    }
  });
};

const relocateElement = (el, direction) => {
  if (dragAndDrop.clone != null && dragAndDrop.element != null) {
    el.insertAdjacentElement(direction, dragAndDrop.element);
    el.insertAdjacentElement(direction, dragAndDrop.clone);
    dragAndDrop.parentScroll = findParentScroll();
  }
};

// ----------------------------------------------------------
// MOVEMENT
// ----------------------------------------------------------

const moveElement = (x, y) => {
  let centerH = dragAndDrop.element.clientHeight / 2;
  let centerW = dragAndDrop.element.clientWidth / 2;
  let style = `position:fixed;top:${y - centerH}px;left:${x - centerW}px`;

  dragAndDrop.element.setAttribute("style", style);
};

// ----------------------------------------------------------
// SCROLL
// ----------------------------------------------------------

const moveScroll = (y) => {
  let box = dragAndDrop.parentScroll.getBoundingClientRect();
  let navAreaSize = box.height * 0.3;
  let lineTop = box.y + navAreaSize;
  let lineBottom = box.y + box.height - navAreaSize;

  dragAndDrop.scrollOn = true;

  if (y >= box.y && y <= lineTop) {
    moveScrollY(-1);
  } else if (y >= lineBottom && y <= box.y + box.height) {
    moveScrollY(1);
  } else {
    dragAndDrop.scrollOn = false;
  }
};

const moveScrollY = (dir) => {
  if (dragAndDrop.scrollOn) {
    let parent = {
      sSize: dragAndDrop.parentScroll.scrollHeight,
      end:
        dragAndDrop.parentScroll.scrollTop +
        dragAndDrop.parentScroll.clientHeight,
      begin: dragAndDrop.parentScroll.scrollTop,
    };

    if (dir == -1 && parent.begin > 0) {
      dragAndDrop.parentScroll.scroll(
        dragAndDrop.parentScroll.scrollLeft,
        parent.begin - 2
      );
    } else if (dir == 1 && parent.end < parent.sSize) {
      dragAndDrop.parentScroll.scroll(
        dragAndDrop.parentScroll.scrollLeft,
        parent.begin + 2
      );
    } else {
      dragAndDrop.scrollOn = false;
      return false;
    }

    setTimeout(moveScrollY, 300, dir);
  } else {
    dragAndDrop.scrollOn = false;
  }
};

const findParentScroll = () => {
  let parent = dragAndDrop.element.parentNode;

  while (
    parent.clientHeight == parent.scrollHeight &&
    parent !== document.body
  ) {
    parent = parent.parentNode;
  }

  return parent;
};

// ----------------------------------------------------------
// CLONE
// ----------------------------------------------------------

const createClone = () => {
  removeClone();
  dragAndDrop.clone = document.createElement("div");
  dragAndDrop.clone.classList.add(dragAndDrop.cloneFlag);

  dragAndDrop.element.parentNode.insertBefore(
    dragAndDrop.clone,
    dragAndDrop.element.nextSibling
  );
};

const removeClone = () => {
  if (dragAndDrop.clone != null)
    dragAndDrop.element.parentNode.removeChild(dragAndDrop.clone);
  dragAndDrop.clone = null;
};

// ----------------------------------------------------------
// MAIN FUNCTIONS
// ----------------------------------------------------------

const mouseMove = (e) => {
  moveElement(e.clientX, e.clientY);
  drop(e.clientX, e.clientY);
  moveScroll(e.clientY);
  dragAndDrop.onDrag(dragAndDrop.element);
};

const touchMove = (e) => {
  let touch = e.touches[0];

  moveElement(touch.clientX, touch.clientY);
  drop(touch.clientX, touch.clientY);
  moveScroll(touch.clientY);
  dragAndDrop.onDrag(dragAndDrop.element);
};

const dragStart = (el, ev, touch) => {
  dragAndDrop.element = el;
  dragAndDrop.element.classList.add(dragAndDrop.draggingFlag);
  dragAndDrop.parentScroll = findParentScroll();

  if (touch) {
    document.addEventListener("touchmove", touchMove);
    moveElement(ev.touches[0].clientX, ev.touches[0].clientY);
  } else {
    document.addEventListener("mousemove", mouseMove);
    moveElement(ev.clientX, ev.clientY);
  }

  createClone(dragAndDrop.element);
  dragAndDrop.beginDrag(el);
};

const dragOver = (el) => {
  dragAndDrop.element = el;
  document.removeEventListener("mousemove", mouseMove);
  document.removeEventListener("touchmove", touchMove);
  dragAndDrop.element.removeAttribute("style");

  removeClone();

  dragAndDrop.element.classList.remove(dragAndDrop.draggingFlag);
};

// ----------------------------------------------------------
// LOAD
// ----------------------------------------------------------

const loadElements = (selector) => {
  dragAndDrop.elements = [];
  let elements = document.querySelectorAll("." + selector);
  elements.forEach((e) => {
    addElement(e);
  });
};

const addElement = (element, first = false) => {
  if (first) {
    dragAndDrop.elements.unshift(element);
  } else {
    dragAndDrop.elements.push(element);
  }

  element.onmousedown = (ev) => {
    dragStart(element, ev, false);
  };

  element.onmouseup = () => {
    dragOver(element);
  };

  element.ontouchstart = (ev) => {
    dragStart(element, ev, true);
  };

  element.ontouchend = () => {
    dragOver(element);
  };
};

const dragAndDrop = {
  elements: [],
  element: null,
  clone: null,
  parentScroll: null,
  scrollOn: false,
  draggingFlag: "dragging",
  cloneFlag: "temp-clone",
  beginDrag: () => {},
  onDrag: () => {},
  drop: () => {},
};

const load = ({
  selector,
  draggingFlag = "dragging",
  cloneFlag = "temp-clone",
  beginDrag = () => {},
  onDrag = () => {},
  drop = () => {}
}) => {
  dragAndDrop.draggingFlag = draggingFlag;
  dragAndDrop.cloneFlag = cloneFlag;
  dragAndDrop.beginDrag = beginDrag;
  dragAndDrop.onDrag = onDrag;
  dragAndDrop.drop = drop;

  loadElements(selector);
  
  window.onmouseup = () => {
    if (dragAndDrop.element != null) dragOver(dragAndDrop.element);
  };

  window.ontouchend = () => {
    if (dragAndDrop.element != null) dragOver(dragAndDrop.element);
  };
  
  window.onblur = () => {
    if (dragAndDrop.element != null) dragOver(dragAndDrop.element);
  };
};
