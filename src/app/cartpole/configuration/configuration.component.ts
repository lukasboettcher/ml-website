import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  // in and outputs for this component
  @Input() modelCreated = false;
  @Input() isTraining = false;
  @Input() isTesting = false;
  @Output() configSubmitted = new EventEmitter<FormGroup>();
  @Output() stopTrain = new EventEmitter();
  @Output() test = new EventEmitter();
  @Output() stopTest = new EventEmitter();

  configurationForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    // this handles the form for parameters
    this.configurationForm = new FormGroup({
      iteration: new FormControl(30, [Validators.required, Validators.min(1)]),
      gamesInIter: new FormControl(20, [Validators.required, Validators.min(1)]),
      steps: new FormControl(500, [Validators.required, Validators.min(100)]),
      discount: new FormControl(0.95, [Validators.required, Validators.min(0), Validators.max(1)]),
      learn: new FormControl(0.05, [Validators.required, Validators.min(0), Validators.max(1)]),
      render: new FormControl(false),
    });
    this.configurationForm.statusChanges.subscribe(
      (status) => {
        // // logging for debugging
        // console.log(status)
      }
    );
  }

  // form was submitted
  onSubmit(): void {
    console.log(this.configurationForm);
    if (!this.isTraining) {
      this.configSubmitted.emit(this.configurationForm);
    } else {
      this.stopTrain.emit();
    }
  }

  // user clicked on test
  onTest(): void {
    // console.log('clicked test');
    if (!this.isTesting) {
      // console.log('currently not testing, starting');
      this.test.emit();
      // this.configurationForm.disable();
    } else {
      // console.log('currently testing, stopping');
      this.stopTest.emit();
      // this.configurationForm.enable();
    }
  }

}
