import { Injectable } from '@angular/core';
import { Course } from '../data/course';

@Injectable({
  providedIn: 'root'
})
export class PersonalModelService {
  private static loadDefaultData:boolean = false;
  public static courses:Course[] = [];

  constructor() { 
    if (PersonalModelService.loadDefaultData) {
      this.load_default_data();
    }
    PersonalModelService.loadDefaultData = false;
  }

  private load_default_data() {
    // TO DO
  }

  public add_course(course:Course) {
    PersonalModelService.courses.push(course);
    // TO DO: Push course to database 
  }

  public remove_course(course:Course) {
    PersonalModelService.courses.filter((elm) => elm !== course);
    // TO DO: Pop course from database
  }


}
