import { Component, Input, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { Tensor } from '@tensorflow/tfjs';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-mnist-eval-model',
  templateUrl: './mnist-eval-model.component.html',
  styleUrls: ['./mnist-eval-model.component.css']
})
export class MnistEvalModelComponent {

  @ViewChild(BaseChartDirective)
  chart?: BaseChartDirective;
  @Input() model: any;

  results: number[];
  prediction: number;


  barChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Wahrscheinlichkeiten',
      }
    ],
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    // animation: false,
    elements: {
      line: {
        tension: 0.5
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Vorhersage'
      }
    }
  };

  constructor() { }

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
