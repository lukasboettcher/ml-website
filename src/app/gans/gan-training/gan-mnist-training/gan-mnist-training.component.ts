import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { MnistData } from './data';
@Component({
  selector: 'app-gan-mnist-training',
  templateUrl: './gan-mnist-training.component.html',
  styleUrls: ['./gan-mnist-training.component.css']
})
export class GanMnistTrainingComponent implements OnInit {


  BATCH = 200;
  SIZE = 28;
  INPUT_SIZE = this.SIZE * this.SIZE;
  SEED_SIZE = 40;
  SEED_STD = 3.5;
  ONES = tf.ones([this.BATCH, 1]);
  ONES_PRIME = tf.ones([this.BATCH, 1]).mul(tf.scalar(0.98));
  ZEROS = tf.zeros([this.BATCH, 1]);
  DISCRIMINATOR_LEARNING_RATE = 0.025;
  GENERATOR_LEARNING_RATE = 0.025;
  dOptimizer = tf.train.sgd(this.DISCRIMINATOR_LEARNING_RATE);
  gOptimizer = tf.train.sgd(this.GENERATOR_LEARNING_RATE);
  mnstdata;
  trainStep = 0;
  G1w;
  G1b;
  G2w;
  G2b;
  G3w;
  G3b;
  D1w;
  D1b;
  D2w;
  D2b;
  D3w;
  D3b;

  stopTraining = true;

  varInitNormal = (shape, mean = 0, std = 0.1) => tf.variable(tf.randomNormal(shape, mean, std));
  varLoad = (shape, data) => tf.variable(tf.tensor(shape, data));
  seed = (s = this.BATCH) => tf.randomNormal([s, this.SEED_SIZE], 0, this.SEED_STD);

  constructor() { }

  ngOnInit(): void {

    console.log(tf.version);
    this.mnstdata = new MnistData();

    this.G1w = this.varInitNormal([this.SEED_SIZE, 140]);
    this.G1b = this.varInitNormal([140]);
    this.G2w = this.varInitNormal([140, 80]);
    this.G2b = this.varInitNormal([80]);
    this.G3w = this.varInitNormal([80, this.INPUT_SIZE]);
    this.G3b = this.varInitNormal([this.INPUT_SIZE]);

    this.D1w = this.varInitNormal([this.INPUT_SIZE, 200]);
    this.D1b = this.varInitNormal([200]);
    this.D2w = this.varInitNormal([200, 90]);
    this.D2b = this.varInitNormal([90]);
    this.D3w = this.varInitNormal([90, 1]);
    this.D3b = this.varInitNormal([1]);
  }

  async start(canvas: HTMLCanvasElement): Promise<void> {
    this.stopTraining = false;
    await this.mnstdata.load();
    // let i = 0;
    // for (let i = 0; i < 1375; i++) {
    while (true) {
      this.trainStep++;
      const real = this.mnstdata.nextTrainBatch(200);
      const fake = this.seed();
      if (this.trainStep % 2 === 0) {
        this.sample(canvas);
      }
      const [dcost, gcost] = await this.trainBatch(real.xs, fake);
      if (this.stopTraining) {
        break;
      }
      // if (i % 50 === 0 || i === (200 - 1)) {
      //   console.log('i', i);
      //   console.log('discriminator cost', dcost.dataSync());
      //   console.log('generator cost', gcost.dataSync());
      // }
      // i++;
    }
  }




  gen(xs): tf.Tensor {

    const l1 = tf.leakyRelu(xs.matMul(this.G1w).add(this.G1b));
    const l2 = tf.leakyRelu(l1.matMul(this.G2w).add(this.G2b));
    const l3 = tf.tanh(l2.matMul(this.G3w).add(this.G3b));
    return l3;

    // return gen_net.predict(xs)
  }

  disReal(xs): [tf.Tensor, tf.Tensor] {
    const l1 = tf.leakyRelu(xs.matMul(this.D1w).add(this.D1b));
    const l2 = tf.leakyRelu(l1.matMul(this.D2w).add(this.D2b));
    const logits = l2.matMul(this.D3w).add(this.D3b);
    const output = tf.sigmoid(logits);
    return [logits, output];
  }

  disFake(xs): [tf.Tensor, tf.Tensor] {
    return this.disReal(this.gen(xs));
  }

