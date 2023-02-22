import { Component, OnInit } from '@angular/core';
import { PersonalModelService } from 'src/app/services/personal-model.service';

@Component({
  selector: 'app-overnight-sleep',
  templateUrl: './overnight-sleep.page.html',
  styleUrls: ['./overnight-sleep.page.scss'],
})
export class OvernightSleepPage implements OnInit {
  wakeup_time:Date = new Date();

  constructor(private personal_model:PersonalModelService) { }

  async ngOnInit() {
    this.wakeup_time = await this.recommended_wakeup_time();
  }

  async recommended_wakeup_time() {
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var date = new Date();
    var recommended = await this.personal_model.today(weekdays[date.getDay()]);

    date.setDate(date.getDate() + 1);
    date.setHours(recommended.sleep.hour);
    date.setMinutes(recommended.sleep.min);
    return date;
  }

  async recommended_sleep_time() {
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var date = new Date();
    var recommended = await this.personal_model.today(weekdays[date.getDay()]);

    date.setDate(date.getDate() + 1);
    date.setHours(recommended.wakeup.hour);
    date.setMinutes(recommended.wakeup.min);
    return date;
  }

  get wakeup_time_str() {
    return new Date(this.wakeup_time).toLocaleTimeString('en-US', {timeStyle: 'short'});
  }

  get time_from_now() {
    if (this.wakeup_time) {
      var diff = (new Date()).getDate() - this.wakeup_time.getDate();
      var hours = Math.floor(diff / (1000 * 60 * 60));
      
      if (hours > 1) return `in ${hours} hours`;
      else if (hours > 0) return `in ${hours} hour`;
      else return `in <1 hour`;
    } else return 'in -1 hours';
  }

}
