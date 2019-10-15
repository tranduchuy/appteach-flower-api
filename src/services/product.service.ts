import { injectable } from 'inversify';
import ProductModel, { Product } from '../models/product.model';
import TagModel from '../models/tag';
import urlSlug from 'url-slug';
import generate from 'nanoid/generate';
import { SearchSelector } from '../constant/search-selector.constant';
import PriceRanges = SearchSelector.PriceRanges;
import { General } from '../constant/generals';
import { Status } from '../constant/status';
import * as _ from 'lodash';
import AttributeValueModel from '../models/attribute-value.model';
import AttributeModel from '../models/attribute.model';
import sequelize from 'sequelize';
import ProductHasTag from '../models/product-has-tags.model';
import ImageProduct from '../models/image-product.model';
import SaleOffProduct from '../models/sale-off-product.model';
import ShopHasProduct from '../models/shop-has-product.model';

const requireAttributeWhenCreateNew = [1];

export interface ISaleOffProduct {
    status: number;
    price: number;
    startDate: Date;
    endDate: Date;
    productId: number;
}

export interface IQueryProduct {
    shop_id: string;
    title: string;
    limit: number;
    page: number;
    sku: string;
    approvedStatus: number;
    maxPrice: number;
    minPrice: number;
    saleOff: boolean;
    status: number;
    sb?: string;
    sd?: string;
}

@injectable()
export class ProductService {
  listProductFields = [
    '_id',
    'status',
    'title',
    'images',
    'originalPrice',
    'saleOff',
    'slug'
  ];
  detailProductFields = [
    '_id',
    'status',
    'title',
    'sold',
    'description',
    'user',
    'images',
    'originalPrice',
    'saleOff',
    'slug',
    'sku',
    'view',
    'topic',
    'design',
    'specialOccasion',
    'floret',
    'city',
    'district',
    'color',
    'seoUrl',
    'seoDescription',
    'tags',
    'seoImage',
    'shop',
    'priceRange',
    'freeShip'
  ];

  findProductById = async (productId: number) => {
    try {
      return await ProductModel.findOne({
        where: { id: productId },
        include: [
          {
            model: ShopHasProduct,
            as: 'shopHasProductInfo',
            duplicating: false
          }
        ]
      });
    } catch (e) {
      console.log(e);
    }
  };

  findListProductByIds = async (productIds: number[]) =>
    ProductModel.findAll({
      where: {
        id: {
          [sequelize.Op.in]: productIds
        }
      }
    });

