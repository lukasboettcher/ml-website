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

  @ViewChild('video', { static: true }) videoElement: ElementRef;

  images = [1, 2, 3, 4].map((n) => `assets/classify-images/coco${n}.png`);

  constructor(private renderer: Renderer2) { }

  // state
  model: mnet.MobileNet;
  knn: knn.KNNClassifier;
  startedLoading = false;
  loopID: number;
  mazeInterval: ReturnType<typeof setInterval>;
  webcamRunning = false;
  solveMaze = false;
  showMazeControl = false;
  result = '';
  classes = new Map(); // <string, {pred: number, count: number} | undefined>
  currentSampleClass: string;

  // camera settings
  constraints = {
    video: {
      facingMode: 'user',
      width: { ideal: 500 },
      height: { ideal: 300 }
    }
  };

  // solve maze
  moveSubject: Subject<string> = new Subject<string>();

  ngOnInit(): void { }

  async initiateModels(): Promise<void> {
    this.startedLoading = true;
    this.model = await mnet.load();
    this.knn = await knn.create();
  }

  startWebcam(): void {
    // proceed only if camera is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(this.constraints)
        .then((stream) => {
          // set srcObject property
          const vid = this.videoElement.nativeElement;
          this.renderer.setProperty(vid, 'srcObject', stream);
          this.webcamRunning = true;
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

  startStopNN(): void {
    if (this.loopID) {
      cancelAnimationFrame(this.loopID);
      clearInterval(this.mazeInterval);
      this.loopID = null;
    } else {
      this.loopID = requestAnimationFrame(this.animate.bind(this));
      // send detected direction every 500ms,
      // makes it possible to move in the maze (not too fast)
      this.mazeInterval = setInterval(async () => {
        if (this.loopID && this.knn.getNumClasses() > 0) {
          this.moveSubject.next(this.result);
        }
      }, 500);
    }
  }

  async addClass(name: string): Promise<void> {
    if (!name || this.classes.has(name)) {
      return;
    }
    this.classes.set(name, {});
  }

  async animate(): Promise<void> {
    if (this.webcamRunning) {
      // Get image data from video element
      const image = tf.browser.fromPixels(this.videoElement.nativeElement);

      let logits;
      // 'conv_preds' is the logits activation of MobileNet.
      const infer = () => this.model.infer(image, true);

      // Train class if one of the buttons is held down
      if (this.currentSampleClass) {
        logits = infer();

        // Add current image to classifier
        this.knn.addExample(logits, this.currentSampleClass);
      }

      const numClasses = this.knn.getNumClasses();
      if (numClasses > 0) {

        // If classes have been added run predict
        logits = infer();
        const res = await this.knn.predictClass(logits, 10);
        const exampleCount = this.knn.getClassExampleCount();
        this.classes.forEach((v, k) => {
          v.count = exampleCount[k];
          v.pred = res.confidences[k];
        });
        this.result = res.label;
      }

      // Dispose image when done
      image.dispose();
      if (logits) {
        logits.dispose();
      }
    }
    if (this.loopID) {
      this.loopID = requestAnimationFrame(this.animate.bind(this));
    }

  }

  async removeClass(name: string): Promise<void> {
    this.classes.delete(name);
    // this.knn.clearClass(name);
    const exampleCount = this.knn.getClassExampleCount();
    if (exampleCount[name]) {
      this.knn.clearClass(name);
    }
  }

  // wrapper to add multiple images for a class
  // this results in better detection afterwards
  async addClassLoop(name: string): Promise<void> {
    for (let index = 0; index < 30; index++) {
      this.addClass(name);
    }
  }

  resetClasses(): void {
    this.classes.clear();
    if (this.knn.getNumClasses() > 0) {
      this.knn.clearAllClasses();
    }
  }

  emitEventToChild(dir: string): void {
    // console.log('button submitted for: '+dir);
    this.moveSubject.next(dir);
  }
}
