import { Component, OnInit } from '@angular/core';

import Swiper, { Navigation, Pagination } from 'swiper';

import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {
  page:number = 0;
  size:number = 5;
  swiper:Swiper;

  isEnd:boolean = false;

  prefers_morning:boolean;
  wind_up_time:Date;
  fitness_connected:boolean = false;

  constructor() { }

  async ngOnInit() {
    const { value } = await Preferences.get({key: 'has_setup'});
    if (!value || value == 'false') {
      Preferences.set({key: 'has_setup', value: 'false'});
      this.page = 0;
      this.swiper = new Swiper('.swiper', {
        allowTouchMove: false,
      });
    } else {
      window.location.href = '/pages/my-schedule'
    }
  }

  advance() {
    if (this.swiper.isEnd) {
      Preferences.set({key: 'has_setup', value: 'true'});
      window.location.href = '/pages/my-schedule';
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
