import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'My Schedule', url: '/pages/my-schedule', icon: 'calendar' },
    { title: 'Overnight Sleep', url: '/pages/overnight-sleep', icon: 'moon' },
    { title: 'Sleepiness', url: '/pages/sleepiness', icon: 'battery-charging' },
    { title: 'Settings', url: '/pages/settings', icon: 'cog' },
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
