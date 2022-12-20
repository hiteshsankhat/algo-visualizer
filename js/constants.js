const computesStyles = getComputedStyle(document.querySelector(":root"));
// colors
const COLORS = {
  DEFAULT: "#5a189a",
  SWAP: "green",
  COMPARE: "orange",
  BACKGROUND: computesStyles.getPropertyValue("--background-color"),
};

const MAX_ARRAY_VALUE = 100;