  // Copied from tensorflow core
  sigmoidCrossEntropyWithLogits(target, output): tf.Tensor {
    return tf.tidy(() => {
      const maxOutput = tf.maximum(output, tf.zerosLike(output));
      const outputXTarget = tf.mul(output, target);
      const sigmoidOutput = tf.log(tf.add(tf.scalar(1.0), tf.exp(tf.neg(tf.abs(output)))));
      const result = tf.add(tf.sub(maxOutput, outputXTarget), sigmoidOutput);
      return result;
    });
  }

  // Single batch training
  async trainBatch(realBatch, fakeBatch): Promise<[tf.Scalar, tf.Scalar]> {
    const dcost = this.dOptimizer.minimize(() => {
      const [logitsReal, outputReal] = this.disReal(realBatch);
      const [logitsFake, outputFake] = this.disFake(fakeBatch);

      const lossReal = this.sigmoidCrossEntropyWithLogits(this.ONES_PRIME, logitsReal);
      const lossFake = this.sigmoidCrossEntropyWithLogits(this.ZEROS, logitsFake);
      return lossReal.add(lossFake).mean();
    }, true, [this.D1w, this.D1b, this.D2w, this.D2b, this.D3w, this.D3b]);
    await tf.nextFrame();

    const gcost = this.gOptimizer.minimize(() => {
      const [logitsFake, outputFake] = this.disFake(fakeBatch);

      const lossFake = this.sigmoidCrossEntropyWithLogits(this.ONES, logitsFake);
      return lossFake.mean();
    }, true, [this.G1w, this.G1b, this.G2w, this.G2b, this.G3w, this.G3b]);
    await tf.nextFrame();

    return [dcost, gcost];
  }

  async oldsample(canvas: HTMLCanvasElement): Promise<void> {
    await tf.nextFrame();
    const options = {
      width: this.SIZE,
      height: this.SIZE
    };

    canvas.width = options.width;
    canvas.height = options.height;
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(options.width, options.height);
    const data = this.gen(this.seed(1)).dataSync();

    // Undo tanh
    /*
    for (let i=0; i < data.length; i++) {
      data[i] = 0.5 * (data[i]+1.0);
    }
    */

    const unflat = this.unflatten(data, options);
    for (let i = 0; i < unflat.length; i++) {
      imageData.data[i] = unflat[i];
    }
    ctx.putImageData(imageData, 0, 0);
  }

  unflatten(data, options): number[] {
    const w = options.width || 0;
    const h = options.height || 0;
    const unflat = [];
    for (let i = 0; i < 2 * w * h; ++i) {
      const val = data[i];
      unflat.push(data[i] * 255);
      unflat.push(data[i] * 255);
      unflat.push(data[i] * 255);
      unflat.push(255);
    }
    return unflat;
  }

  async sample(canvas: HTMLCanvasElement): Promise<void> {
    // const [width, height] = [28, 28];
    // canvas.width = width;
    // canvas.height = height;
    // const ctx = canvas.getContext('2d');
    // const imageData = new ImageData(2 * width, 2 * height);
    // const data = this.gen(this.seed(1)).dataSync();
    // console.log(data);

    // const asignValue = (idx, val, imgData) => {
    //   imgData.data[idx] = val;
    //   imgData.data[idx + 1] = val;
    //   imgData.data[idx + 2] = val;
    //   imgData.data[idx + 3] = 255;
    // };

    // for (let i = 0; i < height; ++i) {
    //   for (let j = 0; j < width; ++j) {
    //     const index = i * height + j;
    //     const val = data[index];
    //     asignValue(i * 2 * height + j * 2, val, imageData);
    //     asignValue((i + 1) * 2 * height + j * 2, val, imageData);
    //     asignValue(i * 2 * height + (j + 1) * 2, val, imageData);
    //     asignValue((i + 1) * 2 * height + (j + 1) * 2, val, imageData);
    //   }
    //   // const j = i * 4;
    //   // imageData.data[j + 0] = data[i] * 255;
    //   // imageData.data[j + 1] = data[i] * 255;
    //   // imageData.data[j + 2] = data[i] * 255;
    //   // imageData.data[j + 3] = 255;
    // }
    // ctx.putImageData(imageData, 0, 0);

    const [width, height] = [28, 28];
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(width, height);
    const data = this.gen(this.seed(1)).dataSync();
    for (let i = 0; i < height * width; ++i) {
      const j = i * 4;
      imageData.data[j + 0] = data[i] * 255;
      imageData.data[j + 1] = data[i] * 255;
      imageData.data[j + 2] = data[i] * 255;
      imageData.data[j + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
