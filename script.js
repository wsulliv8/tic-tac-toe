
const gameBoard = (function () {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i=0; i<rows; i++){
    board[i] = [];
    for (let j=0; j<columns; j++){
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeToken = (row, column, player) => {
    if (board[row][column].getValue() === 0)
      board[row][column].addToken(player.getToken());
    return checkWin(row, column, player);
  }

  const checkWin = (row, column, player) => {
    const playerToken = player.getToken();
    const winCondition = playerToken * 3;
    let diagWinOne = 0;
    let diagWinTwo = 0;
    for (var i=0, j=0; i<3; i++, j++) {
      if (board[i][j].getValue()===playerToken) diagWinOne += playerToken;
    }
    for (var i=0, j=2; i<3; i++, j--){
      if (board[i][j].getValue()===playerToken) diagWinTwo += playerToken;
    }
    console.log(diagWinTwo);
    let columnTotal = board.map(row => row[column].getValue())
                      .filter((token) => token===playerToken)
                      .reduce((total, current) => total+= current);
    let rowTotal = board[row].map(cell => cell.getValue())
                    .filter((token) => token===playerToken)
                    .reduce((total, current) => total+= current);
    return columnTotal === winCondition 
          || rowTotal === winCondition
          || diagWinOne === winCondition
          || diagWinTwo === winCondition;
  }

  const initCell = (row, column) => {
    board[row][column] = Cell();
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithCellValues);
  }

  return { getBoard, placeToken, printBoard, initCell };

})();

function Cell () {
  let value = 0;

  const addToken = (token) => value = token;
  
  const getValue = () => value;

  return { addToken, getValue };

}

function Player(name, token) {
  const playerName = name;

  const playerToken = token;

  const getName = () => playerName;

  const getToken = () => playerToken;

  return { getName, getToken };

}

const gameController = (function () {
  const players = [Player('Player One', 1), Player('Player Two', 2)];
  let activePlayer = players[0];

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    gameBoard.printBoard();
  }

  const playRound = (row, column) => {
    if (gameBoard.placeToken(row, column, activePlayer)) {
      return 1;
    }

    switchActivePlayer();
    printNewRound();
  } 

  const playerWin = () => {console.log(`${activePlayer.getName()} wins!`)};

  return { playRound, getActivePlayer, getBoard: gameBoard.getBoard };

})();

function ScreenController() {
  let board = gameBoard.getBoard();
  const winText = document.querySelector('h1');
  const dialog = document.querySelector('.dialog');
  const crosses = document.querySelector('.crosses');
  const circles = document.querySelector('.circles');
  let squares = document.querySelectorAll('.square');
  let playAgain = document.querySelector('.playAgain');
  playAgain.addEventListener('click', clearScreen);
  squares.forEach(button => button.addEventListener('click', clickHandle));
  squares = convertTwoDim(squares);
  const tokenData = {
    0 : '',
    1 : {
          type : crosses,
          html : 
                `   
                    <span class="shape-wrapper">
                      <span class="shape cross"></span>
                    </span>
                `,
        }, 
    2 : {
          type : circles,
          html : 
                `   
                    <span class="shape-wrapper">
                      <span class="shape circle"></span>
                    </span>
                `,
        },
  }

  function convertTwoDim(oneDim) {
    const twoDim = [];
    oneDim = Array.from(oneDim);
    for (let i = 0; i < oneDim.length; i += 3) {
      twoDim.push(oneDim.slice(i, i + 3));
    }
    return twoDim;
  }

  const updateScreen = (row, column) => {
    const cellValue = board[row][column].getValue();
    const activePlayer = gameController.getActivePlayer();
    dialog.textContent = `${activePlayer.getName()}'s turn...`;
    squares[row][column].innerHTML = tokenData[cellValue].html;
    tokenData[cellValue].type.lastElementChild.remove();
  }

  function clearScreen() {
    winText.innerText = '';
    for (let i = 0; i < board.length; i++){
      for (let j = 0; j < board[i].length; j++) {
        const token = squares[i][j].firstElementChild;
        if (token) token.remove();
        const cellValue = board[i][j].getValue();
        if (cellValue) tokenData[cellValue].type.innerHTML += tokenData[cellValue].html;
        gameBoard.initCell(i,j);
        squares[i][j].disabled = false;
      }
    }
  }

  function clickHandle(e) {
    e.target.disabled = true;
    if (e.target.firstElementChild) {
      console.log(e.target.firstElementChild);
      dialog.textContent = 'Please select a different square.';
    } else {
      if (gameController.playRound(e.target.dataset.row, e.target.dataset.column)) {
        updateScreen(e.target.dataset.row, e.target.dataset.column);
        playAgain.style.visibility = 'visible';
        winText.textContent = `${gameController.getActivePlayer().getName()} Wins!`;
      } else { updateScreen(e.target.dataset.row, e.target.dataset.column) }
    }
  }

}

ScreenController();
