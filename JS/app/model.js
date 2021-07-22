var getElements = {
  black: document.getElementsByClassName("black"),
  white: document.getElementsByClassName("white"),
  box: document.getElementsByClassName("box"),
};

var located = {
  color: "",
  fromRow: "",
  fromCoulm: "",
  toRow: "",
  toCoulm: "",
  ascii: "",
  plus1: "",
  plus2: "",
  minus1: "",
  minus2: "",
  piece: null,
};
var upLeft = [];
var upRight = [];
var downRight = [];
var downLeft = [];
var move = null;
var divs = [];
var landing = [];
var eating = [];
var turn = false;
var leave_place = null;
var moved_to = null;
var colorEnd = null;

function funcOprator() {
  for (const boxe of getElements.black) {
    boxe.addEventListener("dragstart", dragStart);
    boxe.addEventListener("dragend", dragEnd);
  }
  for (const boxe of getElements.white) {
    boxe.addEventListener("dragstart", dragStart);
    boxe.addEventListener("dragend", dragEnd);
  }
  for (let empty of getElements.box) {
    empty.addEventListener("dragover", emptyFuncs.dragOver);
    empty.addEventListener("dragenter", emptyFuncs.dragEnter);
    empty.addEventListener("dragleave", emptyFuncs.dragLeave);
    empty.addEventListener("drop", emptyFuncs.dragDrop);
  }
}

function dragStart() {
  upLeft = [];
  upRight = [];
  downRight = [];
  downLeft = [];
  divs = [];
  if ((this.id && this.id == "kingW") || this.id == "kingB") {
    this.setAttribute("player", "king");
    console.log("in");
  }
  leave_place = this.parentNode;
  locationFrom(this.parentNode);
  located.piece = this;
  located.color = this.getAttribute("color");
  setTimeout(() => {
    this.className += " invisible";
  }, 0);
  if (located.color == "white" && turn == false) {
    chatchDivs(1, this);
  } else if (located.color == "black" && turn == true) {
    chatchDivs(-1, this);
  }
}

function locationFrom(place) {
  located.fromRow = place.getAttribute("row");
  located.fromCoulm = place.getAttribute("coulm");
  located.ascii = located.fromCoulm.charCodeAt(0);
  located.plus1 = String.fromCharCode(located.ascii + 1);
  located.plus2 = String.fromCharCode(located.ascii + 2);
  located.minus1 = String.fromCharCode(located.ascii - 1);
  located.minus2 = String.fromCharCode(located.ascii - 2);
}

function chatchDivs(numbe, player) {
  landing = [];
  eating = [];
  var emp = getElements.box;
  for (let i = 0; i < emp.length; i++) {
    var col = emp[i].getAttribute("coulm");
    var row = emp[i].getAttribute("row");
    if (row == parseInt(located.fromRow) + -1 * numbe) {
      if (col == located.minus1) {
        divs[0] = emp[i];
      }
      if (col == located.plus1) {
        divs[1] = emp[i];
      }
    }
    if (row == parseInt(located.fromRow) + -2 * numbe) {
      if (col == located.minus2) {
        divs[2] = emp[i];
      }
      if (col == located.plus2) {
        divs[3] = emp[i];
      }
    }
  }
  //in case of a king:
  if (player && (player.id == "kingW" || player.id == "kingB")) {
    kingCount();
  }
  color(divs);
}

function kingCount() {
  var emp = getElements.box;

  for (let i = 0; i < emp.length; i++) {
    var col = emp[i].getAttribute("coulm");
    var row = emp[i].getAttribute("row");
    if (
      Math.abs(parseInt(located.ascii) - parseInt(col.charCodeAt(0))) ==
      Math.abs(parseInt(located.fromRow) - parseInt(row))
    ) {
      // --
      if (
        parseInt(located.ascii) > parseInt(col.charCodeAt(0)) &&
        parseInt(located.fromRow) > parseInt(row)
      ) {
        upLeft.push(emp[i]);
      }
      // - +
      if (
        parseInt(located.ascii) < parseInt(col.charCodeAt(0)) &&
        parseInt(located.fromRow) > parseInt(row)
      ) {
        upRight.push(emp[i]);
      }
      // + -
      if (
        parseInt(located.ascii) > parseInt(col.charCodeAt(0)) &&
        parseInt(located.fromRow) < parseInt(row)
      ) {
        downLeft.push(emp[i]);
      }
      // + +
      if (
        parseInt(located.ascii) < parseInt(col.charCodeAt(0)) &&
        parseInt(located.fromRow) < parseInt(row)
      ) {
        downRight.push(emp[i]);
      }
    }
  }
  upRight.reverse();
  upLeft.reverse();
  kingLight();
}

