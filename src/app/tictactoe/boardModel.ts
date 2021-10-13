
/**
 * Class to create a board of the game tic-tac-toe.
 */
class Board {
    public board: number[][];
    private p1: number;
    private p2: number;
    public dimension: number;
    public currentPlayer: number;
    public winner;
    public isEmpty: boolean;
    public symmetries: number[][];
    public inverseIndex: number;

    constructor(p1, p2) {
        /**
         * The board representation as a matrix.
         */
        this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        /**
         * Representation of the player 1.
         */
        this.p1 = p1;

        /**
         * Representation of the player 2.
         */
        this.p2 = p2;

        /**
         * Dimension of a classic tic-tac-toe board.
         */
        this.dimension = 3;

        /**
         * The current player. p1 is always startingplayer.
         */
        this.currentPlayer = this.p1;

        /**
         * The current winner.
         */
        this.winner = undefined;

        /**
         * Flag to check if the current board is empty.
         */
        this.isEmpty = true;

        /**
         * All possible symmetries of a tic tac toe board.
         */
        this.symmetries = [[0, 1, 2, 3, 4, 5, 6, 7, 8], // r_0 id = t(r_0)
        [2, 1, 0, 5, 4, 3, 8, 7, 6], // s_2 t(s_2)
        [6, 3, 0, 7, 4, 1, 8, 5, 2], // r_3 t(r_3)
        [0, 3, 6, 1, 4, 7, 2, 5, 8], // s_3 t(s_3)
        [8, 7, 6, 5, 4, 3, 2, 1, 0], // r_2 t(r_2)
        [6, 7, 8, 3, 4, 5, 0, 1, 2], // s_0 t(s_0)
        [2, 5, 8, 1, 4, 7, 0, 3, 6], // r_1 t(r_1)
        [8, 5, 2, 7, 4, 1, 6, 3, 0]]; // s_1 t(s_1)

        /**
         * Tracks which symmertrie was used.
         */
        this.inverseIndex = 0;


    }

