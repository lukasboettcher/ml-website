import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-model',
  templateUrl: './create-model.component.html',
  styleUrls: ['./create-model.component.css']
})
export class CreateModelComponent implements OnInit {

  // outputs for this component
  @Output() modelDelete = new EventEmitter();
  @Output() modelSubmitted = new EventEmitter<number[]>();
  @Output() modelSave = new EventEmitter();
  @Output() modelLoad = new EventEmitter<File[]>();
  modelForm: FormGroup;
  modelCreated: boolean = false;
  currentLayout: number[];

  // variable for the uploaded files
  modelLoaded: File = null;
  weightsLoaded: File = null;

  constructor() { }

  ngOnInit(): void {
    this.modelForm = new FormGroup({
      'layout': new FormControl("4", [Validators.required, this.isArrayForm.bind(this)])
    });
    this.modelForm.statusChanges.subscribe(
      (status) => {
        // // logging for debugging
        //console.log(status)
      }
    );
  }

  // these functions handle the button events
  onSubmit() {
    this.modelCreated = true;
    //this.modelForm.get('layout').disable();
    this.modelSubmitted.emit(this.currentLayout);
    //console.log(this.modelForm);
  }
  onDelete() {
    this.modelCreated = false;
    this.modelDelete.emit();
  }
  onSave() {
    this.modelSave.emit();
  }
  onUpload() {
    this.modelLoad.emit([this.modelLoaded[0], this.weightsLoaded[0]]);
    this.modelLoaded = null;
    this.weightsLoaded = null;
    this.modelCreated = true;
  }
  handleModelUpload(model: File) {
    this.modelLoaded = model;
  }
  handleWeightsUpload(weights: File) {
    this.weightsLoaded = weights;
  }

  // parse the form with these functions
  isArrayForm(control: FormControl): { [s: string]: boolean } {
    // validate a form by parsing the string
    try {
      this.currentLayout = this.parseArray(control.value);
    } catch (error) {
      // return error if pasing failed
      return { 'modelStringInvalid': true };
    }
    return null;
  }
  parseArray(s: string): number[] {
    // try to interpret the string as numbers list, 
    // when split at commas
    return s.trim().split(',').map(
      lsize => {
        let int = Number.parseInt(lsize.trim())
        if (int < 1) {
          throw new Error('invalid layer input');
        } else if (isNaN(int)) {
          throw new Error('invalid layer input');
        }
        return int;
      }
    );
  }
}
