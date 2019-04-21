import {
  controller, httpGet, httpPost
} from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { Request, Response } from "express";
import { ProductService } from '../services/product.service';
import { HttpCodes } from "../constant/http-codes";
import ProductModel, { Product } from "../models/product";
import { General } from "../constant/generals";
import UserTypes = General.UserTypes;
import Joi from '@hapi/joi';
// validate schema
import addProductSchema from '../validation-schemas/product/add-new.schema';
import { ResponseMessages } from "../constant/messages";


interface IRes<T> {
  status: Number;
  messages: string[];
  data: T;
}

@controller('/product')
export class ProductController {
  constructor(
      @inject(TYPES.ProductService) private productService: ProductService
  ) {
  }

  @httpGet("/")
  public getProducts(request: Request, response: Response): Promise<IRes<Product[]>> {
    return new Promise<IRes<Product[]>>(async (resolve, reject) => {
      const result: IRes<Product[]> = {
        status: 1,
        messages: [ResponseMessages.SUCCESS],
        data: await ProductModel.find()
      };

      resolve(result);
    });
  }

  @httpPost("/", TYPES.CheckTokenMiddleware)
  public addOne(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, addProductSchema);
        if (error) {
          let messages = error.details.map(detail => {
            return detail.message;
          });
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const user = request.user;
        const {
          title, sku, description, images, topic, salePrice, originalPrice,
          tags,
          design, specialOccasion, floret, city, district, color, seoUrl, seoDescription, seoImage
        } = request.body;

        if (user.type !== UserTypes.TYPE_SELLER) {
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: [ResponseMessages.Product.Add.NO_ADD_PRODUCT_PERMISSION],
            data: {}
          };
          return resolve(result);
        }

        let newProduct = await this.productService.createProduct({
          title,
          sku,
          description,
          topic,
          originalPrice,
          user,
          tags: tags || [],
          salePrice: salePrice || null,
          images: images || [],
          design: design || null,
          specialOccasion: specialOccasion || null,
          floret: floret || null,
          city: city || null,
          district: district || null,
          color: color || null,
          seoUrl: seoUrl || null,
          seoDescription: seoDescription || null,
          seoImage: seoImage || null
        });


        const result: IRes<{}> = {
          status: HttpCodes.SUCCESS,
          messages: [ResponseMessages.Product.Add.ADD_PRODUCT_SUCCESS],
          data: {
            meta: {},
            entries: [newProduct]
          }
        };

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result: IRes<{}> = {
          status: HttpCodes.ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }


}