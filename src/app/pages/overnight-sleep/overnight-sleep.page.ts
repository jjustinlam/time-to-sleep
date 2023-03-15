import { Component, OnInit } from '@angular/core';
import { PersonalModelService } from 'src/app/services/personal-model.service';
import { Health } from '@awesome-cordova-plugins/health/ngx';

@Component({
  selector: 'app-overnight-sleep',
  templateUrl: './overnight-sleep.page.html',
  styleUrls: ['./overnight-sleep.page.scss'],
})


export class OvernightSleepPage implements OnInit {
  wakeup_time: Date;
  sleep: string = "Error retrieving sleep data"; // placeholder text if unable to retrieve health data

  constructor(private personal_model: PersonalModelService, private health: Health) {
  }

  async ngOnInit() {
    if (PersonalModelService.sleep_entries.length < 1) this.personal_model.load_sleep_entries();

    this.wakeup_time = await this.recommended_wakeup_time();

    this.health.isAvailable().then((available: boolean) => {
      console.log(available);
      this.health.requestAuthorization([
        {
          read: ['sleep']     //read only permission
        }
      ])
        .then(res => {
          console.log(res);
          this.loadSleep(); // set new sleep value from health data
        })
        .catch(e => console.log(e));
    })
      .catch(e => console.log(e));
  }

  formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const hrs = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);

    return `${hrs} hrs and ${min} min`;
  }

  loadSleep() {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(21, 0, 0, 0); // date from yesterday starting 9pm

    this.health.query({
      startDate: yesterday, // start time = last night 9 pm
      endDate: new Date(), // now
      dataType: 'sleep',
      limit: 1000
    }).then(data => {

      let sleepData = data.reduce((total, data) => {
        if (["sleep", "sleep.light", "sleep.deep", "sleep.rem"].includes(data.value)) {
          const sleepStart = new Date(data.startDate);
          const sleepEnd = new Date(data.endDate);
          const sleepDuration = sleepEnd.getTime() - sleepStart.getTime();
          return total + sleepDuration;
        }
        return total;
      }, 0);
      console.log(sleepData);
      this.sleep = this.formatTime(sleepData);
    })
  }

  async recommended_wakeup_time() {
    // const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    // var date = new Date();
    // var recommended = await this.personal_model.today(weekdays[date.getDay()]);

    // var sleep = (recommended.sleep.hour) * 60 + (recommended.sleep.min);
    // var wakeup = (recommended.wakeup.hour) * 60 + (recommended.wakeup.min);

    // if (sleep > wakeup) {
    //   // e.g. 23:00 - 8:00
    //   date.setDate(date.getDate() + 1);
    // } else {
    //   // e.g. 0:00 - 9:00, extreme case 1:00 - 1:00
    // }
    // date.setHours(recommended.wakeup.hour);
    // date.setMinutes(recommended.wakeup.min);
    // return date;
    return await this.personal_model.when_to_wakeup();
  }

  async recommended_sleep_time() {
    // const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    // var date = new Date();
    // var recommended = await this.personal_model.today(weekdays[date.getDay()]);

    // date.setDate(date.getDate() + 1);
    // date.setHours(recommended.sleep.hour);
    // date.setMinutes(recommended.sleep.min);
    // return date;
    return await this.personal_model.when_to_sleep();
  }

  get wakeup_time_str() {
    return new Date(this.wakeup_time).toLocaleTimeString('en-US', { timeStyle: 'short' });
  }

  get time_from_now() {
    if (this.wakeup_time) {
      var now = new Date();

      var diff = this.wakeup_time.valueOf() - now.valueOf();
      var hours = Math.floor(diff / (1000 * 60 * 60));
      var minutes = Math.floor(diff / (1000 * 60)) % 60;

      if (hours > 1) return `in ${hours} hours`;
      else if (hours > 0) return `in ${hours} hour`;
      else return `in <1 hour`;
    } else return 'in -1 hours';
  }

}
