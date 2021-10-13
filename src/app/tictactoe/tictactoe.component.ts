import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { Board } from './boardModel';
import { Agent, PerfectAgent } from './agent';
import { addSituationsToGameTree, drawBoard, drawBoardC, drawBoardRow, timeout, treeVisualization } from './canvasHelpFunctions';
@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrls: ['./tictactoe.component.css']
})
export class TictactoeComponent implements OnInit {

  agent: Agent;
  agent2: PerfectAgent;
  board: Board;
  againstPerfectAgent = false;
  gameCounter = 0;
  learningCurve = 0;
  boardCanvas;
  treeCanvas;
  diagrammCanvas;
  situationsInCurrentGame = [];
  colorMode = 'red-green';
  buttonsDisabled = false;

  constructor() {
    this.agent = new Agent(1, 2);
    this.agent2 = new PerfectAgent(2, 1);
    this.board = new Board(this.agent.playerSymbol, this.agent.opponent);
  }

  ngOnInit(): void {
    try {
      this.initCanvases();

    }catch(err){
      //TODO!
      console.log(err)
    }
  }

  async initCanvases(): Promise<any> {
    this.situationsInCurrentGame = [];
    this.situationsInCurrentGame.push([[this.board.deepCopy(), 1]]);
    await timeout(5)
    this.treeCanvas = new p5(this.treeSketch, 'tree');
    this.boardCanvas = new p5(this.boardSketch, 'board');
    this.diagrammCanvas = new p5(this.diagrammSketch, 'diagram');
    this.agentTurn();
  }

  /**
   * Function to reset the current game, so a new game can be played.
   */
  resetGame(): void {
    this.boardCanvas.noLoop();
    this.treeCanvas.noLoop();
    this.againstPerfectAgent = false;
    this.board.reset();
    this.agent.reset();
    this.situationsInCurrentGame = [];
    this.situationsInCurrentGame.push([[this.board.deepCopy(), 1]]);
    this.treeCanvas.remove();
    this.treeCanvas = new p5(this.treeSketch, 'tree');
    this.boardCanvas.loop();
    this.treeCanvas.loop();
    this.agentTurn();

  }

  /**
   * Function to makes the agents turn.
   */
  async agentTurn(): Promise<void> {
    this.treeCanvas.noLoop();
    let winner;
    if (this.board.currentPlayer === this.agent.playerSymbol) {
      if (this.againstPerfectAgent) {
        await timeout(200); // 500)
      }
      const move = this.agent.chooseAction(this.board);
      addSituationsToGameTree(this.agent, this.board, move, this.situationsInCurrentGame);
      this.board.setPlayer(move);
      winner = this.board.getWinner();
    }
    if (winner !== undefined) {
      this.gameHasEnded();
    } else {
      this.treeCanvas.loop();
      if (this.againstPerfectAgent) {
        this.perfectAgentTurn();
      }
    }
  }

  /**
   * Function to let the Agent learn and manage the learningcurve.
   */
  gameHasEnded(): void {
    this.treeCanvas.noLoop();
    const winner = this.board.getWinner();
    // Game has ended
    this.agent.learn(winner);
    this.gameCounter++;
    document.getElementById('gameCounter').innerHTML = this.gameCounter as any;
    if (winner === this.agent.opponent) {
      this.learningCurve -= 1;
    }

    if (winner === this.agent.playerSymbol) {
      this.learningCurve += 1;
    }

    if (winner === 0) {
      this.learningCurve += 1;
    }
    this.treeCanvas.loop();
    this.enableBtns();
  }

  /**
   * Function which is called, when the human player made a move.
   */
  playerTurn(move): void {
    this.treeCanvas.noLoop();
    let winner;
    if (this.board.board[move[0]][move[1]] === 0) {
      this.board.setPlayer([move[0], move[1]]);
      this.situationsInCurrentGame.push([[this.board.deepCopy(), 1]]);
      winner = this.board.getWinner();
    }
    if (winner !== undefined) {
      this.gameHasEnded();
    } else {
      this.agentTurn();
    }
  }

