import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VisualScheduleComponent } from './visual-schedule.component';

@NgModule({
  declarations: [
    VisualScheduleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    VisualScheduleComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisualScheduleModule { }
