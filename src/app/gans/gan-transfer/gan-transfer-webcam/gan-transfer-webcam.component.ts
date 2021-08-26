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
}
