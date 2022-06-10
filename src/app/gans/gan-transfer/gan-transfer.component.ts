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

  @ViewChild('inputImg') inputImg: GanTransferInputComponent;
  @ViewChild('style1') style1: GanTransferInputComponent;
  @ViewChild('style2') style2: GanTransferInputComponent;
  @ViewChild('outputCanvas')
  outputCanvas: ElementRef<HTMLCanvasElement>;

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
  }

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

  // this handles the selection of low/high quality models
  async updateModels(variant: string): Promise<void> {
    this.buttonsEnabled = false;
    let modelPromises: Promise<tf.GraphModel>[];
    if (variant === 'low') {
      this.loadMobileNetStyleModel().then(model => {
        this.styleNet = model;
      });
      modelPromises = [this.loadMobileNetStyleModel(), this.loadOriginalTransformerModel()];
    } else if (variant === 'high') {
      modelPromises = [this.loadInceptionStyleModel(), this.loadSeparableTransformerModel()];
    }
    Promise.all(modelPromises).then(([styleModel, transformModel]) => {
      this.styleNet = styleModel;
      this.transformNet = transformModel;
    }).catch(e => console.log).finally(() => {
      this.onDoneWithModels();
    });
  }

  // callback when model changes done
  // reenables the buttons
  onDoneWithModels(): void {
    this.buttonsEnabled = true;
    this.styleText = 'Transferiere Style';
  }

  /*
   * methods for invoking the neural networks
   * either apply a single style
   * or combine two styles and apply that to an
   * input image
  */

  async onStyleSubmit(output: HTMLCanvasElement): Promise<void> {
    const inputImg = this.inputImg.image.nativeElement;
    const style1Img = this.style1.image.nativeElement;
    const style2Img = this.style2.image.nativeElement;

    this.buttonsEnabled = false;

    if (this.combineStyles) {
      await this.startCombinedStyleTransfer(inputImg, style1Img, style2Img, output);
    } else {
      await this.startStyleTransfer(inputImg, style1Img, output);
    }
    this.outputGenerated = true;
    this.onDoneWithModels();
  }

  async startStyleTransfer(imageInput: HTMLImageElement, imageStyle: HTMLImageElement, outputCanvas: HTMLCanvasElement): Promise<void> {
    await tf.nextFrame();
    this.styleText = 'Generiere latente Representation';
    await tf.nextFrame();

    let bottleneck: tf.Tensor = await tf.tidy(() => (this.styleNet.predict(tf.browser.fromPixels(imageStyle).toFloat().div(tf.scalar(255)).expandDims()) as tf.Tensor));

    // if the ratio is < 1, the original style must be taken into account
    if (this.styleRatio !== 1.0) {
      this.styleText = 'Generiere 100D identity style Representation';
      await tf.nextFrame();
      const identityBottleneck: tf.Tensor = await tf.tidy(() => (this.styleNet.predict(tf.browser.fromPixels(imageInput).toFloat().div(tf.scalar(255)).expandDims()) as tf.Tensor));
      const styleBottleneck: tf.Tensor = bottleneck;
      bottleneck = await tf.tidy(() => {
        const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(this.styleRatio));
        const identityBottleneckScaled = identityBottleneck.mul(tf.scalar(1.0 - this.styleRatio));
        return styleBottleneckScaled.add(identityBottleneckScaled);
      });
      styleBottleneck.dispose();
      identityBottleneck.dispose();
    }

    this.styleText = 'Style wird angewandt';
    await tf.nextFrame();

    // apply the style to the original image
    const stylized: tf.Tensor2D = await tf.tidy(() => {
      const imageInputTensor = tf.browser.fromPixels(imageInput).toFloat().div(tf.scalar(255)).expandDims();
      return (this.transformNet.predict([imageInputTensor, bottleneck]) as tf.Tensor).squeeze() as tf.Tensor2D;
    });

    await tf.browser.toPixels(stylized, outputCanvas);

    bottleneck.dispose();
    stylized.dispose();
  }

  async startCombinedStyleTransfer(imageInput: HTMLImageElement, imageStyleLeft: HTMLImageElement,
    imageStyleRight: HTMLImageElement, outputCanvas: HTMLCanvasElement): Promise<void> {
    // await tf.nextFrame();
    this.styleText = 'Generiere latente Representation von Bild 1';
    await tf.nextFrame();
    const bottleneck1: tf.Tensor = await tf.tidy(() => (this.styleNet.predict(tf.browser.fromPixels(imageStyleLeft).toFloat().div(tf.scalar(255)).expandDims()) as tf.Tensor));

    this.styleText = 'Generiere latente Representation von Bild 2';
    await tf.nextFrame();
    const bottleneck2: tf.Tensor = await tf.tidy(() => (this.styleNet.predict(tf.browser.fromPixels(imageStyleRight).toFloat().div(tf.scalar(255)).expandDims()) as tf.Tensor));

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
