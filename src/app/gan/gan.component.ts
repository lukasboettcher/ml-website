import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gan',
  templateUrl: './gan.component.html',
  styleUrls: ['./gan.component.css']
})
export class GanComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

}
