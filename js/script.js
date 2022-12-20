MAX_VALUE = 100;
SPEED = 100;

class DrawArray {
  constructor(maxValue) {
    this.barSize = 5;
    [this.ctx, this.rect] = setUpCanvas();
    this.width = this.rect.width;
    this.height = this.rect.height - 60;
    this.maxValue = maxValue;
  }

  draw(array) {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    const n = array.length;
    const startX = Math.round((this.width - n * (2 * this.barSize)) / 2);
    drawLine(
      this.ctx,
      startX - 5,
      0,
      n * (2 * this.barSize) + 5,
      this.barSize,
      "black"
    );
    array.forEach((element, index) => {
      const [x, y] = [
        startX + index * (2 * this.barSize),
        Math.floor(element * (this.height / this.maxValue)),
      ];
      drawLine(this.ctx, x, this.barSize, 5, y);
    });
  }
}
function getUserInputData() {
  const startButton = document.getElementById("start");
  startButton.addEventListener("click", start);
}

function setUpCanvas() {
  const canvas = document.getElementById("canvas");
  const dpr = window.devicePixelRatio;
  canvas.style.width = `${Math.floor(window.innerWidth * 0.99)}px`;
  canvas.style.height = `${Math.floor(
    (window.innerHeight - canvas.offsetTop) * 0.99
  )}px`;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(dpr, dpr);
  return [ctx, rect];
}
function drawLine(ctx, x, y, width, height, color = "green") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.closePath();
}
function bubbleSort(array, drawArray) {
  const arrCopy = [...array];
  let swapped;
  function sort() {
    swapped = false;
    for (let i = 0; i < arrCopy.length - 1; i++) {
      if (arrCopy[i] > arrCopy[i + 1]) {
        [arrCopy[i], arrCopy[i + 1]] = [arrCopy[i + 1], arrCopy[i]];
        swapped = true;
      }
      drawArray(arrCopy);
    }

    if (swapped) {
      var t = setTimeout(() => {
        requestAnimationFrame(sort);
        clearTimeout(t);
      }, SPEED);
    } else {
      // console.log(arrCopy);
    }
  }

  sort();
  // console.log(arrCopy);
}
function start() {
  const numberOfElementInput = document.getElementById("number_of_elements");
  const numberOfElement = Number(numberOfElementInput.value);

  if (isNaN(numberOfElement) || numberOfElement <= 0) {
    alert("Invalid input. Please enter a positive number.");
    return;
  }
  const arr = generateArray(numberOfElement);
  const d = new DrawArray(Math.max(...arr));
  d.draw(arr);
  bubbleSort(arr, d.draw.bind(d));
}

getUserInputData();
