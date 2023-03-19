export class Modulo {
	static mod(n:number, m:number) {
		return ((n % m) + m) % m;
	}
}
