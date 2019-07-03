import { Request } from 'express';
import * as HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { General } from '../../constant/generals';
import { HttpCodes } from '../../constant/http-codes';
import { ResponseMessages } from '../../constant/messages';
import TYPES from '../../constant/types';
import { IRes } from '../../interfaces/i-res';
import Joi from '@hapi/joi';

import urlSlug from 'url-slug';
import NewModel, { New } from '../../models/new';
// schemas
import AdminAddNew from '../../validation-schemas/new/admin-add-new.schema';
import { ImageService } from '../../services/image.service';
import { Status } from '../../constant/status';
import AdminListNewSchema from '../../validation-schemas/new/admin-list-news.schema';
import { NewService } from '../../services/new.service';
import AdminUpdateNew from '../../validation-schemas/new/admin-update-new.schema';

interface IResNews {
  meta: {
    totalItems: number
  };
  entries: New[];
}

@controller('/admin/new')
export class AdminNewController {
  constructor(@inject(TYPES.NewService) private newService: NewService,
              @inject(TYPES.ImageService) private imageService: ImageService) {

  }

  @httpPut('/:id', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public updateNew(req: Request): Promise<IRes<New>> {
    return new Promise<IRes<New>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.body, AdminUpdateNew);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<New> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages
          };

          return resolve(result);
        }

        const id = req.params.id;

        if (!id || id.length === 0) {
          const result: IRes<New> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.INVALID_ID]
          };
          return resolve(result);
        }

        let news = await NewModel.findOne({_id: id});
        if (!news) {
          const result: IRes<New> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.New.NOT_FOUND]
          };
          return resolve(result);
        }

        const {
          title, content, cate, image, status,
          description, metaTitle, metaDescription,
          metaType, metaUrl, metaImage, canonical,
          textEndPage, url
        } = req.body;

        this.imageService.updateImages([news.image], [image]);
        news.title = title || news.title;
        news.content = content || news.content;
        news.type = cate || news.type;
        news.image = image || news.image;
        news.description = description || news.description;
        news.status = status || news.status;
        news.textEndPage = textEndPage || news.textEndPage;
        news.metaTitle = metaTitle || news.metaTitle;
        news.metaDescription = metaDescription || news.metaDescription;
        news.metaType = metaType || news.metaType;
        news.metaUrl = metaUrl || news.metaUrl;
        news.metaImage = metaImage || news.metaImage;
        news.canonical = canonical || news.canonical;

        if (title && news.title !== title) {
          let slug = urlSlug(title);

          const duplicatedNumber = await NewModel.count({
            title: title
          });
          if (duplicatedNumber > 0) {
            slug = `${slug}-${duplicatedNumber}`;
          }

          news.url = slug;
        }

        const customUrl = url;
        if (customUrl && customUrl !== news.customUrl) {
          const queryCountDuplicate = {
            _id: {$ne: id},
            $or: [
              {url: customUrl},
              {customUrl}
            ]
          };

          if (await NewModel.count(queryCountDuplicate) > 0) {
            const result: IRes<New> = {
              status: HttpStatus.BAD_REQUEST,
              messages: [ResponseMessages.New.EXISTED_SLUG]
            };
            return resolve(result);
          }
          // post.url = url; // url property should NOT be changed, it is original
          news.customUrl = customUrl;
        }

        news = await news.save();

        return resolve({
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: news
        });
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result: IRes<New> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        return resolve(result);
      }
    });
  }


  @httpGet('/:id', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public detailNew(req: Request): Promise<IRes<New>> {
    return new Promise<IRes<New>>(async (resolve) => {
      try {
        const id = req.params.id;

        if (!id || id.length === 0) {
          const result: IRes<New> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.INVALID_ID]
          };
          return resolve(result);
        }

        const news = await NewModel.findOne({_id: id});
        if (!news) {
          const result: IRes<New> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.New.NOT_FOUND]
          };
          return resolve(result);
        }

        return resolve({
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: news
        });
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result: IRes<New> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        return resolve(result);
      }
    });
  }

  @httpPost('/', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public add(req: Request): Promise<IRes<New>> {
    return new Promise<IRes<New>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.body, AdminAddNew);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<New> = {
            status: HttpCodes.ERROR,
            messages: messages
          };

          return resolve(result);
        }

        const {
          title, content, cate, image, description,
          metaTitle, metaDescription, metaType, metaUrl,
          metaImage, canonical, textEndPage, createdByType
        } = req.body;

        let news = new NewModel();

        if (createdByType === General.NewCreatedBy.CRAWL) {
          const duplicateTitle = await NewModel.findOne({title: req.body.title});
          if (duplicateTitle) {
            const result: IRes<New> = {
              status: HttpCodes.ERROR,
              messages: ['Crawling duplicate title']
            };
            return resolve(result);
          }
        }

        news.title = title;
        news.content = content;
        news.cate = cate;
        news.image = image;
        news.description = description;
        news.status = Status.ACTIVE;
        news.admin = [req.user._id.toString()];
        news.createdByType = createdByType || General.NewCreatedBy.HAND;
        this.imageService.confirmImages([image]);


        let slug = urlSlug(title);

        const duplicatedNumber = await NewModel.count({
          title: title
        });
        if (duplicatedNumber > 0) {
          slug = `${slug}-${duplicatedNumber}`;
        }

        news.url = slug;
        news.metaTitle = metaTitle;
        news.metaDescription = metaDescription;
        news.metaType = metaType;
        news.metaUrl = metaUrl;
        news.metaImage = metaImage;
        news.canonical = canonical;
        news.textEndPage = textEndPage;

        news = await news.save();

        return resolve({
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: news
        });
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result: IRes<New> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        return resolve(result);
      }
    });
  }

  @httpGet('/', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public getNewsList(req: Request): Promise<IRes<IResNews>> {
    return new Promise<IRes<IResNews>>(async (resolve) => {
      try {
        const { error } = Joi.validate(req.query, AdminListNewSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });
          const result: IRes<IResNews> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages
          };
          return resolve(result);
        }

        const { createdByType, status, _id, dateFrom, dateTo, title, sortBy, cate, sortDirection, limit, page } = req.query;
        const stages: any[] = this.newService.buildStageGetAdminListNews({
          _id: _id ? _id : null,
          title: title ? title : null,
          createdByType:  createdByType ? createdByType : null,
          dateFrom:  dateFrom ? dateFrom : null,
          dateTo:  dateTo ? dateTo : null,
          limit: parseInt((limit || 10).toString()),
          page: parseInt((page || 1).toString()),
          status: status ? parseInt(status) : null,
          sortBy: sortBy,
          cate: cate || null,
          sortDirection: sortDirection,
        });

        const result: any = await NewModel.aggregate(stages);
        const response: IRes<IResNews> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            meta: {
              totalItems: result[0].meta[0] ? result[0].meta[0].totalItems : 0
            },
            entries: result[0].entries
          }
        };

        resolve(response);
      }
      catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<IResNews> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        resolve(result);
      }
    });
  }
}