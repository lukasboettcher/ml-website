import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
@Component({
  selector: 'app-gan-transfer-webcam',
  templateUrl: './gan-transfer-webcam.component.html',
  styleUrls: ['./gan-transfer-webcam.component.css']
})
export class GanTransferWebcamComponent implements OnInit, AfterViewInit {
  @Output() newImage = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
}
