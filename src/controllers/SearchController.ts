import { Request } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { HttpCodes } from '../constant/http-codes';
import TYPES from '../constant/types';
import { IRes } from '../interfaces/i-res';
import Joi from '@hapi/joi';
import { UrlParam } from '../models/url-param';
import { SearchService } from '../services/search.service';
import boxSchema from '../validation-schemas/search/box.schema';

@controller('/search')
export class SearchController {
  constructor(@inject(TYPES.SearchService) private searchService: SearchService) {

  }

  @httpGet('/')
  public search(): Promise<any> {
    return new Promise<any>((resolve) => {

    });
  }

  @httpPost('/box')
  public box(req: Request): Promise<any> {
    return new Promise<any>(async (resolve) => {
      const {error} = Joi.validate(req.body, boxSchema);
      if (error) {
        const messages = error.details.map(detail => {
          return detail.message;
        });

        const result: IRes<{}> = {
          status: HttpCodes.ERROR,
          messages: messages,
          data: {}
        };

        return resolve(result);
      }

      const queryFields = [
        'topic', 'specialOccasion', 'floret', 'design', 'color', 'priceRange', 'city', 'district'
      ];

      const queryObj: any = {};

      queryFields.forEach((field: string) => {
        if (req.body[field] !== null && req.body[field] !== undefined) {
          queryObj[field] = req.body[field];
        } else {
          queryObj[field] = null;
        }
      });

      console.log(queryObj);
      let urlParamInstance: UrlParam = await this.searchService.searchUrlParamByQuery(queryObj);
      if (!urlParamInstance) {
        urlParamInstance = await this.searchService.createUrlParamByQuery(queryObj);
      }

      resolve({
        status: HttpCodes.SUCCESS,
        messages: ['Success'],
        data: {
          url: urlParamInstance.customUrl || urlParamInstance.url
        }
      });
    });
  }
}
