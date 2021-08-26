import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import descriptions from './image-descriptions';
import * as tf from '@tensorflow/tfjs';
import { GanTransferInputComponent } from './gan-transfer-input/gan-transfer-input.component';

@Component({
  selector: 'app-gan-transfer',
  templateUrl: './gan-transfer.component.html',
  styleUrls: ['./gan-transfer.component.css']
})
export class GanTransferComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
