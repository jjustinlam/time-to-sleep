import { Component } from '@angular/core';

import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // show_menu:boolean = true; 
  // show_menu:boolean= true; // TO DO: Change to make menu available ONLY AFTER setup process

  public static active:boolean = false;

  public appPages = [
    { title: 'My Schedule', url: '/pages/my-schedule', icon: 'calendar' },
    { title: 'Overnight Sleep', url: '/pages/overnight-sleep', icon: 'moon' },
    { title: 'Sleepiness', url: '/pages/sleepiness', icon: 'battery-charging' },
    { title: 'Coffee', url: '/pages/coffee', icon: 'cafe'},
    { title: 'Settings', url: '/pages/settings', icon: 'cog' },
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {
    // TO DO: Retrieve from database if the user has setup yet. If retrieved is true, set this.has_setup to true.
  }

  async ngOnInit() {
    const { value } = await Preferences.get({key: 'has_setup'});
    if (value == 'true') AppComponent.active = true;
  }

  get show_menu() {
    return AppComponent.active;
  }
}
