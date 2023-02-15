import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { Platform } from '@ionic/angular';

import { Course } from '../data/course';

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
      });
    } catch (e) {
      console.log('Your device does not support SQLite natively');
    }
  }

  initSleepiness() {
    this.db.executeSql(`
      CREATE TABLE Sleepiness(
        day DATETIME, 
        score INTEGER,

        PRIMARY KEY (day)
      )
    `)
  }

  // avgSleepiness(day:Date) {
  //   this.db.executeSql(`
  //   SELECT AVG(S.score)
  //   FROM Sleepiness S
  //   WHERE S.day = ${day}
  //   `)
  // }

  initOvernightSleepiness() {
    this.db.executeSql(`
      CREATE TABLE OvernightSleep(
        timeStart DATETIME,
        timeEnd DATETIME,

        PRIMARY KEY (timeStart)
      )
    `)
  }

  initCourses() {
    // this.db.executeSql('CREATE TABLE Course(name:VARCHAR(32), type:VARCHAR(32), days:CHAR(7), time_start:DATE, time_end:DATE)')
    this.db.executeSql(`
      CREATE TABLE Course(
        name VARCHAR(32),
        type VARCHAR(32),
        format VARCHAR(32),
        days CHAR(7),
        time_start DATETIME,
        time_end DATETIME,

        PRIMARY KEY (name, type)
      )
    `);
  }

  insertCourse(course:Course) {
    var days = course.days.map((elm) => {
      if (elm) return "1";
      else return "0";
    }).join('');
    this.db.executeSql(`
      INSERT INTO Course C
      VALUES (
        ${course.name}, 
        ${course.type},
        ${course.format},
        ${days},
        ${course.time_start},
        ${course.time_end}
      )
    `)
  }

  removeCourse(course:Course) {
    this.db.executeSql(`
      DELETE FROM Course C
      WHERE C.name = ${course.name} AND C.type = ${course.type}
    `)
  }
  
  retrieveCoursesByDay(day:string) : Array<Course> {
    var index = Course.days_strings.indexOf(day);
    var out:Array<Course> = [];

    if (index >= 0) {
      var arr = new Array(7).fill("0");
      arr[index] = "1";
      this.db.executeSql(`
        SELECT C.name, C.time_start, C.time_end
        FROM Course C
        WHERE C.days = ${arr.join('')}
      `).then((courses: Array<Course>) => {
        out = courses;
      })
    }
    return out;
  }

}
