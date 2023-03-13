import { Injectable } from '@angular/core';
import { Course } from '../data/course';
import { SQLiteService } from './sqlite.service';
import { Preferences } from '@capacitor/preferences';
import { AppComponent } from '../app.component';
import { Sleep } from '../data/sleep';
import { Sleepiness } from '../data/sleepiness';

@Injectable({
  providedIn: 'root'
})
export class PersonalModelService {
  private static loadDefaultData:boolean = false;
  public static day_labels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  public static courses:Course[] = [];
  public static sleep_entries:Sleep[] = [];
  public static sleepiness_scores:Sleepiness[] = [];

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
    if (PersonalModelService.loadDefaultData) {
      this.load_default_data();
    }
    PersonalModelService.loadDefaultData = false;
  }

  load_default_data() {
    // TO DO
  }

  async set_default_preferences() {
    if ((await Preferences.get({key: 'has_setup'})).value === null) Preferences.set({key: 'has_setup', value: 'false'});

    // Morning or night person
    if ((await Preferences.get({key: 'prefers_morning'})).value === null) Preferences.set({key: 'prefers_morning', value: 'false'});

    // Send a notification this amount of time, in minutes, before recommended sleep time to tell the user when to begin winding down for the day
    if ((await Preferences.get({key: 'WIND_DOWN_TIME'})).value === null) Preferences.set({key: 'WIND_DOWN_TIME', value: '30'});

    // When to wake up the user for in person classes, in minutes
    if ((await Preferences.get({key: 'wind_up_time'})).value === null) Preferences.set({key: 'wind_up_time', value: '60'});

    // When to wake up the user for remote synchronous classes, in minutes
    if ((await Preferences.get({key: 'wind_up_time_remote'})).value === null) Preferences.set({key: 'wind_up_time_remote', value: '30'});

    // When to wake up the user for remote asynchronous classes, in minutes
    if ((await Preferences.get({key: 'wind_up_time_async'})).value === null) Preferences.set({key: 'wind_up_time_async', value: '-1'});

    // Recommended times to sleep and to wakeup by day (based on recommended overnight sleep)
    if ((await Preferences.get({key: 'sun'})).value === null) Preferences.set({key: 'sun', value: '23:00 - 7:00'});
    if ((await Preferences.get({key: 'mon'})).value === null) Preferences.set({key: 'mon', value: '23:00 - 7:00'});
    if ((await Preferences.get({key: 'tue'})).value === null) Preferences.set({key: 'tue', value: '23:00 - 7:00'});
    if ((await Preferences.get({key: 'wed'})).value === null) Preferences.set({key: 'wed', value: '23:00 - 7:00'});
    if ((await Preferences.get({key: 'thu'})).value === null) Preferences.set({key: 'thu', value: '23:00 - 7:00'});
    if ((await Preferences.get({key: 'fri'})).value === null) Preferences.set({key: 'fri', value: '23:00 - 7:00'});
    if ((await Preferences.get({key: 'sat'})).value === null) Preferences.set({key: 'sat', value: '23:00 - 7:00'});

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

  // Returns true if the user has finished the setup process
  async has_setup():Promise<boolean> {
    const { value } = await Preferences.get({key: 'has_setup'});
    return value == 'true';
  }

  // Returns true if the user is a morning person
  async prefers_morning():Promise<boolean> {
    const { value } = await Preferences.get({key: 'prefers_morning'});
    return value == 'true';
  }

  // Returns the (const) value for when we send a notifcation before the recommended sleep time
  async WIND_DOWN_TIME():Promise<number> {
    const { value } = await Preferences.get({key: 'WIND_DOWN_TIME'});
    if (value) return +value;
    else return -1;
  }

  // Returns the amount of prep/commute time the user set
  async wind_up_time():Promise<number> {
    const { value } = await Preferences.get({key: 'wind_up_time'});
    if (value) return +value;
    else return -1;
  }

  // Returns the (const) prep time for a remote live course
  async wind_up_time_remote():Promise<number> {
    const { value } = await Preferences.get({key: 'wind_up_time_remote'});
    if (value) return +value;
    else return -1;
  }

  // Returns the (const) prep time for an async course
  async wind_up_time_async():Promise<number> {
    const { value } = await Preferences.get({key: 'wind_up_time_async'});
    if (value) return +value;
    else return -1;
  }

  // Returns the sleep time for a given day:string
  // The day does not necessarily reflect it being on the day. 
  // e.g. {sun: {sleep: {hour: 1, min: 0}, wakeup: {hour: 9, min: 0}}} means that the user is recommended
  // to sleep on SATURDAY 1:00am and wake up at SATURDAY 9:00am. 
  // ** In other words, we should COMPUTE the recommended sleep time IN THE MORNING, and if (sleep.hour < wakeup.hour), then assume the sleep.hour is the next day **
  async get_sleep_time(day:string) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':');
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':');

      return {
        hour: +sleep_hour,
        min: +sleep_min
      }
    } else return {
      hour: 0,
      min: 0
    }
  }

  // Returns the wakeup time for a given day:string
  // The day does not necessarily reflect it being on the day. 
  // e.g. {sun: {sleep: {hour: 1, min: 0}, wakeup: {hour: 9, min: 0}}} means that the user is recommended
  // to sleep on SATURDAY 1:00am and wake up at SATURDAY 9:00am. 
  // ** In other words, we should COMPUTE the recommended sleep time IN THE MORNING, and if (sleep.hour < wakeup.hour), then assume the sleep.hour is the next day **
  async get_wakeup_time(day:string) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':');
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':');

      return {
        hour: +wakeup_hour,
        min: +wakeup_min
      }
    } else return {
      hour: 0,
      min: 0
    }
  }

  // Returns the sleep time and wakeup time for a given day:string
  // The day does not necessarily reflect it being on the day. 
  // e.g. {sun: {sleep: {hour: 1, min: 0}, wakeup: {hour: 9, min: 0}}} means that the user is recommended
  // to sleep on SATURDAY 1:00am and wake up at SATURDAY 9:00am. 
  // ** In other words, we should COMPUTE the recommended sleep time IN THE MORNING, and if (sleep.hour < wakeup.hour), then assume the sleep.hour is the next day **
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

  // Returns the recommended sleep time (as a string) for a given day
  async when_to_sleep(day?:string) {
    var summary;
    if (day) summary = await this.today(day.toLowerCase());
    else {
      var today = (new Date()).getDay();
      if (today < 8) summary = await this.today(PersonalModelService.day_labels[(today - 1) % 7]);
      else summary = await this.today(PersonalModelService.day_labels[today]);
    }

    return `${summary.sleep.hour}:${summary.sleep.min}`;
  }

  // Returns the recommended wakeup time (as a string) for a given day
  async when_to_wakeup(day?:string) {
    var summary;
    if (day) summary = await this.today(day.toLowerCase());
    else {
      var today = (new Date()).getDay();
      if (today < 8) summary = await this.today(PersonalModelService.day_labels[(today - 1) % 7]);
      else summary = await this.today(PersonalModelService.day_labels[today]);
    }

    return `${summary.wakeup.hour}:${summary.wakeup.min}`;
  }

  // Returns the time (as a Date) to send a notification to let the user know when to sleep
  async when_to_notify_sleep() {
    var sleep_time = await this.when_to_sleep();
    var [hour, min] = sleep_time.split(':');

    var when = new Date();

    var wind_down = await Preferences.get({key: 'WIND_DOWN_TIME'});

    when.setHours(+hour);
    when.setMinutes(+min - +wind_down);

    return when;
  }

  // Returns the time (as a Date) to set the alarm
  async when_to_alarm_wakeup() {
    var wakeup_time = await this.when_to_wakeup();
    var [hour, min] = wakeup_time.split(':');

    var when = new Date();
    if (when.getHours() < 24) when.setDate(when.getDate() + 1);
    when.setHours(+hour);
    when.setMinutes(+min);

    return when;
  }

  // Shift sleep for day:string by minutes:number. Positive values shift it forward.
  // e.g. shift_sleep('mon', 30) could shift it from 10:30pm to 11:00pm
  async shift_sleep(day:string, minutes:number) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':');
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':');

      sleep_hour += Math.floor(Math.abs(minutes) / 60) * Math.sign(minutes);
      sleep_min += Math.floor(Math.abs(minutes) % 60) * Math.sign(minutes);

      Preferences.set({key: day.toLowerCase(), value: `${sleep_hour}:${sleep_min} - ${wakeup_hour}:${wakeup_min}`});
    } else console.log('Could not change sleep time');
  }

  // Set the sleep time manually for day:string
  async set_sleep(day:string, hour:number, min:number) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':');
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':');

      Preferences.set({key: day.toLowerCase(), value: `${hour}:${min} - ${wakeup_hour}:${wakeup_min}`});
    } else console.log('Could not change sleep time');
  }

  // Shift wakeup for day:string by minutes:number. Positive values shift it forward.
  // e.g. shift_wakeup('mon', 30) could shift it from 8:00am to 8:30am
  async shift_wakeup(day:string, minutes:number) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':');
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':');

      wakeup_hour += Math.floor(Math.abs(minutes) / 60) * Math.sign(minutes);
      wakeup_min += Math.floor(Math.abs(minutes) % 60) * Math.sign(minutes);

      Preferences.set({key: day.toLowerCase(), value: `${sleep_hour}:${sleep_min} - ${wakeup_hour}:${wakeup_min}`});
    } else console.log('Could not change wakeup time');
  }

  // Set the sleep time manually for day:string
  async set_wakeup(day:string, hour:number, min:number) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':');
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':');

      Preferences.set({key: day.toLowerCase(), value: `${sleep_hour}:${sleep_min} - ${hour}:${min}`});
    } else console.log('Could not change wakeup time');
  }

  // Get the duration of sleep recommended from sleep time to wakeup time
  async get_recommended_duration(day:string) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':');
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':');

      var sleep = (+sleep_hour) * 60 + (+sleep_min);
      var wakeup = (+wakeup_hour) * 60 + (+wakeup_min);

      if (sleep > wakeup) {
        // e.g. 23:00 - 8:00
        return (+wakeup) + (24*60 - (+sleep));
      } else {
        // e.g. 0:00 - 9:00, extreme case 1:00 - 1:00
        return (+wakeup) - (+sleep)
      }

    } else return -1;
  }

  // Reset app data
  erase_data() {
    Preferences.clear();
    this.set_default_preferences();
    PersonalModelService.courses = [];
    PersonalModelService.sleep_entries = [];
    PersonalModelService.sleepiness_scores = [];
    AppComponent.active = false;
    this.sqlite.drop_tables();
    if (PersonalModelService.loadDefaultData) this.load_default_data();
  }

  // Sorts the course list alphabetically
  sort_course_list() {
    PersonalModelService.courses.sort((a:Course, b:Course) => {
      return a.name.localeCompare(b.name);
    });
  }

  // Adds a course to the course list, then sorts alphabetically
  async add_course(course:Course) {
    PersonalModelService.courses.push(course);
    this.sort_course_list();
    // TO DO: Push course to database 
  }

  // Removes a course from the courses list, then sorts alphabetically.
  async remove_course(course:Course) {
    PersonalModelService.courses = PersonalModelService.courses.filter((elm) => { return elm !== course });
    this.sort_course_list();
    // TO DO: Pop course from database
  }

  // Retrieve all courses that take place on a given day.
  async get_courses_by_day(day:string) {
    var arr:Course[] = [];
    var index = PersonalModelService.day_labels.findIndex((elm) => { return elm == day });
    for (var i = 0; i < PersonalModelService.courses.length; i++) {
      var course = PersonalModelService.courses[i];
      if (course.days[index]) arr.push(course);
    }
    return arr;
  }

  // Adds a sleep entry to the sleep entries list. Assume sleep_entries is kept in chronological order.
  async add_sleep(sleep:Sleep) {
    PersonalModelService.sleep_entries.push(sleep);
    // TO DO: Push sleep to database
  }

  // Retrieves the most recent sleep entry. Assume sleep_entries is kept in chronological order.
  async get_last_sleep() {
    if (PersonalModelService.sleep_entries.length) return PersonalModelService.sleep_entries[PersonalModelService.length-1];
    else return null;
    // TO DO: Retrieve most recent Sleep by date from database
  }

  // Retrieves the average sleep duration for a given day.
  async get_sleep_duration_avg(day:string) {
    var arr:Sleep[] = PersonalModelService.sleep_entries.filter((sleep) => {
      return sleep.day == day;
    });

    var total = 0;
    for (var i = 0; i < arr.length; i++) {
      total += arr[i].duration;
    }

    if (total > 0) return total / arr.length;
    else return -1;

    // TO DO: Retrieve AVG sleep duration (minutes?) from database
  }

  // Adds a sleepiness score to sleepiness scores list. Assume sleepiness_scores is kept in chronological order.
  async add_sleepiness(sleepiness:Sleepiness) {
    PersonalModelService.sleepiness_scores.push(sleepiness);
    // TO DO: Push sleepiness to database
  }

  // Retrieves the average sleepiness score for a given day.
  async get_sleepiness_avg(day:string) {
    var arr:Sleepiness[] = PersonalModelService.sleepiness_scores.filter((sleepiness) => {
      return sleepiness.day == day;
    });

    var total = 0;
    for (var i = 0; i < arr.length; i++) {
      total += arr[i].rating;
    }

    if (total > 0) return total / arr.length;
    else return -1;

    // TO DO: Retrieve AVG from database
    
  }

  // Change the time needed to wind up
  set_wind_up_time(minutes:number) {
    Preferences.set({key: 'wind_up_time', value: `${minutes}`});
    // PersonalModelService.wind_up_time = minutes;
  }


}