  updateProduct = async (
    product,
    {
      title,
      sku,
      description,
      topic,
      images,
      saleOff,
      originalPrice,
      keywordList,
      freeShip,
      design,
      specialOccasion,
      floret,
      city,
      district,
      color,
      seoUrl,
      seoDescription,
      seoImage
    }
  ) => {
    try {
      // TODO: map price ranges
    //   const productId = product.id;
      const priceRange = ProductService.detectPriceRange(originalPrice);

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
        updatedAt: new Date(),
        freeShip
      };

      if (keywordList && keywordList.length > 0) {
        for (let i = 0; i < keywordList.length; i++) {
          const key = keywordList[i];
          const slug = urlSlug(key);
          if (!slug) {
            continue;
          }

          let tag = await TagModel.findOne({
            status: Status.ACTIVE,
            slug: slug
          });
          if (!tag) {
            tag = new TagModel({
              slug: slug,
              keyword: key
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

      // TODO: update product
      return null;
    //   return await ProductModel.findOneAndUpdate(
    //     { _id: productId },
    //     newProduct
    //   );
    } catch (e) {
      console.log(e);
    }
  };

  updateProductStatus = async (
    product: Product,
    status: number
  ): Promise<void> => {
    await ProductModel.update(
      {
        status: status || product.status
      },
      {
        where: {
          id: product.id
        }
      }
    );
  };

  updateProductApprovedStatus = async (
    product: Product,
    status: number
  ): Promise<void> => {
    ProductModel.update(
      {
        approvedStatus: status || product.approvedStatus,
        updatedAt: new Date()
      },
      {
        where: {
          id: product.id
        }
      }
    );
  };

  updateViews = async (slug: string): Promise<void> => {
    try {
      const product = await ProductModel.findOne({
        where: {
          slug
        }
      });

      if (product) {
        product.view = product.view + 1;
        await product.save();
      }
    } catch (e) {
      console.error(e);
    }
  };

  getFeaturedProducts = async (): Promise<Product[]> => {
    try {
      return await ProductModel.findAll(
        {
          where: {
            status: Status.ACTIVE,
            approvedStatus: Status.PRODUCT_APPROVED
          },
          order: [
              ['view', 'DESC']
          ],
          limit: 15
        }
      );
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  getSaleProducts = async (): Promise<Product[]> => {
      return [];
    // try {
    //   return await ProductModel.find(
    //     {
    //       'saleOff.active': true,
    //       status: Status.ACTIVE,
    //       approvedStatus: Status.PRODUCT_APPROVED
    //     },
    //     this.listProductFields
    //   )
    //     .sort({
    //       updatedAt: -1
    //     })
    //     .limit(General.HOME_PRODUCT_LIMIT);
    // } catch (e) {
    //   console.error(e);
    //   return [];
    // }
  };

  getNewProducts = async (): Promise<Product[]> => {
    try {
      return await ProductModel.findAll(
        {
          where: {
            status: Status.ACTIVE,
            approvedStatus: Status.PRODUCT_APPROVED
          },
          order: [],
          limit: General.HOME_PRODUCT_LIMIT
        }
      );
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  getProductDetail = async (slug: string): Promise<Product> => {
    return await ProductModel.findOne(
      {
          where: { slug: slug }
      }
    );
    // TODO: should get tags of product
  };

  getProductDetailById = async (id: number) => {

    return await Product.findOne({
        where: {
            id
        }
    });

    // TODO: should return tags and shopInfo

    // try {
    //   const product: any = await ProductModel.findOne(
    //     { _id: id },
    //     this.detailProductFields
    //   )
    //     .populate({ model: ShopModel, path: 'shop' })
    //     .populate({ model: TagModel, path: 'tags' });

    //   product.tags = await Promise.all(
    //     product.tags.map(async id => {
    //       const tag = await TagModel.findById(id);
    //       return tag.keyword;
    //     })
    //   );

    //   return product;
    // } catch (e) {
    //   console.log(e);
    //   return null;
    // }
  };

  getRelatedProducts = async (product): Promise<Product[]> => {
    // TODO: getRelatedProducts
      return [];
    // try {
    //   const queryArr = [];
    //   const query = {
    //     _id: { $ne: product._id },
    //     status: Status.ACTIVE,
    //     approvedStatus: Status.PRODUCT_APPROVED,
    //     topic: product.topic || null,
    //     specialOccasion: product.specialOccasion || null,
    //     floret: product.floret || null,
    //     design: product.design || null,
    //     color: product.color || null,
    //     priceRange: product.priceRange || null,
    //     city: product.city || null,
    //     district: product.district || null
    //   };

    //   Object.keys(query).map(key => {
    //     if (query[key] === null) {
    //       delete query[key];
    //     }
    //   });

    //   const newObject = Object.assign({}, query);
    //   queryArr.push(newObject);
    //   let queryKeys = Object.keys(query);
    //   let queryLength = queryKeys.length;

    //   while (queryLength > 2) {
    //     delete query[queryKeys[queryLength - 1]];
    //     queryKeys = Object.keys(query);
    //     queryLength = queryKeys.length;
    //     const newObject = Object.assign({}, query);
    //     queryArr.push(newObject);
    //   }

    //   return await ProductModel.find(
    //     { $or: queryArr },
    //     this.listProductFields
    //   ).limit(General.RELATED_PRODUCT_LIMIT);
    // } catch (e) {
    //   return null;
    // }
  };

  findProductsByProductIds = async (productIds: number[]): Promise<Product[]> => {
    try {
      return await ProductModel.findAll({
        where: {
            id: {
                [sequelize.Op.in]: productIds
            }
        }
      });
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  mappingListProducts = products => {
    return products.map(product => {
      return {
        _id: product._id,
        status: product.status,
        title: product.title,
        images: product.images,
        originalPrice: product.originalPrice,
        saleOff: product.saleOff,
        slug: product.slug
      };
    });
  };

  static detectPriceRange(price: number): number {
    let priceRange = null;
    const range = PriceRanges.find(range => {
      if (range.min && range.max) {
        return range.min <= price && price < range.max;
      } else {
        return range.min <= price;
      }
    });
    if (range) {
      priceRange = range.value;
    }

    return priceRange;
  }

  buildStageGetListProduct(queryCondition: IQueryProduct): any[] {
    const stages = [];
    const matchStage: any = {};
    if (queryCondition.shop_id) {
      matchStage['shop'] = queryCondition.shop_id;
    }

    if (queryCondition.status) {
      matchStage['status'] = queryCondition.status;
    }

    if (queryCondition.approvedStatus) {
      matchStage['approvedStatus'] = queryCondition.approvedStatus;
    }

    if (queryCondition.sku) {
      matchStage['sku'] = queryCondition.sku;
    }

    if (queryCondition.minPrice) {
      matchStage['originalPrice'] = { $gte: queryCondition.minPrice };
    }

    if (queryCondition.maxPrice) {
      matchStage['originalPrice'] = { $lt: queryCondition.maxPrice };
    }

    if (_.isBoolean(queryCondition.saleOff)) {
      matchStage['saleOff.active'] = queryCondition.saleOff;
    }

    if (queryCondition.title) {
      matchStage['title'] = { $regex: queryCondition.title, $options: 'i' };
    }

    if (Object.keys(matchStage).length > 0) {
      stages.push({ $match: matchStage });
    }

    stages.push({
      $lookup: {
        from: 'shops',
        localField: 'shop',
        foreignField: '_id',
        as: 'shopInfo'
      }
    });

    stages.push({ $unwind: { path: '$shopInfo' } });

    if (queryCondition.sb) {
      stages.push({
        $sort: {
          [queryCondition.sb]: queryCondition.sd === 'ASC' ? 1 : -1
        }
      });
    } else {
      stages.push({
        $sort: {
          createdAt: -1
        }
      });
    }

    stages.push({
      $facet: {
        entries: [
          { $skip: (queryCondition.page - 1) * queryCondition.limit },
          { $limit: queryCondition.limit }
        ],
        meta: [{ $group: { _id: null, totalItems: { $sum: 1 } } }]
      }
    });

    return stages;
  }

  async updateMultipleProducts(productIds: number[], status: number) {
    await ProductModel.update(
      {
        status
      },
      {
        where: {
          id: productIds
        }
      }
    );
  }

  getSearchQueryFromProduct(product: Product): any {
      return {};
      // TODO: get search form of un product
    // let priceRange = ProductService.detectPriceRange(product.originalPrice);
    // if (product.saleOff.active === true) {
    //   priceRange = ProductService.detectPriceRange(product.saleOff.price);
    // }

    // return {
    //   topic: product.topic,
    //   specialOccasion: product.specialOccasion,
    //   design: product.design,
    //   floret: product.floret,
    //   city: product.city,
    //   district: product.district,
    //   color: product.color,
    //   priceRange: priceRange
    // };
  }

  async listFeaturedProducts(condition: {
    limit: number;
    page: number;
    sortBy?: string;
    sortDirection?: string;
  }) {
    const queryObj = {};
    queryObj['status'] = Status.ACTIVE;
    queryObj['approvedStatus'] = Status.PRODUCT_APPROVED;

    const stages: any[] = [
      {
        $match: queryObj
      }
    ];

    if (condition.sortBy) {
      const sortStage = {
        $sort: {
          view: -1
        }
      };
      sortStage.$sort[condition.sortBy] =
        condition.sortDirection === 'DESC' ? -1 : 1;
      stages.push(sortStage);
    } else {
      stages.push({
        $sort: {
          view: -1
        }
      });
    }

    stages.push({
      $facet: {
        entries: [
          { $skip: (condition.page - 1) * condition.limit },
          { $limit: condition.limit }
        ],
        meta: [{ $group: { _id: null, totalItems: { $sum: 1 } } }]
      }
    });

    return [];
    // TODO: get feature products
    // return await ProductModel.aggregate(stages);
  }

  async listSaleProducts(condition: {
    limit: number;
    page: number;
    sortBy?: string;
    sortDirection?: string;
  }) {
    const queryObj = {};
    queryObj['status'] = Status.ACTIVE;
    queryObj['saleOff.active'] = true;

    const stages: any[] = [
      {
        $match: queryObj
      }
    ];

    if (condition.sortBy) {
      const sortStage = {
        $sort: {}
      };
      sortStage.$sort[condition.sortBy] =
        condition.sortDirection === 'DESC' ? -1 : 1;
      stages.push(sortStage);
    } else {
      stages.push({
        $sort: {
          updatedAt: -1
        }
      });
    }

    stages.push({
      $facet: {
        entries: [
          { $skip: (condition.page - 1) * condition.limit },
          { $limit: condition.limit }
        ],
        meta: [{ $group: { _id: null, totalItems: { $sum: 1 } } }]
      }
    });

    return [];
    // TODO: get sale products
    // return await ProductModel.aggregate(stages);
  }

  generateProductCode = () => {
    const characters = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const codeLength = 10;
    return generate(characters, codeLength);
  };

  async invalidAttrNameForCreating(attrValueIds: number[]): Promise<string[]> {
    const attributeValueRecords = await AttributeValueModel.findAll({
      where: {
        id: {
          [sequelize.Op.in]: attrValueIds
        }
      }
    });

    const attributeIds = [
      ...new Set(attributeValueRecords.map(a => a.attributesId))
    ];

    const invalidAttrIds = requireAttributeWhenCreateNew.filter(
      id => attributeIds.indexOf(id) === -1
    );

    const attrs = await AttributeModel.findAll({
      where: {
        id: {
          [sequelize.Op.in]: invalidAttrIds
        }
      },
      attributes: ['name']
    });

    return attrs.map(a => a.name);
  }

  async insertProductImages(productId: number, images: string[]) {
    const bulk = images.map(img => {
      return {
        imageUrl: img,
        productsId: productId
      };
    });

    await ImageProduct.bulkCreate(bulk);
  }

  async insertProductTags(productId: number, tagsIds: number[]) {
    const bulk: ProductHasTag[] = tagsIds.map(tagId => {
      return <ProductHasTag>{
        productsId: productId,
        tagsId: tagId
      };
    });

    await ProductHasTag.bulkCreate(bulk);
  }

  async insertSaleOffProduct(params: ISaleOffProduct): Promise<SaleOffProduct> {
    const saleOff = SaleOffProduct.build({
      productsId: params.productId,
      price: params.price,
      status: params.status,
      startDate: params.startDate,
      endDate: params.endDate
    });

    return saleOff.save();
  }
}
