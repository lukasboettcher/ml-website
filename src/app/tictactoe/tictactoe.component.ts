import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as p5 from 'p5';
// import * as $ from 'jquery';
import { Board } from './boardModel';
import { Agent, PerfectAgent } from './agent';
// import 'bootstrap';
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
  // colorMode = 'red-green';
  buttonsDisabled = false;

  // state for the task progression
  // hardcode the total number of tasks for now
  // might change in the future
  taskProgress = 1;
  taskOneNav = 1;
  numberOfTasks = 6;

  // view children, to compute css width
  @ViewChild('boardSection')
  boardElement: ElementRef<HTMLDivElement>;

  @ViewChild('treeArea')
  treeElement: ElementRef<HTMLDivElement>;

  tasks = [
    { id: 1, title: 'a)', text: 'Mache dich während der ersten 10 Spiele mit der Oberfläche vertraut und notiere was dir beim Spielen auffällt.' },
    { id: 2, title: 'b)', text: 'Versuche in mehreren Spielen dieselbe Spielsituation zu erzeugen. Wählt der Agent in jedem Spiel denselben Zug? Wenn nicht, beschreibe, was sich verändert und woran es liegen könnte.' },
    { id: 3, title: 'c)', text: 'Was passiert mit dem Spielbaum und der Kurve am Ende eines Spiels - wenn man gewinnt, verliert oder unentschieden spielt?' },
    { id: 4, title: 'd)', text: 'Was lässt sich aus diesen Veränderungen des Spielbaums und der Kurve schließen?' },
    // {
    //   id: 5, title: 'e)', text: `Wenn du ein Spiel gewonnen hast, beschreibe, was mit dem Spielbaum passiert.
    //           Betrachte außerdem den Graphen im Koordinatensystem unten links. Wie verändert sich die Kurve?`
    // },
  ];

  constructor() {
    this.agent = new Agent(1, 2);
    this.agent2 = new PerfectAgent(2, 1);
    this.board = new Board(this.agent.playerSymbol, this.agent.opponent);
  }

  ngOnInit(): void {
    try {
      this.initCanvases();

    } catch (err) {
      // TODO!
      console.log(err);
    }
  }

  advanceTask(): void {
    this.taskProgress++;
    this.taskOneNav = Math.min(this.taskProgress, this.tasks.length);

    // if the user marked all tasks as done, display alert
    if (this.taskProgress === this.numberOfTasks + 1) {
      alert('Super! Du bist mit allen Aufgaben fertig!');
    }
  }

  async initCanvases(): Promise<any> {
    this.situationsInCurrentGame = [];
    this.situationsInCurrentGame.push([[this.board.deepCopy(), 1]]);
    await timeout(5);
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

  // /**
  //  * Function to switch the color mode from red-green to blue-yellow and vice versa.
  //  */
  // switchColorMode(): void {
  //   if (this.colorMode === 'red-green') {
  //     this.colorMode = 'blue-yellow';
  //   } else {
  //     this.colorMode = 'red-green';
  //   }
  // }

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
      // use offsetWidth, easier and more precise
      dimension = this.boardElement.nativeElement.offsetWidth * 0.55;
      canvas = p.createCanvas(dimension, dimension);

      // const x = canvas.position().x + offset.x / 2;
      // const y = canvas.position().y + offset.y / 2;
      // canvas.position(x, y);
    };

    p.draw = () => {
      drawBoardC(p, 0, 0, dimension, { r: 0, g: 145, b: 255 }, this.board);
      const winner = this.board.getWinner();
      if (winner !== undefined) {
        p.fill(0, 0, 0);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(dimension / 7);
        p.stroke(0, 0, 0);
        const yText = dimension / 2 - dimension / 14;
        if (winner === this.agent.opponent) {

          p.text('Du gewinnst!', 0, yText, dimension, dimension);
        }

        if (winner === this.agent.playerSymbol) {
          p.text('Der Agent gewinnt!', 0, yText, dimension, dimension);
        }

        if (winner === 0) {
          p.text('Unentschieden', 0, yText, dimension, dimension);
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

    p.windowResized = () => {
      p.remove();
      this.boardCanvas = new p5(this.boardSketch, 'board');

    };
  }

  treeSketch = (p) => {

    let boardDimension;
    let offsetWidth;
    let offsetHeight;
    let width;
    let height;

    p.setup = () => {
      const widthScale = 0.65;
      // use offsetWidth, easier and more precise
      width = this.treeElement.nativeElement.offsetWidth * widthScale;

      boardDimension = (3 * width) / 29;
      const offset = boardDimension / 4;
      height = 10 * boardDimension + 9 * offset;
      // TODO Elemente passen sich auf unterschiedliche width an.
      // Damit es nicht so komisch aussieht height aus width berechnen?
      p.createCanvas(width, height);  // 1150);

      offsetWidth = offset; // 20;
      offsetHeight = offset; // 2 * offsetWidth;
      // boardDimension = //Math.max(Math.min((width - 8 * offsetWidth) / 7, (height - 11 * offsetHeight) / 10), 70);
      const agentColor = { r: 220, g: 220, b: 220 }; // { r: 255, g: 229, b: 204 };
      const playerColor = { r: 248, g: 249, b: 250 };
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
        boardDimension, this.agent, this.situationsInCurrentGame);
    };

    p.windowResized = () => {
      p.remove();
      this.treeCanvas = new p5(this.treeSketch, 'tree');
    };
  }


  diagrammSketch = (p) => {
    let dimension;
    let xAxisStart;
    let yAxisStart;
    let xAxisEnd;
    let yAxisEnd;
    p.setup = () => {
      // use offsetWidth, easier and more precise
      dimension = this.boardElement.nativeElement.offsetWidth * 0.8;
      const canvas = p.createCanvas(dimension, dimension);
      p.textSize(Math.min(dimension * 0.05, dimension * 0.05));
      p.textAlign(p.CENTER);
      p.text('y: #gewonnen + #unentschieden - #verloren\n x: #Spiele ', 0, 0, dimension, dimension / 3);

      p.strokeWeight(3);
      // y-Achse
      const lineStartXyAxis = dimension / 6;
      const lineStartYyAxis = dimension / 6;
      p.line(lineStartXyAxis, lineStartYyAxis, lineStartXyAxis, dimension);
      p.line(lineStartXyAxis, lineStartYyAxis, lineStartXyAxis - 10, lineStartYyAxis + 10);
      p.line(lineStartXyAxis, lineStartYyAxis, lineStartXyAxis + 10, lineStartYyAxis + 10);

      // x-Achse
      const lineStartXxAxis = lineStartXyAxis;
      const lineStartYxAxis = (dimension + lineStartYyAxis) / 2;
      p.line(lineStartXxAxis, lineStartYxAxis, dimension - dimension / 6, lineStartYxAxis);
      p.line(dimension - dimension / 6, lineStartYxAxis, dimension - dimension / 6 - 10, lineStartYxAxis - 10);
      p.line(dimension - dimension / 6, lineStartYxAxis, dimension - dimension / 6 - 10, lineStartYxAxis + 10);

      // init the axis starting points
      xAxisStart = lineStartXyAxis;
      yAxisStart = lineStartYxAxis;
      xAxisEnd = dimension - dimension / 6;
      yAxisEnd = dimension;

      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(20);
      p.text('x', xAxisEnd + 12, yAxisStart);
      p.text('y', xAxisStart, (dimension / 6) - 12);
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

    // p.windowResized = () =>{
    //   p.remove()
    //   this.diagrammCanvas = new p5(this.diagrammSketch, 'diagram');
    // }
  }
}
