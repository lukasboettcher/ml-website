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
  }

}
