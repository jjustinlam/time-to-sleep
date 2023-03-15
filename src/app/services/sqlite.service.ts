import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { Platform } from '@ionic/angular';
// import { RSA_NO_PADDING } from 'constants';

import { Course } from '../data/course';
import { Sleep } from '../data/sleep';
import { Sleepiness } from '../data/sleepiness';

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  db:SQLiteObject;
  native:boolean = false;

  public static initialized:boolean = false;
  
  constructor(private platform:Platform) {
    if (!SQLiteService.initialized) this.initPlugin();
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
      }).catch((e) => {
        console.log(e);
      });

      this.initCourses();
      this.initSleepiness();
      this.initOvernightSleep();
    } catch (e) {
      console.log('Your device does not support SQLite natively');
    }
    SQLiteService.initialized = true;
  }

  hard_reset() {
    this.drop_tables();
    this.native = false;
    SQLiteService.initialized = false;
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
          rating INTEGER,

          PRIMARY KEY (date)
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
      this.db.executeSql('INSERT INTO Sleepiness VALUES (?)', [sleepiness.date, sleepiness.rating]);
    }
  }

  retrieveSleepiness() : Array<Sleepiness> {
    var sleepiness_scores:Sleepiness[] = [];
    if (this.native) {
      this.db.executeSql(`
        SELECT S.date, S.day, S.rating
        FROM Sleepiness S
        ORDER BY S.date ASC
      `).then((result) => {
        for (var i = 0; i < result.rows.length; i++) {
          var s = result.rows.item(i);
          sleepiness_scores.push(new Sleepiness(s.rating, s.date));
        }
      }).catch((e) => {
        console.log(e);
      });
    }
    return sleepiness_scores;
  }

  // getAverageSleepiness(day:string) {
  //   if (this.native) {
  //     this.db.executeSql(`
  //       SELECT AVG(S.score) AS average
  //       FROM Sleepiness S
  //       WHERE S.day = ?
  //     `, [day]
  //     ).then(rs => {
  //       return rs.rows.item(0).average;
  //     }).catch((e) => {
  //       console.log(e);
  //     });
  //   }
  //   return -1;
  // }

  initOvernightSleep() {
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

  insertOvernightSleep(sleep:Sleep) {
    if (this.native) {
      this.db.executeSql('INSERT INTO OvernightSleep VALUES (?)', [sleep.time_sleep, sleep.time_wakeup])
      .catch((e) => {
        console.log(e);
      });
    }
  }

  retrieveOvernightSleep() : Array<Sleep> {
    var sleep_entries:Sleep[] = [];
    if (this.native) {
      this.db.executeSql(`
        SELECT O.timeStart, O.timeEnd
        FROM OvernightSleep O
        ORDER BY O.timeStart ASC
      `).then((result) => {
        for (var i = 0; i < result.rows.length; i++) {
          var o = result.rows.item(i);
          sleep_entries.push(new Sleep(o.sleepStart, o.sleepEnd));
        }
      }).catch((e) => {
        console.log(e);
      });
    }
    return sleep_entries;
  }

  initCourses() {
    if (this.native) {
      this.db.executeSql(`
        CREATE TABLE Course(
          name VARCHAR(32),
          type VARCHAR(32),
          format VARCHAR(32),
          days CHAR(7),
          timeStart DATETIME,
          timeEnd DATETIME,

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
  
  retrieveCourses() : Array<Course> {
    var courses:Course[] = [];
    if (this.native) {
      this.db.executeSql(`
        SELECT C.name, C.type, C.format, C.days, C.time_start, C.time_end
        FROM Courses C
        ORDER BY C.name ASC
      `).then((result) => {
        for (var i = 0; i < result.rows.length; i++) {
          var c = result.rows.item(i);
          var days:boolean[] = new Array(7).fill(false);
          for (var j = 0; j < c.days.length; j++) {
            days[j] = (c.days[j] === '1');
          }
          courses.push(new Course(c.name, c.type, c.format, days, c.timeStart, c.timeEnd));
        }
      }).catch((e) => {
        console.log(e);
      });
    }
    return courses;
  }

  retrieveCoursesByDay(day:string) : Array<Course> {
    var index = Course.day_labels.indexOf(day.toLowerCase());
    var courses:Course[] = [];
    if (this.native && index >= 0) {
      this.db.executeSql(`
        SELECT C.name, C.time_start, C.time_end
        FROM Course C
      `).then((result) => {
        for (var i = 0; i < result.rows.length; i++) {
          var c = result.rows.item(i);
          if (c.days[index] === '1') {
            var days:boolean[] = new Array(7).fill(false);
            for (var j = 0; j < c.days.length; j++) {
              days[j] = (c.days[j] === '1');
            }
            courses.push(new Course(c.name, c.type, c.format, days, c.timeStart, c.timeEnd));
          }
        }
      }).catch((e) => {
        console.log(e);
      });
    }
    return courses;
  } 

}
