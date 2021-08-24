import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import * as mnet from '@tensorflow-models/mobilenet';
import * as knn from '@tensorflow-models/knn-classifier';
import * as tf from '@tensorflow/tfjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-classify',
  templateUrl: './classify.component.html',
  styleUrls: ['./classify.component.css']
})
export class ClassifyComponent implements OnInit {

  images = [1, 2, 3, 4].map((n) => `assets/classify-images/coco${n}.png`);

  constructor(private renderer: Renderer2) {
    // this.initiateModels();
  }

  // variables for the models
  private model: mnet.MobileNet;
  knn: knn.KNNClassifier;
  startedLoading = false;
  modelsLoaded = false;

  @ViewChild('video', { static: true }) videoElement: ElementRef;
  private webcam;

  // state of component
  private videoWidth;
  private videoHeight;
  webcamStarted = false;
  classifyNotInterrupted = true;
  solveMaze = false;
  showMazeControl = false;
  result = '';
  probabilities: { [label: string]: number; } = {};

  // camera settings
  constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 500 },
      height: { ideal: 300 }
    }
  };

  // solve maze
  moveSubject: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.webcam = this.videoElement.nativeElement;
  }

  async initiateModels(): Promise<void> {
    this.startedLoading = true;
    this.model = await mnet.load();
    this.knn = await knn.create();
    console.log('models loaded');
    this.modelsLoaded = true;
  }

  onLoadedData(): void {
    // only start detecting frames of video element ready
    console.log('video loaded');
    this.detectFrames();
  }

  startWebcam(): void {
    // proceed only if camera is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(this.constraints)
        .then((stream) => {
          // set srcObject property
          const vid = this.videoElement.nativeElement;
          this.renderer.setProperty(vid, 'srcObject', stream);
          this.renderer.listen(vid, 'play', (event) => {
            // save dimensions of webcam video
            this.videoHeight = vid.videoHeight;
            this.videoWidth = vid.videoWidth;
          });
          this.webcamStarted = true;
        })
        .catch((e) => {
          console.log(e);
          // error in promise
          alert('Fehler beim Laden des Videos!');
        });
    } else {
      // no camera on device
      alert('Keine Kamera gefunden!');
    }
  }

  stopClassify(): void {
    this.classifyNotInterrupted = !this.classifyNotInterrupted;
  }

  async addClass(name: string): Promise<void> {
    // use knn to add custom class
    const relu = this.model.infer(this.webcam, true);
    this.knn.addExample(relu, name);
    console.log('successfully added class ' + name);
  }

  async removeClass(name: string): Promise<void> {
    console.log(name);
    this.knn.clearClass(name);
    console.log('successfully removed class ' + name);
  }

  // wrapper to add multiple images for a class
  // this results in better detection afterwards
  async addClassLoop(name: string): Promise<void> {
    for (let index = 0; index < 30; index++) {
      this.addClass(name);
    }
  }

  resetClasses(): void {
    this.knn.clearAllClasses();
  }

  async detectFrames(): Promise<void> {
    // evaluate the video feed every 32ms
    setInterval(async () => {
      if (this.knn.getNumClasses() > 0 && this.classifyNotInterrupted) {
        const relu = this.model.infer(this.webcam, true);
        const res = await this.knn.predictClass(relu);
        this.result = res.label;
        this.probabilities = res.confidences;
      }
      await tf.nextFrame();
    }, 32);
    // send detected direction every 500ms,
    // makes it possible to move in the maze (not too fast)
    setInterval(async () => {
      if (this.knn.getNumClasses() > 0 && this.classifyNotInterrupted) {
        this.moveSubject.next(this.result);
      }
    }, 500);
  }
  emitEventToChild(dir: string): void {
    // console.log('button submitted for: '+dir);
    this.moveSubject.next(dir);
  }
}
