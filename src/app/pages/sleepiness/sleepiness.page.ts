import { Component, OnInit } from '@angular/core';
import { PersonalModelService } from 'src/app/services/personal-model.service';

@Component({
  selector: 'app-sleepiness',
  templateUrl: './sleepiness.page.html',
  styleUrls: ['./sleepiness.page.scss'],
})
export class SleepinessPage implements OnInit {
  logged_value:number;

  constructor(private personal_model:PersonalModelService) { }

  ngOnInit() {
    if (PersonalModelService.sleepiness_scores.length < 1) this.personal_model.load_sleepiness_scores();
  }

  pin_formatter(value:number) {
    return `${value}`;
  }

  confirm() {

  }
}
