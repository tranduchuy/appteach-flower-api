import { injectable } from 'inversify';

export interface IQueryWaitingShop {
  limit: number;
  page: number;
  sortBy?: string;
  sortDirection?: string;
  userId?: string;
}

@injectable()
export class ShopService {
  buildStageQueryShopWaiting(queryCondition: IQueryWaitingShop): any[] {
    const stages = [];

    if (queryCondition.userId) {
      stages.push({
        $match: {
          user: queryCondition.userId
        }
      });
    }

    if (queryCondition.sortBy) {
      stages.push({
        $sort: {
          [queryCondition.sortBy]: queryCondition.sortDirection || 'ASC'
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
