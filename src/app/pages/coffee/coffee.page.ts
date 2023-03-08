import { Component, OnInit } from '@angular/core';

import { CoffeeShop } from 'src/app/data/coffee-shop';

import { Geolocation } from '@capacitor/geolocation';

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
    //outputs latitude and longitude when button is clicked
    const coordinates = Geolocation.getCurrentPosition().then(resp=>{
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
      // const lat = resp.coords.latitude;
      // const long = resp.coords.longitude;
      //insert function to retrieve coffee shops
    }).catch((error) => {
      console.log('Error getting location', error);
    });


    //function code
    //code below doesnt work

    // const sdk = require('api')('@yelp-developers/v1.0#1hzxg2alewxco5x');
    //
    // sdk.auth('Bearer 5EauOkDZtKc_L0v7KHW_g48BRNWS95gXWrsIkPfypG4ZjX5vqZLSbWvNsDE4jn5t0D1aYQRBV3PW-kSA683wqpBI7P-O_QG0q8-xDNhvnpr7xrCJ0JYWpgpAo6MGZHYx');
    // sdk.v3_business_search({
    //   latitude: '33.6551686', //test variables change to current location later
    //   longitude: '-117.8399602', //test variables
    //   term: 'coffee',
    //   locale: 'en_US',
    //   open_now: 'true',
    //   sort_by: 'distance',
    //   device_platform: 'mobile-generic',
    //   limit: '20'
    // }).then(({ data }) => console.log(data)) //issue with data variable
    //   .catch((err) => console.error(err));

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
