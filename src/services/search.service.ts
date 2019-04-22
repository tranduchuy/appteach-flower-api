import { injectable } from 'inversify';
import UrlParamModel, { UrlParam } from '../models/url-param';

@injectable()
export class SearchService {
  async searchUrlParamByQuery(query: any): Promise<UrlParam> {
    return <UrlParam>await UrlParamModel.findOne(query);
  }

  async createUrlParamByQuery(query: any): Promise<UrlParam> {
    const _query = {...query};
    _query.url = this.createUrlByQuery(query);

    console.log(JSON.stringify(_query));
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
}

