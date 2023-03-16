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

  get weekday() {
    return (new Date()).toLocaleDateString('en-US', {weekday: 'long'})
  }

  get avg_sleepiness() {
    var day = PersonalModelService.day_labels[(new Date()).getDay()];
    return this.personal_model.get_sleepiness_avg(day);
  }

  get avg_sleep_duration() {
    var day = PersonalModelService.day_labels[(new Date()).getDay()];
    return this.personal_model.get_sleep_duration_avg(day);
  }

  get avg_sleep_duration_str() {
    var duration = this.avg_sleep_duration;

    var hours = Math.floor(duration / 60);
    var minutes = duration % 60;

    if (hours > 0) return `${hours} hours ${minutes} minutes`;
    else return `${minutes} minutes`
  }

  pin_formatter(value:number) {
    return `${value}`;
  }

  confirm() {

  }
}
