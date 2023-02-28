export class CoffeeShop {
	name:string;
	address:string;
	rating:number; // Google Maps rating? Idk. Remove this if you don't want it.
	distance_from_me:number; // in miles

	constructor(name:string, address:string, rating:number, distance_from_me:number) {
		this.name = name;
		this.address = address;
		this.rating = rating;
		this.distance_from_me = distance_from_me;
	}
}
