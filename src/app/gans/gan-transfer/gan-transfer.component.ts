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

  async startCombinedStyleTransfer(imageInput: HTMLImageElement, imageStyleLeft: HTMLImageElement,
                                   imageStyleRight: HTMLImageElement, outputCanvas: HTMLCanvasElement): Promise<void> {
    // await tf.nextFrame();
    this.styleText = 'Generiere latente Representation von Bild 1';
    await tf.nextFrame();
    const bottleneck1: tf.Tensor = await tf.tidy(() => {
      return (this.styleNet.predict(tf.browser.fromPixels(imageStyleLeft).toFloat().div(tf.scalar(255)).expandDims()) as tf.Tensor);
    });

    this.styleText = 'Generiere latente Representation von Bild 2';
    await tf.nextFrame();
    const bottleneck2: tf.Tensor = await tf.tidy(() => {
      return (this.styleNet.predict(tf.browser.fromPixels(imageStyleRight).toFloat().div(tf.scalar(255)).expandDims()) as tf.Tensor);
    });

    this.styleText = 'Style wird angewandt';
    await tf.nextFrame();
    const combinedBottleneck: tf.Tensor = await tf.tidy(() => {
      const scaledBottleneck1 = bottleneck1.mul(tf.scalar(1 - this.styleRatio));
      const scaledBottleneck2 = bottleneck2.mul(tf.scalar(this.styleRatio));
      return scaledBottleneck1.add(scaledBottleneck2);
    });

    const stylized = await tf.tidy(() => {
      const imageInputTensor = tf.browser.fromPixels(imageInput).toFloat().div(tf.scalar(255)).expandDims();
      return (this.transformNet.predict([imageInputTensor, combinedBottleneck]) as tf.Tensor).squeeze() as tf.Tensor2D;
    });

    await tf.browser.toPixels(stylized, outputCanvas);

    bottleneck1.dispose();
    bottleneck2.dispose();
    combinedBottleneck.dispose();
    stylized.dispose();
  }
}
