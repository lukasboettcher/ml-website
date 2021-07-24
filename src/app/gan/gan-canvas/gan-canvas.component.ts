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

  ngOnInit(): void {
  }

}
