import { AfterContentInit, AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { GanCanvasComponent } from './gan-canvas/gan-canvas.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gan',
  templateUrl: './gan.component.html',
  styleUrls: ['./gan.component.css']
})
export class GanComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

}
