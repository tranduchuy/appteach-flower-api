import { controller, httpGet } from 'inversify-express-utils';
import { IRes } from '../../interfaces/i-res';
import { Product } from '../../models/product';

interface IResProducts {
  meta: {
    totalItems: number
  };
  products: Product[];
}

@controller('/admin/product')
export class AdminProductController {
  @httpGet('/')
  public getList(): Promise<IRes<IResProducts>> {
    return new Promise<IRes<IResProducts>>((resolve) => {

    });
  }
}