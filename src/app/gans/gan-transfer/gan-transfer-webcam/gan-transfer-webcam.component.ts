import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
@Component({
  selector: 'app-gan-transfer-webcam',
  templateUrl: './gan-transfer-webcam.component.html',
  styleUrls: ['./gan-transfer-webcam.component.css']
})
export class GanTransferWebcamComponent implements OnInit, AfterViewInit {

  @ViewChild('video')
  public video: ElementRef<HTMLVideoElement>;

  @Output() newImage = new EventEmitter<string>();

  captureTaken = false;
  noWebcam = false;

  constructor() { }

  ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.play();
      }).catch(() => {
        this.noWebcam = true;
        console.warn('Keine Webcam erkannt.');
      });
    }
  }

}
