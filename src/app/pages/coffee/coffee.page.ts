import { Component, OnInit } from '@angular/core';

import { CoffeeShop } from 'src/app/data/coffee-shop';

@Component({
  selector: 'app-coffee',
  templateUrl: './coffee.page.html',
  styleUrls: ['./coffee.page.scss'],
})
export class CoffeePage implements OnInit {
  found_shops:Array<CoffeeShop> = [];
  shop:CoffeeShop;
  index:number;

  constructor() { }

  ngOnInit() {
  }

  find_coffee_shop() {
    // TO DO
    // for each result from API sorted by distance from current location (maximum X entries OR maximum distance?): 
    //  found_shops.push(new CoffeeShop(...));
    // this.index = 0;
    // this.shop = found_shops[this.index];
  }

  back() {
    // this.index = Math.min(this.index-1, 0);
    // this.shop = found_shops[this.index];
  }

  forward() {
    // this.index = Math.max(this.index-1, this.found_shops.length);
    // this.shop = found_shops[this.index];
  }
}
