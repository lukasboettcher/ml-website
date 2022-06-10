import { Component } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { MnistData } from './data';
@Component({
  selector: 'app-gan-mnist-training',
  templateUrl: './gan-mnist-training.component.html',
  styleUrls: ['./gan-mnist-training.component.css']
})
export class GanMnistTrainingComponent {


  batchSize = 200;
  latentSize = 40;
  inputSize = 28 * 28;

  allTrue = tf.ones([this.batchSize, 1]);
  allTruePrime = tf.ones([this.batchSize, 1]).mul(tf.scalar(0.98));
  allFalse = tf.zeros([this.batchSize, 1]);

  mnstdata: MnistData;
  trainStep = 0;
  trainTotal = 4000;

  genWeights: tf.Variable[];
  genBiases: tf.Variable[];
  disWeights: tf.Variable[];
  disBiases: tf.Variable[];

  mnistReady = false;
  weightsReady = false;
  stopTraining = true;

  constructor() { }



  async loadMnist(): Promise<void> {
    this.mnstdata = new MnistData();

    this.mnstdata.load().then(() => {
      this.mnistReady = true;
    });
  }

  createWeights(): void {
    this.genWeights = [
      this.createTfVariable([this.latentSize, 140]),
      this.createTfVariable([140, 80]),
      this.createTfVariable([80, this.inputSize])
    ];
    this.genBiases = [
      this.createTfVariable([140]),
      this.createTfVariable([80]),
      this.createTfVariable([this.inputSize])
    ];

    this.disWeights = [
      this.createTfVariable([this.inputSize, 200]),
      this.createTfVariable([200, 90]),
      this.createTfVariable([90, 1])
    ];
    this.disBiases = [
      this.createTfVariable([200]),
      this.createTfVariable([90]),
      this.createTfVariable([1])
    ];
    this.trainStep = 0;
    this.weightsReady = true;
  }

  createTfVariable(shape, mean = 0, std = 0.1): tf.Variable<tf.Rank> {
    const randomVar = tf.randomNormal(shape, mean, std);
    const tfVar = tf.variable(randomVar);
    return tfVar;
  }

  createLatentVector(count: number = this.batchSize): tf.Tensor2D {
    return tf.randomNormal([count, this.latentSize], 0, 3.5);
  }

  async start(canvas: HTMLCanvasElement): Promise<void> {
    if (!this.stopTraining) {
      this.stopTraining = true;
      return;
    }
    this.stopTraining = false;

    const disOpt = tf.train.sgd(0.025);
    const genOpt = tf.train.sgd(0.025);

    for (let i = 0; this.trainStep < this.trainTotal; i++) {
      this.trainStep++;
      const real = this.mnstdata.nextTrainBatch(this.batchSize);
      const fake = this.createLatentVector();
      if (this.trainStep % 4 === 0) {
        this.sample(canvas);
      }
      const [disLoss, genLoss] = await this.trainBatch(real.xs, fake, disOpt, genOpt);
      if (this.stopTraining) {
        break;
      }
      // if (i % 50 === 0) {
      //   console.log('i', i);
      //   console.log('discriminator cost', disLoss.dataSync());
      //   console.log('generator cost', genLoss.dataSync());
      // }
      tf.dispose([disLoss, genLoss]);
    }
  }

  generator(xs): tf.Tensor {
    return tf.tidy(() => {
      const l1 = tf.leakyRelu(xs.matMul(this.genWeights[0]).add(this.genBiases[0]));
      const l2 = tf.leakyRelu(l1.matMul(this.genWeights[1]).add(this.genBiases[1]));
      const l3 = tf.tanh(l2.matMul(this.genWeights[2]).add(this.genBiases[2]));
      return l3;
    });
  }

  discriminatorReal(xs): tf.Tensor {
    return tf.tidy(() => {
      const l1 = tf.leakyRelu(xs.matMul(this.disWeights[0]).add(this.disBiases[0]));
      const l2 = tf.leakyRelu(l1.matMul(this.disWeights[1]).add(this.disBiases[1]));
      const l3 = l2.matMul(this.disWeights[2]).add(this.disBiases[2]);
      return l3;
    });
  }

  discriminatorFake(xs): tf.Tensor {
    return this.discriminatorReal(this.generator(xs));
  }

  crossEntropyFromLogits(target, output): tf.Tensor {
    return tf.tidy(() => {
      const maxOutput = tf.maximum(output, tf.zerosLike(output));
      const outputXTarget = tf.mul(output, target);
      const sigmoidOutput = tf.log(tf.add(tf.scalar(1.0), tf.exp(tf.neg(tf.abs(output)))));
      return tf.add(tf.sub(maxOutput, outputXTarget), sigmoidOutput);
    });
  }

  async trainBatch(realBatch: tf.Tensor2D, fakeBatch: tf.Tensor2D, disOpt: tf.Optimizer, genOpt: tf.Optimizer): Promise<tf.Scalar[]> {
    const disLoss = tf.tidy(() => disOpt.minimize(() => {
        const logitsReal = this.discriminatorReal(realBatch);
        const logitsFake = this.discriminatorFake(fakeBatch);

        const lossReal = this.crossEntropyFromLogits(this.allTruePrime, logitsReal);
        const lossFake = this.crossEntropyFromLogits(this.allFalse, logitsFake);
        return lossReal.add(lossFake).mean();
      }, true, this.disWeights.concat(this.disBiases)));
    await tf.nextFrame();
    const genLoss = tf.tidy(() => genOpt.minimize(() => {
        const logitsFake = this.discriminatorFake(fakeBatch);

        const lossFake = this.crossEntropyFromLogits(this.allTrue, logitsFake);
        return lossFake.mean();
      }, true, this.genWeights.concat(this.genBiases)));
    await tf.nextFrame();
    tf.dispose([realBatch, fakeBatch]);
    return [disLoss, genLoss];
  }

  async sample(canvas: HTMLCanvasElement): Promise<void> {
    const [width, height] = [28, 28];
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(width, height);

    const data = this.generator(this.createLatentVector(1)).dataSync();

    for (let i = 0; i < height * width; ++i) {
      const j = i * 4;
      imageData.data[j + 0] = data[i] * 255;
      imageData.data[j + 1] = data[i] * 255;
      imageData.data[j + 2] = data[i] * 255;
      imageData.data[j + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    tf.dispose(data);
  }
}
