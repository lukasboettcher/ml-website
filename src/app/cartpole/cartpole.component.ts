import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NeuralNetwork } from './neural-network';
import * as tf from '@tensorflow/tfjs';
import { Cart } from './cart';
import { RlComponent } from './rl-component';
import { RlEnvironment } from './rl-environment';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-cartpole',
  templateUrl: './cartpole.component.html',
  styleUrls: ['./cartpole.component.css']
})
export class CartpoleComponent implements OnInit, RlComponent {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;

  // variables for helper classes
  net: NeuralNetwork;
  sim: RlEnvironment = null;

  // status parameters
  modelCreated = false;
  status = 'Warte auf Input...';
  isTraining: boolean;
  isTesting: boolean;
  simInterrupt = false;
  renderDuringTrain = false;

  // progress counters
  progressIter = 0;
  progressGames = 0;

  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Durchschnittliche Schritte pro Iteration',
      }
    ],
    labels: []
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    elements: {
      line: {
        tension: 0.5
      }
    },
  };

  lineChartType: ChartType = 'line';

  constructor(private ngZone: NgZone) {
    this.isTraining = false;
    this.isTesting = false;
  }

  ngOnInit(): void {
    // this.ngZone.runOutsideAngular(() => this.renderSimulation());
    this.context = this.canvas.nativeElement.getContext('2d');
  }

  // handle inputs from child components
  onModelDelete(): void {
    this.modelCreated = false;
    this.net = null;
    this.simInterrupt = true;
    this.lineChartData.datasets[0].data = [];
    this.lineChartData.labels = [];
    console.log('model deleted');
  }
  onModelSubmitted(layers: number[]): void {
    console.log(layers);
    this.modelCreated = true;
    // create new neuralnet from form input
    this.net = new NeuralNetwork(layers, this);
  }
  onModelSave(): void {
    this.net.downloadModel();
  }
  async onModelLoad(files: File[]): Promise<void> {
    // console.log(files[0]);
    // read model from file
    tf.loadLayersModel(
      tf.io.browserFiles([files[0], files[1]])
    ).then((model) => {
      this.net = new NeuralNetwork(model, this);
      this.modelCreated = true;
    }).catch((e) => console.log(e));
  }
  // display new point in graph for needed steps
  showGraph(x: number, y: number): void {
    this.lineChartData.datasets[0].data.push(y);
    this.lineChartData.labels.push(x.toString());
    this.chart?.update();
  }

  // handle new training instruction
  async onTrain(config: FormGroup): Promise<void> {
    this.simInterrupt = false;
    this.isTraining = true;
    // singleton instantiation
    if (this.sim === null) {
      this.sim = new Cart();
    }
    this.renderDuringTrain = config.value.render;
    this.updateInfo('Training gestartet.');
    // learning rate used in optimizer
    const opt = tf.train.adam(config.value.learn);
    this.updateIterProgress(0, config.value.iteration);
    for (let i = 0; i < config.value.iteration; i++) {
      this.updateInfo('Aktuelle Trainingsiteration: ' + i);
      if (this.simInterrupt) { // stop button was pressed
        console.log('simulation was interrupted');
        this.simInterrupt = false;
        break;
      }
      // call NeuralNetwork instance, return num of steps achieved
      const steps = await this.net.trainNetwork(
        this.sim,
        opt,
        config.value.discount,
        config.value.gamesInIter,
        config.value.steps
      );
      // display current achieved steps in graph, use average of steps per iteration
      const meanToPush = steps.reduce((x, prev) => prev + x) / steps.length;
      this.showGraph(i + 1, meanToPush);
      this.updateIterProgress(i + 1, config.value.iteration);
      await tf.nextFrame();

      if (this.simInterrupt) { // stop button was pressed
        console.log('simulation was interrupted');
        this.simInterrupt = false;
        break;
      }
    }
    this.updateInfo('Training beendet.');
    this.isTraining = false;
  }
  onStopTrain(): void {
    // interrupt training
    this.simInterrupt = true;
    this.isTraining = false;
  }

  // handle new testing instruction
  async onTest(): Promise<void> {
    this.simInterrupt = false;
    this.isTesting = true;
    this.updateInfo('Test gestartet.');
    let testEnded = false;
    const sim = new Cart();
    sim.randomizeState();
    let counter = 0;
    this.simInterrupt = false;
    while (!testEnded) {
      tf.tidy(
        () => {
          this.updateInfo('Erreichte Schritte im Test: ' + counter);
          const direction = this.net.getActions(sim.getStateTensor())[0];
          testEnded = sim.update(direction);
          this.renderDuringTrain = true;
          this.renderSimulation(sim);
        }
      );
      counter++;
      await tf.nextFrame();
      if (this.simInterrupt) {
        console.log('simulation was interrupted');
        this.simInterrupt = false;
        break;
      }
    }
    this.isTesting = false;
  }
  async onStopTest(): Promise<void> {
    console.log('stopped train');

    this.isTesting = false;
    this.simInterrupt = true;
  }

  // handle UI updates from subclasses
  updateGameProgress(current: number, total: number): void {
    this.progressGames = 100 * (current / total);
    if (current === total) {
      this.updateInfo('Gewichte im neuronalen Netz werden angepasst.');
    }
  }
  updateIterProgress(current: number, total: number): void {
    this.progressIter = 100 * (current / total);
  }
  async renderSimulation(simulator: RlEnvironment): Promise<boolean> {
    if (this.renderDuringTrain) {
      simulator.draw(this.canvas.nativeElement);
      // this.ngZone.runOutsideAngular(() => {
      //   simulator.draw(this.canvas.nativeElement);
      // });
    }
    return true;

  }
  updateInfo(message: string): void {
    this.status = message;
  }
}
