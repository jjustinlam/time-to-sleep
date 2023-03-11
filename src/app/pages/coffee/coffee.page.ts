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
  APIKEY = "5EauOkDZtKc_L0v7KHW_g48BRNWS95gXWrsIkPfypG4ZjX5vqZLSbWvNsDE4jn5t0D1aYQRBV3PW-kSA683wqpBI7P-O_QG0q8-xDNhvnpr7xrCJ0JYWpgpAo6MGZHYx";
  lat: number; // default to aldrich park
  long: number; // default to aldrich park

  constructor() { }

  ngOnInit() {
  }

  find_coffee_shop() {
    this.found_shops = [];

    //outputs latitude and longitude when button is clicked
    const coordinates = Geolocation.getCurrentPosition().then(resp=>{
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      //insert function to retrieve coffee shops

      var result_count = 20;
      var radius = 3000; // search radius in meters


      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer 5EauOkDZtKc_L0v7KHW_g48BRNWS95gXWrsIkPfypG4ZjX5vqZLSbWvNsDE4jn5t0D1aYQRBV3PW-kSA683wqpBI7P-O_QG0q8-xDNhvnpr7xrCJ0JYWpgpAo6MGZHYx'
        }
      };
  
      fetch(`https://api.yelp.com/v3/businesses/search?latitude=${this.lat}&longitude=${this.long}&term=coffee&radius=${radius}&open_now=true&sort_by=distance&limit=${result_count}`, options)
        .then(response => response.json())
        .then(response => {
          for (const shop of response.businesses) {
            const name = shop.name;
            const address = shop.location.display_address.join(", ");
            const rating = shop.rating;
            const distance_from_me = shop.distance;
          
            const coffeeShop = new CoffeeShop(name, address, rating, distance_from_me);
          
            this.found_shops.push(coffeeShop);
            console.log(name);
          }
          console.log(this.found_shops);

          // for each result from API sorted by distance from current location (maximum X entries OR maximum distance?):
          console.log("BREAK")
          this.index = 0;
          this.shop = this.found_shops[this.index];
          console.log(this.shop);
        })
        .catch(err => console.error(err));
    }).catch((error) => {
      console.log('Error getting location', error);
    })

 
    
  }

  back() {
    this.index = Math.min(this.index-1, 0);
    this.shop = this.found_shops[this.index];
  }

  forward() {
    this.index = Math.max(this.index-1, this.found_shops.length);
    this.shop = this.found_shops[this.index];
  }
}
