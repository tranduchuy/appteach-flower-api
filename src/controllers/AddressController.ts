import {
  controller, httpGet, httpPost, httpPut
} from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { Request, Response } from 'express';
import { IRes } from '../interfaces/i-res';
import * as HttpStatus from 'http-status-codes';
import Joi from '@hapi/joi';
// validate schema
import addAddressSchema from '../validation-schemas/address/add-address.schema';
import addPossibleDeliveryAddressSchema from '../validation-schemas/address/add-possible-delivery.schema';
import { ResponseMessages } from '../constant/messages';
import { AddressService } from "../services/address.service";
import { General } from "../constant/generals";
import UserTypes = General.UserTypes;
import updateDeliveryAddressSchema from "../validation-schemas/address/update-delivery-address.schema";

@controller('/address')
export class AddressController {
  constructor(
    @inject(TYPES.AddressService) private addressService: AddressService,
  ) {
  }

  @httpGet('/delivery', TYPES.CheckTokenMiddleware)
  public getAddress(request: Request, response: Response): Promise<{}> {
    return new Promise<{}>(async (resolve, reject) => {
      try {
        const user = request.user;
        const addresses = await this.addressService.getDelieveryAddress(user);
        const result = {
          status: 1,
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
        const addresses = await this.addressService.getPossibleDelieveryAddress(user);
        const result = {
          status: 1,
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
        const { name, phone, city, district, address} = request.body;

        const newAddress= await this.addressService.createDeliveryAddress({
          name,
          phone,
          city,
          user,
          district,
          address
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
        const { district, city} = request.body;

        const newAddress= await this.addressService.createPossibleDeliveryAddress({
          district,
          city,
          user
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
        console.log(addressId);
        const user = request.user;
        const deliveryAddress = await this.addressService.findDeliveryAddressById(addressId, user._id);
        console.log(deliveryAddress);
        if (!deliveryAddress) {
          const result: IRes<{}> = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Address.ADDRESS_NOT_FOUND],
            data: {}
          };
          return resolve(result);
        }

        const {name, phone, city, district, address} = request.body;

        await this.addressService.updateDeliveryAddress(deliveryAddress._id, {
          name,
          phone,
          city,
          district,
          address
        });


        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.Address.Update.UPDATE_ADDRESS_SUCCESS],
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


}