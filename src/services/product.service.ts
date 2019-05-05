import { injectable } from 'inversify';
import ProductModel from '../models/product';
import TagModel from '../models/tag';

import urlSlug from 'url-slug';
import { SearchSelector } from '../constant/search-selector.constant';
import PriceRanges = SearchSelector.PriceRanges;
import mongoose from 'mongoose';

import RandomString from 'randomstring';
import { General } from '../constant/generals';
import ProductStatus = General.ProductStatus;
import { Status } from "../constant/status";

export interface IQueryProduct {
  shop_id: string;
  product_name: string;
  limit: number;
  page: number;
  status: number;
  sb?: string;
  sd?: string;
}

@injectable()
export class ProductService {
  listProductFields = ['_id', 'status', 'title', 'image', 'originalPrice', 'saleOff', 'slug'];
  detailProductFields =
    ['_id', 'status', 'title', 'description', 'user', 'images', 'originalPrice', 'saleOff', 'slug', 'sku', 'topic', 'design',
      'specialOccasion', 'floret', 'city', 'district', 'color', 'seoUrl', 'seoDescription', 'tags', 'seoImage','shop','priceRange'];

  static detectPriceRange(price: number): number {
    let priceRange = null;
    const range = PriceRanges.find(range => {
      if (range.min && range.max) {
        return (range.min <= price && price < range.max);
      } else {
        return (range.min <= price);
      }
    });
    if (range) {
      priceRange = range.value;
    }

    return priceRange;
  }

  createProduct = async ({
                           title, sku, status, description, topic, shopId, images, salePrice, originalPrice, keywordList,
                           design, specialOccasion, floret, city, district, color, seoUrl, seoDescription, seoImage
                         }) => {
    const priceRange = ProductService.detectPriceRange(originalPrice);



    // TODO: generate slug
    let slug = urlSlug(title);

    const duplicatedNumber = await ProductModel.count({
      title: title
    });
    if (duplicatedNumber > 0) {
      slug = `${slug}-${duplicatedNumber}`;
    }

    let saleOff = {
      price: 0,
      startDate: null,
      endDate: null,
      active: false
    };
    if (salePrice) {
      saleOff = {
        price: salePrice,
        startDate: null,
        endDate: null,
        active: false
      };
    }
    const code = RandomString.generate() + Date.now();
    const newProduct = new ProductModel({
      title,
      sku,
      description,
      topic,
      priceRange,
      slug,
      code,
      originalPrice,
      status: status || ProductStatus.ACTIVE,
      shop: new mongoose.Types.ObjectId(shopId),
      images: images || [],
      design: design || null,
      specialOccasion: specialOccasion || null,
      floret: floret || null,
      city: city || null,
      district: district || null,
      color: color || null,
      seoUrl: seoUrl || null,
      seoDescription: seoDescription || null,
      seoImage: seoImage || null,
      saleOff: saleOff
    });

    // TODO: add tags
    if (keywordList && keywordList.length > 0) {
      for (let i = 0; i < keywordList.length; i++) {
        let key = keywordList[i];

        let slug = urlSlug(key);

        if (!slug) {
          continue;
        }

        let tag = await TagModel.findOne({status: Status.ACTIVE, slug: slug});

        if (!tag) {
          tag = new TagModel({
            slug: slug,
            keyword: key,
          });
          tag = await tag.save();
        }
        newProduct.tags.push(tag._id);
      }
    }

    return await newProduct.save();
  };

  findProductById = async (productId) => {
    try {
      return await ProductModel.findOne({_id: productId})
          .populate('shop');
    } catch (e) {
      console.log(e);
    }

  };

  updateProduct = async (product, {
    title, sku, description, topic, images, saleOff, originalPrice, keywordList,
    design, specialOccasion, floret, city, district, color, seoUrl, seoDescription, seoImage
  }) => {
    try {
      // TODO: map price ranges
      const productId = product._id;
      let priceRange = null;
      const range = PriceRanges.find(range => {
        if (range.min && range.max) {
          return (range.min <= originalPrice && originalPrice < range.max);
        } else {
          return (range.min <= originalPrice);
        }
      });
      if (range) {
        priceRange = range.value;
      }

      const defaultSaleOff = product.saleOff;
      Object.assign(defaultSaleOff, saleOff);
      let newOriginalPrice = 0;
      if (originalPrice === 0) {
        newOriginalPrice = originalPrice;
      } else {
        newOriginalPrice = originalPrice || null;
      }

      const newProduct = {
        title: title || null,
        sku: sku || null,
        description: description || null,
        topic: topic || null,
        priceRange: priceRange || null,
        saleOff: defaultSaleOff,
        originalPrice: newOriginalPrice,
        images: images || null,
        design: design || null,
        specialOccasion: specialOccasion || null,
        floret: floret || null,
        city: city || null,
        district: district || null,
        color: color || null,
        seoUrl: seoUrl || null,
        seoDescription: seoDescription || null,
        seoImage: seoImage || null,
        tags: [],
        updatedAt: new Date()
      };

      if (keywordList && keywordList.length > 0) {
        for (let i = 0; i < keywordList.length; i++) {
          let key = keywordList[i];

          let slug = urlSlug(key);

          if (!slug) {
            continue;
          }

          let tag = await TagModel.findOne({status: Status.ACTIVE, slug: slug});

          if (!tag) {
            tag = new TagModel({
              slug: slug,
              keyword: key,
            });
            tag = await tag.save();
          }
          newProduct.tags.push(tag._id);
        }
      }
      newProduct.tags = newProduct.tags.length > 0 ? newProduct.tags : null;


      Object.keys(newProduct).map(key => {
        if (newProduct[key] === null) {
          delete newProduct[key];
        }
      });
      console.log(newProduct);
      return await ProductModel.findOneAndUpdate({_id: productId}, newProduct);
    } catch (e) {
      console.log(e);
    }

  };

