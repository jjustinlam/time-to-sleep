import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sleepiness',
  templateUrl: './sleepiness.page.html',
  styleUrls: ['./sleepiness.page.scss'],
})
export class SleepinessPage implements OnInit {
  logged_value:number;

  constructor() { }

  ngOnInit() {
  }

  pin_formatter(value:number) {
    return `${value}`;
  }

  confirm() {

  }
}
