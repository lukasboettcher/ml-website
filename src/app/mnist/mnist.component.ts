import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as tf from '@tensorflow/tfjs';
import { Tensor } from '@tensorflow/tfjs';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-mnist',
  templateUrl: './mnist.component.html',
  styleUrls: ['./mnist.component.css']
})
export class MnistComponent {

  // vars for state of component
  // also use stages for mnist parent component
  stages: boolean[] = new Array(4).fill(false);
  currentlyLoading = false;
  doTutorial: boolean = null;
  modelLoaded = false;
  modelType = '';
  gotCustomModel = false;
  mnistbReadFirst = false;
  benchmarkTooSlow = false;
  benchmarkWarningClosed = false;

  // vars for models and results
  private model: any;
  private customModel: any;
  results: number[];
  prediction: number;

  resultsCustom: number[];
  predictionCustom: number;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Wahrscheinlichkeiten',
      }
    ],
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  };

  public barChartDataCustom: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Wahrscheinlichkeiten',
      }
    ],
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    elements: {
      line: {
        tension: 0.5
      }
    },
  };

  public barChartType: ChartType = 'bar';

  constructor(private router: Router) {
    this.results = null;

    // if not in mnistb, set the read flag to true
    if (!this.inPath('mnistb')) {
      this.mnistbReadFirst = true;
    }
  }

  inPath(...args: any[]): boolean {
    for (const arg of args) {
      if (this.router.url.includes(arg)) {
        return true;
      }
    }
    return false;
  }

  async benchmarkTensorflow(): Promise<number> {
    // const results: number[] = [];
    const nTest = 10;
    const results = new Array<number>(nTest);
    for (let i = 0; i < nTest; i++) {
      const time = await tf.time(() => {
        tf.tidy(() => {
          const x = tf.randomNormal([2000, 200]);
          const y = tf.randomNormal([200, 2000]);
          x.matMul(y);
        });
      });
      results[i] = time.wallMs;
    }
    return results.reduce((a, b) => a + b) / results.length;
  }

  // handle model loading
  async loadPretrainedModel(): Promise<void> {
    this.currentlyLoading = true;
    console.log('loading pretrained model...');
    const path = 'assets/tfjs-models/mnist-recognition/model.json';

    Promise.all([tf.loadLayersModel(path), this.benchmarkTensorflow()]).then(([loadedModel, timeMs]) => {
      if (timeMs > 150) {
        this.benchmarkTooSlow = true;
      }
      this.model = loadedModel;
      console.log('loaded pretrained model');
      this.modelLoaded = true;
      this.modelType = 'pre';
      this.currentlyLoading = false;
      this.stages[0] = true;
    }).catch(e => console.log('failed to load model: ' + e));

  }
  async loadCustomModel(): Promise<void> {
    this.currentlyLoading = true;
    console.log('loading custom model...');
    // this.model = this.customModel;
    this.modelLoaded = true;
    this.modelType = 'custom';
    console.log('loaded custom model...');
    this.currentlyLoading = false;
  }
  importCustomModel(model: any): void {
    this.customModel = model;
    // if custom model was previously loaded and new model is submitted,
    // load new model automatically
    if (this.modelType === 'custom') {
      this.loadCustomModel();
    }
    this.gotCustomModel = true;
  }

  chooseTutorial(b: boolean): void {
    this.doTutorial = b;
  }

  // get canvas image and interpret it
  // save results afterwards
  onClassify(i: ImageData): void {
    this.convertCanvasTensor(i).then(
      t => {
        const prediction = this.model.predict(t);
        this.results = Array.from(prediction.dataSync());
        this.barChartData.datasets[0].data = this.results;
        this.prediction = this.labelData(this.results);
        this.chart?.update();
      });
  }

  // get canvas image and interpret it
  // save results afterwards
  onClassifyCustom(i: ImageData): void {
    this.convertCanvasTensor(i).then(
      t => {
        const prediction = this.customModel.predict(t);
        this.resultsCustom = Array.from(prediction.dataSync());
        this.barChartDataCustom.datasets[0].data = this.resultsCustom;
        this.predictionCustom = this.labelData(this.resultsCustom);
        this.chart?.update();
      });
  }

  // convert image data into a canvas that can be interpreted by tensorflow
  async convertCanvasTensor(i: ImageData): Promise<Tensor> {
    const unit = tf.browser.fromPixels(i)
      // convert 3d tensor to 2d tensor
      .resizeNearestNeighbor([28, 28])
      // normalize data
      .mean(2).expandDims(2).expandDims()
      // flatten for nnet input
      .toFloat()
      // scale [0,255] -> [0,1]
      .div(255.);
    return unit;
  }

  // find the number for the highest probability
  labelData(d: Array<number>): number {
    // find label for most likely number
    let prob = d[0];
    let label = 0;

    for (let i = 1; i < d.length; i++) {
      if (d[i] > prob) {
        label = i;
        prob = d[i];
      }
    }
    return label;
  }
}
