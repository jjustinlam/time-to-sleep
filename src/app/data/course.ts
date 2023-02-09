export class Course {
	course_name:string;
	course_type:string;
	days:string;
	time_start:Date;
	time_end:Date;

	constructor(course_name:string, course_type:string, selected_days:Array<boolean>, time_start:Date, time_end:Date) {
		this.course_name = course_name;
		this.course_type = course_type;
		this.days = (selected_days[0]) 	? "S" : "_" +
					(selected_days[1]) 	? "M" : "_" +
					(selected_days[2]) 	? "T" : "_" +
					(selected_days[3]) 	? "W" : "_" +
					(selected_days[4]) 	? "T" : "_" +
					(selected_days[5]) 	? "F" : "_" +
					(selected_days[6]) 	? "S" : "_" ;
		this.time_start = time_start;
		this.time_end = time_end;
	}

	time_start_str() {
		return new Date(this.time_start).toLocaleTimeString('en-US', {timeStyle: 'short'});
	}

	time_end_str() {
		return new Date(this.time_end).toLocaleTimeString('en-US', {timeStyle: 'short'});
	}

	duration_as_str():string {
		var diff_ms = this.time_end.getTime() - this.time_start.getTime();
		var hours = Math.floor(diff_ms / (1000*60*60));
		var minutes = Math.floor(diff_ms / (1000*60) % 60);

		if (hours < 1) return `${minutes} minutes`;
		else return `${hours} hours, ${minutes} minutes`;
	}

	duration_in_minutes():number {
		var diff_ms = this.time_end.getTime() - this.time_start.getTime();
		var minutes = Math.floor(diff_ms / (1000*60));

		return minutes;
	}


}
