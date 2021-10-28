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
  }

  onFieldClicked(id: number): void {
    if (this.interactive) {
      this.states[id] = this.playerSymbol;
      setTimeout(this.randomComputerStep.bind(this), 100);
      // this.randomComputerStep();
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
