import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/data/course';

@Component({
  selector: 'app-visual-schedule',
  templateUrl: './visual-schedule.component.html',
  styleUrls: ['./visual-schedule.component.scss'],
})
export class VisualScheduleComponent implements OnInit {
  display:string = "study-list";
  courses = Array<Course>();

  selected_days = {
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  }
  time_start = new Date(0, 0, 1, 8, 0);
  time_end = new Date(0, 0, 1, 8, 50);

  constructor() { }

  ngOnInit() {
    // TO DO: Load schedule from database, if it exists
  }

  show_study_list() {
    this.display = "study-list";
  }

  show_calendar() {
    this.display = "calendar";
  }

  add_course(course_name:string, course_type:string, days:string, time_start:Date, time_end:Date) {
    this.courses.push(new Course(course_name, course_type, days, time_start, time_end));
    // TO DO: Push to DB 
  }

  remove_course(course:Course) {
    this.courses.filter((c) => {return c !== course});
    // TO DO: Remove from DB
  }

  reset_days() {
    this.selected_days = {
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false, 
    }
    this.time_start = new Date(0, 0, 1, 8, 0);
    this.time_end = new Date(0, 0, 1, 8, 50);
  }

  time_start_str() {
    return new Date(this.time_start).toLocaleTimeString('en-US', {timeStyle: 'short'});
  }

  time_end_str() {
    return new Date(this.time_end).toLocaleTimeString('en-US', {timeStyle: 'short'});
  }

  confirm() {
    // TO DO
  }

}
