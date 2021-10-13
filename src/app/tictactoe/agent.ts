import { Board } from './boardModel';
/**
 * Class to create an intelligent agent object which learns via reinforcement learning for the game tic-tac-toe.
 */

class Agent {

    public opponent: number;
    public playerSymbol: number;
    private playsInCurrentGame: [string, Board][];
    private states: Board[][];
    private deletedStatesInCurrentGame: Board[];
    private hasLearned: boolean;
    private emptyKeys: string[];


    /**
     * Create a new Agent object for a game of tic-tac-toe.
     */
    constructor(playerSymbol, opponent) {
        // the integer representation of its opponent
        this.opponent = opponent;
        // its own integer representation
        this.playerSymbol = playerSymbol;
        // array to track which moves where made within a game
        this.playsInCurrentGame = [];
        // the policy of the agent
        this.states = Object();
        // tracks which states where deleted through a game
        this.deletedStatesInCurrentGame = [];
        // tracks if the learn process for a single game was finished
        this.hasLearned = false;
        // create a initial empty board for creation of the policy
        const board = new Board(this.playerSymbol, this.opponent);
        // create the policy
        this.getAllPossibleStates(board, opponent);

        // // use this to download the states Object
        // const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.states));
        // const downloadAnchorNode = document.createElement('a');
        // downloadAnchorNode.setAttribute('href', dataStr);
        // downloadAnchorNode.setAttribute('download', 'states.json');
        // document.body.appendChild(downloadAnchorNode); // required for firefox
        // downloadAnchorNode.click();
        // downloadAnchorNode.remove();

        // tracks which Keys where emptied during the learning process
        this.emptyKeys = [];
    }
    /**
     * Method to clear the possible states from empty keys and values from other keys which where learned not to make.
     * Also clears the deletedStatesInCurrentGame and playsInCurrentGame
     * attributes and resets the hasLearned attribute to false for a new game.
     */
    reset(): void {

        while (this.emptyKeys.length !== 0) {
            delete this.states[this.emptyKeys[0]];
            this.deleteValuesLeadingToKey(this.emptyKeys[0]);
            this.emptyKeys = this.emptyKeys.slice(1, this.emptyKeys.length);
        }
        this.deletedStatesInCurrentGame = [];
        this.playsInCurrentGame = [];
        this.hasLearned = false;

    }

    /**
     * Method to choose a move given a board situation.
     * Is chosen at random, when there are multiple move to choose from. Else the only possible move.
     * @returns the move, the agent makes.
     */
    chooseAction(board): number {
        const copy = board.deepCopy();
        copy.getMinimalSymmetry();
        const key = JSON.stringify(copy.board);
        // There is just the last position remaining. So no decisions possible.
        if (this.states[key] === undefined) {
            if (copy.getAvailablePositions().length > 1) {
                // Something went horribly wrong.
                // resetAll();
                // location.reload();

            }
            copy.invertBoardToActualOne();
            return copy.getAvailablePositions()[0];
        } else {
            const posMoves = this.states[key];
            let index = 0;
            if (posMoves.length > 1) {
                index = Math.floor(Math.random() * posMoves.length);
            }
            this.playsInCurrentGame.push([key, posMoves[index]]);
            const boardCopy = posMoves[index].deepCopy();
            boardCopy.inverseIndex = copy.inverseIndex;
            boardCopy.invertBoardToActualOne();
            return board.getPosition(boardCopy);
        }
    }

    /**
     * Method which learns the agent its strategy over a period of games.
     */
    learn(result): void {
        if (result === this.opponent) {
            while (!this.hasLearned) {
                const key = this.playsInCurrentGame[this.playsInCurrentGame.length - 1][0];
                const moveLeadingToLoss = this.playsInCurrentGame[this.playsInCurrentGame.length - 1][1].deepCopy();
                this.deletedStatesInCurrentGame.push(moveLeadingToLoss.deepCopy());
                const wasLastOne = this.deleteValueInKey(key, moveLeadingToLoss);
                if (wasLastOne) {
                    this.hasLearned = true;
                } else {
                    this.playsInCurrentGame = this.playsInCurrentGame.slice(0, this.playsInCurrentGame.length - 1);
                }
            }

        }
    }

    /**
     * Method to delete the value of the given board, found in key, in the strategy of the agent.
     * @returns true, if the key still have values left, else false.
     */
    deleteValueInKey(key, board): boolean {
        const deletingVal = board.deepCopy();
        deletingVal.getMinimalSymmetry();
        for (let i = 0; i < this.states[key].length; i++) {
            const state = this.states[key][i].deepCopy();
            state.getMinimalSymmetry();
            if (JSON.stringify(state.board) === JSON.stringify(deletingVal.board)) {
                delete this.states[key][i];
            }
        }
        this.states[key] = this.states[key].filter(el => el);
        if (this.states[key].length === 0) {
            this.emptyKeys.push(key);
            return false;
        }

        return true;

    }