    /**
     * Function to get all available positions of the board.
     * @returns all available positions of the board.
     */
    getAvailablePositions(): number[] {
        const positions = [];
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                if (this.board[i][j] === 0) {
                    positions.push([i, j]);
                }
            }
        }
        return positions;
    }

    /**
     * Method to check of there is a current winner.
     * @returns the current winner.
     */
    getWinner(): number {
        this.winner = this.checkWinner();
        return this.winner;
    }

    /**
     * Checks if the game has ended yet and if there is a winner.
     * @returns this.p1 if player1 has won, this.p2 if player2 has won, 0 if its a draw and undefined if the game hasn´t ended yet.
     */
    checkWinner(): number {
        // Checks the rows for a winner
        for (let row = 0; row < this.dimension; row++) {
            let horizontalSum = 0;
            for (let column = 0; column < this.dimension; column++) {
                if (this.board[row][column] === this.p1) {
                    horizontalSum += 1;
                } else {
                    if (this.board[row][column] === this.p2) {
                        horizontalSum -= 1;
                    }
                }
            }
            if (horizontalSum === this.dimension) {
                return this.p1;
            }
            if (horizontalSum === -this.dimension) {
                return this.p2;
            }
        }

        // checks the columns for a winner
        for (let column = 0; column < this.dimension; column++) {
            let verticalSum = 0;
            for (let row = 0; row < this.dimension; row++) {
                if (this.board[row][column] === this.p1) {
                    verticalSum += 1;
                } else {
                    if (this.board[row][column] === this.p2) {
                        verticalSum -= 1;
                    }
                }
            }
            if (verticalSum === this.dimension) {
                return this.p1;
            }
            if (verticalSum === -this.dimension) {
                return this.p2;
            }
        }

        // checks the diagonals for a winner
        let diagonalSum = 0;
        for (let diag = 0; diag < this.dimension; diag++) {
            if (this.board[diag][diag] === this.p1) {
                diagonalSum += 1;
            } else {
                if (this.board[diag][diag] === this.p2) {
                    diagonalSum -= 1;
                }
            }
        }

        if (diagonalSum === this.dimension) {
            return this.p1;
        }
        if (diagonalSum === -this.dimension) {
            return this.p2;
        }

        let diagonalSum2 = 0;
        for (let row = 0; row < this.dimension; row++) {
            if (this.board[row][this.dimension - row - 1] === this.p1) {
                diagonalSum2 += 1;
            } else {
                if (this.board[row][this.dimension - row - 1] === this.p2) {
                    diagonalSum2 -= 1;
                }
            }
        }

        if (diagonalSum2 === this.dimension) {
            return this.p1;
        }
        if (diagonalSum2 === -this.dimension) {
            return this.p2;
        }

        // checks if it´s a draw
        if (this.getAvailablePositions().length === 0) {
            return 0;
        }

        // case that the game hasn´t ended yet
        return undefined;

    }


    /**
     * Places the current Player to the current board and changes the current player to the next player.
     */
    setPlayer(position): void {
        const row = position[0];
        const column = position[1];

        this.board[row][column] = this.currentPlayer;

        if (this.currentPlayer === this.p1) {
            this.currentPlayer = this.p2;
        } else {
            this.currentPlayer = this.p1;
        }
        this.isEmpty = false;
    }

    /**
     * Copies this board object.
     * @returns a new board object which is a copy of this board object.
     */
    deepCopy(): Board {
        const newBoard = new Board(this.p1, this.p2);
        newBoard.board = JSON.parse(JSON.stringify(this.board));
        newBoard.currentPlayer = this.currentPlayer;
        newBoard.inverseIndex = this.inverseIndex;
        newBoard.isEmpty = this.isEmpty;
        return newBoard;
    }

    /**
     * Calculates the position of the made move between this board and the other board.
     * @returns The position which was done to get from this board to the other board or vice versa.
     */

    getPosition(other): number[] {
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                if (this.board[i][j] !== other.board[i][j]) {
                    return [i, j];
                }
            }
        }
    }

    /**
     * Method which transforms this board in its minimal representation.
     */
    getMinimalSymmetry(): void {
        // array for all symmetrical boards
        const symmetricalBoards = [];

        // decimal values for the symmetrical Board
        const stateValues = [];
        let symmBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let symmBoardRepr = [];

        // for (let i = 0; i < this.symmetries.length; i++) {
        //     for (let sym = 0; sym < this.symmetries[i].length; sym++) {
        //         const bIdx = getTrinary(sym);
        //         const symmIndex = getTrinary(this.symmetries[i][sym]);
        //         symmBoard[bIdx[0]][bIdx[1]] = this.board[symmIndex[0]][symmIndex[1]];
        //         symmBoardRepr.push(this.board[symmIndex[0]][symmIndex[1]]);
        //     }
        //     symmetricalBoards.push(symmBoard);
        //     const values = getDecimal(symmBoardRepr);
        //     stateValues.push(values);
        //     symmBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        //     symmBoardRepr = [];
        // }
        for (const symRow of this.symmetries) {
            for (let sym = 0; sym < symRow.length; sym++) {
                const bIdx = getTrinary(sym);
                const symmIndex = getTrinary(symRow[sym]);
                symmBoard[bIdx[0]][bIdx[1]] = this.board[symmIndex[0]][symmIndex[1]];
                symmBoardRepr.push(this.board[symmIndex[0]][symmIndex[1]]);
            }
            symmetricalBoards.push(symmBoard);
            const values = getDecimal(symmBoardRepr);
            stateValues.push(values);
            symmBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
            symmBoardRepr = [];
        }

        const minIndex = stateValues.indexOf(Math.min(...stateValues));
        this.inverseIndex = minIndex;
        this.board = symmetricalBoards[minIndex];
    }

    /**
     * Method which transforms this board in its original representation.
     */
    invertBoardToActualOne(): void {
        const actualBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < this.symmetries[this.inverseIndex].length; i++) {
            const idx = getTrinary(i);
            const symmIndex = getTrinary(this.symmetries[this.inverseIndex][i]);
            actualBoard[symmIndex[0]][symmIndex[1]] = this.board[idx[0]][idx[1]];
        }
        this.board = actualBoard;
    }

    /**
     * Method to calculate all following boards.
     * @returns an array with all possible nextBoards.
     */
    getAllSymmetricalNextBoards(): Board[] {
        const pos = this.getAvailablePositions();
        const nsb = [];
        const right = [];

        // for (let i = 0; i < pos.length; i++) {
        //     const copy = this.deepCopy();
        //     copy.setPlayer(pos[i]);
        //     copy.getMinimalSymmetry();
        //     if (!contains(nsb, copy)) {
        //         nsb.push(copy.deepCopy());
        //         copy.invertBoardToActualOne();
        //         right.push(copy);
        //     }
        // }
        for (const p of pos) {
            const copy = this.deepCopy();
            copy.setPlayer(p);
            copy.getMinimalSymmetry();
            if (!contains(nsb, copy)) {
                nsb.push(copy.deepCopy());
                copy.invertBoardToActualOne();
                right.push(copy);
            }
        }

        return right;
    }

    /**
     * Resets the current board object.
     */
    reset(): void {
        this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.winner = undefined;
        this.currentPlayer = this.p1;
        this.isEmpty = true;
        this.inverseIndex = 0;
    }

}


////////////////////////////////////////////////////////////////
////////////////////// Help functions
/**
 * Converts decimal number to trinary number.
 * @returns the converted decimal number.
 */
function getDecimal(trinary): number {
    let decimal = 0;
    let exponent = trinary.length - 1;
    // for (let i = 0; i < trinary.length; i++) {
    //     decimal += trinary[i] * (3 ** exponent);
    //     exponent -= 1;
    // }
    for (const elem of trinary) {
        decimal += elem * (3 ** exponent);
        exponent -= 1;
    }
    return decimal;
}

/**
 * Calculates a given decimal number to its trinary representation (with at least two bit).
 * @returns an array as the decimals trinary representation where the first index is the MSB
 */
function getTrinary(decimal): number[] {
    const trinary = [];
    let rest = 0;
    while (decimal > 0) {
        rest = decimal % 3;
        trinary.push(rest);
        decimal = Math.floor(decimal / 3);
    }
    if (trinary.length === 0) {
        trinary.push(0);
        trinary.push(0);
    } else {
        if (trinary.length === 1) {
            trinary.push(0);
        }
    }
    return trinary.reverse();
}

/**
 * Searches an array for a boardobject.
 * @returns true if the arr contains the boardobject else false.
 */
function contains(arr, boardObject): boolean {
    // for (let i = 0; i < arr.length; i++) {
    //     if (JSON.stringify(arr[i].board) === JSON.stringify(boardObject.board)) {
    //         return true;
    //     }
    // }
    for (const elem of arr) {
        if (JSON.stringify(elem.board) === JSON.stringify(boardObject.board)) {
            return true;
        }
    }
    return false;
}

export {Board, getDecimal, getTrinary, contains};
