import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@awesome-cordova-plugins/local-notifications';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {
    clickSub: any;

    constructor(private router:Router) { }

    ngOnInit() {
        this.sleepinessNotifs();
        this.router.navigateByUrl('pages/my-schedule');
    }

    async sleepinessNotifs() {
        try {
            await LocalNotifications.requestPermission();
        } catch (e) {
            console.log(e);
        }

        if (await LocalNotifications.hasPermission()) {
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var day = new Date().getDate();

            var time1 = new Date(year, month, day, 10);
            var time2 = new Date(year, month, day, 14);
            var time3 = new Date(year, month, day, 18);

            console.log('Nofications scheduled');
            LocalNotifications.schedule({
                title: 'Notifications are enabled!',
                text: "You'll receive daily notifications to remind you about logging your sleepiness throughout the day.",
                trigger: { at: new Date(new Date().getTime() + 1000)}
            });
            LocalNotifications.schedule({
                id: 1,
                title: 'Log your morning sleepiness',
                text: 'How tired are you?',
                trigger: { at: new Date(time1), every: ELocalNotificationTriggerUnit.DAY }
            });
            LocalNotifications.schedule({
                id: 2,
                title: 'Log your midday sleepiness',
                text: 'How tired are you?',
                trigger: { at: new Date(time2), every: ELocalNotificationTriggerUnit.DAY }
            });
            LocalNotifications.schedule({
                id: 3,
                title: 'Log your evening sleepiness',
                text: 'How tired are you?',
                trigger: { at: new Date(time3), every: ELocalNotificationTriggerUnit.DAY }
            });
            LocalNotifications.on('click').subscribe(() => {
                this.router.navigateByUrl('pages/sleepiness');
            }); 
        } else {
            console.log('Notifications were not permitted');
        }
    }
}