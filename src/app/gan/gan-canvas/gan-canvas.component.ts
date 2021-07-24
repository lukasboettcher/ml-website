import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-gan-canvas',
  templateUrl: './gan-canvas.component.html',
  styleUrls: ['./gan-canvas.component.css']
})
export class GanCanvasComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() canvasColor = '#9ceedd';
  @Input() canvasBrushWidth = 24;
  @Input() canvasWidth;
  @Input() canvasHeight;
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;
  pos = { x: 0, y: 0, draw: false };

  ngOnInit(): void {
  }

  /*
    Functions that handle canvas manipulation
  */

  resetCanvas(): void {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.beginPath();
    this.context.fillStyle = '#9ceedd';
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight * 2 / 3);
    this.context.fillStyle = '#9ac6da';
    this.context.fillRect(0, this.canvasHeight * 2 / 3, this.canvasWidth, this.canvasHeight);
    this.context.fill();
  }

}
