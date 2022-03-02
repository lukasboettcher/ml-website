import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-perceptron',
  templateUrl: './perceptron.component.html',
  styleUrls: ['./perceptron.component.css']
})
export class PerceptronComponent implements OnInit {

  url = 'https://progly.informatik.uni-kiel.de/perceptron/';
  urlSafe: SafeResourceUrl;
  height = 512;
  heightRatio = 0.95;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    console.warn(location.href);
    this.calculateHeight(window.innerHeight);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.calculateHeight(event.target.innerHeight);
  }
  calculateHeight(windowHeight: number): void {
    this.height = this.heightRatio * windowHeight - 100;
  }

}