function kingLight() {
  for (let i = 0; i < downRight.length; i++) {
    if (downRight[i].className == "notEmpty box") {
      if (downRight[i].firstChild.className == located.color) {
        break;
      }
    }
    if (downRight[i] && downRight[i].className == "empty box") {
      downRight[i].setAttribute("id", "color");
      setTimeout(() => {
        removeColor(downRight);
      }, 800);
    }
  }
  for (let i = 0; i < downLeft.length; i++) {
    if (downLeft[i].className == "notEmpty box") {
      if (downLeft[i].firstChild.className == located.color) {
        break;
      }
    }
    if (downLeft[i] && downLeft[i].className == "empty box") {
      downLeft[i].setAttribute("id", "color");
      setTimeout(() => {
        removeColor(downLeft);
      }, 800);
    }
  }
  for (let i = 0; i < upRight.length; i++) {
    if (upRight[i].className == "notEmpty box") {
      if (upRight[i].firstChild.className == located.color) {
        break;
      }
    }
    if (upRight[i] && upRight[i].className == "empty box") {
      upRight[i].setAttribute("id", "color");
      setTimeout(() => {
        removeColor(upRight);
      }, 800);
    }
  }
  for (let i = 0; i < upLeft.length; i++) {
    if (upLeft[i].className == "notEmpty box") {
      if (upLeft[i].firstChild.className == located.color) {
        break;
      }
    }
    if (upLeft[i] && upLeft[i].className == "empty box") {
      upLeft[i].setAttribute("id", "color");
      setTimeout(() => {
        removeColor(upLeft);
      }, 800);
    }
  }
}

function removeColor(remove) {
  for (let i = 0; i < remove.length; i++) {
    remove[i].removeAttribute("id", "color");
  }
  remove = [];
}

function color(divs) {
  for (let i = 0; i < 2; i++) {
    if (divs[i] && divs[i].className == "empty box") {
      divs[i].setAttribute("id", "color");
      setTimeout(() => {
        divs[i].removeAttribute("id", "color");
      }, 800);
    }
    if (divs[i + 2]) {
      if (
        divs[i].className == "notEmpty box" &&
        divs[i].firstChild.className !== located.color
      ) {
        eating.push(divs[i]);
        if (divs[i + 2].className == "empty box") {
          divs[i + 2].setAttribute("id", "color");
          landing.push(divs[i + 2]);
          setTimeout(() => {
            divs[i + 2].removeAttribute("id", "color");
          }, 800);
        }
      }
    }
  }
}

var emptyFuncs = {
  dragOver: (e) => e.preventDefault(),
  dragEnter: function () {
    //this.className += " hovered";
  },
  dragLeave: function () {},
  dragDrop: function () {
    locationTo(this);
    // chack if players turn.
    if (located.color == "white" && turn == false) {
      placePlayer(this);
    } else if (located.color == "black" && turn == true) {
      placePlayer(this);
    }
  },
};

function locationTo(place) {
  located.toRow = place.getAttribute("row");
  located.toCoulm = place.getAttribute("coulm");
}

function placePlayer(place) {
  moved_to = place;
  if (moved_to) {
    if (moved_to.id == "color") {
      place.appendChild(located.piece);
      turn = !turn;
      leave_place.className = "empty box";
      moved_to.className = "notEmpty box";
      // in case of eating a player:
      if (landing) {
        console.log(landing);
        var th = 0;
        for (th = 0; th < landing.length; th++) {
          if (landing[th] == moved_to) {
            eating[th].removeChild(eating[th].firstChild);
            eating[th].className = "empty box";
          }
        }
      }
      // king eating:
      var chil = place;
      if (
        (chil.firstChild && chil.firstChild.id == "kingW") ||
        chil.firstChild.id == "kingB"
      ) {
        eatKing(downLeft);
        eatKing(downRight);
        eatKing(upRight);
        eatKing(upLeft);
      }

      // getting to be a king:
      if (located.color == "white" && located.toRow == 1) {
        moved_to.firstChild.id = "kingW";
      } else if (located.color == "black" && located.toRow == 8) {
        moved_to.firstChild.id = "kingB";
      }
    }
  }
}

function eatKing(arr) {
  var ind = 0;
  for (ind = 0; ind < arr.length; ind++) {
    if (arr[ind].firstChild) {
      if (arr[ind].firstChild.hasAttribute("player", "king")) {
        for (let i = 1; i <= ind; i++) {
          if (
            ind > 0 &&
            arr[ind - i] &&
            arr[ind - i].className == "notEmpty box"
          ) {
            arr[ind - i].removeChild(arr[ind - i].firstChild);
            arr[ind - i].className = "empty box";
            break;
          }
        }
      }
    }
  }
}

function dragEnd() {
  colorEnd = located.color;
  this.className = colorEnd;
  located = {};
  moved_to = null;
  if (this.getAttribute("player", "king")) {
    this.removeAttribute("player", "king");
  }
}

export { funcOprator };
