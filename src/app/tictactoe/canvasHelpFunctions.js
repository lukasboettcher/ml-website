/**
 * Function to add all possible moves of the agent to the situations in current game global variable.
 * @param {*} agent the current agent 
 * @param {*} board the current board
 * @param {*} move the actual move the agent has made.
 * @param {*} situationsInCurrentGame the global var situations in current game 
 */
function addSituationsToGameTree(agent, board, move, situationsInCurrentGame){
    let copy = board.deepCopy()
    copy.getMinimalSymmetry()
    let allNextTurns = copy.getAllSymmetricalNextBoards()
    let knownNextTurns = agent.states[JSON.stringify(copy.board)]
    
    let moveCopy = board.deepCopy()
    moveCopy.setPlayer(move)
    moveCopy.getMinimalSymmetry()
    if(knownNextTurns == undefined){
        moveCopy.invertBoardToActualOne()
        situationsInCurrentGame.push([[moveCopy.deepCopy(),2]])

    }else{
        //moveCopy.invertBoardToActualOne()
        
        let turns = []
    
        let found = false
        
        let status = undefined
    
        for(let i = 0; i < allNextTurns.length;i++){
            //allNextTurns[i].inverseIndex = copy.inverseIndex
            for(let j = 0; j < knownNextTurns.length; j++){
                if(JSON.stringify(allNextTurns[i].board) == JSON.stringify(knownNextTurns[j].board)){
                    found = true
                    let minimalNextTurn = knownNextTurns[j].deepCopy()
                    minimalNextTurn.getMinimalSymmetry()
                    if(JSON.stringify(minimalNextTurn.board) == JSON.stringify(moveCopy.board)){
                        status = 2//turns.push([allNextTurns[i],2])
                    }else{
                        status = 1//turns.push([allNextTurns[i],1])
                    }
                    break
                }
            }
            if(!found){
                status = 0//turns.push([allNextTurns[i],0])
            }
            found = false
    
            // let invertedNextTurn = allNextTurns[i].deepCopy()
            // invertedNextTurn.inverseIndex = copy.inverseIndex
            // invertedNextTurn.invertBoardToActualOne()
            allNextTurns[i].inverseIndex = copy.inverseIndex
            allNextTurns[i].invertBoardToActualOne()
            turns.push([allNextTurns[i], status])
            status = undefined
        }
    
        for(let i = 0; i < turns.length; i++){
            for(let j = i+1; j < turns.length; j++){
                if(turns[i][1] == 0 && turns[j][1] != 0){
                    let temp = turns[i]
                    turns[i] = turns[j]
                    turns[j] = temp
                }
            }
        }

        situationsInCurrentGame.push(turns)
    }
    
   
}

/**
 * Own timeout function to await the execution of the next line of code. 
 * @param {*} ms milliseconds to wait before the next line of code will be executed 
 * @returns a promise
 */
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Draws the game tree for learning visualization. 
 * @param {*} p the canvas to draw on.
 * @param {*} width the canvas width
 * @param {*} offsetWidth the offset width for the boardrows
 * @param {*} offsetHeight the offset height for the boards on different levels.
 * @param {*} board the board which should be drawn
 * @param {*} boardDimension the dimension of the board.
 * @param {*} agent the agent of the game. 
 */
