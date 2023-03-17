import { Injectable } from '@angular/core';
import { Course } from '../data/course';
import { SQLiteService } from './sqlite.service';
import { Preferences } from '@capacitor/preferences';
// import { AppComponent } from '../app.component';
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
    if (PersonalModelService.courses.length < 1) this.load_courses();
    if (PersonalModelService.sleep_entries.length < 1) this.load_sleep_entries();
    if (PersonalModelService.sleepiness_scores.length < 1) this.load_sleepiness_scores();

    if (PersonalModelService.loadDefaultData) this.load_default_data();
    PersonalModelService.loadDefaultData = false;
  }

  async load_default_data() {
    // TO DO: Default data
    this.erase_data();

    if ((await Preferences.get({key: 'has_setup'})).value === null) Preferences.set({key: 'has_setup', value: 'true'});

    // Default user is a night person
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
    if ((await Preferences.get({key: 'sun'})).value === null) Preferences.set({key: 'sun', value: '1:30 - 9:20'}); // Sun - Mon
    if ((await Preferences.get({key: 'mon'})).value === null) Preferences.set({key: 'mon', value: '0:50 - 8:30'}); // Mon - Tue: early class
    if ((await Preferences.get({key: 'tue'})).value === null) Preferences.set({key: 'tue', value: '2:00 - 9:30'}); // Tue - Wed
    if ((await Preferences.get({key: 'wed'})).value === null) Preferences.set({key: 'wed', value: '0:20 - 8:10'}); // Wed - Thu: early class
    if ((await Preferences.get({key: 'thu'})).value === null) Preferences.set({key: 'thu', value: '0:30 - 9:50'}); // Thu - Fri: "busiest" day, most sleep needed 
    if ((await Preferences.get({key: 'fri'})).value === null) Preferences.set({key: 'fri', value: '3:00 - 11:10'}); // Fri - Sat
    if ((await Preferences.get({key: 'sat'})).value === null) Preferences.set({key: 'sat', value: '2:30 - 11:00'}); // Sat - Sun

    // Set today to be Monday March 20th, 8:00 PM
    const today = new Date(2023, 2, 20, 8, 0);

    var time_only = function(hour:number, min:number) {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, min);
    };
    var today_offset = function(days_before:number, hour:number, min:number) {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate() - days_before, hour, min);
    };

    // Courses - for the sake of simplicity, assume every course is in person
    PersonalModelService.courses = [
      new Course("Comp Sci 125",  "Lec", "In person", [false,false,true ,false,true ,false,false], time_only(11, 0), time_only(12, 20)),
      new Course("Comp Sci 147",  "Lec", "In person", [false,false,true ,false,true ,false,false], time_only(9, 30), time_only(10, 50)),
      new Course("Comp Sci 147",  "Lab", "In person", [false,false,false,false,false,true ,false], time_only(11, 0), time_only(11, 50)),
      new Course("I&C Sci 9",     "Lec", "In person", [false,true ,false,true ,true ,false,false], time_only(11, 0), time_only(12, 20)),
      new Course("I&C Sci 9",     "Lab", "In person", [false,true ,false,true ,true ,false,false], time_only(17, 0), time_only(18, 20)),
      new Course("I&C Sci 9",     "Stu", "In person", [false,false,false,false,false,true ,false], time_only(14, 0), time_only(16, 50)),
    ];
    
    // Sleep data (last 2 weeks = 14 entries)
    PersonalModelService.sleep_entries = [
      new Sleep(today_offset(13,  1, 30), today_offset(13,  8, 30)), // night of Mon 3/6/2023
      new Sleep(today_offset(12,  2,  0), today_offset(12, 10, 20)), // night of Tue 3/7/2023
      new Sleep(today_offset(11,  1, 14), today_offset(11,  8, 32)), // night of Wed 3/8/2023
      new Sleep(today_offset(10,  2, 27), today_offset(10, 10, 10)), // night of Thu 3/9/2023
      new Sleep(today_offset( 9,  2, 45), today_offset( 9, 11, 12)), // night of Fri 3/10/2023
      new Sleep(today_offset( 8,  1, 37), today_offset( 8, 11,  5)), // night of Sat 3/11/2023
      new Sleep(today_offset( 7,  1, 42), today_offset( 7,  9, 56)), // night of Sun 3/12/2023
      new Sleep(today_offset( 6,  0, 20), today_offset( 6,  8, 30)), // night of Mon 3/13/2023
      new Sleep(today_offset( 5,  2, 12), today_offset( 5,  9, 33)), // night of Tue 3/14/2023
      new Sleep(today_offset( 4,  0, 13), today_offset( 4,  8, 13)), // night of Wed 3/15/2023
      new Sleep(today_offset( 3,  0, 34), today_offset( 3,  9, 51)), // night of Thu 3/16/2023
      new Sleep(today_offset( 2,  3, 28), today_offset( 2, 11, 11)), // night of Fri 3/17/2023
      new Sleep(today_offset( 1,  2, 16), today_offset( 1, 11,  3)), // night of Sat 3/18/2023
      new Sleep(today_offset( 0,  1, 42), today_offset( 0,  9, 23)), // night of Sun 3/19/2023
    ];

    // Sleepiness scores (last 2 weeks = 42 entries)
    PersonalModelService.sleepiness_scores = [
      // Tue 3/7/2023
      new Sleepiness(4, today_offset(13,  8, 30)), // upon wakeup
      new Sleepiness(4, today_offset(13, 14,  0)),  // midday
      new Sleepiness(5, today_offset(12,  2,  0)),  // before sleep
      // Wed 3/8/2023
      new Sleepiness(2, today_offset(12, 10, 20)), 
      new Sleepiness(3, today_offset(12, 14,  0)), 
      new Sleepiness(4, today_offset(11,  1, 14)), 
      // Thu 3/9/2023
      new Sleepiness(3, today_offset(11,  8, 32)), 
      new Sleepiness(3, today_offset(11, 14,  0)), 
      new Sleepiness(4, today_offset(10,  2, 27)), 
      // Fri 3/10/2023
      new Sleepiness(5, today_offset(10, 10, 10)), 
      new Sleepiness(6, today_offset(10, 14,  0)), 
      new Sleepiness(6, today_offset( 9,  2,  45)), 
      // Sat 3/11/2023
      new Sleepiness(3, today_offset( 9, 11, 12)), 
      new Sleepiness(3, today_offset( 9, 14,  0)), 
      new Sleepiness(4, today_offset( 8,  1, 37)), 
      // Sun 3/12/2023
      new Sleepiness(1, today_offset( 8, 11,  5)), 
      new Sleepiness(2, today_offset( 8, 14,  0)), 
      new Sleepiness(2, today_offset( 7,  1, 42)), 
      // Mon 3/13/2023
      new Sleepiness(2, today_offset( 7,  9, 56)), 
      new Sleepiness(2, today_offset( 7, 14,  0)), 
      new Sleepiness(2, today_offset( 6,  0, 20)), 
      // Tue 3/14/2023
      new Sleepiness(2, today_offset( 6,  8, 30)), 
      new Sleepiness(3, today_offset( 6, 14,  0)), 
      new Sleepiness(4, today_offset( 5,  2, 12)), 
      // Wed 3/15/2023
      new Sleepiness(3, today_offset( 5,  9, 33)), 
      new Sleepiness(2, today_offset( 5, 14,  0)), 
      new Sleepiness(3, today_offset( 4,  0, 13)), 
      // Thu 3/16/2023
      new Sleepiness(2, today_offset( 4,  8, 13)), 
      new Sleepiness(2, today_offset( 4, 14,  0)), 
      new Sleepiness(3, today_offset( 3,  0, 34)), 
      // Fri 3/17/2023
      new Sleepiness(1, today_offset( 3,  9, 51)), 
      new Sleepiness(1, today_offset( 3, 14,  0)), 
      new Sleepiness(2, today_offset( 2,  3, 28)), 
      // Sat 3/18/2023
      new Sleepiness(2, today_offset( 2, 11, 11)), 
      new Sleepiness(1, today_offset( 2, 14,  0)), 
      new Sleepiness(4, today_offset( 1,  2, 16)), 
      // Sun 3/19/2023
      new Sleepiness(2, today_offset( 1, 11,  3)), 
      new Sleepiness(1, today_offset( 1, 14,  0)), 
      new Sleepiness(3, today_offset( 0,  1, 42)), 
      // Mon 3/8/2023 (today)
      new Sleepiness(3, today_offset( 0,  9, 23)), 
      new Sleepiness(3, today_offset( 0, 14,  0)), 
      // new Sleepiness(5, today_offset(-1,  ?,  ?)), // TO BE RECORDED AT DEMO TIME
    ];

  }

  // Reset app data
  erase_data() {
    Preferences.clear();
    this.set_default_preferences();
    PersonalModelService.courses = [];
    PersonalModelService.sleep_entries = [];
    PersonalModelService.sleepiness_scores = [];
    // AppComponent.active = false;
    this.sqlite.hard_reset();
  }

  load_courses() {
    PersonalModelService.courses = this.sqlite.retrieveCourses();
  }

  load_sleep_entries() {
    PersonalModelService.sleep_entries = this.sqlite.retrieveOvernightSleep();
  }

  load_sleepiness_scores() {
    PersonalModelService.sleepiness_scores = this.sqlite.retrieveSleepiness();
  }

  async set_default_preferences() {
    if ((await Preferences.get({key: 'has_setup'})).value === null) Preferences.set({key: 'has_setup', value: 'false'});

    // Morning or night person
    if ((await Preferences.get({key: 'prefers_morning'})).value === null) Preferences.set({key: 'prefers_morning', value: 'true'});

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

  set_prefers_morning(prefers_morning:boolean) {
    Preferences.set({key: 'prefers_morning', value: `${prefers_morning}`})
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

  // Returns the recommended sleep time (as a Date) for a given day
  async when_to_sleep(day?:string) {
    var when = new Date();

    var summary;
    if (day) {
      summary = await this.today(day.toLowerCase());
    } else {
      summary = await this.today(PersonalModelService.day_labels[(when.getDay()) % 7]);

      var now = (when.getHours()) * 60 + (when.getMinutes());
      var sleep = (summary.sleep.hour) * 60 + (summary.sleep.min);

      // e.g. now is 12:01am and sleep is 2am
      if (now <= sleep) summary = await this.today(PersonalModelService.day_labels[(when.getDay()-1) % 7]);
      else when.setDate(when.getDate() + 1);
    }

    when.setHours(summary.sleep.hour);
    when.setMinutes(summary.sleep.min);

    return when;
  }

  // Returns the recommended wakeup time (as a Date) for a given day
  async when_to_wakeup(day?:string) {
    var when = new Date();
    var summary;

    if (day) {
      summary = await this.today(day.toLowerCase());
    } else {
      summary = await this.today(PersonalModelService.day_labels[(when.getDay()) % 7]);
    
      var now = (when.getHours()) * 60 + (when.getMinutes());
      var wakeup = (summary.wakeup.hour) * 60 + (summary.wakeup.min);

      // e.g. now is 2:00am and wakeup is 10:00am
      if (now <= wakeup) summary = await this.today(PersonalModelService.day_labels[(when.getDay()-1) % 7]);
      else when.setDate(when.getDate() + 1);
    }

    when.setHours(summary.wakeup.hour);
    when.setMinutes(summary.wakeup.min);

    return when;
  }

  // Returns the time (as a Date) to send a notification to let the user know when to sleep
  async when_to_notify_sleep() {
    var when = await this.when_to_sleep();

    var wind_down = +(await this.WIND_DOWN_TIME());

    // when.setHours(summary.sleep.hour);
    // when.setMinutes(summary.sleep.min - wind_down);
    when.setMinutes(-wind_down);

    return when;
  }

  // Returns true if the day and time given conflicts (overlaps) with a course in the user's course schedule
  async is_time_conflict(day:string, hour:number, min:number, include_wind_up:boolean=true) {
    var timestamp = hour * 60 + min;

    var courses = this.get_courses_by_day(day.toLowerCase());
    for (var i = 0; i < courses.length; i++) {
      var start = courses[i].time_start.getHours() * 60 + courses[i].time_start.getMinutes();
      if (include_wind_up) start += await this.wind_up_time();
      var end = courses[i].time_end.getHours() * 60 + courses[i].time_end.getMinutes();

      if (timestamp >= start && timestamp <= end) return true;
    }
    return false;
  }

  // Shift sleep for day:string by minutes:number. Positive values shift it forward.
  // e.g. shift_sleep('mon', 30) could shift it from 10:30pm to 11:00pm
  // Returns false on failure (e.g. conflict with class)
  async shift_sleep(day:string, minutes:number) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':').map(Number);
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':').map(Number);

      sleep_min += (Math.floor(Math.abs(minutes) % 60) * Math.sign(minutes));
      if (sleep_min >= 60) {
        sleep_hour = (sleep_hour + 1) % 24;
        sleep_min %= 60;
      }
      sleep_hour += (Math.floor(Math.abs(minutes) / 60) * Math.sign(minutes)) % 24;

      if (await this.is_time_conflict(day, sleep_hour, sleep_min)) return false;
      else Preferences.set({key: day.toLowerCase(), value: `${sleep_hour}:${sleep_min} - ${wakeup_hour}:${wakeup_min}`});

    } else {
      console.log('Could not change sleep time');
      return false;
    }
    return true;
  }

  // Set the sleep time manually for day:string
  // Returns false on failure (e.g. conflict with class)
  async set_sleep(day:string, hour:number, min:number) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':').map(Number);
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':').map(Number);

      if (await this.is_time_conflict(day, sleep_hour, sleep_min)) return false;
      else Preferences.set({key: day.toLowerCase(), value: `${hour}:${min} - ${wakeup_hour}:${wakeup_min}`});

    } else {
      console.log('Could not change sleep time');
      return false;
    }
    return true;
  }

  // Shift wakeup for day:string by minutes:number. Positive values shift it forward.
  // e.g. shift_wakeup('mon', 30) could shift it from 8:00am to 8:30am
  // Returns false on failure (e.g. conflict with class)
  async shift_wakeup(day:string, minutes:number) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':').map(Number);
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':').map(Number);

      wakeup_min += (Math.floor(Math.abs(minutes) % 60) * Math.sign(minutes));
      if (wakeup_min >= 60) {
        wakeup_hour = (wakeup_hour + 1) % 24;
        wakeup_min %= 60;
      }
      wakeup_hour += (Math.floor(Math.abs(minutes) / 60) * Math.sign(minutes)) % 24;

      if (await this.is_time_conflict(day, wakeup_hour, wakeup_min)) return false;
      else Preferences.set({key: day.toLowerCase(), value: `${sleep_hour}:${sleep_min} - ${wakeup_hour}:${wakeup_min}`});

    } else {
      console.log('Could not change wakeup time');
      return false;
    }
    return true;
  }

  // Set the sleep time manually for day:string
  // Returns false on failure (e.g. conflict with class)
  async set_wakeup(day:string, hour:number, min:number) {
    const { value } = await Preferences.get({key: day.toLowerCase()});
    if (value) {
      var [sleep_time, wakeup_time] = value.split(' - ');
      var [sleep_hour, sleep_min] = sleep_time.split(':').map(Number);
      var [wakeup_hour, wakeup_min] = wakeup_time.split(':').map(Number);

      if (await this.is_time_conflict(day, wakeup_hour, wakeup_min)) return false;
      else Preferences.set({key: day.toLowerCase(), value: `${sleep_hour}:${sleep_min} - ${hour}:${min}`});

    } else {
      console.log('Could not change wakeup time');
      return false;
    }
    return true;
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

  // Sorts the course list alphabetically
  sort_course_list() {
    PersonalModelService.courses.sort((a:Course, b:Course) => {
      return a.type.localeCompare(b.type);
    }).sort((a:Course, b:Course) => {
      return a.name.localeCompare(b.name);
    });
  }

  // Adds a course to the course list, then sorts alphabetically
  async add_course(course:Course) {
    PersonalModelService.courses.push(course);
    this.sort_course_list();
    this.sqlite.insertCourse(course);
  }

  // Removes a course from the courses list, then sorts alphabetically.
  async remove_course(course:Course) {
    PersonalModelService.courses = PersonalModelService.courses.filter((elm) => { return elm !== course });
    this.sort_course_list();
    this.sqlite.removeCourse(course);
  }

  // Retrieve all courses that take place on a given day.
  get_courses_by_day(day:string) {
    var arr:Course[] = [];
    var index = PersonalModelService.day_labels.findIndex((elm) => { return elm == day.toLowerCase() });
    for (var i = 0; i < PersonalModelService.courses.length; i++) {
      var course = PersonalModelService.courses[i];
      if (course.days[index]) arr.push(course);
    }
    return arr;
  }

  // Adds a sleep entry to the sleep entries list. Assume sleep_entries is kept in chronological order.
  async add_sleep(sleep:Sleep) {
    PersonalModelService.sleep_entries.push(sleep);
    this.sqlite.insertOvernightSleep(sleep);
  }

  // Retrieves the most recent sleep entry. Assume sleep_entries is kept in chronological order.
  get_last_sleep() {
    if (PersonalModelService.sleep_entries.length) return PersonalModelService.sleep_entries[PersonalModelService.sleep_entries.length-1];
    else return null;
  }

  // Retrieves the average sleep duration (in minutes) for a given day.
  get_sleep_duration_avg(day:string) {
    var arr:Sleep[] = PersonalModelService.sleep_entries.filter((sleep) => {
      return sleep.day == day;
    });

    var total = 0;
    for (var i = 0; i < arr.length; i++) {
      total += arr[i].duration;
    }

    if (total > 0) return total / arr.length;
    else return -1;
  }  

  // Adds a sleepiness score to sleepiness scores list. Assume sleepiness_scores is kept in chronological order.
  add_sleepiness(sleepiness:Sleepiness) {
    PersonalModelService.sleepiness_scores.push(sleepiness);
    this.sqlite.insertSleepiness(sleepiness);
  }

  // Retrieves the average sleepiness score for a given day.
  get_sleepiness_avg(day:string) {
    var arr:Sleepiness[] = PersonalModelService.sleepiness_scores.filter((sleepiness) => {
      return sleepiness.day == day.toLowerCase();
    });

    var total = 0;
    for (var i = 0; i < arr.length; i++) {
      total += arr[i].rating;
    }

    if (total > 0) return total / arr.length;
    else return -1;
  }

  get_single_day_sleepiness(when?:Date) {
    var today:Date;
    var day:string;
    if (when) {
      today = when;
      day = PersonalModelService.day_labels[when.getDay()];
    }
    else {
      today = new Date();
      day = PersonalModelService.day_labels[today.getDay()];
    }
    var tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    var compare = function(a: Date, b: Date) {
      return a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
    }


    return PersonalModelService.sleepiness_scores.filter((sleepiness) => {
      return (
        sleepiness.day == day 
        && (compare(sleepiness.date, today) || compare(sleepiness.date, tomorrow))
      );
    });
  }

  // Change the time needed to wind up
  set_wind_up_time(minutes:number) {
    Preferences.set({key: 'wind_up_time', value: `${minutes}`});
    // PersonalModelService.wind_up_time = minutes;
  }


}
