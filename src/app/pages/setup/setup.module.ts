import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';

import { SetupPageRoutingModule } from './setup-routing.module';

import { SetupPage } from './setup.page';

// import { VisualScheduleComponent } from 'src/app/components/visual-schedule/visual-schedule.component';
import { VisualScheduleModule } from 'src/app/components/visual-schedule/visual-schedule.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetupPageRoutingModule,
    SwiperModule,
    VisualScheduleModule
  ],
  declarations: [
    SetupPage,
    // VisualScheduleComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SetupPageModule {}
