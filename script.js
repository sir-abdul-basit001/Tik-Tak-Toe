// ---- Element references ----
const boxes = document.querySelectorAll(".box");
const newGameBtn = document.querySelector(".newgame");
const resetGameBtn = document.querySelector(".resetgame");
const msg = document.querySelector(".msg");
const msgText = document.querySelector(".winner");
const flowerLayer = document.querySelector(".flowers");

// ---- Game state ----
const PLAYER_X = "X";
const PLAYER_O = "O";
let currentPlayer = PLAYER_X;
let gameOver = false;

// All possible winning combinations (rows, columns, diagonals)
const WIN_PATTERNS = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const FLOWER_EMOJIS = ["🌸", "🌼", "🌺", "🌻", "🌷"];

// ---- Helpers ----
const clearHighlights = () => {
  boxes.forEach((box) => box.classList.remove("win"));
};

const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
    box.style.color = "";
    box.classList.remove("win");
  });
};

const showMessage = (text) => {
  msgText.innerText = text;
  msg.classList.remove("hide");
};

const hideMessage = () => {
  msg.classList.add("hide");
};

// Spawns a burst of falling flowers across the screen
const celebrateWin = () => {
  const flowerCount = 40;

  for (let i = 0; i < flowerCount; i++) {
    const flower = document.createElement("span");
    flower.className = "flower";
    flower.textContent =
      FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)];

    flower.style.left = `${Math.random() * 100}vw`;
    flower.style.fontSize = `${1.2 + Math.random() * 1.6}rem`;
    flower.style.setProperty("--fall-duration", `${2.5 + Math.random() * 2}s`);
    flower.style.setProperty("--sway-duration", `${1 + Math.random()}s`);
    flower.style.animationDelay = `${Math.random() * 0.6}s`;

    flowerLayer.appendChild(flower);

    // Clean up each flower once its fall animation finishes
    flower.addEventListener("animationend", (e) => {
      if (e.animationName === "fall") flower.remove();
    });
  }
};

const clearFlowers = () => {
  flowerLayer.innerHTML = "";
};

// ---- Core game logic ----
const checkWinner = () => {
  for (const [a, b, c] of WIN_PATTERNS) {
    const valA = boxes[a].innerText;
    const valB = boxes[b].innerText;
    const valC = boxes[c].innerText;

    if (valA && valA === valB && valB === valC) {
      boxes[a].classList.add("win");
      boxes[b].classList.add("win");
      boxes[c].classList.add("win");

      showMessage(`Congrats, winner is ${valA}!`);
      disableBoxes();
      celebrateWin();
      gameOver = true;
      return true;
    }
  }
  return false;
};

const checkDraw = () => {
  const isFull = [...boxes].every((box) => box.innerText !== "");
  if (isFull) {
    showMessage("It's a draw!");
    gameOver = true;
    return true;
  }
  return false;
};

const handleBoxClick = (box) => {
  if (gameOver || box.innerText !== "") return;

  box.innerText = currentPlayer;
  box.style.color =
    currentPlayer === PLAYER_X ? "var(--x-color)" : "var(--o-color)";
  box.disabled = true;

  if (!checkWinner()) {
    checkDraw();
  }

  currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
};

const resetGame = () => {
  currentPlayer = PLAYER_X;
  gameOver = false;
  clearHighlights();
  enableBoxes();
  hideMessage();
  clearFlowers();
};

// ---- Event listeners ----
boxes.forEach((box) => {
  box.addEventListener("click", () => handleBoxClick(box));
});

resetGameBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
