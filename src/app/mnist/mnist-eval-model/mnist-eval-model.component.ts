import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-mnist-eval-model',
  templateUrl: './mnist-eval-model.component.html',
  styleUrls: ['./mnist-eval-model.component.css']
})
export class MnistEvalModelComponent {
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

}
