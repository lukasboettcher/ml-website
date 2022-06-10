import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription, Observable, Observer, PartialObserver } from 'rxjs';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css']
})
export class MazeComponent implements OnInit, OnDestroy {

  @Input() movementObservable: Observable<string>;
  @ViewChild('maze_canvas', { static: true }) canvasRef: ElementRef;
  canvas: HTMLCanvasElement;

  location = { x: 1, y: 1 };

  board1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1],
    [1, -1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];
  board2 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, -1, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  board3 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, -1, 1, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  boards = [this.board1, this.board2, this.board3];
  private movementSubscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    const board = this.boards[Math.floor(Math.random() * this.boards.length)];
    this.draw(board);
    // subscribe to new directions and draw the movemend on a random board
    this.movementSubscription = this.movementObservable.subscribe((dir) => {
      this.move(dir, board);
      this.draw(board);
    });
  }
  ngOnDestroy(): void {
    // remove subscription after view removed
    this.movementSubscription.unsubscribe();
  }

  draw(board): void {
    const width = this.canvas.width;
    const blockOffset = width / board.length;
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, width, width);
    ctx.fillStyle = 'grey';
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        // draw wall
        if (board[y][x] === 1) {
          ctx.fillRect(x * blockOffset, y * blockOffset, blockOffset, blockOffset);
        }
        // -1 marks the target
        else if (board[y][x] === -1) {
          ctx.beginPath();
          ctx.lineWidth = 5;
          ctx.strokeStyle = 'red';
          ctx.moveTo(x * blockOffset, y * blockOffset);
          ctx.lineTo((x + 1) * blockOffset, (y + 1) * blockOffset);
          ctx.moveTo(x * blockOffset, (y + 1) * blockOffset);
          ctx.lineTo((x + 1) * blockOffset, y * blockOffset);
          ctx.stroke();
        }
      }
    }
    // draw red ball on player location
    ctx.beginPath();
    const half = blockOffset / 2;
    ctx.fillStyle = 'red';
    ctx.arc(this.location.x * blockOffset + half, this.location.y * blockOffset + half, half, 0, 2 * Math.PI);
    ctx.fill();
  }

  // checks for movement on the board
  canMove(x, y, board): boolean {
    const horizontalConstr: boolean = (x >= 0) && (x < board[y].length);
    const verticalConstr: boolean = (y >= 0) && (y < board.length);
    return verticalConstr && horizontalConstr && (board[y][x] !== 1);
  }
  move(dir: string, board): void {
    if (dir === 'oben' && this.canMove(this.location.x, this.location.y - 1, board)) {
      this.location.y--;
    } else if (dir === 'unten' && this.canMove(this.location.x, this.location.y + 1, board)) {
      this.location.y++;
    } else if (dir === 'links' && this.canMove(this.location.x - 1, this.location.y, board)) {
      this.location.x--;
    } else if (dir === 'rechts' && this.canMove(this.location.x + 1, this.location.y, board)) {
      this.location.x++;
    }
    if (board[this.location.y][this.location.x] === -1) {
      this.location = { x: 1, y: 1 };
      alert('Labyrinth Gelöst!');
    }
  }
}
