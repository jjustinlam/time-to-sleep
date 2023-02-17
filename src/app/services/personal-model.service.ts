import { Injectable } from '@angular/core';
import { Course } from '../data/course';
import { SQLiteService } from './sqlite.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PersonalModelService {
  private static loadDefaultData:boolean = false;
  public static courses:Course[] = [];

  constructor(private sqlite:SQLiteService) { 

    if (!Preferences.get({key: 'has_setup'})) Preferences.set({key: 'has_setup', value: 'false'});
    // Morning or night person
    if (!Preferences.get({key: 'prefers_morning'})) Preferences.set({key: 'prefers_morning', value: 'false'});

    // Send a notification this amount of time, in minutes, before recommended sleep time to tell the user when to begin winding down for the day
    if (!Preferences.get({key: 'WIND_DOWN_TIME'})) Preferences.set({key: 'WIND_DOWN_TIME', value: '60'});

    // When to wake up the user for in person classes, in minutes
    if (!Preferences.get({key: 'wind_up_time'})) Preferences.set({key: 'wind_up_time', value: '60'});

    // When to wake up the user for remote synchronous classes, in minutes
    if (!Preferences.get({key: 'wind_up_time_remote'})) Preferences.set({key: 'wind_up_time_remote', value: '30'});

    // When to wake up the user for remote asynchronous classes, in minutes
    if (!Preferences.get({key: 'wind_up_time_async'})) Preferences.set({key: 'wind_up_time_async', value: '-1'});

    // Recommended times to sleep and to wakeup by day (based on recommended overnight sleep)
    if (!Preferences.get({key: 'sun'})) Preferences.set({key: 'sun', value: '11:00 PM, 7:00 AM'});
    if (!Preferences.get({key: 'mon'}))Preferences.set({key: 'mon', value: '11:00 PM, 7:00 AM'});
    if (!Preferences.get({key: 'tue'}))Preferences.set({key: 'tue', value: '11:00 PM, 7:00 AM'});
    if (!Preferences.get({key: 'wed'}))Preferences.set({key: 'wed', value: '11:00 PM, 7:00 AM'});
    if (!Preferences.get({key: 'thu'}))Preferences.set({key: 'thu', value: '11:00 PM, 7:00 AM'});
    if (!Preferences.get({key: 'fri'}))Preferences.set({key: 'fri', value: '11:00 PM, 7:00 AM'});
    if (!Preferences.get({key: 'sat'}))Preferences.set({key: 'sat', value: '11:00 PM, 7:00 AM'});

    if (PersonalModelService.loadDefaultData) {
      this.load_default_data();
    }
    PersonalModelService.loadDefaultData = false;
  }

  private load_default_data() {
    // TO DO
  }

  private sort_course_list() {
    PersonalModelService.courses.sort((a:Course, b:Course) => {
      return a.name.localeCompare(b.name);
    });
  }

  public add_course(course:Course) {
    PersonalModelService.courses.push(course);
    this.sort_course_list();
    // TO DO: Push course to database 
  }

  public remove_course(course:Course) {
    PersonalModelService.courses = PersonalModelService.courses.filter((elm) => { return elm !== course });
    this.sort_course_list();
    // TO DO: Pop course from database
  }


}
