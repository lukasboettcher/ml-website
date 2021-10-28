import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ttt-board',
  templateUrl: './ttt-board.component.html',
  styleUrls: ['./ttt-board.component.css']
})
export class TttBoardComponent implements OnInit {

  @Input() interactive = false;
  public states: string[];
  private playerSymbol = 'cross';
  private computerSymbol = 'circle';
  public winner = '';

  constructor() {
    this.states = Array.from({ length: 9 }, () => '');
  }

  @Input('states') set setState(s: string[]) {
    this.states = s;
  }

  ngOnInit(): void {
  }

  reset(): void {
    this.states = Array.from({ length: 9 }, () => '');
    this.winner = '';
  }

  async onFieldClicked(id: number): Promise<void> {
    if (this.interactive && !this.winner) {
      this.states[id] = this.playerSymbol;
      this.checkWinner(this.states, id, this.playerSymbol);
      this.randomComputerStep().then((cid) => {
        this.checkWinner(this.states, cid, this.computerSymbol);
      });
    }
  }

  private checkWinner(states: string[], lastMove: number, player: string): void {
    const row = Math.trunc(lastMove / 3);
    const col = lastMove - row * 3;
    for (let i = 0; i < 3; i++) {
      if (states[row * 3 + i] !== player) {
        break;
      }
      if (i === 2) {
        this.winner = player;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (states[i * 3 + col] !== player) {
        break;
      }
      if (i === 2) {
        this.winner = player;
      }
    }
    if (row === col) {
      for (let i = 0; i < 3; i++) {
        if (states[i * 3 + i] !== player) {
          break;
        }
        if (i === 2) {
          this.winner = player;
        }
      }
    }
    if (row + col === 2) {
      for (let i = 0; i < 3; i++) {
        if (states[i * 3 + 2 - i] !== player) {
          break;
        }
        if (i === 2) {
          this.winner = player;
        }
      }
    }
  }

  private async randomComputerStep(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const idxs = [];
    for (let i = 0; i < this.states.length; i++) {
      if (this.states[i] === '') {
        idxs.push(i);
      }
    }
    if (idxs.length > 0) {
      const idx = Math.floor(Math.random() * idxs.length);
      this.states[idxs[idx]] = this.computerSymbol;
      return idxs[idx];
    }
    return -1;
  }

}
