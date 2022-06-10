import { Component, OnInit, ViewChild, ElementRef, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { CanvasStore } from './canvas-store';

@Component({
  selector: 'app-draw-digit',
  templateUrl: './draw-digit.component.html',
  styleUrls: ['./draw-digit.component.css']
})
export class DrawDigitComponent implements OnInit {

  @Input() modelLoaded = false;
  @Output() classify = new EventEmitter<ImageData>();
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;
  canvasStore: CanvasStore;
  isPenDown: boolean;

  constructor() {
    this.canvasStore = new CanvasStore();
    this.isPenDown = false;
  }

  // listen for touch/mouse events that add to the canvas,
  // then store the positions of the input
  @HostListener('mousedown', ['$event.clientX', '$event.clientY'])
  onMouseDown(x: number, y: number): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const xpos = x - rect.left;
    const ypos = y - rect.top;
    this.isPenDown = true;
    this.canvasStore.push(xpos, ypos, false);
    this.draw();
  }

  @HostListener('touchstart', ['$event.touches[0].clientX', '$event.touches[0].clientY', '$event'])
  onTouchDown(x: number, y: number, e: any): void {
    if (e.target === this.canvas.nativeElement) {
      e.preventDefault();
    }
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const xpos = x - rect.left;
    const ypos = y - rect.top;
    this.isPenDown = true;
    this.canvasStore.push(xpos, ypos, false);
    this.draw();
  }

  @HostListener('mousemove', ['$event.clientX', '$event.clientY'])
  onMouseMove(x: number, y: number): void {
    if (this.isPenDown) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const xpos = x - rect.left;
      const ypos = y - rect.top;
      this.canvasStore.push(xpos, ypos, true);
      this.draw();
    }
  }

  @HostListener('touchmove', ['$event.touches[0].clientX', '$event.touches[0].clientY', '$event'])
  onTouchMove(x: number, y: number, e: any): void {
    if (e.target === this.canvas.nativeElement) {
      e.preventDefault();
    }
    if (this.isPenDown) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const xpos = x - rect.left;
      const ypos = y - rect.top;
      this.canvasStore.push(xpos, ypos, true);
      this.draw();
    }
  }

  // all the events that stop the draw process
  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchleave')
  onMouseLeave(): void {
    this.isPenDown = false;
  }

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.style.backgroundColor = 'black';
    this.canvas.nativeElement.width = 300;
    this.canvas.nativeElement.height = 300;
  }

  onClear(): void {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.canvasStore.clear();
  }
  onSubmit(): void {
    this.classify.emit(this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height));
  }

  private draw(): void {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    // this draws 20px wide white line on black bg
    // this mimicks the mnist dataset for best classification
    this.context.strokeStyle = 'white';
    this.context.lineWidth = 20;
    this.context.lineJoin = 'round';

    // draw all lines stored
    const values = this.canvasStore.values();
    for (let i = 0; i < values.length; i++) {
      this.context.beginPath();
      if (values[i].drag && i) {
        this.context.moveTo(values[i - 1].x, values[i - 1].y);
      } else {
        this.context.moveTo(values[i].x - 1, values[i].y);
      }
      this.context.lineTo(values[i].x, values[i].y);
      this.context.closePath();
      this.context.stroke();
    }
  }
}
