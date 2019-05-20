import { injectable } from 'inversify';
import { Status } from '../constant/status';
import NotifyModel from '../models/notify';

@injectable()
export class NotifyService {
  getUnReadCountOfUser = async (userId: string) => {
    const query = {
      toUser: userId,
      status: Status.NOTIFY_NEW
    };

    return await NotifyModel.count(query);
  };

  isValidStatusForUpdating = (status: number) => {
    // TODO: will update this list when new status of notify appeared
    return [
      Status.NOTIFY_NEW,
      Status.NOTIFY_READ
    ].indexOf(status) !== -1;
  };

  createNotify = async ({fromUser, toUser, status, title, type, content, params}) => {
    const newNotify = new NotifyModel({
      fromUser,
      toUser,
      status: Status.NOTIFY_NEW,
      title: title.trim(),
      content: content.trim(),
      type,
      params
    });

    return await newNotify.save();
  };


  buildStageGetListNotify(queryCondition): any[] {
    const stages = [];
    const matchStage: any = {};

    if (queryCondition.toUser) {
      matchStage['toUser'] = queryCondition.toUser;
    }

    if (queryCondition.status) {
      matchStage['status'] = queryCondition.status;
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
