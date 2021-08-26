import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-help-button',
  templateUrl: './help-button.component.html',
  styleUrls: ['./help-button.component.css']
})
export class HelpButtonComponent {

  constructor(private modalService: NgbModal) { }



  onHelpClick(content): void {
    const modalReference = this.modalService.open(content, {
      size: 'xl',
      scrollable: true
    }).result.then(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
