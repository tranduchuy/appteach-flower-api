import * as HttpStatus from 'http-status-codes';

import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import TYPES from '../constant/types';
import { IRes } from '../interfaces/i-res';
import { CartService } from '../services/cart.service';
import { CartRoute } from '../constant/routeMap';
import { Cart } from '../models/cart';
import { ResponseMessages } from '../constant/messages';
import { ProductService } from '../services/product.service';
import { HttpCodes } from '../constant/http-codes';

@controller(CartRoute.Name)
export class CartController {
  constructor(
    @inject(TYPES.ProductService) private productService: ProductService,
    @inject(TYPES.CartService) private cartService: CartService
  ) {
  }

  // @httpGet(CartRoute.Root)
  // public getCart(request: Request, response: Response): Promise<IRes<Product[]>> {
  //   // if not have, return empty cart
  // }

  @httpPost(CartRoute.AddProduct, TYPES.CheckTokenMiddleware)
  public addOne(request: Request, response: Response): Promise<IRes<Cart>> {
    return new Promise<IRes<Cart>>(async (resolve, reject) => {
      try {
        const productId = request.params.productId;
        const user = request.user;

        let cart = await this.cartService.findCart(user.id);
        if (!cart) cart = await this.cartService.createCart(user);

        const product = await this.productService.findProduct(productId);
        if (!product) {
          const result: IRes<Cart> = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Product.PRODUCT_NOT_FOUND],
            data: null
          };
          return resolve(result);
        }

        await this.cartService.addToCart(cart, product);
        const result: IRes<Cart> = {
          status: HttpCodes.SUCCESS,
          messages: [ResponseMessages.SUCCESS],
          data: cart
        };
        resolve(result);
      } catch (error) {
        console.log(error);

        const result: IRes<Cart> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: error.messages,
          data: null
        };
        resolve(result);
      }
    });
  }
}