const getBtn = document.getElementById("get-btn");
const startBtn = document.getElementById("start-btn");
const countElement = document.getElementById("total_element");
const startElement = document.getElementById("start");
const endElement = document.getElementById("end");
const arrayContainer = document.getElementById("array-container");
const animationDuration = 1000;

const randomNumber = (start, end) => {
  return Math.floor(Math.random() * (end - start)) + start;
};

const arrayOfRandom = (count, start, end) => {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(randomNumber(start, end));
  }
  return array;
};

const swapWithAnimate = async (a, b) => {
  const rect1 = a.getBoundingClientRect();
  const react2 = b.getBoundingClientRect();
  const moveVal = Math.abs(react2.x - rect1.x);

  a.animate(
    [
      { transform: "translate(0, -50px)", backgroundColor: "red" },
      { transform: `translate(${moveVal}px, -50px)`, backgroundColor: "red" },
      { transform: `translate(${moveVal}px, 0)`, backgroundColor: "red" },
    ],
    {
      duration: animationDuration,
    }
  );

  b.animate(
    [
      { transform: "translate(0, 50px)", backgroundColor: "red" },
      { transform: `translate(-${moveVal}px, 50px)`, backgroundColor: "red" },
      { transform: `translate(-${moveVal}px, 0)`, backgroundColor: "red" },
    ],
    {
      duration: animationDuration,
    }
  );
};

getBtn.addEventListener("click", () => {
  const count = countElement.value;
  const start = startElement.value;
  const end = endElement.value;
  const array = arrayOfRandom(+count, +start, +end);
  arrayContainer.textContent = "";

  array.forEach((el) => {
    const html = `<div class="element">${el}</div>`;
    arrayContainer.insertAdjacentHTML("beforeend", html);
  });
});

const move = async (e) => {
  const array = document.querySelectorAll(".element");
  const numbers = [];
  array.forEach((el) => numbers.push(parseInt(el.textContent)));
  let timeOut = 0;
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      const node1 = array[j];
      const node2 = array[j + 1];

      if (numbers[j] > numbers[j + 1]) {
        [numbers[j], numbers[j + 1]] = [numbers[j + 1], numbers[j]];
        const clearTimeOutObj = setTimeout(() => {
          swapWithAnimate(node1, node2);
          const numberTimeOut = setTimeout(() => {
            [node1.textContent, node2.textContent] = [
              node2.textContent,
              node1.textContent,
            ];
            clearTimeout(numberTimeOut);
          }, animationDuration);
          clearTimeout(clearTimeOutObj);
        }, timeOut);
        timeOut += animationDuration + 500;
      }
    }
  }
};

startBtn.addEventListener("click", move);
