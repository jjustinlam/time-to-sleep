import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, PickerController } from '@ionic/angular';
import { PersonalModelService } from 'src/app/services/personal-model.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  wind_up_time:number;

  constructor(private personal_model: PersonalModelService, private alertController:AlertController, private pickerController:PickerController ,private router:Router) { }

  ngOnInit() {
    // TO DO: Retrieve wind up time ?
  }

  async clear_data() {
    const alert = await this.alertController.create({
      header: 'Clear all saved data?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          role: 'delete'
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

    if (role == 'delete') {
      this.personal_model.erase_data();
      this.router.navigateByUrl('pages/setup');
    }
  }

  async open_wind_up_picker() {
    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'hours',
          options: [
            {text: '0', value: 0},
            {text: '1', value: 1},
            {text: '2', value: 2},
            {text: '3', value: 3},
            {text: '4', value: 4},
            {text: '5', value: 5},
            {text: '6', value: 6},
            {text: '7', value: 7},
            {text: '8', value: 8},
            {text: '9', value: 9},
            {text: '10', value: 10},
            {text: '11', value: 11},
            {text: '12', value: 12},
          ]
        },
        {
          name: 'minutes',
          options: [
            {text: '00', value: 0},
            {text: '10', value: 10},
            {text: '20', value: 20},
            {text: '30', value: 30},
            {text: '40', value: 40},
            {text: '50', value: 50},
          ]
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (picked) => {
            this.wind_up_time = picked.hours.value * 60 + picked.minutes.value;
          }
        }
      ]
    });

    await picker.present();
  }

}
