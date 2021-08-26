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

  constructor() { }

  ngOnInit(): void {
    Promise.all([this.loadPretrained(), loadMnistData()]).then(() => {
      this.modelsLoaded = true;
    });
  }

  async loadPretrained(): Promise<void> {
    this.pretrainedModel = await tf.loadLayersModel(this.MODEL_PATH);
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
