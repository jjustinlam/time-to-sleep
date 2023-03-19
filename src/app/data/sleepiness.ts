import { PersonalModelService } from "../services/personal-model.service";

import { Modulo } from "./modulo";

export class Sleepiness {
	date:Date;
	rating:number;
	
	public static scale = [1,2,3,4,5,6,7];

	constructor(rating:number, now?:Date) {
		if (now) this.date = now;
		else this.date = new Date();
		
		this.rating = rating;
	}

	get day():string {
		if (this.date.getHours() < 5) return PersonalModelService.day_labels[Modulo.mod(this.date.getDay()-1, 7)];
		else return PersonalModelService.day_labels[this.date.getDay()];
	}

}
