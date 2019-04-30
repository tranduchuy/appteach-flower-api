import { Request } from 'express';
import * as HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { ResponseMessages } from '../../constant/messages';
import TYPES from '../../constant/types';
import { IRes } from '../../interfaces/i-res';
import ProductModel, {Product} from '../../models/product';
import { ProductService } from '../../services/product.service';
import Joi from '@hapi/joi';

// schemas
import ListProductSchema from '../../validation-schemas/user/admin-list-product.schema';

interface IResProducts {
  meta: {
    totalItems: number
  };
  products: Product[];
}

@controller('/admin/product')
export class AdminProductController {
  constructor(@inject(TYPES.ProductService) private productService: ProductService){

  }

  @httpGet('/', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public getList(req: Request): Promise<IRes<IResProducts>> {
    return new Promise<IRes<IResProducts>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.query, ListProductSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<IResProducts> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages
          };
          return resolve(result);
        }

        const {shop_id, product_name, limit, page, status, sb, sd} = req.query;
        const stages: any[] = this.productService.buildStageGetListProduct({
          shop_id: shop_id ? shop_id : null,
          product_name: product_name ? product_name : null,
          limit: parseInt((limit || 10).toString()),
          page: parseInt((page || 1).toString()),
          status: status ? parseInt(status) : null,
          sb: sb,
          sd: sd,
        });

        const result: any = await ProductModel.aggregate(stages);
        const response: IRes<IResProducts> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            meta: {
              totalItems: result[0].meta[0] ? result[0].meta[0].totalItems : 0
            },
            products: result[0].entries
          }
        };

        resolve(response);
      }
      catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<IResProducts> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        resolve(result);
      }
    });
  }
}