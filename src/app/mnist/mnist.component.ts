import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { Tensor } from '@tensorflow/tfjs';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-mnist',
  templateUrl: './mnist.component.html',
  styleUrls: ['./mnist.component.css']
})
export class MnistComponent implements OnInit {

  // vars for state of component
  // also use stages for mnist parent component
  stages: boolean[] = new Array(4).fill(false);
  currentlyLoading = false;
  doTutorial: boolean = null;
  modelLoaded = '';
  gotCustomModel = false;

  // vars for models and results
  private model: any;
  private customModel: any;
  results: number[];
  prediction: number;

  // parameters for ng2-charts
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Wahrscheinlichkeiten' }
  ];

  constructor() {
    this.results = null;
  }

  ngOnInit(): void {
  }

  // handle model loading
  async loadPretrainedModel(): Promise<void> {
    this.currentlyLoading = true;
    console.log('loading pretrained model...');
    const path = 'assets/tfjs-models/mnist-recognition/model.json';

    tf.loadLayersModel(path)
      .then(loadedModel => {
        this.model = loadedModel;
        console.log('loaded pretrained model');
        this.modelLoaded = 'pre';
        this.currentlyLoading = false;
        this.stages[0] = true;
      })
      .catch(e => console.log('failed to load model: ' + e));
  }
  async loadCustomModel(): Promise<void> {
    this.currentlyLoading = true;
    console.log('loading custom model...');
    this.model = this.customModel;
    this.modelLoaded = 'custom';
    console.log('loaded custom model...');
    this.currentlyLoading = false;
  }
  importCustomModel(model: any): void {
    this.customModel = model;
    // if custom model was previously loaded and new model is submitted,
    // load new model automatically
    if (this.modelLoaded === 'custom') {
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
    // console.log(i);
    this.convertCanvasTensor(i).then(
      t => {
        const prediction = this.model.predict(t);
        this.results = Array.from(prediction.dataSync());
        this.barChartData[0].data = this.results;
        this.prediction = this.labelData(this.results);
        // console.log(this.results);
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
