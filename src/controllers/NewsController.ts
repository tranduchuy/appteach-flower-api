import { Request } from 'express';
import { controller, httpGet } from 'inversify-express-utils';
import * as HttpStatus from 'http-status-codes';
import { IRes } from '../interfaces/i-res';
import { ResponseMessages } from '../constant/messages';
import NewModel, { New } from '../models/new';
import { Status } from '../constant/status';
import TYPES from '../constant/types';

import Joi from '@hapi/joi';
import { inject } from 'inversify';
import { NewService } from '../services/new.service';
import ListNewSchema from '../validation-schemas/new/list-news.schema';


interface IResNews {
  meta: {
    totalItems: number
  };
  news: New[];
}


@controller('/new')
export class NewController {
  constructor(@inject(TYPES.NewService) private newService: NewService) {
  }

  @httpGet('/highlight')
  public highlight(request: Request): Promise<IRes<any>> {
    return new Promise<IRes<any>>(async (resolve) => {
      try {
        const newsList = await NewModel.find({status: Status.ACTIVE}).sort({date: -1}).limit(6);
        const results = newsList.map(async news => {
          const result = {
            _id: news._id,
            status: news.status,
            title: news.title,
            content: news.content,
            cate: news.type,
            image: news.image,
            date: news.createdAt,
            description: news.description,
            url: news.url
          };
          return result;
        });

        const result: IRes<any> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: results
        };
        return resolve(result);
      } catch (e) {
        console.error(e);
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)]
        };

        return resolve(result);
      }
    });
  }

  @httpGet('/lastest')
  public lastest(request: Request): Promise<IRes<any>> {
    return new Promise<IRes<any>>(async (resolve) => {
      try {
        const newsList = await NewModel.find({status: Status.ACTIVE}).sort({date: -1}).limit(10);
        const results = await Promise.all(newsList.map(async news => {
          const result = {

            id: news._id,
            status: news.status,
            title: news.title,
            content: news.content,
            cate: news.type,
            image: news.image,
            date: news.createdAt,
            description: news.description,
            url: news.url
          };

          return result;

        }));

        const result: IRes<any> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: results
        };
        return resolve(result);
      } catch (e) {
        console.error(e);
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)]
        };

        return resolve(result);
      }
    });
  }

  @httpGet('/')
  public getNewsList(req: Request): Promise<IRes<IResNews>> {
    return new Promise<IRes<IResNews>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.query, ListNewSchema);
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

        const {cate, sb, sd, limit, page} = req.query;
        const stages: any[] = this.newService.buildStageGetListNews({
          limit: parseInt((limit || 10).toString()),
          page: parseInt((page || 1).toString()),
          cate: cate || null,
          sb: sb,
          sd: sd
        });

        const result: any = await NewModel.aggregate(stages);
        const news = result[0].entries.map(item => {
          return {
            title: item.title,
            content: item.content,
            image: item.image,
            url: item.url,
            description: item.description,
            createdAt: item.createdAt
          };
        });
        const response: IRes<IResNews> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            meta: {
              totalItems: result[0].meta[0] ? result[0].meta[0].totalItems : 0
            },
            news
          }
        };

        resolve(response);
      } catch (e) {
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