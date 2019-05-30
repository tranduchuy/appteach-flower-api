import {
  controller, httpGet, httpPost, httpPut, httpDelete
} from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { Request, Response } from 'express';
import { IRes } from '../interfaces/i-res';
import * as HttpStatus from 'http-status-codes';
import Joi from '@hapi/joi';
import { ShopService } from '../services/shop.service';
// validate schema
import addAddressSchema from '../validation-schemas/address/add-address.schema';
import addPossibleDeliveryAddressSchema from '../validation-schemas/address/add-possible-delivery.schema';
import { ResponseMessages } from '../constant/messages';
import { AddressService } from '../services/address.service';
import { General } from '../constant/generals';
import UserTypes = General.UserTypes;
import updateDeliveryAddressSchema from '../validation-schemas/address/update-delivery-address.schema';
import CheckAddressValidationSchema from '../validation-schemas/address/check-address.schema';
import { GoogleGeocodingService } from '../services/google-geocoding.service';

@controller('/address')
export class AddressController {
  constructor(
      @inject(TYPES.AddressService) private addressService: AddressService,
      @inject(TYPES.ShopService) private shopService: ShopService,
      @inject(TYPES.GoogleGeocodingService) private googleGeocodingService: GoogleGeocodingService
  ) {
  }

  @httpGet('/delivery', TYPES.CheckTokenMiddleware)
  public getAddress(request: Request, response: Response): Promise<{}> {
    return new Promise<{}>(async (resolve, reject) => {
      try {
        const user = request.user;
        const addresses = await this.addressService.getDelieveryAddress(user);
        const result = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            meta: {},
            entries: addresses
          }
        };
        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }

  @httpGet('/possible-delivery', TYPES.CheckTokenMiddleware)
  public getPossibleDeliveryAddress(request: Request, response: Response): Promise<{}> {
    return new Promise<{}>(async (resolve, reject) => {
      try {
        const user = request.user;
        if (user.type !== UserTypes.TYPE_SELLER) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Address.List.NO_POSSIBLE_ADDRESS_PERMISSION],
            data: {}
          };
          return resolve(result);
        }
        const addresses = await this.addressService.getPossibleDelieveryAddress(user);
        const result = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            meta: {},
            entries: addresses
          }
        };
        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }


  @httpPost('/delivery', TYPES.CheckTokenMiddleware)
  public addOne(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, addAddressSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const user = request.user;
        const {name, phone, city, ward, district, address} = request.body;

        let newAddress = await this.addressService.createDeliveryAddress({
          name,
          phone,
          city,
          user,
          district,
          ward,
          address
        });


        const addresses: any = await this.googleGeocodingService.checkAddress(newAddress.addressText);

        if (addresses.length === 0) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Address.ADDRESS_NOT_FOUND],
            data: {
              entries: addresses
            }
          };
          resolve(result);
        }

        const latitude = addresses[0].latitude;
        const longitude = addresses[0].longitude;

        newAddress = await this.addressService.updateGeoAddress(newAddress, {latitude, longitude});

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.Address.Add.ADD_ADDRESS_SUCCESS],
          data: {
            meta: {},
            entries: [newAddress]
          }
        };

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }

  @httpPost('/possible-delivery', TYPES.CheckTokenMiddleware)
  public addPossibleDelivery(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, addPossibleDeliveryAddressSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const user = request.user;
        if (user.type !== UserTypes.TYPE_SELLER) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Address.Add.NO_ADD_ADDRESS_PERMISSION],
            data: {}
          };
          return resolve(result);
        }
        const {district, city} = request.body;

        const possibleDeliveryAddress = await this.addressService.findPossibleDeliveryAddress({district, city, user});

        if (possibleDeliveryAddress) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Address.Add.ADDRESS_EXSIST],
            data: {}
          };

          return resolve(result);
        }

        const shop: any = await this.shopService.findShopOfUser(user._id.toString());
        if (!shop) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Shop.SHOP_OF_USER_NOT_FOUND]
          };

          return resolve(result);
        }

        const newAddress = await this.addressService.createPossibleDeliveryAddress({
          district,
          city,
          shopId: shop._id.toString()
        });

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.Address.Add.ADD_ADDRESS_SUCCESS],
          data: {
            meta: {},
            entries: [newAddress]
          }
        };

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }

  @httpPut('/delivery/:id', TYPES.CheckTokenMiddleware)
  public updateDelivery(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, updateDeliveryAddressSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const addressId = request.params.id;
        const user = request.user;
        const deliveryAddress = await this.addressService.findDeliveryAddressById(addressId, user._id);
        if (!deliveryAddress) {
          const result: IRes<{}> = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Address.ADDRESS_NOT_FOUND],
            data: {}
          };
          return resolve(result);
        }

        const {name, phone, city, district, ward, address} = request.body;

        let newAddress = await this.addressService.updateDeliveryAddress(deliveryAddress._id, {
          name,
          phone,
          city,
          district,
          ward,
          address
        });

        const addresses: any = await this.googleGeocodingService.checkAddress(newAddress.addressText);

        if (addresses.length === 0) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Address.ADDRESS_NOT_FOUND],
            data: {
              entries: addresses
            }
          };
          resolve(result);
        }

        const latitude = addresses[0].latitude;
        const longitude = addresses[0].longitude;

        newAddress = await this.addressService.updateGeoAddress(newAddress, {latitude, longitude});


        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.Address.Update.UPDATE_ADDRESS_SUCCESS],
          data: {
            meta: {},
            entries: [newAddress]
          }
        };

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }

  @httpDelete('/:id', TYPES.CheckTokenMiddleware)
  public deleteAddress(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {

        const addressId = request.params.id;
        const user = request.user;
        const address = await this.addressService.findAddressById(addressId, user._id);
        if (!address) {
          const result: IRes<{}> = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Address.ADDRESS_NOT_FOUND],
            data: {}
          };
          return resolve(result);
        }

        await this.addressService.deleteAddress(addressId);

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.Address.Delete.DELETE_ADDRESS_SUCCESS],
          data: {
            meta: {},
            entries: []
          }
        };

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }


  @httpGet('/check', TYPES.CheckTokenMiddleware)
  public checkAddress(request: Request, response: Response): Promise<{}> {
    return new Promise<{}>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.query, CheckAddressValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }
        const {addressText} = request.query;
        const addresses: any = await this.googleGeocodingService.checkAddress(addressText);
        if (addresses.length === 0) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Address.ADDRESS_NOT_FOUND],
            data: {
              entries: addresses
            }
          };
          resolve(result);
        }
        const result = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            entries: addresses
          }
        };
        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }


}