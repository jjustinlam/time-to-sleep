import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { Platform } from '@ionic/angular';
import { RSA_NO_PADDING } from 'constants';

import { Course } from '../data/course';
import { Sleep } from '../data/sleep';
import { Sleepiness } from '../data/sleepiness';

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  db:SQLiteObject;
  native:boolean = false;
  
  constructor(private platform:Platform) {
    this.initPlugin();
  }

  initPlugin() {
    SQLite.echoTest();
    try {
      SQLite.create({
        name: 'data.db',
        location: 'default'
      }).then((db:SQLiteObject) => {
        this.db = db;
        this.native = true;
      });
    } catch (e) {
      console.log('Your device does not support SQLite natively');
    }
  }

  drop_tables() {
    if (this.native) {
      this.db.executeSql(`
        DROP TABLE Course;
        DROP TABLE Sleepiness;
        DROP TABLE OvernightSleep;
      `)
      .catch((e) => {
        console.log(e);
      });
    }
  }

  initSleepiness() {
    if (this.native) {
      this.db.executeSql(`
        CREATE TABLE Sleepiness(
          date DATETIME, 
          day CHAR(3),
          score INTEGER,

          PRIMARY KEY (day)
        );
      `)
      .catch((e) => {
        console.log(e);
      });
    }
  }

  insertSleepiness(sleepiness:Sleepiness) {
    if (this.native) {
      // this.db.executeSql(`
      // INSERT INTO Sleepiness
      // VALUES ( ${sleepiness.date}, ${sleepiness.day}, ${sleepiness.rating} );
      // `).catch((e) => {
      //   console.log(e);
      // });
      this.db.executeSql('INSERT INTO Sleepiness VALUES (?)', [sleepiness.date, sleepiness.day, sleepiness.rating]);
    }
  }

  getAverageSleepiness(day:string) {
    if (this.native) {
      this.db.executeSql(`
        SELECT AVG(S.score) AS average
        FROM Sleepiness S
        WHERE S.day = ?
      `, [day]
      ).then(rs => {
        return rs.rows.item(0).average;
      }).catch((e) => {
        console.log(e);
      });
    }
    return -1;
  }

  initOvernightSleepiness() {
    if (this.native) {
      this.db.executeSql(`
        CREATE TABLE OvernightSleep(
          timeStart DATETIME,
          timeEnd DATETIME,

          PRIMARY KEY (timeStart)
        );
      `).catch((e) => {
        console.log(e);
      });
    }
  }

  insertOvernightSleepiness(sleep:Sleep) {
    if (this.native) {
      this.db.executeSql('INSERT INTO OvernightSleep VALUES (?)', [sleep.time_sleep, sleep.time_wakeup])
      .catch((e) => {
        console.log(e);
      });
    }
  }

  initCourses() {
    if (this.native) {
      this.db.executeSql(`
        CREATE TABLE Course(
          name VARCHAR(32),
          type VARCHAR(32),
          format VARCHAR(32),
          days CHAR(7),
          time_start DATETIME,
          time_end DATETIME,

          PRIMARY KEY (name, type)
        );
      `).catch((e) => {
        console.log(e);
      });
    }
  }

  insertCourse(course:Course) {
    if (this.native) {
      var days = course.days.map((elm) => {
        if (elm) return "1";
        else return "0";
      }).join('');
      this.db.executeSql(`
        INSERT INTO Course C
        VALUES (?);
      `, [course.name, course.type, course.format, days, course.time_start, course.time_end])
      .catch((e) => {
        console.log(e);
      });
    }
  }

  removeCourse(course:Course) {
    if (this.native) {
      this.db.executeSql(`
        DELETE FROM Course C
        WHERE C.name = ? AND C.type = ?;
      `, [course.name, course.type])
      .catch((e) => {
        console.log(e);
      });
    }
  }
  
  retrieveCoursesByDay(day:string) : Array<Course> {
    var index = Course.day_labels.indexOf(day);
    var courses:Array<Course> = [];
    if (this.native) {
      if (index >= 0) {
        var arr = new Array(7).fill("0");
        arr[index] = "1";
        this.db.executeSql(`
          SELECT C.name, C.time_start, C.time_end
          FROM Course C
          WHERE C.days = ?
        `, [arr.join('')])
        .then((result) => {
          for (var i = 0; i < result.rows.length; i++) {
            var entry = result.rows.item(i);
            var days = [];
            for (var j = 0; j < entry.days.length; j++) {
              if (entry.days[j] === '1') days.push(true);
              else days.push(false);
            }
            courses.push(new Course(entry.name, entry.type, entry.format, days, entry.time_start, entry.time_end));
          }
        })
        .catch((e) => {
          console.log(e);
        });
      }
    }
    return courses;
  } 

}
