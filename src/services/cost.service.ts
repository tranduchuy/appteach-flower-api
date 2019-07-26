import { inject, injectable } from 'inversify';
import { GoogleDistanceMatrixService } from './google-distance-matrix.service';
import { AddressService } from './address.service';
import * as _ from 'lodash';
import { General } from '../constant/generals';
import costPerKm = General.costPerKm;
import TYPES from '../constant/types';
import { ShopService } from './shop.service';

@injectable()
export class CostService {
  constructor(
    @inject(TYPES.GoogleDistanceMatrixService) private googleDistanceMatrixService: GoogleDistanceMatrixService,
    @inject(TYPES.AddressService) private addressService: AddressService,
    @inject(TYPES.ShopService) private shopService: ShopService
  ) {
  }

  calculateShippingCost = async (shopAddressId, deliveryAddressId) => {
    const shopAddress = await this.addressService.findAddress(shopAddressId);
    const deliveryAddress = await this.addressService.findAddress(deliveryAddressId);
    const originsAddress = [shopAddress.addressText];
    const destinationsAddress = [deliveryAddress.address];
    const shopGeoText = this.getGeoText(shopAddress.longitude, shopAddress.latitude);
    if (shopGeoText !== null) {
      originsAddress.push(shopGeoText);
    }
    const deliveryGeoText = this.getGeoText(deliveryAddress.longitude, deliveryAddress.latitude);
    if (deliveryGeoText !== null) {
      destinationsAddress.push(deliveryGeoText);
    }
    const distances: any = await this.googleDistanceMatrixService.calculateDistance(originsAddress, destinationsAddress);
    let minDistance = null;

    if (distances.status === 'OK') {
      minDistance = this.getMinDistance(distances);
    }
    if (minDistance !== null) {
      let shippingCost = ((minDistance / 1000 - 5) * costPerKm);
      if (shippingCost < 0) {
        shippingCost = 0;
      }
      return {
        shippingDistance: minDistance / 1000,
        shippingCost
      };
    } else {
      return {
        shippingDistance: null,
        shippingCost: 0
      };
    }
  };

  calculateNoLoginOrderShippingCost = async (shopAddressId, addressInfo) => {
    const shopAddress = await this.addressService.findAddress(shopAddressId);
    const originsAddress = [shopAddress.addressText];
    const destinationsAddress = [addressInfo.address];
    const shopGeoText = this.getGeoText(shopAddress.longitude, shopAddress.latitude);
    if (shopGeoText !== null) {
      originsAddress.push(shopGeoText);
    }
    const deliveryGeoText = this.getGeoText(addressInfo.longitude, addressInfo.latitude);
    if (deliveryGeoText !== null) {
      destinationsAddress.push(deliveryGeoText);
    }
    const distances: any = await this.googleDistanceMatrixService.calculateDistance(originsAddress, destinationsAddress);
    let minDistance = null;

    if (distances.status === 'OK') {
      minDistance = this.getMinDistance(distances);
    }

    if (minDistance !== null) {
      let shippingCost = ((minDistance / 1000 - 5) * costPerKm);
      if (shippingCost < 0) {
        shippingCost = 0;
      }
      return {
        shippingDistance: minDistance / 1000,
        shippingCost
      };
    } else {
      return {
        shippingDistance: null,
        shippingCost: 0
      };
    }
  };

  getMinDistance = (distances) => {
    if (distances.rows) {
      const values = distances.rows[0].elements.map(element => {
        return element.distance.value;
      });
      return _.min(values);
    }
    return null;
  };

  calculateDiscount = async (shopId, price) => {
    const shop = await this.shopService.findShopById(shopId);
    return (price * shop.discountRate) / 100;
  };

  getGeoText = (long: number, lat: number) => {
    if (long && lat) {
      const geoArr = [lat, long];
      return geoArr.join(',');
    }
    return null;
  }
}
