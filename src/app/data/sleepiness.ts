export class Sleepiness {
	date:Date;
	rating:number;
	
	public static scale = [1,2,3,4,5,6,7];

	constructor(now:Date, rating:number) {
		this.date = now;
		this.rating = rating;
	}
}
