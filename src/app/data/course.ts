export class Course {
	name:string;
	type:string = "Lec";
	format:string;
	days:Array<boolean>;
	time_start:Date;
	time_end:Date;

	static day_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	static course_types = ['Act', 'Col', 'Dis', 'Fld', 'Lab', 'Lec', 'Qiz', 'Res', 'Sem', 'Stu', 'Tap', 'Tut'];
	static format_types = ['In person', 'Synchronous remote', 'Asynchronous remote'];

	constructor(name:string, type:string, format:string, selected_days:Array<boolean>, time_start:Date, time_end:Date) {
		this.name = name;
		this.type = type;
		this.format = format;
		this.days = selected_days;
		this.time_start = time_start;
		this.time_end = time_end;
	}

	get days_str() : string {
		var arr = [];
		for (var i = 0; i < this.days.length; i++) {
			if (this.days[i]) arr.push(Course.day_labels[i]);
		}
		return arr.join(' ');
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
