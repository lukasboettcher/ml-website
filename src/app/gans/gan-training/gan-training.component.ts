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
  stop = true;

  sliderParams: { shape: number[], shift: tf.Tensor, freq: tf.Tensor };

  listFaceModels = [
    {
      path: 'https://storage.googleapis.com/store.alantian.net/tfjs_gan/chainer-dcgan-celebahq-64/tfjs_SmoothedGenerator_50000/model.json',
      desc: 'dcgan'
    },
    {
      path: 'https://storage.googleapis.com/store.alantian.net/tfjs_gan/chainer-resent128-celebahq-128/tfjs_SmoothedGenerator_20000/model.json',
      desc: 'resent128'
    },
    {
      path: 'https://storage.googleapis.com/store.alantian.net/tfjs_gan/chainer-resent256-celebahq-256/tfjs_SmoothedGenerator_40000/model.json',
      desc: 'resent256'
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
    const combinedReals = sampleFromMnistData(10);
    await tf.browser.toPixels(combinedReals, realCanvas);
    tf.dispose(combinedReals);
  }

}
