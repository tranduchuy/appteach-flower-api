import {
  controller, httpGet, httpPost
} from 'inversify-express-utils';
import {inject} from 'inversify';
import TYPES from '../constant/types';
import {Request, Response} from "express";
import {ProductService} from '../services/product.service';
import {HttpCodes} from "../constant/http-codes";
import ProductModel, {Product} from "../models/product";
import { General } from "../constant/generals";
import UserTypes = General.UserTypes;




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
        messages: ["Success"],
        data: await ProductModel.find()
      };

      resolve(result);
    });
  }

  @httpPost("/add", TYPES.CheckTokenMiddleware)
  public addOne(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const user = request.user;
        const {title, sku, description, topic, priceRange, slug, originalPrice} = request.body;

        if (user.type !== UserTypes.TYPE_SELLER) {
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: ['Only Seller is permitted to add product'],
            data: {}
          };
          return resolve(result);
        }

        const product = await ProductModel.findOne({});
        let newProduct = this.productService.createProduct({
          title,
          sku,
          description,
          topic,
          priceRange,
          slug,
          originalPrice,
          user});

        if (!product) {
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: ['Product SKU is duplicated'],
            data: {newProduct}
          };
          return resolve(result);
        }

        const result: IRes<{}> = {
          status: HttpCodes.SUCCESS,
          messages: ['Successfully'],
          data: {
            meta: {
            },
            entries: []
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