import { injectable } from 'inversify';
import { Status } from '../constant/status';

const moment = require('moment');


export interface IAdminQueryNews {
  _id?: string;
  createdByType?: string;
  title?: string;
  limit?: number;
  page: number;
  status?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  cate?: number;
  sortDirection?: string;
}

export interface IQueryNews {
  cate?: number;
  limit?: number;
  page: number;
  sb?: string;
  sd?: string;
}


@injectable()
export class NewService {
  constructor() {
  }

  buildStageGetAdminListNews(queryCondition: IAdminQueryNews): any[] {
    const stages = [];
    const matchStage: any = {};

    if (queryCondition.createdByType && queryCondition.createdByType !== '0') {
      matchStage['createdByType'] = parseInt(queryCondition.createdByType);
    }

    if (queryCondition.status) {
      matchStage['status'] = queryCondition.status;
    }

    if (queryCondition.cate) {
      matchStage['cate'] = queryCondition.cate;
    }

    if (queryCondition._id) {
      matchStage['shop'] = queryCondition._id;
    }

    if (queryCondition.title) {
      matchStage['title'] = {
        $regex: queryCondition.title,
        $options: 'i'
      };
    }

    // filter date by query dateFrom and dateTo
    if (queryCondition.dateFrom || queryCondition.dateTo) {
      const dateFilterObj = {};

      if (queryCondition.dateFrom && queryCondition.dateFrom.toString().length === 10) {
        const fromObj = moment(queryCondition.dateFrom, 'YYYY-MM-DD').toDate();
        dateFilterObj['$gte'] = fromObj.getTime();
      }

      if (queryCondition.dateTo && queryCondition.dateTo.toString().length === 10) {
        const toObj = moment(queryCondition.dateTo, 'YYYY-MM-DD').toDate();
        dateFilterObj['$lte'] = toObj.getTime();
      }

      if (Object.keys(dateFilterObj).length !== 0) {
        matchStage['createdAt'] = dateFilterObj;
      }
    }

    if (Object.keys(matchStage).length > 0) {
      stages.push({$match: matchStage});
    }

    if (queryCondition.sortBy) {
      stages.push({
        $sort: {
          [queryCondition.sortBy]: queryCondition.sortDirection === 'ASC' ? 1 : -1
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

  buildStageGetListNews(queryCondition: IQueryNews): any[] {
    const stages = [];
    const matchStage: any = {};

    matchStage['status'] = Status.ACTIVE;

    if (queryCondition.cate) {
      matchStage['cate'] = queryCondition.cate;
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
