import { PersonalModelService } from "../services/personal-model.service";

export class Sleepiness {
	date:Date;
	day:string;
	rating:number;
	
	public static scale = [1,2,3,4,5,6,7];

	constructor(rating:number, now?:Date) {
		if (now) this.date = now;
		else this.date = new Date();

		if (this.date.getHours() < 8) this.day = PersonalModelService.day_labels[(this.date.getDay() - 1) % 7];
		else this.day = PersonalModelService.day_labels[this.date.getDay()];
		
		this.rating = rating;
	}

}