  /**
   * Function which makes the move for the alpha-beta agent.
   */
  async perfectAgentTurn(): Promise<void> {
    try {
      if (this.board.currentPlayer === this.agent.opponent) {
        await timeout(200); // 500)
        const move = this.agent2.chooseAction(this.board);
        this.board.setPlayer(move);
        this.situationsInCurrentGame.push([[this.board.deepCopy(), 1]]);
        const winner = this.board.getWinner();

        if (winner === undefined) {
          this.agentTurn();
        } else {
          this.gameHasEnded();
        }
      }
    } catch (err) { }
  }

  /**
   * Function to set everything up for a game against the alpha-beta agent.
   */
  perfectAgentPlay(): void {
    if (!this.againstPerfectAgent && this.board.getWinner() === undefined) {
      this.disableBtns();
      this.againstPerfectAgent = true;
      this.perfectAgentTurn();
    } else {
      this.resetGame();
      this.perfectAgentPlay();
    }
  }

  /**
   * Function to reload the page.
   */
  resetAll(): void {
    location.reload();
  }

  /**
   * Function to switch the color mode from red-green to blue-yellow and vice versa.
   */
  switchColorMode(): void {
    if (this.colorMode === 'red-green') {
      this.colorMode = 'blue-yellow';
    } else {
      this.colorMode = 'red-green';
    }
  }

  /**
   * Function to disable all buttons.
   */
  disableBtns(): void {
    this.buttonsDisabled = true;
  }

  /**
   * Function to enable all buttons.
   */
  enableBtns(): void {
    this.buttonsDisabled = false;
  }

  boardSketch = (p) => {
    let canvas;
    let dimension;
    let offset;
    let height;
    let width;

    p.setup = () => {
      height = document.getElementById('board').clientHeight;
      width = document.getElementById('board').clientWidth;

      offset = { x: undefined, y: 10 };

      dimension = Math.min(height, width) - offset.y;

      if (height < width) {
        offset.x = (width - dimension) / 2;
      } else {
        offset.x = (height - dimension) / 2;
      }
      canvas = p.createCanvas(dimension, dimension);

      const x = offset.x;
      const y = canvas.position().y + offset.y / 2;
      canvas.position(x, y);
    };

    p.draw = () => {
      drawBoardC(p, 0, 0, dimension, { r: 169, g: 169, b: 169 }, this.board);
      const winner = this.board.getWinner();
      if (winner !== undefined) {
        p.fill(162, 0, 255);
        p.textAlign(p.TOP, p.TOP);
        p.textSize(dimension / 7);
        p.stroke(255, 255, 255);
        if (winner === this.agent.opponent) {
          p.text('Du gewinnst!', 0, 0, dimension, dimension);
        }

        if (winner === this.agent.playerSymbol) {
          p.text('Der Agent gewinnt!', 0, 0, dimension, dimension);
        }

        if (winner === 0) {
          p.text('Unentschieden', 0, 0, dimension, dimension);
        }
      }
    };

    p.mousePressed = () => {
      if (p.mouseX >= 0 && p.mouseX <= dimension && p.mouseY >= 0 &&
        p.mouseY <= dimension && this.board.currentPlayer === 2 && this.board.winner === undefined && !this.againstPerfectAgent) {
        this.treeCanvas.noLoop();
        const col = Math.floor(3 * p.mouseX / dimension);
        const row = Math.floor(3 * p.mouseY / dimension);
        this.playerTurn([row, col]);
      }
    };
  }

