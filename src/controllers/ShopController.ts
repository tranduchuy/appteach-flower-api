import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import TYPES from '../constant/types';
import { Request } from 'express';
import { IRes } from '../interfaces/i-res';
import { ShopService } from '../services/shop.service';

@controller('/shop')
export class ShopController {
  constructor(@inject(TYPES.ShopService) private shopService: ShopService) {

  }

  @httpPost('/', TYPES.CheckTokenMiddleware)
  public registerShop(req: Request): Promise<IRes<any>> {
    return new Promise<IRes<any>>(resolve => {

    });
  }
}