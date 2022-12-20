let numberArray = [];
let colorArray = [];
let isSortRunning = false;
const canvas = document.getElementById("canvas");
const regenerateBtn = document.getElementById("regenerate-array");
const bubbleSortBtn = document.getElementById("bubble-sort");
const mergeSortBtn = document.getElementById("merge-sort");
const numberOfElementSlider = document.getElementById("number-of-elements");
const animationSpeedSlider = document.getElementById("animation-speed");
let SPEED = animationSpeedSlider.max / 2;

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
}
function sleep() {
  return new Promise((resolve) => setTimeout(resolve, SPEED));
}
async function generateArray(numberOfElement) {
  numberArray.length = 0;
  colorArray.length = 0;
  for (let i = 0; i < numberOfElement; i++) {
    numberArray.push(Math.floor(Math.random() * MAX_ARRAY_VALUE) + 1);
    colorArray.push(COLORS.DEFAULT);
  }
  drawArray(numberArray, colorArray);
}
async function drawArray(arr, colors) {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const length = arr.length;
  const spacing = canvas.width / length;
  const bar_width = spacing / 2;
  let x = bar_width / 2;
  for (let i = 0; i < length; i++) {
    ctx.fillStyle = colors[i];
    const y = arr[i] * ((canvas.height - 60) / MAX_ARRAY_VALUE);
    ctx.fillRect(x, 0, bar_width, y);
    x += spacing;
  }
}
async function swap(arr, i, j) {
  [numberArray[i], numberArray[j]] = [numberArray[j], numberArray[i]];
  [colorArray[i], colorArray[j]] = [COLORS.SWAP, COLORS.SWAP];
  drawArray(arr, colorArray);
  await sleep();
  [colorArray[i], colorArray[j]] = [COLORS.DEFAULT, COLORS.DEFAULT];
}
async function compare(arr, i, j) {
  [colorArray[i], colorArray[j]] = [COLORS.COMPARE, COLORS.COMPARE];
  drawArray(arr, colorArray);
  await sleep();
  [colorArray[i], colorArray[j]] = [COLORS.DEFAULT, COLORS.DEFAULT];
  drawArray(arr, colorArray);
  await sleep();
  if (arr[i] > arr[j]) return -1;
  if (arr[i] <= arr[j]) return 1;
}
async function bubbleSort(arr) {
  const length = arr.length;
  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      if ((await compare(arr, j, j + 1)) === -1) {
        await swap(arr, j, j + 1);
      }
      if (!isSortRunning) {
        enableDisableElement(false);
        drawArray(arr, colorArray);
        return;
      }
    }
  }
  enableDisableElement(false);
  drawArray(arr, colorArray);
}
async function mergeSort(arr) {
  let sorted = false;
  let i = 0;
  async function sort() {
    if (i < arr.length - 1 && !sorted) {
      if ((await compare(arr, i, i + 1)) === -1) {
        sorted = false;
        await swap(arr, i, i + 1);
      }
      i++;
    } else {
      if (sorted) {
        isSortRunning = false;
        return;
      }
      sorted = true;
      i = 0;
    }
    if (isSortRunning) {
      requestAnimationFrame(sort);
    }
  }
  requestAnimationFrame(sort);
  drawArray(arr, colorArray);
}
function enableDisableElement(bool) {
  numberOfElementSlider.disabled = bool;
  isSortRunning = bool;
  bubbleSortBtn.disabled = bool;
  mergeSortBtn.disabled = bool;
}

setUpCanvas();
generateArray(10);

// all event listener
numberOfElementSlider.addEventListener("input", () => {
  generateArray(numberOfElementSlider.value);
});
animationSpeedSlider.addEventListener("input", () => {
  SPEED = animationSpeedSlider.max - animationSpeedSlider.value;
  SPEED = Math.max(SPEED, 10);
});
regenerateBtn.addEventListener("click", () => {
  enableDisableElement(false);
  generateArray(numberOfElementSlider.value);
});
bubbleSortBtn.addEventListener("click", () => {
  enableDisableElement(true);
  bubbleSort(numberArray);
});

mergeSortBtn.addEventListener("click", () => {
  enableDisableElement(true);
  mergeSort(numberArray);
});
