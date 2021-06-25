import { Component, OnInit, Output, EventEmitter, TrackByFunction } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
// import * as tfvis from '@tensorflow/tfjs-vis'
import { IMAGE_H, IMAGE_W, Data } from './data';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {

  basePath = 'assets/mnist-images';

  // vars for output and state of this component
  @Output() modelCreated = new EventEmitter<tf.LayersModel>();
  private model: tf.LayersModel = null;

  // stages for creation: getdata, create model, train, 
  stages: boolean[] = new Array(4).fill(false);

  constructor() { }

  ngOnInit(): void {
  }

  // stage 1: load data
  private dataClass: Data;
  private trainData;
  trainDataLength: number;
  private testData;

  // use the Data class from google to get mnist database
  async loadData() {
    this.dataClass = new Data();
    await this.dataClass.load();
    this.trainData = this.dataClass.getTrainData();
    this.testData = this.dataClass.getTestData();
    this.trainDataLength = this.trainData.xs.shape[0]
    this.stages[0] = true;
  }

  // stage 2: create model
  modelType: string;
  createModel(type: string) {
    this.modelType = type;
    let model: tf.Sequential = tf.sequential();

    // two types of models are offered
    if (type == 'conv') {
      /*
        Topology: best according to tensorflow documentation
        1: first layer is input to the model shape 28x28
        2: maxpooling layer to find max regions
        3: conv layer 32 filters
        4: another maxpooling
        5: conv again
        6: flatten 2d filters for next layer
        7: dense 64 neuron layer
        8: 64 -> 10 with softmax function to get probabilities
      */
      model.add(tf.layers.conv2d({
        inputShape: [IMAGE_H, IMAGE_W, 1],
        kernelSize: 3,
        filters: 16,
        activation: 'relu'
      }));
      model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
      model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: 'relu' }));
      model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
      model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: 'relu' }));
      model.add(tf.layers.flatten({}));
      model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));
    } else if (type == 'dense') {
      /*
        Topology:
        1: first layer is input to the model shape 28x28
        2: dense 42 neuron layer
        3: 64 -> 10 with softmax function to get probabilities
      */
      model.add(tf.layers.flatten({ inputShape: [IMAGE_H, IMAGE_W, 1] }));
      model.add(tf.layers.dense({ units: 42, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));
    }
    this.model = model;

    this.stages[1] = true;
    this.stages[2] = false;
    this.stages[3] = false;
  }

  // stage 3: train model
  // state
  trainingRunning: boolean = false;
  trainingDone: boolean = false;
  availBatchSizes: number[] = [80, 160, 240, 320, 640];
  availEpochs: number[] = [1, 2, 3, 5, 10];

  trainBatchSize: number = 320;
  trainEpochs: number = 3;
  trainValidationSplit: number = 0.15;

  // calculated while running
  trainBatchCount: number;
  trainTotalBatches: number;

  // accuracies calc at end for <p>
  trainValidationAcc: number;
  testValidationAcc: number;

  // parameters for ng2-charts
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Genauigkeit des Modells' },
  ];
  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'black',
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  async trainModel() {
    // reset parameters
    this.trainingDone = false;
    this.lineChartLabels = [];
    this.lineChartData[0].data = [];

    let config: tf.ModelCompileArgs = {
      optimizer: 'rmsprop',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    }
    
    this.model.compile(config);
    this.trainBatchCount = 0;
    this.trainTotalBatches = Math.ceil(this.trainData.xs.shape[0] * (1 - this.trainValidationSplit) / this.trainBatchSize) * this.trainEpochs;
    this.trainingRunning = true;

    // const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    // const container = {
    //   name: 'show.fitCallbacks',
    //   tab: 'Training',
    //   styles: {
    //     height: '1000px'
    //   }
    // };
    // const callbacks = tfvis.show.fitCallbacks(container, metrics);

    await this.model.fit(this.trainData.xs, this.trainData.labels, {
      batchSize: this.trainBatchSize,
      validationSplit: this.trainValidationSplit,
      epochs: this.trainEpochs,
      // callbacks: callbacks
      callbacks: {
        onBatchEnd: async (_, status) => {
          this.trainBatchCount++;
          this.lineChartLabels.push(this.trainBatchCount.toString());
          this.lineChartData[0].data.push(status.acc);
          //this.lineChartData[1].data.push(logs.loss);
          await tf.nextFrame();
        },
        onEpochEnd: async (_, status) => {
          this.trainValidationAcc = status.val_acc;
          await tf.nextFrame();
        }
      }
    });
    this.trainingDone = true;
    this.trainingRunning = false;
    const testResult = this.model.evaluate(this.testData.xs, this.testData.labels);
    // get last train and validation accuracy and assign them to class vars for display in template
    this.testValidationAcc = testResult[1].dataSync()[0];

    this.stages[2] = true;
    this.stages[3] = false;
  }

  // give trained model to parent
  submitModel() {
    this.modelCreated.emit(this.model);
    this.stages[3] = true;
  }
}
