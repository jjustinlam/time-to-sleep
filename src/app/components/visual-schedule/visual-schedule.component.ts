import { Component, OnInit, ViewChild } from '@angular/core';
import { Course } from 'src/app/data/course';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-visual-schedule',
  templateUrl: './visual-schedule.component.html',
  styleUrls: ['./visual-schedule.component.scss'],
})
export class VisualScheduleComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  display:string = "study-list";
  courses = Array<Course>();

  selected_days = [false, false, false, false, false, false, false]; // selected_days[0] is Sunday
  time_start = new Date();
  time_end = new Date();
  course_type = "";
  course_name = "";

  constructor() { }

  ngOnInit() {
    this.reset_modal();
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

  reset_modal() {
    this.selected_days = [false, false, false, false, false, false, false];
    this.time_start.setHours(8);
    this.time_start.setMinutes(0);
    this.time_end.setHours(8);
    this.time_end.setHours(50);
    this.course_type = "";
    this.course_name = "";
  }

  time_start_str() {
    return new Date(this.time_start).toLocaleTimeString('en-US', {timeStyle: 'short'});
  }

  time_end_str() {
    return new Date(this.time_end).toLocaleTimeString('en-US', {timeStyle: 'short'});
  }

  duration() {
    var diff_ms = new Date(this.time_end).getTime() - new Date(this.time_start).getTime();

    // var hours = Math.floor(diff_ms / (1000*60*60));
		// var minutes = Math.floor(diff_ms / (1000*60) % 60);

    return Math.floor(diff_ms / (1000*60));
  }

  is_valid() {
    return (this.duration() > 0) && (this.course_type.length > 0) && (this.course_name.length > 0) && this.selected_days.some((elm) => elm);
  }

  confirm() {
    if (new Date(this.time_end).getTime() - this.time_start.getTime() > 0) {
      // TO DO
      this.modal.dismiss();
    } else {
      // present alert about invalid end time
    }
  }

}
