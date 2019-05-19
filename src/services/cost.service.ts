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
  calculateShippingCost = async (shopAddressId, deliveryAddressId) => {
    const shopAddress = await this.addressService.findAddress(shopAddressId);
    const deliveryAddress = await this.addressService.findAddress(deliveryAddressId);
    const distances: any = await this.googleDistanceMatrixService.calculateDistance([shopAddress.addressText], [deliveryAddress.addressText]);
    let minDistance = null;

    if (distances.status === 'OK') {
      minDistance = this.getMinDistance(distances);
    }

    if (minDistance !== null) {
      const shippingCost = ((minDistance / 1000 - 5) * costPerKm);
      return {
        shippingDistance: minDistance / 1000,
        shippingCost
      };
    } else {
      return null;
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

  constructor(
    @inject(TYPES.GoogleDistanceMatrixService) private googleDistanceMatrixService: GoogleDistanceMatrixService,
    @inject(TYPES.AddressService) private addressService: AddressService,
    @inject(TYPES.ShopService) private shopService: ShopService
  ) {
  }
}
