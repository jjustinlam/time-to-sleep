import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PersonalModelService } from 'src/app/services/personal-model.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private personal_model: PersonalModelService, private alertController:AlertController) { }

  ngOnInit() {
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

    if (role == 'delete') this.personal_model.erase_data();
  }

}
