export class Sleep {
	time_sleep:Date;
	time_wakeup:Date;

	constructor(time_start:Date, time_end:Date) {
		this.time_sleep = time_start;
		this.time_wakeup = time_end;
	}

	// Returns the duration in minutes of the sleep for this entry
	get duration():number {
		var diff_ms = this.time_wakeup.getTime() - this.time_sleep.getTime();
		var minutes = Math.floor(diff_ms / (1000*60));

		return minutes;
	}

	duration_as_str():string {
		var diff_ms = this.time_wakeup.getTime() - this.time_sleep.getTime();
		var hours = Math.floor(diff_ms / (1000*60*60));
		var minutes = Math.floor(diff_ms / (1000*60) % 60);

		if (hours < 1) return `${minutes} minutes`;
		else return `${hours} hours, ${minutes} minutes`;
	}
}
