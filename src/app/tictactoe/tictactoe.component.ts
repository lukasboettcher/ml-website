import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { Board } from './boardModel';
import { Agent, PerfectAgent } from './agent'
import { promise } from 'selenium-webdriver';

//TODO: IMPORT FOR FUNCTIONS drawBoard(), timeout(), treeVisualization()

@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrls: ['./tictactoe.component.css']
})
export class TictactoeComponent implements OnInit {

  agent: Agent;
  board: Board;
  agent2: PerfectAgent;
  againstPerfectAgent: boolean;
  gameCounter: number;
  learningCurve: number;
  boardCanvas: p5;
  treeCanvas: p5;
  diagramCanvas: p5;
  situationsInCurrentGame:any[][][];
  colorMode: string;
  winner: number;

  constructor() { 
    this.agent = new Agent(1,2);
    this.board = new Board(1,2);
    this.agent2 = new PerfectAgent(2,1);
    this.againstPerfectAgent = false;
    this.gameCounter = 0;
    this.learningCurve = 0;
    this.situationsInCurrentGame.push([[[this.board.deepCopy(),1]]])
    this.colorMode = 'red-green'
    this.boardCanvas = new p5(this.boardSketch, 'board')
    this.treeCanvas = new p5(this.treeSketch, 'tree')
    this.diagramCanvas = new p5(this.diagramSketch, 'diagram')
    
  }

  ngOnInit(): void {
    this.agentTurn()
  }

  /**
   * Method to makes the agents turn. 
   */
  async agentTurn(): Promise<any> {
    this.treeCanvas.noLoop()
    if(this.board.currentPlayer == this.agent.playerSymbol){
        if(this.againstPerfectAgent){
            await timeout(200)//500)
        }
        let move = this.agent.chooseAction(this.board)
        addSituationsToGameTree(this.agent, this.board, move, this.situationsInCurrentGame)
        this.board.setPlayer(move)
        this.winner = this.board.getWinner()
    }
    if(this.winner != undefined){
        this.gameHasEnded()
    }else{
        this.treeCanvas.loop()
        if(this.againstPerfectAgent){
            this.perfectAgentTurn()
        }
    }
  }
  
  /**
   * Method to let the Agent learn and manage the learningcurve.
   */
  gameHasEnded(): void{
    this.treeCanvas.noLoop()
    this.winner = this.board.getWinner()
    //Game has ended
    this.agent.learn(this.winner)
    this.gameCounter++
    //document.getElementById('gameCounter').innerHTML = this.gameCounter
    if(this.winner == this.agent.opponent){
        this.learningCurve-=1
    }
    
    if(this.winner == this.agent.playerSymbol){
        this.learningCurve+=1
    }
    
    if(this.winner == 0){
        this.learningCurve+=1           
    }  
    this.treeCanvas.loop()
    this.enableBtns()
  }

  /**
   * Method to reset the current game, so a new game can be played.
   */
  resetGame(): void{
    this.boardCanvas.noLoop()
    this.treeCanvas.noLoop()
    this.againstPerfectAgent = false
    this.board.reset()
    this.agent.reset()
    this.situationsInCurrentGame = []
    this.situationsInCurrentGame.push([[this.board.deepCopy(),1]])
    this.treeCanvas.remove()
    this.treeCanvas = new p5(this.treeSketch, 'tree')
    this.boardCanvas.loop()
    this.treeCanvas.loop()
    this.agentTurn()
  }

  /**
   * Method which is called, when the human player made a move.
   */
  playerTurn(move: number[]):void{
    this.treeCanvas.noLoop()
    if(this.board.board[move[0]][move[1]] == 0){
        this.board.setPlayer([move[0],move[1]])
        this.situationsInCurrentGame.push([[this.board.deepCopy(),1]])            
        this.winner = this.board.getWinner()
    }
    if(this.winner != undefined){
        this.gameHasEnded()
    }else{
        this.agentTurn()
    }
  }

  /**
   * Method which makes the move for the alpha-beta agent.
   */
  async perfectAgentTurn():Promise<any>{
    try{
        if(this.board.currentPlayer == this.agent.opponent){
            await timeout(200)//500)
            let move = this.agent2.chooseAction(this.board)
            this.board.setPlayer(move)
            this.situationsInCurrentGame.push([[this.board.deepCopy(),1]]) 
            this.winner = this.board.getWinner()

            if(this.winner == undefined){
                this.agentTurn()
            }else{
                this.gameHasEnded()
        
            }           
        }
    }catch(err){}
  }

