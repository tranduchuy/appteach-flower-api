import {
  controller, httpGet, httpPost, httpPut
} from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { Request, Response } from 'express';
import { IRes } from '../interfaces/i-res';
import { ProductService } from '../services/product.service';
import * as HttpStatus from 'http-status-codes';
import ProductModel, { Product } from '../models/product';
import { General } from '../constant/generals';
import UserTypes = General.UserTypes;
import Joi from '@hapi/joi';
import { ShopService } from '../services/shop.service';
// validate schema
import addProductSchema from '../validation-schemas/product/add-new.schema';
import updateProductSchema from '../validation-schemas/product/update-one.schema';
import updateStatusValidationSchema from '../validation-schemas/product/update-status.schema';
import { ResponseMessages } from '../constant/messages';
import { ImageService } from '../services/image.service';

@controller('/product')
export class ProductController {
  constructor(
    @inject(TYPES.ProductService) private productService: ProductService,
    @inject(TYPES.ImageService) private imageService: ImageService,
    @inject(TYPES.ShopService) private shopService: ShopService
  ) {
  }

  @httpGet('/')
  public getProducts(request: Request, response: Response): Promise<IRes<Product[]>> {
    return new Promise<IRes<Product[]>>(async (resolve, reject) => {
      const result: IRes<Product[]> = {
        status: 1,
        messages: [ResponseMessages.SUCCESS],
        data: await ProductModel.find()
      };

      resolve(result);
    });
  }

  @httpGet('/home')
  public getHomeProducts(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const featuredProducts = await this.productService.getFeaturedProducts();
        const saleProducts = await this.productService.getSaleProducts();

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.Product.Add.ADD_PRODUCT_SUCCESS],
          data: {
            meta: {},
            entries: {
              featuredProducts: featuredProducts,
              saleProducts: saleProducts
            }
          }
        };
        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }

  @httpPost('/', TYPES.CheckTokenMiddleware)
  public addOne(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, addProductSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const user = request.user;
        const {
          title, sku, description, images, topic, salePrice, originalPrice,
          tags,
          design, specialOccasion, floret, city, district, color, seoUrl, seoDescription, seoImage
        } = request.body;

        if (user.type !== UserTypes.TYPE_SELLER) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Product.Add.NO_ADD_PRODUCT_PERMISSION],
            data: {}
          };
          return resolve(result);
        }

        // check sale price vs original price.
        if (salePrice > originalPrice) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Product.NOT_VALID_PRICE],
            data: {}
          };
          return resolve(result);
        }

        const shop: any = await this.shopService.findShopOfUser(request.user._id.toString());

        const newProduct = await this.productService.createProduct({
          title,
          sku,
          description,
          topic,
          originalPrice,
          shopId: shop._id.toString(),
          tags: tags || [],
          salePrice: salePrice || null,
          images: images || [],
          design: design || null,
          specialOccasion: specialOccasion || null,
          floret: floret || null,
          city: city || null,
          district: district || null,
          color: color || null,
          seoUrl: seoUrl || null,
          seoDescription: seoDescription || null,
          seoImage: seoImage || null
        });

        // confirm images
        const paths = newProduct.images || [];

        if (paths.length > 0) {
          this.imageService.confirmImages(newProduct.images);
        }

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.Product.Add.ADD_PRODUCT_SUCCESS],
          data: {
            meta: {},
            entries: [newProduct]
          }
        };

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }

  @httpPut('/:id', TYPES.CheckTokenMiddleware)
  public updateOne(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, updateProductSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const productId = request.params.id;
        const user = request.user;
        const product = await this.productService.findProductById(productId);
        if (!product) {
          const result: IRes<{}> = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Product.PRODUCT_NOT_FOUND],
            data: {}
          };

          return resolve(result);
        }

        if (user.type !== UserTypes.TYPE_SELLER) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Product.Update.NO_UPDATE_PRODUCT_PERMISSION],
            data: {}
          };
          return resolve(result);
        }

        const {
          title, sku, description, images, topic, saleOff, originalPrice,
          tags,
          design, specialOccasion, floret, city, district, color, seoUrl, seoDescription, seoImage
        } = request.body;

        const saleOffObject = saleOff || {price: null};

        const salePrice = saleOffObject.price || product.saleOff.price;
        const price = originalPrice || product.originalPrice;
        // check sale price vs original price.
        if (salePrice > price) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Product.NOT_VALID_PRICE],
            data: {}
          };
          return resolve(result);
        }

        const oldImages = product.images || [];
        const newImages = images;

        await this.productService.updateProduct(product, {
          title,
          sku,
          description,
          topic,
          originalPrice,
          tags,
          saleOff,
          images,
          design,
          specialOccasion,
          floret,
          city,
          district,
          color,
          seoUrl,
          seoDescription,
          seoImage
        });

        // update images on static server
        if (newImages) {
          this.imageService.updateImages(oldImages, newImages);
        }

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.Product.Update.UPDATE_PRODUCT_SUCCESS],
          data: {
            meta: {},
            entries: []
          }
        };

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }

  @httpPut('/:id/status', TYPES.CheckTokenMiddleware)
  public updateStatus(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, updateStatusValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const productId = request.params.id;
        const user = request.user;
        const product = await this.productService.findProductById(productId);
        if (!product) {
          const result: IRes<{}> = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Product.PRODUCT_NOT_FOUND],
            data: {}
          };
          return resolve(result);
        }

        if (user.type !== UserTypes.TYPE_SELLER) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Product.Update.NO_UPDATE_PRODUCT_PERMISSION],
            data: {}
          };
          return resolve(result);
        }

        const {status} = request.body;

        await this.productService.updateProductStatus(product, status);

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.Product.Update.UPDATE_PRODUCT_SUCCESS],
          data: {
            meta: {},
            entries: []
          }
        };

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }


}