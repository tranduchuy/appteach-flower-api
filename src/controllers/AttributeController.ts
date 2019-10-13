import { controller, httpGet } from 'inversify-express-utils';
import { Request } from 'express';
import * as RouteMaps from '../constant/routeMap';
import AttributeValue from '../models/attribute-value.model';
import AttributeModel from '../models/attribute.model';

@controller('/attributes')
export class AttributeController {
  @httpGet(RouteMaps.Attribute.All)
  public getAllAttribute(req: Request) {
    return new Promise(async (resolve, reject) => {
      return resolve({
        data: {
          attributes: await AttributeModel.findAll({
            include: [
              {model: AttributeValue, as: 'values'}
            ]
          })
        }
      });
    });
  }
}
