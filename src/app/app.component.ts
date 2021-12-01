import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ml-website';

  constructor(private router: Router) { }

  inPath(s: string): boolean {
    return this.router.url.includes(s);
  }

}
