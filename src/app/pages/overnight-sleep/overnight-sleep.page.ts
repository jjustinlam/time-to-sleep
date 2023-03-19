import { Component, OnInit } from '@angular/core';
import { PersonalModelService } from 'src/app/services/personal-model.service';
import { Health, HealthData } from '@awesome-cordova-plugins/health/ngx';
import { Sleep } from 'src/app/data/sleep';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-overnight-sleep',
  templateUrl: './overnight-sleep.page.html',
  styleUrls: ['./overnight-sleep.page.scss'],
})


export class OvernightSleepPage implements OnInit {
  sleep_time:Date;
  wakeup_time:Date;
  time_start:Date;
  is_running:boolean = false;
  timer:any = null;
  // sleep: string = "Error retrieving sleep data"; // placeholder text if unable to retrieve health data

  constructor(private personal_model: PersonalModelService, private health: Health, private alertController:AlertController) {
  }

  async ngOnInit() {
    if (PersonalModelService.sleep_entries.length < 1) this.personal_model.load_sleep_entries();

    this.sleep_time = await this.personal_model.when_to_sleep();
    this.wakeup_time = await this.personal_model.when_to_wakeup();

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
      
      var sleepData = data.filter((datum) => {
        return ["sleep", "sleep.light", "sleep.deep", "sleep.rem"].includes(datum.value);
      }).sort((a:HealthData, b:HealthData) => {
        return (new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf());
      });

      if (sleepData.length > 0) {
        var sleep = new Sleep(sleepData[0].startDate, sleepData[sleepData.length-1].endDate);
        PersonalModelService.sleep_entries.push(sleep);
      }

      // let sleepData = data.reduce((total, data) => {
      //   if (["sleep", "sleep.light", "sleep.deep", "sleep.rem"].includes(data.value)) {
      //     const sleepStart = new Date(data.startDate);
      //     const sleepEnd = new Date(data.endDate);
      //     const sleepDuration = sleepEnd.getTime() - sleepStart.getTime();
      //     return total + sleepDuration;
      //   }
      //   return total;
      // }, 0);
      // console.log(sleepData);
      // this.sleep = this.formatTime(sleepData);
    })
  }

  get last_sleep_date() {
    var last_sleep = this.personal_model.get_last_sleep();
    if (last_sleep) return last_sleep.time_sleep_as_str();
    else return "";
  }

  get last_sleep_duration() {
    var last_sleep = this.personal_model.get_last_sleep();
    if (last_sleep) return last_sleep.duration_as_str();
    else return "No recorded data"
  }

  get all_sleep_entries() {
    return PersonalModelService.sleep_entries.reverse();
  }

  get wakeup_time_str() {
    return new Date(this.wakeup_time).toLocaleTimeString('en-US', { timeStyle: 'short' });
  }

  get sleep_time_str() {
    return new Date(this.sleep_time).toLocaleTimeString('en-US', { timeStyle: 'short'});
  }

  get sleep_from_now() {
    if (this.sleep_time) {
      var now = new Date();

      var diff = this.sleep_time.valueOf() - now.valueOf();
      var hours = Math.floor(diff / (1000 * 60 * 60));
      var minutes = Math.floor(diff / (1000 * 60)) % 60;

      if (hours > 1) return `in ${hours} hours`;
      else if (hours > 0) return `in ${hours} hour`;
      else return `in ${minutes} minutes`;
    } else return 'in -1 hours';
  }

  get wakeup_from_now() {
    if (this.wakeup_time) {
      var now = new Date();

      var diff = this.wakeup_time.valueOf() - now.valueOf();
      var hours = Math.floor(diff / (1000 * 60 * 60));
      var minutes = Math.floor(diff / (1000 * 60)) % 60;

      if (hours > 1) return `in ${hours} hours`;
      else if (hours > 0) return `in ${hours} hour`;
      else return `in ${minutes} minutes`;
    } else return 'in -1 hours';
  }

  // async recommended_wakeup_time() {
  //   // const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  //   // var date = new Date();
  //   // var recommended = await this.personal_model.today(weekdays[date.getDay()]);

  //   // var sleep = (recommended.sleep.hour) * 60 + (recommended.sleep.min);
  //   // var wakeup = (recommended.wakeup.hour) * 60 + (recommended.wakeup.min);

  //   // if (sleep > wakeup) {
  //   //   // e.g. 23:00 - 8:00
  //   //   date.setDate(date.getDate() + 1);
  //   // } else {
  //   //   // e.g. 0:00 - 9:00, extreme case 1:00 - 1:00
  //   // }
  //   // date.setHours(recommended.wakeup.hour);
  //   // date.setMinutes(recommended.wakeup.min);
  //   // return date;
  //   return await this.personal_model.when_to_wakeup();
  // }

  // async recommended_sleep_time() {
  //   // const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  //   // var date = new Date();
  //   // var recommended = await this.personal_model.today(weekdays[date.getDay()]);

  //   // date.setDate(date.getDate() + 1);
  //   // date.setHours(recommended.sleep.hour);
  //   // date.setMinutes(recommended.sleep.min);
  //   // return date;
  //   return await this.personal_model.when_to_sleep();
  // }

  elapsed():string {
    if (!this.is_running) return "0:00:00";

    var current:Date = new Date();
    var elapsed:Date = new Date(current.getTime() - this.time_start.getTime());

    var hour = elapsed.getUTCHours().toString();
		var min = elapsed.getUTCMinutes().toString().padStart(2, '0');
		var sec = elapsed.getUTCSeconds().toString().padStart(2, '0');

		return hour + ':' + min + ':' + sec;
  }

  async start() {
    const alert = await this.alertController.create({
      header: 'Start a sleep session?',
      buttons: [
        {
          text: 'Not yet',
          role: 'cancel'
        },
        {
          text: 'Good night!',
          role: 'confirm'
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

    if (role == 'confirm') {
      if (this.is_running) return;
      this.is_running = true;

      this.time_start = new Date();
      this.timer = setInterval(this.elapsed.bind(this), 1000);
    }
  }

  async stop() {
    const alert = await this.alertController.create({
      header: 'End your sleep session?',
      buttons: [
        {
          text: 'Still sleeping',
          role: 'cancel'
        },
        {
          text: 'Good morning!',
          role: 'confirm'
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

    if (role == 'confirm') {
      if (!this.is_running) return;
      this.is_running = false;

      var sleep = new Sleep(this.time_start, new Date());
      this.personal_model.add_sleep(sleep);

      clearInterval(this.timer);
    }
  }

}
