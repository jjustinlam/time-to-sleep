import { Component, OnInit } from '@angular/core';

import Swiper, { Navigation, Pagination } from 'swiper';

import { Preferences } from '@capacitor/preferences';
import { PersonalModelService } from 'src/app/services/personal-model.service';
import { Router } from '@angular/router';
import { PickerController } from '@ionic/angular';

@Component({
  selector: 'app-setup',
  providers: [PersonalModelService],
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {
  page:number = 0;
  size:number = 5;
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

  constructor(private personal_model:PersonalModelService, private pickerController:PickerController, private router:Router) { }

  async ngOnInit() {
    const { value } = await Preferences.get({key: 'has_setup'});
    if (!value || value == 'false') {
      this.personal_model.set_default_preferences();
      this.page = 0;
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
      // window.location.href = '/pages/my-schedule';
      this.router.navigateByUrl('pages/my-schedule');
    } else {
      if (this.page == 1 && this.prefers_morning === undefined) return;
      else if (this.page == 3 && this.wind_up_time === undefined) return;
      
      this.swiper.slideNext();
      this.page++;
      this.isEnd = this.swiper.isEnd;
    }
  }

  back() {
    if (!this.swiper.isBeginning) {
      this.page = Math.max(this.page - 1, 0);
      this.swiper.slidePrev();
      this.isEnd = this.swiper.isEnd;
    }
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
    // TO DO: fitness integration
  }

}