async function treeVisualization(p, width, offsetWidth, offsetHeight, board, boardDimension, agent){

    try{
        for(let i = 0; i < situationsInCurrentGame.length; i++){
            let xCoordinate = (width - situationsInCurrentGame[i].length * boardDimension - (situationsInCurrentGame[i].length - 1) * offsetWidth) / 2
            drawBoardRow(p, xCoordinate,i*(boardDimension + offsetHeight) ,boardDimension,situationsInCurrentGame[i],i,width, offsetWidth)
        }
        
        if(board.winner == agent.opponent && agent.hasLearned){
            p.noLoop()
            for(let i = 0; i < situationsInCurrentGame.length; i++){
                let xCoordinate = (width - situationsInCurrentGame[i].length * boardDimension - (situationsInCurrentGame[i].length - 1) * offsetWidth) / 2
                drawBoardRow(p, xCoordinate,i*(boardDimension + offsetHeight),boardDimension,situationsInCurrentGame[i],i,width,offsetWidth)
            }
            let timer = 50
            for(let i = situationsInCurrentGame.length - 1; i >= 0; i--){
                for(let j = 0; j < situationsInCurrentGame[i].length; j++){
                    let copy = situationsInCurrentGame[i][j][0].deepCopy()
                    copy.getMinimalSymmetry()
                    let found = false
                    for(let delIndex = agent.deletedStatesInCurrentGame.length-1; delIndex >= 0; delIndex--){
                        let stateCopy = agent.deletedStatesInCurrentGame[delIndex]
                        stateCopy.getMinimalSymmetry()
                        if(JSON.stringify(copy.board) == JSON.stringify(stateCopy.board) && situationsInCurrentGame[i][j][1] == 2){
                            found = true
                            if(colorMode=="red-green"){
                                let red = 0
                                let green = 255
                                let shift = 17
                                let blue = 0
                                let xCoordinate = (width - situationsInCurrentGame[i].length * boardDimension - (situationsInCurrentGame[i].length - 1) * offsetWidth) / 2 + j*(boardDimension + offsetWidth)
                                let yCoordinate = (i)*(boardDimension + offsetHeight)
                                while(green > 0 && red <= 255){
                                    drawBoard(p, xCoordinate, yCoordinate, boardDimension, {r:red,g: green, b:blue}, situationsInCurrentGame[i][j][0].deepCopy())
                                    
                                    await timeout(timer)
        
                                
                                    if(blue < 255 && red < 255){
                                        blue += shift
                                        red += shift
                                    }else{
                                        green -= shift
                                        blue -= shift
                                    }
                                }
                            }else{
                                let red = 0
                                let blue = 255
                                let green = 0
                                let shift = 17
                                let xCoordinate = (width - situationsInCurrentGame[i].length * boardDimension - (situationsInCurrentGame[i].length - 1) * offsetWidth) / 2 + j*(boardDimension + offsetWidth)
                                let yCoordinate = (i)*(boardDimension + offsetHeight)
                                while(blue > 0){
                                    drawBoard(p, xCoordinate, yCoordinate, boardDimension, {r:red,g: green, b:blue}, situationsInCurrentGame[i][j][0].deepCopy())
                                    
                                    await timeout(timer)
        
                                    if(green < 255 && red < 255){
                                        green += shift
                                        red += shift
                                    }else{
                                        blue -= shift
                                    }
                                }
                            }
                            break
                        }
                    }
                    if(found && agent.deletedStatesInCurrentGame.length > 0){
                        agent.deletedStatesInCurrentGame.slice(0,agent.deletedStatesInCurrentGame.length-1)
                        found = false
                    }
                }
            }   
    
        }

    }catch(err){
        treeVisualization(p, width, offsetWidth, offsetHeight, board, boardDimension, agent)
        //catched the case that the tree visualization wasn't completely finished when restart the game. Has no impact on game or agent.  
    }
}

/**
 * Draws the rows of the board in the game tree visualization. 
 * @param {*} canvas the canvas where the board should be drawn on. 
 * @param {*} startX the start x koordinate of the first board.
 * @param {*} startY the start y koordinate of the first board.
 * @param {*} boardDimension the board dimension. 
 * @param {*} boardArray the array with all board which should be drawn in this row.
 * @param {*} index index of the place of the boardArray in the situations global var.
 * @param {*} width the complete width of the canvas. 
 * @param {*} offsetWidth where the first board should be draw. 
 */
