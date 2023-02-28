export class Sleepiness {
	date:Date;
	day:string;
	rating:number;
	
	public static scale = [1,2,3,4,5,6,7];

	constructor(now:Date, day:string, rating:number) {
		this.date = now;
		this.day = day.toLowerCase();
		this.rating = rating;
	}
}
