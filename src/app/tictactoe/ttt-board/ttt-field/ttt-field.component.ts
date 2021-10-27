import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ttt-field',
  templateUrl: './ttt-field.component.html',
  styleUrls: ['./ttt-field.component.css']
})
export class TttFieldComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private width = 300;
  private height = 300;
  private strokeWidth = 30;
  private state = '';

  constructor() { }

  ngOnInit(): void {
    this.canvas.nativeElement.width = this.width;
    this.canvas.nativeElement.height = this.height;
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  }
}