  treeSketch = (p) => {

    let boardDimension;
    let offsetWidth;
    let offsetHeight;
    let width;

    p.setup = () => {
      const height = document.getElementById('tree').clientHeight;

      width = document.getElementById('tree').clientWidth;

      p.createCanvas(width, height);

      offsetWidth = 20;
      offsetHeight = 2 * offsetWidth;
      boardDimension = Math.max(Math.min((width - 8 * offsetWidth) / 7, (height - 11 * offsetHeight) / 10), 70);
      const agentColor = { r: 255, g: 229, b: 204 };
      const playerColor = { r: 255, g: 255, b: 255 };
      const maxNumberofBoardsInHeight = 10;
      const x = 0;
      let y = 0;
      let rectHeight = boardDimension + 1 / 2 * offsetHeight;
      const rectWidth = width;

      for (let i = 0; i < maxNumberofBoardsInHeight; i++) {
        p.noStroke();
        if (i % 2 === 0) {
          p.fill(playerColor.r, playerColor.g, playerColor.b);
          p.rect(x, y, rectWidth, rectHeight);
          p.stroke(0, 0, 0);
          if (i > 0) {
            p.textAlign(p.BOTTOM, p.CENTER);
            p.textSize(boardDimension / 2);
            p.fill(0, 0, 0);
            p.text('S', x, y + 1 / 2 * rectHeight);
          }
        } else {
          p.fill(agentColor.r, agentColor.g, agentColor.b);
          p.rect(x, y, rectWidth, rectHeight);
          p.stroke(0, 0, 0);
          p.textAlign(p.BOTTOM, p.CENTER);
          p.fill(0, 0, 0);
          p.textSize(boardDimension / 2);
          p.text('A', x, y + 1 / 2 * rectHeight);
        }
        y += rectHeight;
        if (i === 0) {
          rectHeight += 1 / 2 * offsetHeight;
        }
      }
    };

    p.draw = () => {
      treeVisualization(p, width, offsetWidth, offsetHeight, this.board,
        boardDimension, this.agent, this.colorMode, this.situationsInCurrentGame);
    };
  }


  diagrammSketch = (p) => {
    let width;
    let height;
    let xAxisStart;
    let yAxisStart;
    let xAxisEnd;
    let yAxisEnd;
    p.setup = () => {
      height = document.getElementById('diagram').clientHeight;

      width = document.getElementById('diagram').clientWidth;

      const canvas = p.createCanvas(width, height);
      p.textSize(Math.min(height * 0.05, width * 0.05));
      p.textAlign(p.CENTER);
      p.text('y: #gewonnen + #unentschieden - #verloren, x: #Spiele ', 0, 0, width, height / 3);

      p.strokeWeight(3);
      // y-Achse
      const lineStartXyAxis = width / 6;
      const lineStartYyAxis = height / 6;
      p.line(lineStartXyAxis, lineStartYyAxis, lineStartXyAxis, height);
      p.line(lineStartXyAxis, lineStartYyAxis, lineStartXyAxis - 10, lineStartYyAxis + 10);
      p.line(lineStartXyAxis, lineStartYyAxis, lineStartXyAxis + 10, lineStartYyAxis + 10);

      // x-Achse
      const lineStartXxAxis = lineStartXyAxis;
      const lineStartYxAxis = (height + lineStartYyAxis) / 2;
      p.line(lineStartXxAxis, lineStartYxAxis, width - width / 6, lineStartYxAxis);
      p.line(width - width / 6, lineStartYxAxis, width - width / 6 - 10, lineStartYxAxis - 10);
      p.line(width - width / 6, lineStartYxAxis, width - width / 6 - 10, lineStartYxAxis + 10);

      // init the axis starting points
      xAxisStart = lineStartXyAxis;
      yAxisStart = lineStartYxAxis;
      xAxisEnd = width - width / 6;
      yAxisEnd = height;

      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(20);
      p.text('x', xAxisEnd + 12, yAxisStart);
      p.text('y', xAxisStart, (height / 6) - 12);
    };

    p.draw = () => {
      const xVal = xAxisStart + 5 * this.gameCounter;
      const yVal = yAxisStart - 5 * this.learningCurve;
      if (this.gameCounter > 0 && this.gameCounter % 10 === 0 && xVal < xAxisEnd) {
        const yHeight = yAxisStart;
        p.strokeWeight(3);
        p.stroke(0);
        p.line(xVal, yHeight + 10, xVal, yHeight - 10);
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(18);
        p.text(this.gameCounter, xVal, yHeight + 20);
      }
      if (xVal <= xAxisEnd && yVal <= yAxisEnd && yVal >= -yAxisEnd) {
        p.strokeWeight(5);
        p.stroke(0, 0, 255);
        p.point(xVal, yVal);
      }
    };
  }
}
