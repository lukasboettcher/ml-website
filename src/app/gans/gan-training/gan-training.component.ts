import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
// import { ACGAN } from "./acgan";
import { loadMnistData, sampleFromMnistData } from '../../mnist/tutorial/data';

@Component({
  selector: 'app-gan-training',
  templateUrl: './gan-training.component.html',
  styleUrls: ['./gan-training.component.css']
})
export class GanTrainingComponent implements OnInit {

  MODEL_PATH = 'assets/gan-models/mnist-acgan/model.json';
  LATENT_DIM = 100;

  pretrainedModel: tf.LayersModel;
  modelsLoaded = false;
  loopId;

  latentRange = 0;
  currFaceModel: tf.LayersModel;
  currFaceModelUrl = '';
  faceModelReady = false;
  faceModelLoading = false;
  stop = true;
  faceImageFactor = 0;

  sliderParams: { shape: number[], shift: tf.Tensor, freq: tf.Tensor };

  listFaceModels = [
    {
      path: 'https://storage.googleapis.com/store.alantian.net/tfjs_gan/chainer-dcgan-celebahq-64/tfjs_SmoothedGenerator_50000/model.json',
      desc: 'dcgan 16 Megabyte',
      factor: 4
    },
    {
      path: 'https://storage.googleapis.com/store.alantian.net/tfjs_gan/chainer-resent128-celebahq-128/tfjs_SmoothedGenerator_20000/model.json',
      desc: 'resent128 252 Megabyte',
      factor: 2
    },
    {
      path: 'https://storage.googleapis.com/store.alantian.net/tfjs_gan/chainer-resent256-celebahq-256/tfjs_SmoothedGenerator_40000/model.json',
      desc: 'resent256 252 Megabyte',
      factor: 1
    }
  ];


  constructor() { }

  ngOnInit(): void {
    Promise.all([this.loadPretrained(), loadMnistData()]).then(() => {
      this.modelsLoaded = true;
    });
  }

  async loadPretrained(): Promise<void> {
    this.pretrainedModel = await tf.loadLayersModel(this.MODEL_PATH);
  }

  sampleLoop(genCanvas: HTMLCanvasElement, realCanvas: HTMLCanvasElement): void {
    if (this.loopId) {
      clearInterval(this.loopId);
      this.loopId = null;
    } else {
      this.loopId = setInterval(() => {
        this.sampleFromBoth(genCanvas, realCanvas);
      }, 100);
    }
  }

  // stopLoop(): void {
  //   if (this.loopId) {
  //     clearInterval(this.loopId);
  //     this.loopId = null;
  //   }
  // }

  async sampleFromBoth(genCanvas: HTMLCanvasElement, realCanvas: HTMLCanvasElement): Promise<void> {
    await this.sampleFromPretrained(genCanvas);
    await this.sampleFromMnist(realCanvas);
  }

  async sampleFromPretrained(genCanvas: HTMLCanvasElement): Promise<void> {
    if (this.pretrainedModel) {
      const generatedImages = tf.tidy(() => {
        const classLabels = tf.tensor2d([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [10, 1]);
        const latentVector = tf.randomUniform([10, this.LATENT_DIM]);

        const modelOutput = (this.pretrainedModel.predict([latentVector, classLabels]) as tf.Tensor).add(1).div(2);
        return tf.concat(tf.unstack(modelOutput), 1) as tf.Tensor2D;
      });

      await tf.browser.toPixels(generatedImages, genCanvas);

      tf.dispose(generatedImages);
    }
  }

  async sampleFromMnist(realCanvas: HTMLCanvasElement): Promise<void> {
    const combinedReals = sampleFromMnistData(5);
    await tf.browser.toPixels(combinedReals, realCanvas);
    tf.dispose(combinedReals);
  }

  //////////////////////////////////////////////////////

  async onFaceModelChange(): Promise<void> {
    this.faceImageFactor = this.listFaceModels.find(model => model.path === this.currFaceModelUrl).factor;
    this.faceModelLoading = true;
    this.faceModelReady = false;
    this.stop = true;

    this.currFaceModel = await tf.loadLayersModel(this.currFaceModelUrl);

    // this.currFaceModel.summary();


    const [shape, shift, freq] = tf.tidy(() => {
      const inputShape = this.currFaceModel.inputs[0].shape.slice(1);
      const input = tf.randomNormal(inputShape).expandDims(0);
      const variance = tf.randomNormal(inputShape, 0, .1).expandDims(0);
      this.currFaceModel.predict(input);
      return [inputShape, input, variance];
    });

    this.sliderParams = {
      shape,
      shift,
      freq
    };
    this.faceModelLoading = false;
    this.faceModelReady = true;
  }

  async onFaceLatentChange(value: string, canvas: HTMLCanvasElement): Promise<void> {
    const input = Number.parseInt(value, 10);
    const output = tf.tidy(() => {
      const z = tf.sin(tf.scalar(input).mul(this.sliderParams.freq).add(this.sliderParams.shift));
      const y = (this.currFaceModel.predict(z) as tf.Tensor2D).squeeze().transpose([1, 2, 0]).div(tf.scalar(2)).add(tf.scalar(.5));
      return this.imageResize(y as tf.Tensor2D, this.faceImageFactor);
    });

    await tf.browser.toPixels(output, canvas);
  }

  abort(): void {
    this.stop = true;
  }

  generate(canvas: HTMLCanvasElement): void {
    const output = tf.tidy(() => {
      const z = tf.randomNormal([1, 128]);
      const y = (this.currFaceModel.predict(z) as tf.Tensor2D).squeeze().transpose([1, 2, 0]).div(tf.scalar(2)).add(tf.scalar(0.5));
      // return image_enlarge(y, 4);
      return this.imageResize(y as tf.Tensor2D, this.faceImageFactor);

    });
    tf.browser.toPixels(output, canvas);
  }

  async animate(canvas: HTMLCanvasElement): Promise<void> {
    if (!this.stop) {
      this.stop = true;
      return;
    }
    this.stop = false;
    const inputShape = this.currFaceModel.inputs[0].shape.slice(1);
    const shift = tf.randomNormal(inputShape).expandDims(0);
    const freq = tf.randomNormal(inputShape, 0, .1).expandDims(0);

    let i = 0;
    while (i < 400) {
      if (this.stop) {
        break;
      }
      i++;
      const output = tf.tidy(() => {
        const z = tf.sin(tf.scalar(i).mul(freq).add(shift));
        const y = (this.currFaceModel.predict(z) as tf.Tensor2D).squeeze().transpose([1, 2, 0]).div(tf.scalar(2)).add(tf.scalar(.5));
        return this.imageResize(y as tf.Tensor2D, this.faceImageFactor);
      });

      await tf.browser.toPixels(output, canvas);
      await tf.nextFrame();
    }
  }

  imageResize(y: tf.Tensor2D, factor: number): tf.Tensor2D {
    if (factor === 1) {
      return y;
    }
    const size = y.shape[0];
    return y.expandDims(2).tile([1, 1, factor, 1]
    ).reshape([size, size * factor, 3]
    ).expandDims(1).tile([1, factor, 1, 1]
    ).reshape([size * factor, size * factor, 3]);
  }

}
