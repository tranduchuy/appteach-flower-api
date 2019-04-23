import { injectable } from 'inversify';
import UrlParamModel, { UrlParam } from '../models/url-param';
import ProductModel, { Product } from '../models/product';

@injectable()
export class SearchService {
  async searchUrlParamByQuery(query: any): Promise<UrlParam> {
    return <UrlParam>await UrlParamModel.findOne(query);
  }

  async createUrlParamByQuery(query: any): Promise<UrlParam> {
    const _query = {...query};
    _query.url = this.createUrlByQuery(query);

    const newUrlParam = new UrlParamModel(_query);
    return await newUrlParam.save();
  }

  createUrlByQuery(query: any): string {
    // TODO
    const queryFields = [
      'topic', 'specialOccasion', 'floret', 'design', 'color', 'priceRange', 'city', 'district'
    ];

    return queryFields
      .filter(f => query[f])
      .map(f => query[f])
      .join('-');
  }

  async searchListByUrlParam(condition: {url: string, limit: number, page: number}): Promise<{total: number, products: Product[]}> {
    const urlParam: UrlParam | null = await UrlParamModel.findOne({url: condition.url});
    if (!urlParam) {
      return {
        total: 0,
        products: []
      };
    }

    const queryFields = [
      'topic', 'specialOccasion', 'floret', 'design', 'color', 'priceRange', 'city', 'district'
    ];

    const queryObj = {};
    queryFields.forEach(f => {
      if (urlParam[f] !== null) {
        queryObj[f] = urlParam[f];
      }
    });

    const stages = [
      {
        $match: queryObj
      },
      {
        $facet: {
          entries: [
            {$skip: (condition.page - 1) * condition.limit},
            {$limit: condition.limit}
          ],
          meta: [
            {$group: {_id: null, totalItems: {$sum: 1}}},
          ],
        }
      }
    ];

    const result = (await ProductModel.aggregate(stages))[0];

    return {
      total: result.meta[0] ? result.meta[0].totalItems : 0,
      products: result.entries
    };
  }
}

