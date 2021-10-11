/**
 * Create a new canvas for representing the board of a game of tic-tac-toe.
 * @param {*} p the sketch where to draw.
 */
var boardSketch = function(p){
    
    let canvas 

    let dimension 
    
    let offset

    let height

    let width

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
        drawBoard(p, 0, 0, dimension, {r:169,g:169,b:169} ,board)
        let winner = board.getWinner()
        if(winner != undefined){
            p.fill(162,0,255)
            p.textAlign(p.CENTER,p.CENTER)
            p.textSize(dimension / 7)
            p.stroke(255,255,255)
            if(winner == agent.opponent){
                p.text("Du gewinnst!",0,0,dimension, dimension)
                
            }
            
            if(winner == agent.playerSymbol){
                p.text("Der Agent gewinnt!",0,0,dimension, dimension)
            }
            
            if(winner == 0){
                
                p.text("Unentschieden",0,0,dimension, dimension)           
            }
        }
    }

    p.mousePressed = function(){
        if(p.mouseX >= 0 && p.mouseX <= dimension  &&  p.mouseY >= 0 && p.mouseY <= dimension && board.currentPlayer == 2 && board.winner == undefined && !againstPerfectAgent){
            treeCanvas.noLoop()
            let col = Math.floor(3*p.mouseX/dimension) 
            let row = Math.floor(3*p.mouseY/dimension)
            playerTurn([row,col])

        }

    }

    // p.windowResized = function(){
        
    //     height = document.getElementById('board').clientHeight
    //     width = document.getElementById('board').clientWidth
              
    //     dimension = Math.min(height, width) - offset.y
        
    //     if(height < width){
    //         offset.x = (width - dimension) / 2 
    //     }else{
    //         offset.x = (height - dimension) / 2
    //     }
        
        
    //     p.resizeCanvas(dimension, dimension)
    //     let x = offset.x
    //     let y = canvas.position().y //+ offset.y / 2
    //     canvas.position(x,y)
        
        
    // }
    
}

/**
 * Create a new canvas for representing the game tree of a game of tic-tac-toe.
 * @param {*} p the sketch where to draw.
 */
var treeSketch = function(p){
    
    let boardDimension
    let offsetWidth
    let offsetHeight
    let width
    
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
        treeVisualization(p,width,offsetWidth,offsetHeight,board,boardDimension,agent)
    }
}

/**
 * Create a new canvas for drawing the learning curve of the agent.
 * @param {*} p the sketch where to draw.
 */
var diagrammSketch = function(p){
    let width
    let height
    let xAxisStart
    let yAxisStart
    let xAxisEnd
    let yAxisEnd
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
        let xVal = xAxisStart+5*gameCounter
        let yVal = yAxisStart-5*learningCurve   
        if(gameCounter > 0 && gameCounter % 10 == 0 && xVal < xAxisEnd){
            let yHeight = yAxisStart
            p.strokeWeight(3)
            p.stroke(0)
            p.line(xVal, yHeight + 10, xVal, yHeight - 10)
            p.noStroke()
            p.textAlign(p.CENTER,p.CENTER)
            p.textSize(18)
            p.text(gameCounter, xVal, yHeight + 20)
        }
        if(xVal <= xAxisEnd && yVal <= yAxisEnd && yVal >= -yAxisEnd){
            p.strokeWeight(5)
            p.stroke(0,0,255)
            p.point(xVal,yVal)
        }

    }
}






