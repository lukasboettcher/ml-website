import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import links from '../image-links';

@Component({
  selector: 'app-gan-transfer-input',
  templateUrl: './gan-transfer-input.component.html',
  styleUrls: ['./gan-transfer-input.component.css']
})
export class GanTransferInputComponent implements OnInit {

  @Input() imgSrc = '';
  @Input() inputDisabled = true;
  @Input() listOfImages = [];
  @Input() description = '';

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }


}
