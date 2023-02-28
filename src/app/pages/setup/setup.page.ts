import { Component, OnInit } from '@angular/core';

import Swiper, { Navigation, Pagination } from 'swiper';

import { Preferences } from '@capacitor/preferences';
import { PersonalModelService } from 'src/app/services/personal-model.service';
import { Router } from '@angular/router';
import { PickerController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { Health } from '@awesome-cordova-plugins/health/ngx';


@Component({
  selector: 'app-setup',
  providers: [PersonalModelService],
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {
  public static slides = ['welcome', 'morning/night', 'course schedule', 'prep/commute', 'fitness', 'finish'];
  index:number = 0;
  slide:string;
  swiper:Swiper;

  isEnd:boolean = false;

  prefers_morning:boolean;
  wind_up_time:number = 60;
  fitness_connected:boolean = false;

  get wind_up_string() {
    var hours = Math.floor(this.wind_up_time / 60);
    var minutes = this.wind_up_time % 60;

    if (hours > 0) return `${hours} hours, ${minutes} minutes`;
    else return `${minutes} minutes`;
  }

  constructor(private personal_model:PersonalModelService, private pickerController:PickerController, private router:Router, private health: Health) { }

  async ngOnInit() {
    const { value } = await Preferences.get({key: 'has_setup'});
    if (!value || value == 'false') {
      this.personal_model.set_default_preferences();
      this.index = 0;
      this.slide = SetupPage.slides[this.index];
      this.swiper = new Swiper('.swiper', {
        allowTouchMove: false,
      });
    } else {
      // window.location.href = '/pages/my-schedule';
      this.router.navigateByUrl('pages/my-schedule');
    }
  }

  advance() {
    if (this.swiper.isEnd) {
      Preferences.set({key: 'has_setup', value: 'true'});
      Preferences.set({key: 'prefers_morning', value: `${this.prefers_morning}`});
      for (var i = 0; i < PersonalModelService.day_labels.length; i++) {
        // if user prefers night, shift all wakeup and sleep times by 2 hours (i.e. 1:00 - 9:00)
        var day = PersonalModelService.day_labels[i];
        this.personal_model.shift_sleep(day, 2*60);
        this.personal_model.shift_wakeup(day, 2*60);
      }
      Preferences.set({key: 'wind_up_time', value: `${this.wind_up_time}`});
      AppComponent.active = true;
      // window.location.href = '/pages/my-schedule';
      this.router.navigateByUrl('pages/my-schedule');
    } else {
      if (this.slide == 'morning/night' && this.prefers_morning === undefined) return;
      else if (this.slide == 'prep/commute' && this.wind_up_time === undefined) return;
      
      this.swiper.slideNext();
      this.slide = SetupPage.slides[++this.index];
      this.isEnd = this.swiper.isEnd;
    }
  }

  back() {
    if (!this.swiper.isBeginning) {
      this.slide = SetupPage.slides[--this.index];
      this.swiper.slidePrev();
      this.isEnd = this.swiper.isEnd;
    } else this.index = 0;
  }

  async open_wind_up_picker() {
    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'hours',
          options: [
            {text: '0', value: 0},
            {text: '1', value: 1},
            {text: '2', value: 2},
            {text: '3', value: 3},
            {text: '4', value: 4},
            {text: '5', value: 5},
            {text: '6', value: 6},
            {text: '7', value: 7},
            {text: '8', value: 8},
            {text: '9', value: 9},
            {text: '10', value: 10},
            {text: '11', value: 11},
            {text: '12', value: 12},
          ]
        },
        {
          name: 'minutes',
          options: [
            {text: '00', value: 0},
            {text: '10', value: 10},
            {text: '20', value: 20},
            {text: '30', value: 30},
            {text: '40', value: 40},
            {text: '50', value: 50},
          ]
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (picked) => {
            this.wind_up_time = picked.hours.value * 60 + picked.minutes.value;
          }
        }
      ]
    });

    await picker.present();
  }

  set_prefers_morning() {
    this.prefers_morning = true;
  }
  set_prefers_night() {
    this.prefers_morning = false;
  }

  connect_fitness() {
    this.health.isAvailable().then((available: boolean) => {
      console.log(available);
      this.health.requestAuthorization([
        {
          read: ['sleep']     //read only permission
        }
      ])
        .then(res => {
          console.log(res);
        })
        .catch(e => console.log(e));
    })
      .catch(e => console.log(e));
  }

}