  /**
   * Method to set everything up for a game against the alpha-beta agent.
   */
  perfectAgentPlay():void {
    if(!this.againstPerfectAgent && this.board.getWinner() == undefined){
        this.disableBtns()
        this.againstPerfectAgent = true
        this.perfectAgentTurn()
    }else{
        this.resetGame()
        this.perfectAgentPlay()
    }
  }

  /**
   * Method to reload the page.
   */
  resetAll():void {
    location.reload()
  }

  /**
   * Method to switch the color mode from red-green to blue-yellow and vice versa.
   */
  switchColorMode():void {
    this.colorMode = this.colorMode == "red-green" ? "blue-yellow":"red-green"
  }

  /**
   * Method to disable all buttons.
   */
  disableBtns():void {
    const buttons = document.querySelectorAll('button')
    for(let button of buttons){
        button.disabled = true
    }
  }

  /**
   * Method to enable all buttons.
   */
  enableBtns():void {
    const buttons = document.querySelectorAll('button')
    for(let button of buttons){
        button.disabled = false
    }
  }

  /**
   * Create a new canvas for drawing the learning curve of the agent.
   * @param {*} p the sketch where to draw.
   */
  boardSketch(p:any):void{
    let canvas: any 

    let dimension: number 
    
    let offset: any

    let height: number

    let width: number

    p.setup = function(){
        

        height = document.getElementById('board').clientHeight 
        
        width = document.getElementById('board').clientWidth

        
        offset = {x: undefined , y: 10}
        
        dimension = Math.min(height, width) - offset.y
        
        if(height < width){
            offset.x = (width - dimension) / 2 
        }else{
            offset.x = (height - dimension) / 2
        }
        
        
        canvas = p.createCanvas(dimension, dimension)
    
        let x = offset.x
        let y = canvas.position().y + offset.y / 2
        canvas.position(x,y)

        
    }
    
    p.draw = function(){
        // if(board.isEmpty){
        //     situationsInCurrentGame.push([[board.deepCopy(),1]])
        //     agentTurn()
        // }
        drawBoard(p, 0, 0, dimension, {r:169,g:169,b:169} ,this.board)
        this.winner = this.board.getWinner()
        if(this.winner != undefined){
            p.fill(162,0,255)
            p.textAlign(p.CENTER,p.CENTER)
            p.textSize(dimension / 7)
            p.stroke(255,255,255)
            if(this.winner == this.agent.opponent){
                p.text("Du gewinnst!",0,0,dimension, dimension)
                
            }
            
            if(this.winner == this.agent.playerSymbol){
                p.text("Der Agent gewinnt!",0,0,dimension, dimension)
            }
            
            if(this.winner == 0){
                
                p.text("Unentschieden",0,0,dimension, dimension)           
            }
        }
    }

    p.mousePressed = function(){
        if(p.mouseX >= 0 && p.mouseX <= dimension  &&  p.mouseY >= 0 && p.mouseY <= dimension && this.board.currentPlayer == 2 && this.board.winner == undefined && !this.againstPerfectAgent){
            this.treeCanvas.noLoop()
            let col = Math.floor(3*p.mouseX/dimension) 
            let row = Math.floor(3*p.mouseY/dimension)
            this.playerTurn([row,col])

        }

    }
  }
  
