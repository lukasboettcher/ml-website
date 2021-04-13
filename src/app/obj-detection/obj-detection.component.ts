import { Component, ViewChild, ElementRef, Renderer2, OnInit, Output, EventEmitter } from '@angular/core';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-obj-detection',
  templateUrl: './obj-detection.component.html',
  styleUrls: ['./obj-detection.component.css']
})
export class ObjDetectionComponent implements OnInit {

  // vars for canvas elements
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvasPred: ElementRef;

  // vars for state and video settings
  webcamStarted: boolean = false;
  modelLoaded: boolean = false;
  videoWidth = 0;
  videoHeight = 0;
  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 300 },
      height: { ideal: 300 }
    }
  };
  detectionInterrupted: boolean = false;

  // the model used for detection
  model: cocoSSD.ObjectDetection;

  constructor(private renderer: Renderer2) {
    tf.backend();
    this.loadModel();
  }

  async loadModel() {
    console.log('loading model..');
    this.model = await cocoSSD.load();
    console.log("model loaded");
    this.modelLoaded = true;
  }

  ngOnInit(): void {
  }

  // handle camera start
  startCamera() {
    // proceed only if camera is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(this.constraints)
        .then((stream) => {
          // set srcObject property
          this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
          this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
            // save dimensions of webcam video
            this.videoHeight = this.videoElement.nativeElement.videoHeight;
            this.videoWidth = this.videoElement.nativeElement.videoWidth;
          });
          this.webcamStarted = true;
        })
        .catch((e) => {
          console.log(e);
          // error in promise
          alert("Fehler beim Laden des Videos!");
        });
    } else {
      // no camera on device
      alert('Keine Kamera gefunden!');
    }
  }

  // switch prediction on or off
  changePredictionState() {
    if (this.detectionInterrupted) {
      // this restarts the prediction
      this.detectionInterrupted = !this.detectionInterrupted;
      this.predictWithCocoModel();
    } else {
      this.detectionInterrupted = !this.detectionInterrupted;
    }
  }

  // wait for video element to be ready before showing feed
  onLoadedData() {
    console.log("data loaded");
    this.predictWithCocoModel();
  }

  // this just starts detection
  async predictWithCocoModel() {
    this.detectFromVideo(this.videoElement.nativeElement, this.model);
    console.log('detection running');
  }

  // this predicts and draws results while uninterupted
  detectFromVideo(video, model) {
    if (!this.detectionInterrupted) {
      model.detect(video).then(predictions => {
        this.drawPredictions(predictions);
        requestAnimationFrame(() => {
          this.detectFromVideo(video, model);
        });
      });
    }
  }

  // typical implementation for labeling according to cocossd documentation
  drawPredictions(predictions) {
    let canvas = this.canvasPred.nativeElement;
    let ctx = canvas.getContext("2d");

    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;

    // clear canvas before each drawing
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    let font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.drawImage(this.videoElement.nativeElement, 0, 0, canvas.width, canvas.height);

    // draw box around each predicted object
    predictions.forEach(p => {
      const x = p.bbox[0];
      const y = p.bbox[1];
      const width = p.bbox[2];
      const height = p.bbox[3];
      // bounding box
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // label background
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(p.class).width;
      const textHeight = parseInt(font, 10);
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    // draw prediction text around each box
    predictions.forEach(p => {
      const x = p.bbox[0];
      const y = p.bbox[1];
      ctx.fillStyle = "#000000";
      ctx.fillText(p.class, x, y);
    });
  };
}
