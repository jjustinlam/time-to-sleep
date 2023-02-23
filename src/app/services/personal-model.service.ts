import { Injectable } from '@angular/core';
import { Course } from '../data/course';
import { SQLiteService } from './sqlite.service';
import { Preferences } from '@capacitor/preferences';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class PersonalModelService {
  private static loadDefaultData:boolean = false;

  public static courses:Course[] = [];
  // public static has_setup = false;
  // public static prefers_morning = false;
  // public static WIND_DOWN_TIME = 60;
  // public static wind_up_time:number = 60;
  // public static wind_up_time_remote:number = 30;
  // public static wind_up_time_async:number = -1;
  // public static sun = {sleep: '11:00 PM', wakeup: '7:00 AM'};
  // public static mon = {sleep: '11:00 PM', wakeup: '7:00 AM'};
  // public static tue = {sleep: '11:00 PM', wakeup: '7:00 AM'};
  // public static wed = {sleep: '11:00 PM', wakeup: '7:00 AM'};
  // public static thu = {sleep: '11:00 PM', wakeup: '7:00 AM'};
  // public static fri = {sleep: '11:00 PM', wakeup: '7:00 AM'};
  // public static sat = {sleep: '11:00 PM', wakeup: '7:00 AM'};
  

  constructor(private sqlite:SQLiteService) { 
    // this.set_default_preferences();
    // if (PersonalModelService.loadDefaultData) {
    //   this.load_default_data();
    // }
    // PersonalModelService.loadDefaultData = false;
  }

  load_default_data() {
    // TO DO
  }

  set_default_preferences() {
    if (!Preferences.get({key: 'has_setup'})) Preferences.set({key: 'has_setup', value: 'false'});

    // Morning or night person
    if (!Preferences.get({key: 'prefers_morning'})) Preferences.set({key: 'prefers_morning', value: 'false'});

    // Send a notification this amount of time, in minutes, before recommended sleep time to tell the user when to begin winding down for the day
    if (!Preferences.get({key: 'WIND_DOWN_TIME'})) Preferences.set({key: 'WIND_DOWN_TIME', value: '30'});

    // When to wake up the user for in person classes, in minutes
    if (!Preferences.get({key: 'wind_up_time'})) Preferences.set({key: 'wind_up_time', value: '60'});

    // When to wake up the user for remote synchronous classes, in minutes
    if (!Preferences.get({key: 'wind_up_time_remote'})) Preferences.set({key: 'wind_up_time_remote', value: '30'});

    // When to wake up the user for remote asynchronous classes, in minutes
    if (!Preferences.get({key: 'wind_up_time_async'})) Preferences.set({key: 'wind_up_time_async', value: '-1'});

    // Recommended times to sleep and to wakeup by day (based on recommended overnight sleep)
    if (!Preferences.get({key: 'sun'})) Preferences.set({key: 'sun', value: '23:00 - 7:00'});
    if (!Preferences.get({key: 'mon'})) Preferences.set({key: 'mon', value: '23:00 - 7:00'});
    if (!Preferences.get({key: 'tue'})) Preferences.set({key: 'tue', value: '23:00 - 7:00'});
    if (!Preferences.get({key: 'wed'})) Preferences.set({key: 'wed', value: '23:00 - 7:00'});
    if (!Preferences.get({key: 'thu'})) Preferences.set({key: 'thu', value: '23:00 - 7:00'});
    if (!Preferences.get({key: 'fri'})) Preferences.set({key: 'fri', value: '23:00 - 7:00'});
    if (!Preferences.get({key: 'sat'})) Preferences.set({key: 'sat', value: '23:00 - 7:00'});

    // PersonalModelService.has_setup = false;
    
    // // Morning or night person
    // PersonalModelService.prefers_morning = false;

    // // Send a notification this amount of time, in minutes, before recommended sleep time to tell the user when to begin winding down for the day
    // PersonalModelService.WIND_DOWN_TIME = 60;

    // // When to wake up the user for in person classes, in minutes
    // PersonalModelService.wind_up_time = 60;

    // // When to wake up the user for remote synchronous classes, in minutes
    // PersonalModelService.wind_up_time_remote = 30;

    // // When to wake up the user for remote asynchronous classes, in minutes
    // PersonalModelService.wind_up_time_async = -1;

    // // Recommended times to sleep and to wakeup by day (based on recommended overnight sleep)
    // PersonalModelService.sun = {sleep: '11:00 PM', wakeup: '7:00 AM'};
    // PersonalModelService.mon = {sleep: '11:00 PM', wakeup: '7:00 AM'};
    // PersonalModelService.tue = {sleep: '11:00 PM', wakeup: '7:00 AM'};
    // PersonalModelService.wed = {sleep: '11:00 PM', wakeup: '7:00 AM'};
    // PersonalModelService.thu = {sleep: '11:00 PM', wakeup: '7:00 AM'};
    // PersonalModelService.fri = {sleep: '11:00 PM', wakeup: '7:00 AM'};
    // PersonalModelService.sat = {sleep: '11:00 PM', wakeup: '7:00 AM'};

  }

  async has_setup():Promise<boolean> {
    const { value } = await Preferences.get({key: 'has_setup'});
    return value == 'true';
  }
  async prefers_morning():Promise<boolean> {
    const { value } = await Preferences.get({key: 'prefers_morning'});
    return value == 'true';
  }
  async WIND_DOWN_TIME():Promise<number> {
    const { value } = await Preferences.get({key: 'WIND_DOWN_TIME'});
    if (value) return +value;
    else return -1;
  }
  async wind_up_time():Promise<number> {
    const { value } = await Preferences.get({key: 'wind_up_time'});
    if (value) return +value;
    else return -1;
  }
  async wind_up_time_remote():Promise<number> {
    const { value } = await Preferences.get({key: 'wind_up_time_remote'});
    if (value) return +value;
    else return -1;
  }
  async wind_up_time_async():Promise<number> {
    const { value } = await Preferences.get({key: 'wind_up_time_async'});
    if (value) return +value;
    else return -1;
  }
  async today(day:string) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':');
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':');

      return {
        sleep: {
          hour: +sleep_hour,
          min: +sleep_min
        },
        wakeup: {
          hour: +wakeup_hour,
          min: +wakeup_min
        }
      }
    } else return {
      sleep: {
        hour: 0,
        min: 0
      },
      wakeup: {
        hour: 0,
        min: 0
      }
    };
  }

  erase_data() {
    Preferences.clear();
    this.set_default_preferences();
    PersonalModelService.courses = [];
    AppComponent.active = false;
    this.sqlite.drop_tables();
    if (PersonalModelService.loadDefaultData) this.load_default_data();
  }

  sort_course_list() {
    PersonalModelService.courses.sort((a:Course, b:Course) => {
      return a.name.localeCompare(b.name);
    });
  }

  add_course(course:Course) {
    PersonalModelService.courses.push(course);
    this.sort_course_list();
    // TO DO: Push course to database 
  }

  remove_course(course:Course) {
    PersonalModelService.courses = PersonalModelService.courses.filter((elm) => { return elm !== course });
    this.sort_course_list();
    // TO DO: Pop course from database
  }

  set_wind_up_time(minutes:number) {
    Preferences.set({key: 'wind_up_time', value: `${minutes}`});
    // PersonalModelService.wind_up_time = minutes;
  }


}