  /**
   * Create a new canvas for representing the game tree of a game of tic-tac-toe.
   * @param {*} p the sketch where to draw.
   */
  treeSketch(p:any):void{
        
    let boardDimension: number;
    let offsetWidth: number
    let offsetHeight: number
    let width: number
    
    p.setup = function(){
        let height = document.getElementById('tree').clientHeight 
        
        width = document.getElementById('tree').clientWidth

        p.createCanvas(width, height)

        offsetWidth = 20
        offsetHeight = 2*offsetWidth 
        boardDimension = Math.max(Math.min((width-8*offsetWidth)/7,(height-11*offsetHeight)/10),70)         
        let agentColor = {r:255,g:229,b:204}
        let playerColor = {r:255,g:255,b:255}
        let maxNumberofBoardsInHeight = 10
        let x = 0
        let y = 0
        let rectHeight = boardDimension + 1/2 * offsetHeight
        let rectWidth = width

        for(let i = 0; i < maxNumberofBoardsInHeight; i++){
            p.noStroke()
            if(i%2 == 0){
                p.fill(playerColor.r, playerColor.g,playerColor.b)
                p.rect(x,y,rectWidth,rectHeight)
                p.stroke(0,0,0)
                if(i > 0){
                    p.textAlign(p.BOTTOM,p.CENTER)
                    p.textSize(boardDimension / 2)
                    p.fill(0,0,0)
                    p.text("S",x,y + 1/2 * rectHeight)
                }
            }else{
                p.fill(agentColor.r,agentColor.g,agentColor.b)
                p.rect(x,y,rectWidth,rectHeight)
                p.stroke(0,0,0)
                p.textAlign(p.BOTTOM,p.CENTER)
                p.fill(0,0,0)
                p.textSize(boardDimension / 2)
                p.text("A",x,y+1/2 * rectHeight)
            }
            y += rectHeight
            if(i == 0){
                rectHeight += 1/2 * offsetHeight
            }
        }
    }
    
    p.draw = function(){
        treeVisualization(p,width,offsetWidth,offsetHeight,this.board,boardDimension,this.agent)
    }
  }

  /**
   * Create a new canvas for drawing the learning curve of the agent.
   * @param {*} p the sketch where to draw.
   */
  diagramSketch(p:any):void{
    let width: number
    let height: number
    let xAxisStart: number
    let yAxisStart: number
    let xAxisEnd: number
    let yAxisEnd: number
    p.setup = function(){
        height = document.getElementById('diagram').clientHeight 
        
        width = document.getElementById('diagram').clientWidth

        let canvas = p.createCanvas(width, height)
        p.textSize(Math.min(height*0.05, width*0.05))
        p.textAlign(p.CENTER)
        p.text("y: #gewonnen + #unentschieden - #verloren, x: #Spiele ", 0,0, width, height/3)

        p.strokeWeight(3);
        //y-Achse
        let lineStartXyAxis = width/6
        let lineStartYyAxis = height/6
        p.line(lineStartXyAxis,lineStartYyAxis, lineStartXyAxis, height)
        p.line(lineStartXyAxis,lineStartYyAxis, lineStartXyAxis-10, lineStartYyAxis+10)
        p.line(lineStartXyAxis,lineStartYyAxis, lineStartXyAxis+10, lineStartYyAxis+10)

        //x-Achse
        let lineStartXxAxis = lineStartXyAxis 
        let lineStartYxAxis = (height+lineStartYyAxis)/2
        p.line(lineStartXxAxis,lineStartYxAxis, width - width/6,lineStartYxAxis)
        p.line(width - width/6,lineStartYxAxis,width - width/6 - 10,lineStartYxAxis-10)
        p.line(width - width/6,lineStartYxAxis,width - width/6 - 10,lineStartYxAxis+10)

        //init the axis starting points
        xAxisStart = lineStartXyAxis
        yAxisStart = lineStartYxAxis
        xAxisEnd = width - width/6
        yAxisEnd = height
        
        p.noStroke()
        p.textAlign(p.CENTER,p.CENTER)
        p.textSize(20)
        p.text('x', xAxisEnd+12, yAxisStart)
        p.text('y', xAxisStart, (height / 6) - 12)
    }

    p.draw = function(){
        let xVal = xAxisStart+5*this.gameCounter
        let yVal = yAxisStart-5*this.learningCurve   
        if(this.gameCounter > 0 && this.gameCounter % 10 == 0 && xVal < xAxisEnd){
            let yHeight = yAxisStart
            p.strokeWeight(3)
            p.stroke(0)
            p.line(xVal, yHeight + 10, xVal, yHeight - 10)
            p.noStroke()
            p.textAlign(p.CENTER,p.CENTER)
            p.textSize(18)
            p.text(this.gameCounter, xVal, yHeight + 20)
        }
        if(xVal <= xAxisEnd && yVal <= yAxisEnd && yVal >= -yAxisEnd){
            p.strokeWeight(5)
            p.stroke(0,0,255)
            p.point(xVal,yVal)
        }

    }
  }

}
