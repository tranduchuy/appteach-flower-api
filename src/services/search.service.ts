import { injectable } from 'inversify';
import UrlParamModel, { UrlParam } from '../models/url-param';
import ProductModel, { Product } from '../models/product';
import TagModel from '../models/tag';
import { SelectorService } from './selector.service';
import { SearchSelector } from '../constant/search-selector.constant';
import urlSlug from 'url-slug';

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
    const _query = {...query};
    const url = urlSlug(this.createTitleByQuery(_query).trim());

    return url;
  }

  createTitleByQuery(query: any): string {
    let title = '';
    const {
      topic, specialOccasion, floret, design, color, priceRange, city, district
    } = query;

    let titleEles = [];
    if (design)
      titleEles.push(SelectorService.getTextByValue(SearchSelector.Designs, design));

    if (floret)
      titleEles.push(SelectorService.getTextByValue(SearchSelector.Florets, floret));

    if (color)
      titleEles.push(SelectorService.getTextByValue(SearchSelector.Colors, color));

    if (specialOccasion)
      titleEles.push(SelectorService.getTextByValue(SearchSelector.SpecialOccasions, specialOccasion));
    else if (topic)
      titleEles.push(SelectorService.getTextByValue(SearchSelector.Topics, topic));

    if (city) {
      const objCity = SelectorService.getCityByCode(city);
      if (objCity && objCity.name) {
        const objDistrict = SelectorService.getDistrictByValue(objCity, district);
        if (objDistrict && objDistrict.name)
          titleEles.push('tại', objDistrict.name, objCity.name);
        else
          titleEles.push('tại', objCity.name);
      }
    }

    if (priceRange)
      titleEles.push('giá', SelectorService.getTextByValue(SearchSelector.PriceRanges, priceRange));

    titleEles = titleEles.filter(e => e !== null);
    title = titleEles.join(' ');
    title = title.replace('hoa Hoa', 'hoa');

    return title;
  }

  async searchListByUrlParam(condition: { url: string, limit: number, page: number, sortBy?: string, sortDirection?: string }): Promise<{ total: number, products: Product[] }> {
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

    const stages: any[] = [
      {
        $match: queryObj
      }
    ];

    if (condition.sortBy) {
      const sortStage = {
        $sort: {}
      };
      sortStage.$sort[condition.sortBy] = condition.sortDirection === 'DESC' ? -1 : 1;
      stages.push(sortStage);
    }

    stages.push({
      $facet: {
        entries: [
          {$skip: (condition.page - 1) * condition.limit},
          {$limit: condition.limit}
        ],
        meta: [
          {$group: {_id: null, totalItems: {$sum: 1}}}
        ]
      }
    });

    const result = (await ProductModel.aggregate(stages))[0];

    return {
      total: result.meta[0] ? result.meta[0].totalItems : 0,
      products: result.entries
    };
  }

  async searchListByTag(condition: { tagSlug: string, limit: number, page: number, sortBy?: string, sortDirection?: string }): Promise<{ total: number, products: Product[], searchQuery: Object }> {
    const tag = await TagModel.findOne({slug: condition.tagSlug});
    if (!tag) {
      return {
        total: 0,
        products: [],
        searchQuery: {}
      };
    }

    const queryObj = {};
    queryObj['tags'] = tag._id;

    const stages: any[] = [
      {
        $match: queryObj
      }
    ];

    if (condition.sortBy) {
      const sortStage = {
        $sort: {}
      };
      sortStage.$sort[condition.sortBy] = condition.sortDirection === 'DESC' ? -1 : 1;
      stages.push(sortStage);
    }

    stages.push({
      $facet: {
        entries: [
          {$skip: (condition.page - 1) * condition.limit},
          {$limit: condition.limit}
        ],
        meta: [
          {$group: {_id: null, totalItems: {$sum: 1}}}
        ]
      }
    });

    const result = (await ProductModel.aggregate(stages))[0];
    let searchQuery = {};
    if (result.entries.length > 0) {
      searchQuery = this.getSearchQueryFromProduct(result.entries[0]);
    }

    return {
      total: result.meta[0] ? result.meta[0].totalItems : 0,
      products: result.entries,
      searchQuery
    };
  }

  getSearchQueryFromProduct(product: Product): Object {

    return {
      topic: product.topic || null,
      specialOccasion: product.specialOccasion || null,
      design: product.design || null,
      floret: product.floret || null,
      city: product.city || null,
      district: product.district || null,
      color: product.color || null,
      priceRange: product.priceRange || null
    };
  }

  async getSearchQueryFromUrlParam(url: string): Promise<any> {
    const urlParam: any = await UrlParamModel.findOne({url}).lean();
    if (!urlParam) {
      return Promise.resolve({});
    }

    return Promise.resolve({
      topic: urlParam.topic,
      specialOccasion: urlParam.specialOccasion,
      design: urlParam.design,
      floret: urlParam.floret,
      city: urlParam.city,
      district: urlParam.district,
      color: urlParam.color,
      priceRange: urlParam.priceRange
    });
  }
}

