import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { Course } from 'src/app/data/course';
import { PersonalModelService } from 'src/app/services/personal-model.service';

@Component({
  selector: 'app-visual-schedule',
  templateUrl: './visual-schedule.component.html',
  styleUrls: ['./visual-schedule.component.scss'],
})
export class VisualScheduleComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  display:string = "study-list";

  selected_days = [false, false, false, false, false, false, false]; // selected_days[0] is Sunday
  time_start = new Date();
  time_end = new Date();
  course_type = "";
  course_name = "";

  constructor(private personal_model:PersonalModelService, private alert_controller:AlertController, private modal_controller:ModalController) {}

  ngOnInit() {
    this.reset_modal();
    // TO DO: Load schedule from database, if it exists
  }

  get courses() {
    return PersonalModelService.courses;
  }

  show_study_list() {
    this.display = "study-list";
  }

  show_calendar() {
    this.display = "calendar";
  }

  add_course() {
    this.personal_model.add_course(
      new Course(this.course_name, this.course_type, this.selected_days, this.time_start, this.time_end)
    );
  }

  async remove_course(course:Course) {
    const alert = await this.alert_controller.create({
      header: 'Remove this course?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          role: 'delete'
        }
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role == 'delete') this.personal_model.remove_course(course);
  }

  // async edit_course(course:Course) {
  //   this.selected_days = course.days_as_bool_array();
  //   this.time_start = course.time_start;
  //   this.time_end = course.time_end;
  //   this.course_type = course.course_type;
  //   this.course_name = course.course_name;

  //   this.personal_model.remove_course(course); // Remove the course and re-add it LOL
  //   this.modal.present();
  // }

  reset_modal() {
    this.selected_days = [false, false, false, false, false, false, false];
    this.time_start.setHours(8);
    this.time_start.setMinutes(0);
    this.time_end.setHours(8);
    this.time_end.setMinutes(50);
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
    if (this.is_valid()) {
      // TO DO
      this.add_course();
      this.modal.dismiss();
      this.reset_modal();
    } else {
      // present alert about invalid end time
    }
  }

}
