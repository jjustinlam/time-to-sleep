import { Injectable } from '@angular/core';
import { Course } from '../data/course';
import { SQLiteService } from './sqlite.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalModelService {
  private static loadDefaultData:boolean = false;
  public static courses:Course[] = [];

  constructor(private sqlite:SQLiteService) { 
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
