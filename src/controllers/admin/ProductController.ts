import { controller, httpGet } from 'inversify-express-utils';
import { IRes } from '../../interfaces/i-res';
import { Product } from '../../models/product';
//import * as HttpStatus from 'http-status-codes';

interface IResProducts {
  meta: {
    totalItems: number
  };
  products: Product[];
}

@controller('/admin/product')
export class ProductController {
  @httpGet('/')
  public getList(): Promise<IRes<IResProducts>> {
    return new Promise<IRes<IResProducts>>((resolve) => {

    });
  }
}