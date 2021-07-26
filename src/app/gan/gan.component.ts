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

  constructor() { }

  @ViewChild('inputCanvas', { static: false })
  inputCanvas: GanCanvasComponent;
  @ViewChild('outputCanvas', { static: false })
  outputCanvas: ElementRef<HTMLCanvasElement>;

  activeCategory: string;
  canvasColor = '#9ceedd';
  canvasBrushWidth = 24;
  canvasWidth = 512;

  categories = {
    categories: [
      { name: 'Gebäude', index: 'buildings' },
      { name: 'Böden', index: 'grounds' },
      { name: 'Landschaften', index: 'landscape' },
      { name: 'Pflanzen', index: 'plants' },
    ],
    buildings: [
      { name: 'Brücke', color: '#5e5bc5' },
      { name: 'Zaun', color: '#706419' },
      { name: 'Haus', color: '#7f4502' },
      { name: 'Platform', color: '#8f2a91' },
      { name: 'Dach', color: '#9600b1' },
      { name: 'Wand-Ziegel', color: '#aad16a' },
      { name: 'Wand-Stein', color: '#ae2974' },
      { name: 'Wand-Holz', color: '#b0c1c3' },
    ],
    grounds: [
      { name: 'Erde', color: '#6e6e28' },
      { name: 'Kies', color: '#7c32c8' },
      { name: 'Anderer Boden', color: '#7d3054' },
      { name: 'Schlamm', color: '#87716f' },
      { name: 'Gehweg', color: '#8b3027' },
      { name: 'Straße', color: '#946e28' },
      { name: 'Sand', color: '#999900' }
    ],
    landscape: [
      { name: 'Wolken', color: '#696969' },
      { name: 'Nebel', color: '#77ba1d' },
      { name: 'Hügel', color: '#7ec864' },
      { name: 'Gebirge', color: '#869664' },
      { name: 'Fluss', color: '#9364c8' },
      { name: 'Felsen', color: '#956432' },
      { name: 'See', color: '#9ac6da' },
      { name: 'Himmel', color: '#9ceedd' },
      { name: 'Schnee', color: '#9e9eaa' },
      { name: 'Stein', color: '#a1a164' },
      { name: 'Wasser', color: '#b1c8ff' },
    ],
    plants: [
      { name: 'Busch', color: '#606e32' },
      { name: 'Blume', color: '#760000' },
      { name: 'Gras', color: '#7bc800' },
      { name: 'Stroh', color: '#a2a3eb' },
      { name: 'Baum', color: '#a8c832' },
      // { name: 'Wood', color: '#b57b00' },
    ]
  };

  ngOnInit(): void {
  }

}
