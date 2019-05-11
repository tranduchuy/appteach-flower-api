import { Request } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import * as HttpStatus from 'http-status-codes';
import TYPES from '../constant/types';
import { IRes } from '../interfaces/i-res';
import Joi from '@hapi/joi';
import { Product } from '../models/product';
import { UrlParam } from '../models/url-param';
import { SearchService } from '../services/search.service';
import { ShopService } from '../services/shop.service';
import boxSchema from '../validation-schemas/search/box.schema';
import searchSchema from '../validation-schemas/search/search.schema';
import Url from 'url';
import { ProductService } from '../services/product.service';

interface ISearchBoxResponse {
  url: string;
}

interface ISearchResponse {
  searchQuery?: any;
  isList?: boolean;
  isDetail?: boolean;
  products?: Product[];
  product?: Product;
  relatedProducts?: Product[];
  shopInfo?: any;
  totalItems?: number;
}

const SLUG_CAT = 'danh-muc';
const SLUG_DETAIL = 'chi-tiet-san-pham';

@controller('/search')
export class SearchController {
  constructor(@inject(TYPES.SearchService) private searchService: SearchService,
              @inject(TYPES.ShopService) private shopService: ShopService,
              @inject(TYPES.ProductService) private productService: ProductService) {

  }

  @httpGet('/')
  public search(req: Request): Promise<IRes<ISearchResponse>> {
    return new Promise<IRes<ISearchResponse>>(async (resolve) => {
      const {error} = Joi.validate(req.query, searchSchema);
      if (error) {
        const messages = error.details.map(detail => {
          return detail.message;
        });

        const result: IRes<ISearchResponse> = {
          status: HttpStatus.BAD_REQUEST,
          messages: messages
        };

        return resolve(result);
      }

      const url = req.query.url || '';
      if (!url) {
        const result: IRes<ISearchResponse> = {
          status: HttpStatus.BAD_REQUEST,
          messages: ['Url is required']
        };

        return resolve(result);
      }

      const eles = Url.parse(req.query.url).pathname.split('/');
      if (eles.length < 2) {
        const result: IRes<ISearchResponse> = {
          status: HttpStatus.BAD_REQUEST,
          messages: ['Url is wrong']
        };

        return resolve(result);
      }

      const resultSuccess: IRes<ISearchResponse> = {
        status: HttpStatus.OK,
        messages: ['Success'],
        data: {}
      };

      if (SLUG_CAT === eles[0]) {
        // case search list
        const result = await this.searchService.searchListByUrlParam({
          url: eles[1],
          limit: parseInt((req.query.limit || 10).toString()),
          page: parseInt((req.query.page || 1).toString()),
          sortBy: req.query.sb || '',
          sortDirection: req.query.sd || ''
        });
        resultSuccess.data.isList = true;
        resultSuccess.data.products = result.products;
        resultSuccess.data.totalItems = result.total;
        resultSuccess.data.searchQuery = await this.searchService.getSearchQueryFromUrlParam(eles[1]);
      } else if (SLUG_DETAIL === eles[0]) {
        // case detail product
        resultSuccess.data.isDetail = true;
        resultSuccess.data.product = await this.productService.getProductDetail(eles[1]);
        resultSuccess.data.searchQuery = this.productService.getSearchQueryFromProduct(resultSuccess.data.product);
        resultSuccess.data.relatedProducts = await this.productService.getRelatedProducts(resultSuccess.data.product);
        resultSuccess.data.shopInfo = await this.shopService.findShopById(resultSuccess.data.product.shop.toString());
        delete resultSuccess.data.product.shop;
        // update product view
        await this.productService.updateViews(eles[1]);
      }

      resolve(resultSuccess);
    });
  }

  @httpPost('/box')
  public box(req: Request): Promise<IRes<ISearchBoxResponse>> {
    return new Promise<IRes<ISearchBoxResponse>>(async (resolve) => {
      const {error} = Joi.validate(req.body, boxSchema);
      if (error) {
        const messages = error.details.map(detail => {
          return detail.message;
        });

        const result: IRes<ISearchBoxResponse> = {
          status: HttpStatus.BAD_REQUEST,
          messages: messages
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

      let urlParamInstance: UrlParam = await this.searchService.searchUrlParamByQuery(queryObj);
      if (!urlParamInstance) {
        urlParamInstance = await this.searchService.createUrlParamByQuery(queryObj);
      }

      resolve({
        status: HttpStatus.OK,
        messages: ['Success'],
        data: {
          url: urlParamInstance.customUrl || urlParamInstance.url
        }
      });
    });
  }
}
