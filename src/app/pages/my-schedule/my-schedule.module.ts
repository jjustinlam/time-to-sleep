import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MySchedulePageRoutingModule } from './my-schedule-routing.module';

import { MySchedulePage } from './my-schedule.page';

import { VisualScheduleModule } from 'src/app/components/visual-schedule/visual-schedule.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MySchedulePageRoutingModule,
    VisualScheduleModule
  ],
  declarations: [
    MySchedulePage,
    // VisualScheduleComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MySchedulePageModule {}
