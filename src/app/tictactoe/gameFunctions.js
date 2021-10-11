/**
 * Global variable for the intelligent agent.
 */
let agent = new Agent(1, 2);

/**
 * Global variable for the alpha-beta-agent.
 */
let agent2 = new perfectAgent(2, 1);

/**
 * Global variable to store if a player or the other agent plays.
 */
let againstPerfectAgent = false;

/**
 * Global variable for the boardmodel.
 */
let board = new Board(agent.playerSymbol, agent.opponent);

/**
 * Global variable for counting the number of games already played.
 */
let gameCounter = 0;

/**
 * Global variable for the y value of the learning curve.
 */
let learningCurve = 0;

/**
 * Global variable for the board visualization.
 */
let boardCanvas;

/**
 * Global variable for the gametree visualization.
 */
let treeCanvas;

/**
 * Global variable for the learning curve visualization.
 */
let diagrammCanvas;

/**
 * Global variable which stores all possible situations the current game could have had. Contains arrays, where each entry is one turn of the agent or human.
 * If it´s an agents turn the array consist of arrays where the first entry is the possible move and the second is an indicator if
 * the move still is possible to move (1), was chosen to move (2) or isnt available any longer (0)
 */
let situationsInCurrentGame = [];
// Push the initial empty board in the situations variable
situationsInCurrentGame.push([[board.deepCopy(), 1]]);

/**
 * Global variable for the color mode representation
 */
let colorMode = 'red-green'

/**
 * Creating all the Canvases on load, and start the game.
 */
window.onload = () => {
    treeCanvas = new p5(treeSketch, 'tree');
    boardCanvas = new p5(boardSketch, 'board');
    diagrammCanvas = new p5(diagrammSketch, 'diagram');
    agentTurn();
};

/**
 * Function to reset the current game, so a new game can be played.
 */
function resetGame(){
    boardCanvas.noLoop();
    treeCanvas.noLoop();
    againstPerfectAgent = false;
    board.reset();
    agent.reset();
    situationsInCurrentGame = [];
    situationsInCurrentGame.push([[board.deepCopy(), 1]]);
    treeCanvas.remove();
    treeCanvas = new p5(treeSketch, 'tree');
    boardCanvas.loop();
    treeCanvas.loop();
    agentTurn();

  }

/**
 * Function to makes the agents turn.
 */
async function agentTurn(){
    treeCanvas.noLoop();
    if (board.currentPlayer == agent.playerSymbol){
        if (againstPerfectAgent){
            await timeout(200);// 500)
        }
        const move = agent.chooseAction(board);
        addSituationsToGameTree(agent, board, move, situationsInCurrentGame);
        board.setPlayer(move);
        winner = board.getWinner();
    }
    if (winner != undefined){
        gameHasEnded();
    }else{
        treeCanvas.loop();
        if (againstPerfectAgent){
            perfectAgentTurn();
        }
    }


}

/**
 * Function to let the Agent learn and manage the learningcurve.
 */
function gameHasEnded(){
    treeCanvas.noLoop();
    const winner = board.getWinner();
    // Game has ended
    agent.learn(winner);
    gameCounter++;
    document.getElementById('gameCounter').innerHTML = gameCounter;
    if (winner == agent.opponent){
        learningCurve -= 1;
    }

    if (winner == agent.playerSymbol){
        learningCurve += 1;
    }

    if (winner == 0){
        learningCurve += 1
    }
    treeCanvas.loop();
    enableBtns();
}

/**
 * Function which is called, when the human player made a move.
 */
function playerTurn(move){
    treeCanvas.noLoop();
    if (board.board[move[0]][move[1]] == 0){
        board.setPlayer([move[0], move[1]]);
        situationsInCurrentGame.push([[board.deepCopy(), 1]])
        winner = board.getWinner();
    }
    if (winner != undefined){
        gameHasEnded();
    }else{
        agentTurn();
    }
}

/**
 * Function which makes the move for the alpha-beta agent.
 */
async function perfectAgentTurn(){
    try{
        if (board.currentPlayer == agent.opponent){
            await timeout(200);// 500)
            const move = agent2.chooseAction(board);
            board.setPlayer(move);
            situationsInCurrentGame.push([[board.deepCopy(), 1]])
            const winner = board.getWinner();

            if (winner == undefined){
                agentTurn();
            }else{
                gameHasEnded();

            }
        }
    }catch (err){}
}

/**
 * Function to set everything up for a game against the alpha-beta agent.
 */
function perfectAgentPlay(){
    if (!againstPerfectAgent && board.getWinner() == undefined){
        disableBtns();
        againstPerfectAgent = true;
        perfectAgentTurn();
    }else{
        resetGame();
        perfectAgentPlay();
    }

}

/**
 * Function to reload the page.
 */
function resetAll(){
    location.reload();
}

/**
 * Function to switch the color mode from red-green to blue-yellow and vice versa.
 */
function switchColorMode(){
    if (colorMode == 'red-green'){
        colorMode = 'blue-yellow'
    }else{
        colorMode = 'red-green'
    }
}

/**
 * Function to disable all buttons.
 */
async function disableBtns(){
    const buttons = document.querySelectorAll('button');
    for (const button of buttons){
        button.disabled = true;
    }
}

/**
 * Function to enable all buttons.
 */
function enableBtns(){
    const buttons = document.querySelectorAll('button');
    for (const button of buttons){
        button.disabled = false;
    }
}
