import { Request } from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import * as HttpStatus from 'http-status-codes';
import TYPES from '../constant/types';
import { IRes } from '../interfaces/i-res';
import { NotifyService } from '../services/notify.service';
import { ResponseMessages } from '../constant/messages';
import NotifyModel from '../models/notify';

@controller('/notify')
export class NotifyController {
  constructor(@inject(TYPES.NotifyService) private notifyService: NotifyService) {
  }

  @httpGet('/count-unread', TYPES.CheckTokenMiddleware)
  public countUnread(request: Request): Promise<IRes<any>> {
    return new Promise<IRes<any>>(async (resolve) => {
      try {
        const user = request.user;

        const count = await this.notifyService.getUnReadCountOfUser(user._id);

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            meta: {
              unread: count
            }
          }
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

  @httpGet('/', TYPES.CheckTokenMiddleware)
  public getList(request: Request): Promise<IRes<any>> {
    return new Promise<IRes<any>>(async (resolve) => {
      try {
        const user = request.user;

        const {limit, page, status} = request.query;
        const queryCondition = {
          limit: parseInt((limit || 10).toString()),
          page: parseInt((page || 1).toString()),
          toUser: user._id,
          status: status ? parseInt(status.toString()) : null
        };

        const stages: any[] = this.notifyService.buildStageGetListNotify(queryCondition);
        console.log('stages query search', JSON.stringify(stages));
        const result: any = await  NotifyModel.aggregate(stages);

        return resolve({
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            meta: {
              totalItems: result[0].meta[0] ? result[0].meta[0].totalItems : 0,
              item: result[0].entries.length,
              limit: queryCondition.limit,
              page: queryCondition.page,
            },
            notifies: result[0].entries
          }
        });
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
}
