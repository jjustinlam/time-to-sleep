import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Sleepiness } from 'src/app/data/sleepiness';
import { PersonalModelService } from 'src/app/services/personal-model.service';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-sleepiness',
  templateUrl: './sleepiness.page.html',
  styleUrls: ['./sleepiness.page.scss'],
})
export class SleepinessPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  last_logged_value:number = 1;
  // sleepiness_scores:Sleepiness[] = [];
  // last_logged_day:string;

  static MAX_ENTRIES_PER_DAY:number = 3; // Assume the user can only enter this many sleepiness values per day, e.g. morning, midday, night.
  static EPSILON = 0.25; // Margin of error of sleepiness scores

  constructor(private personal_model:PersonalModelService, private alertController:AlertController) { }

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

    if (hours > 0) return `${hours} hours ${Math.round(minutes)} minutes`;
    else return `${Math.round(minutes)} minutes`
  }

  pin_formatter(value:number) {
    return `${value}`;
  }

  async confirm() {
    var sleepiness = new Sleepiness(this.last_logged_value);

    if (PersonalModelService.scores_today.length > 0 && sleepiness.day == PersonalModelService.last_logged_day) {
      // Push to local IFF they match the same "day" for sleepiness entries
      PersonalModelService.scores_today.push(sleepiness);
    } else {
      // Create a new list for the different day
      PersonalModelService.scores_today = [sleepiness, ];
      PersonalModelService.last_logged_day = sleepiness.day;
    }

    // Push to PersonalModelService once we get 3 entries of the same day
    if (PersonalModelService.scores_today.length == SleepinessPage.MAX_ENTRIES_PER_DAY) {
      var typical:number = this.personal_model.get_sleepiness_avg(PersonalModelService.last_logged_day);
      var total:number = 0;
      for (var i = 0; i < PersonalModelService.scores_today.length; i++) {
        total += PersonalModelService.scores_today[i].rating;
      }
      var avg:number = total / PersonalModelService.scores_today.length;

      // If today's average is atypical OR if typical is not ideal (is > 3), shift sleep if possible
      if (Math.abs(avg - typical) >= SleepinessPage.EPSILON || typical > 3) {
        // var prev = await this.personal_model.today(this.last_logged_day);
        var summary = "";
        var shift = 0;

        // If typically sleepy, increase sleep by 20 minutes
        if (typical > 3) {
          shift += 20;
          if (!(await this.personal_model.shift_wakeup(PersonalModelService.last_logged_day, 20))) 
            this.personal_model.shift_sleep(PersonalModelService.last_logged_day, -20);
            summary += `<p>You're typically tired on ${PersonalModelService.last_logged_day.charAt(0).toUpperCase() + PersonalModelService.last_logged_day.slice(1)}.</p>`;
        } 
        
        // If today's average is different than typical, shift by 10 minutes
        if (avg > typical) {
          // Today's average is more than typical (more tired than normal)
          // Push the user's wakeup upwards if possible, otherwise make them sleep sooner
          shift += 10;
          if (!await this.personal_model.shift_wakeup(PersonalModelService.last_logged_day, 10))
            this.personal_model.shift_sleep(PersonalModelService.last_logged_day, -10);
            summary += `<p>You were more tired than usual.</p>`;
        } else {
          // Today's average is less than typical (more awake than normal)
          // Shift the user's sleep to later
          shift -= 10;
          if (!await this.personal_model.shift_sleep(PersonalModelService.last_logged_day, 10))
            this.personal_model.shift_wakeup(PersonalModelService.last_logged_day, -10);
            summary += `<p>You were more awake than usual.</p>`;
        }

        if (shift > 0) summary += `<p>We increased your recommended sleep by ${shift} minutes.</p>`
        else if (shift < 0) summary += `<p>We decreased your recommended sleep by ${shift} minutes.</p>`
        else summary += `<p>Your recommended sleep remains the same.</p>`

        const alert = await this.alertController.create({
          message: summary,
          buttons: ['Dismiss']
        });

        await alert.present();
      }

      // Record today
      for (var i = 0; i < PersonalModelService.scores_today.length; i++) {
        this.personal_model.add_sleepiness(PersonalModelService.scores_today[i]);
      }
    } else if (PersonalModelService.scores_today.length > SleepinessPage.MAX_ENTRIES_PER_DAY) {
      const alert = await this.alertController.create({
        subHeader: "You already submitted your 3 sleepiness entries for today.",
        message: "Record again tomorrow!",
        buttons: ['OK']
      });

      await alert.present();
    }

    this.modal.dismiss();

  }

}
