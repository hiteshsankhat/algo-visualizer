let numberArray = [];
let colorArray = [];
let isSortRunning = false;
const canvas = document.getElementById("canvas");
const regenerateBtn = document.getElementById("regenerate-array");
const bubbleSortBtn = document.getElementById("bubble-sort");
const quickSortBtn = document.getElementById("quick-sort");
const selectionSortBtn = document.getElementById("selection-sort");
const insertionSortBtn = document.getElementById("insertion-sort");
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
function enableDisableElement(bool) {
  numberOfElementSlider.disabled = bool;
  isSortRunning = bool;
  bubbleSortBtn.disabled = bool;
  selectionSortBtn.disabled = bool;
  insertionSortBtn.disabled = bool;
  quickSortBtn.disabled = bool;
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
      if (!isSortRunning) {
        enableDisableElement(false);
        drawArray(arr, colorArray);
        return;
      }
      if ((await compare(arr, j, j + 1)) === -1) {
        await swap(arr, j, j + 1);
      }
    }
  }
  enableDisableElement(false);
  drawArray(arr, colorArray);
}
async function quickSort(arr) {
  async function partition(arr, low, high) {
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
      if (!isSortRunning) {
        drawArray(arr, colorArray);
        return;
      }
      if ((await compare(arr, j, high)) === 1) {
        i++;
        await swap(arr, i, j);
      }
    }
    await swap(arr, i + 1, high);
    return i + 1;
  }
  async function sort(arr, low, high) {
    if (!isSortRunning) {
      drawArray(arr, colorArray);
      return;
    }
    if (low < high) {
      let pi = await partition(arr, low, high);
      await sort(arr, low, pi - 1);
      await sort(arr, pi + 1, high);
    }
  }
  await sort(arr, 0, arr.length - 1);
  enableDisableElement(false);
  drawArray(arr, colorArray);
}
async function selectionSort(arr) {
  const length = arr.length;
  let min_idx;
  for (let i = 0; i < length - 1; i++) {
    min_idx = i;
    for (let j = i + 1; j < length; j++) {
      if (!isSortRunning) {
        enableDisableElement(false);
        drawArray(arr, colorArray);
        return;
      }
      if ((await compare(arr, min_idx, j)) === -1) {
        min_idx = j;
      }
    }
    if (!isSortRunning) {
      enableDisableElement(false);
      drawArray(arr, colorArray);
      return;
    }
    await swap(arr, min_idx, i);
  }
  enableDisableElement(false);
  drawArray(arr, colorArray);
}
async function insertionSort(arr) {
  const length = arr.length;
  let key;
  for (let i = 1; i < length; i++) {
    key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      if (!isSortRunning) {
        enableDisableElement(false);
        drawArray(arr, colorArray);
        return;
      }
      [colorArray[j + 1], colorArray[j]] = [COLORS.COMPARE, COLORS.COMPARE];
      drawArray(arr, colorArray);
      await sleep();
      arr[j + 1] = arr[j];
      [colorArray[j + 1], colorArray[j]] = [COLORS.DEFAULT, COLORS.DEFAULT];
      j = j - 1;
      drawArray(arr, colorArray);
      await sleep();
    }
    [colorArray[j + 1], colorArray[i]] = [COLORS.SWAP, COLORS.SWAP];
    drawArray(arr, colorArray);
    await sleep();
    arr[j + 1] = key;
    [colorArray[j + 1], colorArray[i]] = [COLORS.DEFAULT, COLORS.DEFAULT];
    drawArray(arr, colorArray);
    await sleep();
  }
  enableDisableElement(false);
  drawArray(arr, colorArray);
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

quickSortBtn.addEventListener("click", () => {
  enableDisableElement(true);
  quickSort(numberArray);
});
selectionSortBtn.addEventListener("click", () => {
  enableDisableElement(true);
  selectionSort(numberArray);
});
insertionSortBtn.addEventListener("click", () => {
  enableDisableElement(true);
  insertionSort(numberArray);
});
