import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { MnistData } from './data';
@Component({
  selector: 'app-gan-mnist-training',
  templateUrl: './gan-mnist-training.component.html',
  styleUrls: ['./gan-mnist-training.component.css']
})
export class GanMnistTrainingComponent implements OnInit {


  BATCH_SIZE = 200;
  LATENT_SIZE = 40;
  SIZE = 28;
  INPUT_SIZE = 28 * 28;

  ALL_TRUE = tf.ones([this.BATCH_SIZE, 1]);
  ALL_TRUE_PRIME = tf.ones([this.BATCH_SIZE, 1]).mul(tf.scalar(0.98));
  ALL_FALSE = tf.zeros([this.BATCH_SIZE, 1]);

  mnstdata: MnistData;
  trainStep = 0;
  trainTotal = 4000;

  GEN_WEIGHTS: tf.Variable[];
  GEN_BIASES: tf.Variable[];
  DIS_WEIGHTS: tf.Variable[];
  DIS_BIASES: tf.Variable[];

  mnistReady = false;
  stopTraining = true;

  constructor() { }

  ngOnInit(): void {
    this.loadMnist();
    this.createWeights();
  }

  async loadMnist(): Promise<void> {
    this.mnstdata = new MnistData();

    this.mnstdata.load().then(() => {
      this.mnistReady = true;
    });
  }

  createWeights(): void {
    this.GEN_WEIGHTS = [
      this.createTfVariable([this.LATENT_SIZE, 140]),
      this.createTfVariable([140, 80]),
      this.createTfVariable([80, this.INPUT_SIZE])
    ];
    this.GEN_BIASES = [
      this.createTfVariable([140]),
      this.createTfVariable([80]),
      this.createTfVariable([this.INPUT_SIZE])
    ];

    this.DIS_WEIGHTS = [
      this.createTfVariable([this.INPUT_SIZE, 200]),
      this.createTfVariable([200, 90]),
      this.createTfVariable([90, 1])
    ];
    this.DIS_BIASES = [
      this.createTfVariable([200]),
      this.createTfVariable([90]),
      this.createTfVariable([1])
    ];
  }

  createTfVariable(shape, mean = 0, std = 0.1): tf.Variable<tf.Rank> {
    const randomVar = tf.randomNormal(shape, mean, std);
    const tfVar = tf.variable(randomVar);
    return tfVar;
  }

  createLatentVector(count: number = this.BATCH_SIZE): tf.Tensor2D {
    return tf.randomNormal([count, this.LATENT_SIZE], 0, 3.5);
  }

  async start(canvas: HTMLCanvasElement): Promise<void> {
    this.stopTraining = false;

    const disOpt = tf.train.sgd(0.025);
    const genOpt = tf.train.sgd(0.025);

    for (let i = 0; this.trainStep < this.trainTotal; i++) {
      this.trainStep++;
      const real = this.mnstdata.nextTrainBatch(this.BATCH_SIZE);
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
      const l1 = tf.leakyRelu(xs.matMul(this.GEN_WEIGHTS[0]).add(this.GEN_BIASES[0]));
      const l2 = tf.leakyRelu(l1.matMul(this.GEN_WEIGHTS[1]).add(this.GEN_BIASES[1]));
      const l3 = tf.tanh(l2.matMul(this.GEN_WEIGHTS[2]).add(this.GEN_BIASES[2]));
      return l3;
    });
  }

  discriminatorReal(xs): tf.Tensor {
    return tf.tidy(() => {
      const l1 = tf.leakyRelu(xs.matMul(this.DIS_WEIGHTS[0]).add(this.DIS_BIASES[0]));
      const l2 = tf.leakyRelu(l1.matMul(this.DIS_WEIGHTS[1]).add(this.DIS_BIASES[1]));
      const l3 = l2.matMul(this.DIS_WEIGHTS[2]).add(this.DIS_BIASES[2]);
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
    const disLoss = tf.tidy(() => {
      return disOpt.minimize(() => {
        const logitsReal = this.discriminatorReal(realBatch);
        const logitsFake = this.discriminatorFake(fakeBatch);

        const lossReal = this.crossEntropyFromLogits(this.ALL_TRUE_PRIME, logitsReal);
        const lossFake = this.crossEntropyFromLogits(this.ALL_FALSE, logitsFake);
        return lossReal.add(lossFake).mean();
      }, true, this.DIS_WEIGHTS.concat(this.DIS_BIASES));
    });
    await tf.nextFrame();
    const genLoss = tf.tidy(() => {
      return genOpt.minimize(() => {
        const logitsFake = this.discriminatorFake(fakeBatch);

        const lossFake = this.crossEntropyFromLogits(this.ALL_TRUE, logitsFake);
        return lossFake.mean();
      }, true, this.GEN_WEIGHTS.concat(this.GEN_BIASES));
    });
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
