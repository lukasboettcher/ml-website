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

  inPath(...args: any[]): boolean {
    for (const arg of args) {
      if (this.router.url.includes(arg)) {
        return true;
      }
    }
    return false;
  }

}
