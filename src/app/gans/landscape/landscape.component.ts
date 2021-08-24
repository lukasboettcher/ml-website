import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { LandscapeCanvasComponent } from './landscape-canvas/landscape-canvas.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-landscape',
  templateUrl: './landscape.component.html',
  styleUrls: ['./landscape.component.css']
})
export class LandscapeComponent implements OnInit {

  constructor() { }

  @ViewChild('inputCanvas', { static: false })
  inputCanvas: LandscapeCanvasComponent;
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
    setTimeout(() => { this.onResize(); }, 100);
  }

  // helper function to calculate rgb values from hex strings
  hexToRgb(hex): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // // helper to calculate perceived brightness of a color
  // perceivedBrightness(hex): number {
  //   const rgb = this.hexToRgb(hex);
  //   return (rgb !== null ? rgb.r * 299 + rgb.g * 587 + rgb.b * 114 : 0);
  // }

  // calculate text color based on brightness
  textColor(hex): string {
    const rgb = this.hexToRgb(hex);
    if (rgb !== null && rgb.r * 299 + rgb.g * 587 + rgb.b * 114 >= 125000) {
      return '#ffffff';
    } else {
      return '#000000';
    }
  }

  // function to download the output as an image
  downloadOutput(): void {
    const link = document.createElement('a');
    link.download = `output-${uuidv4()}.png`;
    link.href = this.outputCanvas.nativeElement.toDataURL();
    link.click();
  }


  @HostListener('window:resize', [])
  onResize(): void {
    const calculatedNewWidth = Math.min(this.inputCanvas.canvas.nativeElement.offsetWidth, 512);

    // only reset the canvas, if width - this implies scaling - is changed
    if (this.canvasWidth !== calculatedNewWidth) {
      this.canvasWidth = calculatedNewWidth;
      setTimeout(() => {
        this.inputCanvas.resetCanvas();
      }, 0);
    }
  }

  sendRequest(style: string): void {
    const dataURL = this.inputCanvas.canvas.nativeElement.toDataURL();
    const uuid = uuidv4();
    // const remoteURL: string = environment.production ? 'http://54.191.253.241:443' : '';
    // fetch(remoteURL + '/nvidia_gaugan_submit_map', {
    fetch('https://btchr.de/gan/submit', {
      method: 'post',
      body: new URLSearchParams({
        imageBase64: dataURL,
        name: uuid
      })
    }).then((res) => {
      if (res.ok) {
        // fetch(remoteURL + '/nvidia_gaugan_receive_image', {
        fetch('https://btchr.de/gan/receive', {
          method: 'post',
          body: new URLSearchParams({
            name: uuid,
            style_name: style
          })
        }).then(imageResponse => imageResponse.blob())
          .then(createImageBitmap)
          .then(image => {
            const output = document.getElementById('output');
            // console.log(image);
            this.outputCanvas.nativeElement.getContext('2d').drawImage(image, 0, 0, 512, 512);

            // let img = new Image()
            // img.onload = function () {
            //     output.getContext('2d').drawImage(this, 0, 0, 512, 512);
            // }
            // img.src = URL.createObjectURL(image)

          });
      }
    });
  }


}
