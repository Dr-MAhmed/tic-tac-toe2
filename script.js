document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const cells = document.querySelectorAll("[data-cell]");
  const status = document.getElementById("status");
  const resetButton = document.getElementById("reset");
  const aiMoveButton = document.getElementById("ai-move");

  let currentPlayer = "x";
  let gameState = ["", "", "", "", "", "", "", "", ""];
  let gameActive = true;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  // Initialize the game
  initGame();

  function initGame() {
    cells.forEach((cell) => {
      cell.classList.remove("x", "o", "winning-cell");
      cell.addEventListener("click", handleCellClick, { once: true });
    });

    // Remove any winning line
    const existingLine = document.querySelector(".winning-line");
    if (existingLine) {
      existingLine.remove();
    }

    board.classList.remove("win");
    currentPlayer = "x";
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    updateStatus();
  }

  function handleCellClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (gameState[index] !== "" || !gameActive) {
      return;
    }

    updateCell(cell, index);
    checkWinner();
  }

  function updateCell(cell, index) {
    gameState[index] = currentPlayer;
    cell.classList.add(currentPlayer);

    // Remove event listener after cell is clicked
    cell.removeEventListener("click", handleCellClick);
  }

  function checkWinner() {
    let gameWon = false;

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];

      if (
        gameState[a] &&
        gameState[a] === gameState[b] &&
        gameState[a] === gameState[c]
      ) {
        gameWon = true;
        highlightWinningCells([a, b, c]);
        drawWinningLine([a, b, c]);
        break;
      }
    }

    if (gameWon) {
      gameActive = false;
      status.textContent = `${currentPlayer.toUpperCase()} Wins!`;
      status.style.animation = "none";
      void status.offsetWidth; // Trigger reflow to restart animation
      status.style.animation = "status-fade 0.3s ease-in";
      return;
    }

    // Check for draw
    if (!gameState.includes("")) {
      gameActive = false;
      status.textContent = "It's a Draw!";
      status.style.animation = "none";
      void status.offsetWidth; // Trigger reflow to restart animation
      status.style.animation = "status-fade 0.3s ease-in";
      return;
    }

    // Switch player
    currentPlayer = currentPlayer === "x" ? "o" : "x";
    updateStatus();
  }

  function updateStatus() {
    status.textContent = `${currentPlayer.toUpperCase()}'s Turn`;
    status.style.animation = "none";
    void status.offsetWidth; // Trigger reflow to restart animation
    status.style.animation = "status-fade 0.3s ease-in";
  }

  function highlightWinningCells(combination) {
    board.classList.add("win");
    combination.forEach((index) => {
      cells[index].classList.add("winning-cell");
    });
  }

  function drawWinningLine(combination) {
    // Remove any existing line
    const existingLine = document.querySelector(".winning-line");
    if (existingLine) {
      existingLine.remove();
    }

    const lineElement = document.createElement("div");
    lineElement.classList.add("winning-line");

    // Get specific winning pattern
    const pattern = combination.toString();

    // Set line properties based on the winning pattern
    const isRow = [
      [0, 1, 2].toString(),
      [3, 4, 5].toString(),
      [6, 7, 8].toString(),
    ].includes(pattern);

    const isColumn = [
      [0, 3, 6].toString(),
      [1, 4, 7].toString(),
      [2, 5, 8].toString(),
    ].includes(pattern);

    const isDiagonalDown = [0, 4, 8].toString() === pattern;
    const isDiagonalUp = [2, 4, 6].toString() === pattern;

    // Set position, width, and transform for different win types
    if (isRow) {
      const rowIndex = Math.floor(combination[0] / 3);
      const cellHeight = cells[0].offsetHeight;
      const rowY = rowIndex * cellHeight + cellHeight / 2 + rowIndex * 10 + 10; // account for gap and padding

      lineElement.style.width = "calc(100% - 20px)";
      lineElement.style.height = "5px";
      lineElement.style.top = `${rowY}px`;
      lineElement.style.left = "10px";
      lineElement.style.transformOrigin = "left center";
    } else if (isColumn) {
      const colIndex = combination[0] % 3;
      const cellWidth = cells[0].offsetWidth;
      const colX = colIndex * cellWidth + cellWidth / 2 + colIndex * 10 + 10; // account for gap and padding

      lineElement.style.width = "5px";
      lineElement.style.height = "calc(100% - 20px)";
      lineElement.style.left = `${colX}px`;
      lineElement.style.top = "10px";
      lineElement.style.transform = "scaleY(0)";
      lineElement.style.animation = "line-animation-y 0.5s forwards";
    } else if (isDiagonalDown) {
      lineElement.style.width = "140%";
      lineElement.style.height = "5px";
      lineElement.style.top = "50%";
      lineElement.style.left = "-20%";
      lineElement.style.transformOrigin = "center";
      lineElement.style.transform = "rotate(45deg) scaleX(0)";
      lineElement.style.animation = "diagonal-animation-down 0.5s forwards";
    } else if (isDiagonalUp) {
      lineElement.style.width = "140%";
      lineElement.style.height = "5px";
      lineElement.style.top = "50%";
      lineElement.style.left = "-20%";
      lineElement.style.transformOrigin = "center";
      lineElement.style.transform = "rotate(-45deg) scaleX(0)";
      lineElement.style.animation = "diagonal-animation-up 0.5s forwards";
    }

    // Set color based on current player
    lineElement.style.backgroundColor =
      currentPlayer === "x" ? "var(--primary)" : "var(--secondary)";

    // Add line to the board
    board.appendChild(lineElement);

    // Add additional animations for vertical and diagonal lines
    const style = document.createElement("style");
    style.innerHTML = `
                    @keyframes line-animation-y {
                        from { transform: scaleY(0); }
                        to { transform: scaleY(1); }
                    }
                    
                    @keyframes diagonal-animation-down {
                        from { transform: rotate(45deg) scaleX(0); }
                        to { transform: rotate(45deg) scaleX(1); }
                    }
                    
                    @keyframes diagonal-animation-up {
                        from { transform: rotate(-45deg) scaleX(0); }
                        to { transform: rotate(-45deg) scaleX(1); }
                    }
                `;
    document.head.appendChild(style);
  }

  function makeAIMove() {
    if (!gameActive || currentPlayer === "x") return;

    // Find empty cells
    const emptyCells = gameState
      .map((val, idx) => (val === "" ? idx : null))
      .filter((val) => val !== null);

    if (emptyCells.length > 0) {
      // Choose a random empty cell
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const cellIndex = emptyCells[randomIndex];

      // Delay for a more natural feel
      setTimeout(() => {
        updateCell(cells[cellIndex], cellIndex);
        checkWinner();
      }, 500);
    }
  }

  // Event listeners
  resetButton.addEventListener("click", () => {
    cells.forEach((cell) => {
      cell.classList.remove("x", "o");
    });
    initGame();
  });

  aiMoveButton.addEventListener("click", makeAIMove);
});