async function drawBoardRow(canvas, startX, startY, boardDimension, boardArray, index, width, offsetWidth){
    try{

        let posX = startX
        let posY = startY
        let color
        let timer = 80
        for(let i = 0; i < boardArray.length;i++){
            if(boardArray[i][1] == 0){
                if(colorMode == "red-green"){
                    color = {r:255,g:0,b:0}
                }else{
                    color = {r:255,g:255,b:0}
                }
            }else{
                if(boardArray[i][1] == 2){
                    if(colorMode == "red-green"){
                        color = {r:0, g:255, b: 0}
                    }else{
                        color = {r:0,g:0,b:255}
                    }
                }else{
                    color = {r:255, g:255, b:255}
                }
            }
            drawBoard(canvas, posX, posY, boardDimension, color, boardArray[i][0])
            if(boardArray.length == 1 && index >= 1){
                let yAxis = 0
                for(let j=0; j < situationsInCurrentGame[index-1].length;j++){
                    if(situationsInCurrentGame[index-1][j][1] == 2){
                        yAxis = j
                        break
                    }
                }
                
                let previousXStart = (width - situationsInCurrentGame[index-1].length * boardDimension - (situationsInCurrentGame[index-1].length - 1) * offsetWidth) / 2
                canvas.strokeWeight(1)
                canvas.line(startX+(1/2)*boardDimension+ i * (offsetWidth + boardDimension), startY, previousXStart + boardDimension/2 + (yAxis)*(boardDimension + offsetWidth), startY - 2*offsetWidth)
                
                
            }else{
                if(boardArray[i][1] != 0){
                    canvas.strokeWeight(1)
                    canvas.line(startX+(1/2)*boardDimension+ i * (offsetWidth + boardDimension), startY, (1/2)*width, startY - 2*offsetWidth)
                }
            }
            
            await timeout(timer)
            posX+= boardDimension + offsetWidth
        }
    }catch(err){
        //nothing todo because than just the visualization hasnt finished. New Game will fix it. 
    }
}

/**
 * Function to draw a single board with white background.
 * @param {*} canvas the canvas the board should be drawn onto.
 * @param {*} posX starting x coordinate of the board.
 * @param {*} posY starting y coordinate of the board.
 * @param {*} dimension the dimension or size of the board.
 * @param {*} board the board which should be drawn. 
 */
function drawBoard(canvas, posX, posY, dimension, board){
    drawBoard(canvas, posX, posY, dimension, {r: 255, g: 255, b: 255}, board)
}

/**
 * Function to draw a single board.
 * @param {*} canvas the canvas the board should be drawn onto.
 * @param {*} posX starting x coordinate of the board.
 * @param {*} posY starting y coordinate of the board.
 * @param {*} dimension the dimension or size of the board.
 * @param {*} color the color of the board.
 * @param {*} board the board which should be drawn. 
 */
function drawBoard(canvas, posX, posY, dimension, color, board){
    canvas.strokeWeight(2)
    canvas.fill(color.r,color.g,color.b)
    canvas.rect(posX,posY,dimension,dimension)
    
    canvas.noFill()
    canvas.stroke(0,0,0)
    canvas.strokeWeight(2)
    canvas.line(posX+dimension/3,posY, posX+dimension/3, posY+dimension)
    canvas.line(posX+2*dimension/3, posY,posX+2*dimension/3, posY+dimension)
    canvas.line(posX, posY+dimension/3, posX+dimension, posY+dimension/3)
    canvas.line(posX, posY+2*dimension/3, posX+dimension, posY+2*dimension/3)
    
    let borderOffset = 0.1*(dimension / 3) 

    for(let i = 0; i < board.dimension;i++){
        for(let j = 0; j < board.dimension;j++){
            let x = (dimension / 3)*j + posX 
            let y = (dimension / 3)*i + posY 
            let spot = board.board[i][j]
            if(spot == board.p1){
                canvas.line(x+borderOffset,y+borderOffset,x+dimension/3 - borderOffset,y+dimension/3-borderOffset)
                canvas.line(x+borderOffset, y+dimension/3 - borderOffset, x + dimension/3 - borderOffset,y+borderOffset)

            }else{
                if(spot == board.p2){
                    canvas.circle(x+dimension/6,y+dimension/6, dimension/3-borderOffset)
                }
            }
        }
    }
}
