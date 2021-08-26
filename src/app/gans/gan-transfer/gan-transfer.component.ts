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


  styleNet: tf.GraphModel;
  transformNet: tf.GraphModel;
  mobileStyleNet: tf.GraphModel;
  inceptionStyleNet: tf.GraphModel;
  originalTransformNet: tf.GraphModel;
  separableTransformNet: tf.GraphModel;

  imageInputSrc = 'assets/gan-images/chicago.jpg';
  imageStyleLeftSrc = 'assets/gan-images/seaport.jpg';
  imageStyleRightSrc = 'assets/gan-images/udnie.jpg';

  styleText = 'Modelle werden geladen. Bitte warten..';
  styleRatio = 0.5;

  combineStyles = false;
  buttonsEnabled = false;
  outputGenerated = false;

  preImagesInput = descriptions.inputs;
  preImagesStyle = descriptions.styles;

  constructor() { }

  ngOnInit(): void {
    // initially load the stlye and transfer models
    Promise.all([
      this.loadMobileNetStyleModel(),
      this.loadSeparableTransformerModel(),
    ]).then(([styleModel, transformModel]) => {
      this.styleNet = styleModel;
      this.transformNet = transformModel;
    }).finally(() => {
      this.onDoneWithModels();
    });

  /*
   * methods for loading each model individually
   * these are then cached as instance variables to improve loading times
  */

  async loadMobileNetStyleModel(): Promise<tf.GraphModel> {
    if (!this.mobileStyleNet) {
      this.mobileStyleNet = await tf.loadGraphModel(
        'assets/gan-models/saved_model_style_js/model.json');
    }

    return this.mobileStyleNet;
  }

  async loadInceptionStyleModel(): Promise<tf.GraphModel> {
    if (!this.inceptionStyleNet) {
      this.inceptionStyleNet = await tf.loadGraphModel(
        'assets/gan-models/saved_model_style_inception_js/model.json');
    }

    return this.inceptionStyleNet;
  }

  async loadOriginalTransformerModel(): Promise<tf.GraphModel> {
    if (!this.originalTransformNet) {
      this.originalTransformNet = await tf.loadGraphModel(
        'assets/gan-models/saved_model_transformer_js/model.json'
      );
    }

    return this.originalTransformNet;
  }

  async loadSeparableTransformerModel(): Promise<tf.GraphModel> {
    if (!this.separableTransformNet) {
      this.separableTransformNet = await tf.loadGraphModel(
        'assets/gan-models/saved_model_transformer_separable_js/model.json'
      );
    }

    return this.separableTransformNet;
  }
  }

}
