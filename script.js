
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
    let columnTotal = board.map(row => row[column].getValue())
                      .filter((token) => token===playerToken)
                      .reduce((total, current) => total+= current);
    let rowTotal = board[row].map(cell => cell.getValue())
                    .filter((token) => token===playerToken)
                    .reduce((total, current) => total+= current);
    return columnTotal === winCondition || rowTotal === winCondition;
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithCellValues);
  }

  return { getBoard, placeToken, printBoard };

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
    if (gameBoard.placeToken(row, column, activePlayer)) {playerWin();}

    switchActivePlayer();
    printNewRound();
  } 

  const playerWin = () => {console.log(`${activePlayer.getName()} wins!`)};

  return { playRound, getActivePlayer, getBoard: gameBoard.getBoard };

})();

function ScreenController() {
  const winText = document.querySelector('h1');
  const dialog = document.querySelector('.dialog');
  const squares = document.querySelectorAll('.square');
  squares.forEach(button => button.addEventListener('click', clickHandle));


  const updateScreen = () => {
    const board = gameBoard.getBoard();
    const activePlayer = gameController.getActivePlayer();

    dialog.textContent = `${activePlayer.getName()}'s turn...`;

    squares.forEach(square => {
      square.textContent = board[square.dataset.row][square.dataset.column].getValue();
    });
  }

  function clickHandle(e) {
    if (e.target.textContent !== '0') {
      dialog.textContent = 'Please select a different square.';
    } else {
      gameController.playRound(e.target.dataset.row, e.target.dataset.column);
      updateScreen();
    }
  }
}

ScreenController();
