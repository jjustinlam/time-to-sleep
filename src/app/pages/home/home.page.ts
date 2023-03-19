import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {
    clickSub: any;

    constructor(private localNotifications: LocalNotifications, private router:Router) { }

    ngOnInit() {
        this.sleepinessNotifs();
        this.router.navigateByUrl('pages/my-schedule');
    }

    async sleepinessNotifs() {
        var allowed = false;
        try {
            allowed = await this.localNotifications.requestPermission();
        } catch (e) {
            
        }

        if (allowed) {
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var day = new Date().getDate();

            var time1 = new Date(year, month, day, 10);
            var time2 = new Date(year, month, day, 14);
            var time3 = new Date(year, month, day, 18);

            this.localNotifications.schedule({
                id: 1,
                title: 'Log your morning sleepiness',
                text: 'How tired are you?',
                trigger: { at: new Date(time1) }
            });
            this.localNotifications.schedule({
                id: 2,
                title: 'Log your midday sleepiness',
                text: 'How tired are you?',
                trigger: { at: new Date(time2) }
            });
            this.localNotifications.schedule({
                id: 3,
                title: 'Log your evening sleepiness',
                text: 'How tired are you?',
                trigger: { at: new Date(time3) }
            });
            this.localNotifications.on('click').subscribe(() => {
                this.router.navigateByUrl('pages/sleepiness');
            }); 
        }
    }
}