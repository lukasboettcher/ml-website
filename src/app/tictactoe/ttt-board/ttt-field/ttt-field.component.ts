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

  private drawCross(): void {
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.strokeWidth, this.strokeWidth);
    this.ctx.lineTo(this.width - this.strokeWidth, this.height - this.strokeWidth);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(this.strokeWidth, this.height - this.strokeWidth);
    this.ctx.lineTo(this.width - this.strokeWidth, this.strokeWidth);
    this.ctx.stroke();
  }

  private drawCircle(): void {
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.beginPath();
    this.ctx.arc(this.width / 2, this.height / 2, Math.min(this.width / 2, this.height / 2) - this.strokeWidth, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

}
