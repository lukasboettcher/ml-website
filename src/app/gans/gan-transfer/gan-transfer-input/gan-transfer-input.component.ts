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

  @ViewChild('image') image: ElementRef<HTMLImageElement>;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  async onSelectChange(element: HTMLImageElement, select: HTMLSelectElement, uploadElem: HTMLInputElement): Promise<void> {
    const value = select.value;
    if (value === 'file') {
      console.log('file selected');
      uploadElem.onchange = (evt) => {
        const f = (evt.target as HTMLInputElement).files[0];
        const fileReader = new FileReader();
        fileReader.onload = ((e) => {
          element.src = (e.target.result as string);
        });
        fileReader.readAsDataURL(f);
        uploadElem.value = '';
      };
      uploadElem.click();
    } else if (value === 'pic') {
      // handle this explicitly on the click event
    } else if (value === 'random') {
      const randomNumber = Math.floor(Math.random() * links.length);
      element.src = links[randomNumber];
    } else if (value !== '') {
      element.src = 'assets/gan-images/' + value + '.jpg';
    }
    // reset the select at the end
    select.value = '';
  }
  onNewImage(imageData: string): void {
    this.image.nativeElement.src = imageData;
  }

}
