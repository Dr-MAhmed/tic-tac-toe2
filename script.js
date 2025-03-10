document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const cells = document.querySelectorAll("[data-cell]");
    const status = document.getElementById("status");
    const resetButton = document.getElementById("reset");
    const aiMoveButton = document.getElementById("ai-move");
    const playBtn = document.getElementById("playBtn");
    const multiPlayer = document.getElementById("multiPlayer");
  
    let currentPlayer = "x";
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;
    let player1Name = "X";
    let player2Name = "O";
    let player1Initial = "x";
    let player2Initial = "o";
    let isMultiplayerMode = false;
  
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
        // Show winner's name instead of X or O
        const winnerName = currentPlayer === player1Initial ? player1Name : player2Name;
        status.textContent = `${winnerName} Wins!`;
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
      currentPlayer = currentPlayer === player1Initial ? player2Initial : player1Initial;
      updateStatus();
    }
  
    function updateStatus() {
      // Show current player's name instead of X or O
      const playerName = currentPlayer === player1Initial ? player1Name : player2Name;
      status.textContent = `${playerName}'s Turn`;
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
        currentPlayer === player1Initial ? "var(--primary)" : "var(--secondary)";
  
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
      if (!gameActive || currentPlayer === player1Initial || isMultiplayerMode) return;
  
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
  
    // Function to prompt for player names
    function promptForPlayerNames() {
      // Create overlay container
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = "1000";
  
      // Create form container
      const formContainer = document.createElement("div");
      formContainer.style.backgroundColor = "white";
      formContainer.style.padding = "20px";
      formContainer.style.borderRadius = "8px";
      formContainer.style.width = "80%";
      formContainer.style.maxWidth = "400px";
      formContainer.style.textAlign = "center";
  
      // Create title
      const title = document.createElement("h3");
      title.textContent = "Enter Player Names";
      title.style.marginBottom = "20px";
  
      // Create player 1 input
      const player1Label = document.createElement("label");
      player1Label.textContent = "Player 1 (X): ";
      player1Label.style.display = "block";
      player1Label.style.marginBottom = "5px";
  
      const player1Input = document.createElement("input");
      player1Input.type = "text";
      player1Input.placeholder = "Enter Player 1 Name";
      player1Input.style.width = "100%";
      player1Input.style.padding = "8px";
      player1Input.style.marginBottom = "15px";
      player1Input.style.boxSizing = "border-box";
  
      // Create player 2 input
      const player2Label = document.createElement("label");
      player2Label.textContent = "Player 2 (O): ";
      player2Label.style.display = "block";
      player2Label.style.marginBottom = "5px";
  
      const player2Input = document.createElement("input");
      player2Input.type = "text";
      player2Input.placeholder = "Enter Player 2 Name";
      player2Input.style.width = "100%";
      player2Input.style.padding = "8px";
      player2Input.style.marginBottom = "20px";
      player2Input.style.boxSizing = "border-box";
  
      // Create start button
      const startButton = document.createElement("button");
      startButton.textContent = "Start Game";
      startButton.style.padding = "10px 20px";
      startButton.style.backgroundColor = "#4CAF50";
      startButton.style.color = "white";
      startButton.style.border = "none";
      startButton.style.borderRadius = "4px";
      startButton.style.cursor = "pointer";
  
      // Add event listener to start button
      startButton.addEventListener("click", () => {
        // Get player names
        player1Name = player1Input.value.trim() || "Player 1";
        player2Name = player2Input.value.trim() || "Player 2";
        
        // Get first character for player symbols
        player1Initial = "x";  // Keep the class names as x and o for styling
        player2Initial = "o";
        
        // Set multiplayer mode
        isMultiplayerMode = true;
        
        // Remove overlay
        document.body.removeChild(overlay);
        
        // Show game board
        let mainContainer = document.querySelector('.main');
        mainContainer.style.display = 'block';
        playBtn.style.display = 'none';
        
        // Reset and start game
        initGame();
      });
  
      // Append elements to form container
      formContainer.appendChild(title);
      formContainer.appendChild(player1Label);
      formContainer.appendChild(player1Input);
      formContainer.appendChild(player2Label);
      formContainer.appendChild(player2Input);
      formContainer.appendChild(startButton);
  
      // Append form container to overlay
      overlay.appendChild(formContainer);
  
      // Append overlay to body
      document.body.appendChild(overlay);
    }
  
    // Event listeners
    resetButton.addEventListener("click", () => {
      cells.forEach((cell) => {
        cell.classList.remove("x", "o");
      });
      initGame();
    });
  
    aiMoveButton.addEventListener("click", makeAIMove);
  
    // Play button logic
    playBtn.addEventListener('click', () => {
      let mainContainer = document.querySelector('.main');
      mainContainer.style.display = 'block';
      playBtn.style.display = 'none';
    });
  
    // Multiplayer logic
    multiPlayer.addEventListener('click', () => {
      promptForPlayerNames();
    });
  });