  updateProductStatus = async (product, status) => {
    return await ProductModel.findOneAndUpdate({_id: product._id}, {
      status: status || product.status,
      updatedAt: new Date()
    });
  };

  updateViews = async (slug) => {
    try {
      const product = await ProductModel.findOne({slug: slug});
      if (product) {
        product.view = product.view + 1;
        return await product.save();
      }
    } catch (e) {
      console.log(e);
    }
  };

  getFeaturedProducts = async () => {
    try {
      const products = await ProductModel.find({status: Status.ACTIVE}, this.listProductFields).sort({
        view: -1
      }).limit(General.HOME_PRODUCT_LIMIT);

      return products;
    } catch (e) {
      console.log(e);
    }
  };

  getSaleProducts = async () => {
    try {
      const products = await ProductModel.find({'saleOff.active': true, status: Status.ACTIVE}, this.listProductFields).sort({
        updatedAt: -1
      }).limit(General.HOME_PRODUCT_LIMIT);

      return products;
    } catch (e) {
      console.log(e);
    }
  };

  getProductDetail = async (slug) => {
    try {
      return await ProductModel.findOne({slug: slug}, this.detailProductFields);
    } catch (e) {
      console.log(e);
    }
  };

  getProductDetailById = async (id) => {
    try {
      const product:any = await ProductModel.findOne({_id: id}, this.detailProductFields);
      const keywords = await Promise.all(product.tags.map(async id=>{
        const tag = await TagModel.findById(id);
        return tag.keyword;
      }));
      product.tags = keywords;
      return product;
    } catch (e) {
      console.log(e);
    }
  };


  getRelatedProducts = async (product) => {
    try {
      const queryArr = [];
      const query = {
        _id: {$ne: product._id},
        topic: product.topic || null,
        specialOccasion: product.specialOccasion || null,
        floret: product.floret || null,
        design: product.design || null,
        color: product.color || null,
        priceRange: product.priceRange || null,
        city: product.city || null,
        district: product.district || null
      };

      Object.keys(query).map(key => {
        if (query[key] === null) {
          delete query[key];
        }
      });

      const newObject = Object.assign({}, query);
      queryArr.push(newObject);
      let queryKeys = Object.keys(query);
      let queryLength = queryKeys.length;

      while (queryLength > 2) {
        delete query[queryKeys[queryLength - 1]];
        queryKeys = Object.keys(query);
        queryLength = queryKeys.length;
        const newObject = Object.assign({}, query);
        queryArr.push(newObject);
      }

      const relatedProducts = await ProductModel.find({$or: queryArr}, this.listProductFields).limit(General.RELATED_PRODUCT_LIMIT);
      return relatedProducts;
    } catch (e) {
      console.log(e);
    }
  };

  buildStageGetListProduct(queryCondition: IQueryProduct): any[] {
    const stages = [];
    const matchStage: any = {};
    if (queryCondition.shop_id) {
      matchStage['shop'] = queryCondition.shop_id;
    }

    if (queryCondition.status) {
      matchStage['status'] = queryCondition.status;
    }

    if (queryCondition.product_name) {
      matchStage['title'] = {"$regex": queryCondition.product_name, "$options": "i" };
    }

    if (Object.keys(matchStage).length > 0) {
      stages.push({$match: matchStage});
    }

    if (queryCondition.sb) {
      stages.push({
        $sort: {
          [queryCondition.sb]: queryCondition.sd === 'ASC' ? 1 : -1
        }
      });
    }

    stages.push({
      $facet: {
        entries: [
          {$skip: (queryCondition.page - 1) * queryCondition.limit},
          {$limit: queryCondition.limit}
        ],
        meta: [
          {$group: {_id: null, totalItems: {$sum: 1}}},
        ],
      }
    });

    return stages;
  }
}
