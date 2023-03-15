import { Component, Input, OnInit } from '@angular/core';
import { PersonalModelService } from 'src/app/services/personal-model.service';

@Component({
  selector: 'app-my-schedule',
  providers: [PersonalModelService],
  templateUrl: './my-schedule.page.html',
  styleUrls: ['./my-schedule.page.scss'],
})
export class MySchedulePage implements OnInit {

  constructor(private personal_model:PersonalModelService) { }

  ngOnInit() {
    if (PersonalModelService.courses.length < 1) this.personal_model.load_courses();
  }

}
