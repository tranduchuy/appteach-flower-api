import { controller, httpGet, httpPut } from 'inversify-express-utils';
import TYPES from '../../constant/types';
import { inject } from 'inversify';
import { SystemConfigService } from '../../services/system-config.service';
import { Request, Response } from 'express';
import { IRes } from '../../interfaces/i-res';
import { ResponseMessages } from '../../constant/messages';
import { SystemConfig } from '../../models/system-config';
import * as HttpStatus from 'http-status-codes';
import { HttpCodes } from '../../constant/http-codes';
import { ImageService } from '../../services/image.service';

// validate
import Joi from '@hapi/joi';
import UpdateImage from '../../validation-schemas/system-config/update-image';
import UpdateImages from '../../validation-schemas/system-config/update-images';

@controller('/admin/system-config')
export class AdminSystemConfigController {
  constructor(@inject(TYPES.SystemConfigService) private systemConfigService: SystemConfigService,
              @inject(TYPES.ImageService) private imageService: ImageService) {
  }

  @httpGet('/', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public getProducts(request: Request, response: Response): Promise<IRes<SystemConfig>> {
    return new Promise<IRes<SystemConfig>>(async (resolve, reject) => {
      const config = await this.systemConfigService.getConfig();
      const result: IRes<SystemConfig> = {
        status: 1,
        messages: [ResponseMessages.SUCCESS],
        data: config
      };

      resolve(result);
    });
  }

  @httpPut('/logo-image', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public updateLogo(req: Request): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.body, UpdateImage);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<SystemConfig> = {
            status: HttpCodes.ERROR,
            messages: messages
          };

          return resolve(result);
        }
        const config = await this.systemConfigService.getConfig();
        const {image} = req.body;
        console.log(image);

        await this.systemConfigService.updateLogoImage(image);
        console.log(image);

        const oldImages = [config.logoImage] || [];
        const newImages = [image];

        // update images on static server
        if (newImages) {
          this.imageService.updateImages(oldImages, newImages);
        }

        return resolve({
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {}
        });
      }

      catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        return resolve(result);
      }
    });
  }

  @httpPut('/home-banner-image', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public homeBannerImage(req: Request): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.body, UpdateImage);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<SystemConfig> = {
            status: HttpCodes.ERROR,
            messages: messages
          };

          return resolve(result);
        }
        const config = await this.systemConfigService.getConfig();
        const {image} = req.body;
        console.log(image);

        await this.systemConfigService.updateHomeBannerImage(image);
        console.log(image);

        const oldImages = [config.logoImage] || [];
        const newImages = [image];

        // update images on static server
        if (newImages) {
          this.imageService.updateImages(oldImages, newImages);
        }

        return resolve({
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {}
        });
      }

      catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        return resolve(result);
      }
    });
  }

  @httpPut('/top-bar-banner-image', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public updateTopBarBannerImage(req: Request): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.body, UpdateImage);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<SystemConfig> = {
            status: HttpCodes.ERROR,
            messages: messages
          };

          return resolve(result);
        }
        const config = await this.systemConfigService.getConfig();
        const {image} = req.body;
        console.log(image);

        await this.systemConfigService.updateTopBarBannerImage(image);
        console.log(image);

        const oldImages = [config.logoImage] || [];
        const newImages = [image];

        // update images on static server
        if (newImages) {
          this.imageService.updateImages(oldImages, newImages);
        }

        return resolve({
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {}
        });
      }

      catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        return resolve(result);
      }
    });
  }

  @httpPut('/criteria-images', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public updateCriteriaImages(req: Request): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.body, UpdateImages);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<SystemConfig> = {
            status: HttpCodes.ERROR,
            messages: messages
          };

          return resolve(result);
        }
        const config = await this.systemConfigService.getConfig();
        const {images} = req.body;

        await this.systemConfigService.updateCriteriaImages(images);

        const oldImages = config.criteriaImages || [];
        const newImages = images;

        // update images on static server
        if (newImages) {
          this.imageService.updateImages(oldImages, newImages);
        }

        return resolve({
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {}
        });
      }

      catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        return resolve(result);
      }
    });
  }


}