    /**
     * Method to delete all values which represent the given board.
     */
    deleteAll(board): void {
        const copy = board.deepCopy();
        copy.getMinimalSymmetry();

        for (const k in this.states) {
            if (this.states.hasOwnProperty(k)) {
                for (let i = 0; i < this.states[k].length; i++) {
                    const copiedMinState = this.states[k][i].deepCopy();
                    copiedMinState.getMinimalSymmetry();
                    if (JSON.stringify(copy.board) === JSON.stringify(copiedMinState.board)) {
                        this.deletedStatesInCurrentGame.push(copy.deepCopy());
                        delete this.states[k][i];
                    }
                }
                this.states[k] = this.states[k].filter(el => el);

                if (this.states[k].length === 0) {
                    this.emptyKeys.push(k);
                }
            }

        }
    }

    /**
     * Method to delete all values which direct next move can lead to the given key.
     */
    deleteValuesLeadingToKey(key): void {
        const valToDelete = [];
        for (const k in this.states) {
            if (this.states.hasOwnProperty(k)) {
                const len = this.states[k].length;
                for (let i = 0; i < len; i++) {
                    const follow = this.states[k][i].getAllSymmetricalNextBoards();
                    // for (let j = 0; j < follow.length; j++) {
                    //     const copiedMinFollow = follow[j];
                    //     copiedMinFollow.getMinimalSymmetry();
                    //     if (JSON.stringify(copiedMinFollow.board) === key) {
                    //         valToDelete.push([k, this.states[k][i].deepCopy()]);
                    //     }
                    // }
                    for (const f of follow) {
                        const copiedMinFollow = f;
                        copiedMinFollow.getMinimalSymmetry();
                        if (JSON.stringify(copiedMinFollow.board) === key) {
                            valToDelete.push([k, this.states[k][i].deepCopy()]);
                        }
                    }
                }
            }

        }
        if (valToDelete.length !== 0) {
            // for (let i = 0; i < valToDelete.length; i++) {
            //     this.deleteAll(valToDelete[i][1]);
            // }
            for (const val of valToDelete) {
                this.deleteAll(val[1]);
            }
        }
    }

    /**
     * Method to create the strategy of the agent.
     */
    getAllPossibleStates(board, player): void {
        const winner = board.getWinner();
        if (winner === undefined) {
            const copy = board.deepCopy();
            copy.getMinimalSymmetry();
            const possibleNextBoards = copy.getAllSymmetricalNextBoards();
            if (player === this.opponent && possibleNextBoards.length > 1) {
                if (this.states[JSON.stringify(copy.board)] === undefined) {
                    this.states[JSON.stringify(copy.board)] = possibleNextBoards;
                }
            }
            // for (let i = 0; i < possibleNextBoards.length; i++) {
            //     this.getAllPossibleStates(possibleNextBoards[i], copy.currentPlayer);
            // }
            for (const move of possibleNextBoards) {
                this.getAllPossibleStates(move, copy.currentPlayer);
            }
        }
    }
}

/**
 * Class to create an Agent with alpha-beta strategy.
 */
class PerfectAgent {
    private playerSymbol;
    private opponent;
    constructor(playerSymbol = 2, opponent = 1) {
        this.playerSymbol = playerSymbol;
        this.opponent = opponent;
    }
    /**
     * Method to evaluate the next best move via alpha-beta tree-pruning.
     * @returns the best possible move on the current board situation.
     */
    chooseAction(board): number {
        // Call alpha beta with -inf and +inf
        const copy = board.deepCopy();
        const bestMove = this.alphaBeta(copy, this.playerSymbol, -2, 2);
        return bestMove[1];
    }
    /**
     * Alpha-Beta tree-pruning algorithm to evaluate the best possible move on a given board, for a player.
     * @param board the current board situation.
     * @param player the player whose best move should be evaluated.
     * @param alpha the lower bound.
     * @param beta the upper bound.
     * @returns the best possible move for the player.
     */
    alphaBeta(board, player, alpha, beta): [number, number] {
        let opp;
        if (player === this.playerSymbol) {
            opp = this.opponent;
        } else {
            opp = this.playerSymbol;
        }

        // case the game in current situation has ended
        // return [Ergebnis, -]
        const winner = board.getWinner();
        if (winner !== undefined) {
            if (winner === player) {
                return [1, undefined];
            }

            if (winner === opp) {
                return [-1, undefined];
            }

            if (winner === 0) {
                return [0, undefined];
            }
        }

        let bestMove;
        let bestValue = alpha;

        const possibleMoves = board.getAvailablePositions();
        // for (let i = 0; i < possibleMoves.length; i++) {

        //     const copy = board.deepCopy();
        //     copy.setPlayer(possibleMoves[i]);
        //     const result = this.alphaBeta(copy, opp, -beta, -bestValue);
        //     const value = result[0] * (-1);
        //     if (value > bestValue) {
        //         bestValue = value;
        //         bestMove = possibleMoves[i];
        //         if (bestValue >= beta) {
        //             break;
        //         }
        //     }
        // }
        for (const move of possibleMoves) {
            const copy = board.deepCopy();
            copy.setPlayer(move);
            const result = this.alphaBeta(copy, opp, -beta, -bestValue);
            const value = result[0] * (-1);
            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
                if (bestValue >= beta) {
                    break;
                }
            }
        }
        return [bestValue, bestMove];
    }

}

export { Agent, PerfectAgent };
