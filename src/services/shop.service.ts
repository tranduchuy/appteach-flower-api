import { injectable } from 'inversify';
import mongoose from 'mongoose';
import { Status } from '../constant/status';
import ShopModel, { Shop } from '../models/shop';

export interface IQueryWaitingShop {
  limit: number;
  page: number;
  sortBy?: string;
  sortDirection?: string;
  userId?: string;
}

export interface IQueryProductsOfShop {
  limit: number;
  page: number;
  sortBy?: string;
  sortDirection?: string;
  status?: number;
  approvedStatus?: number;
  title?: string;
  shopId: string;
}

export interface IQueryListShop {
  name: string;
  limit: number;
  page: number;
  status: number;
  sb?: string;
  sd?: string;
}

@injectable()
export class ShopService {

  async findShopById(shopId: string): Promise<Shop> {
    return await ShopModel.findOne({_id: shopId});
  }

  async findShopOfUser(userId: string): Promise<Shop> {
    return await ShopModel.findOne({
      user: new mongoose.Types.ObjectId(userId),
      status: Status.ACTIVE
    });
  }

  async findShopBySlug(slug: string): Promise<Shop> {
    return await ShopModel.findOne({slug});
  }

  async createNewShop(userId: string, name: string, slug: string, images: string[], availableShipCountry: boolean): Promise<Shop> {
    const shop = new ShopModel({
      name,
      slug,
      images,
      availableShipCountry,
      user: new mongoose.Types.ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return await shop.save();
  }

  async updateShop(shop, availableShipCountry: boolean): Promise<Shop> {
    if (availableShipCountry) {
      shop.availableShipCountry = availableShipCountry;
    }
    return await shop.save();
  }

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

  buildStageQueryProductOfShop(queryCondition: IQueryProductsOfShop): any[] {
    const stages = [];

    const matchStage = {
      shop: new mongoose.Types.ObjectId(queryCondition.shopId)
    };
    if (queryCondition.approvedStatus) {
      matchStage['approvedStatus'] = queryCondition.approvedStatus;
    } else {
      matchStage['approvedStatus'] = {
        $ne: Status.PRODUCT_NOT_APPROVED
      };
    }

    if (queryCondition.status) {
      matchStage['status'] = queryCondition.status;
    } else {
      matchStage['status'] = {
        $ne: Status.DELETE
      };
    }

    if (queryCondition.title) {
      matchStage['title'] = {
        $regex: queryCondition.title,
        $options: 'i'
      };
    }

    stages.push({
      $match: matchStage
    });

    if (queryCondition.sortBy) {
      stages.push({
        $sort: {
          [queryCondition.sortBy]: queryCondition.sortDirection === 'ASC' ? 1 : -1
        }
      });
    } else {
      stages.push({
        $sort: {
          'updatedAt': -1
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

  buildStageGetListShop(queryCondition: IQueryListShop): any[] {
    const stages = [];
    const matchStage: any = {};

    if (queryCondition.name) {
      matchStage['name'] = {'$regex': queryCondition.name, '$options': 'i'};
    }

    if (queryCondition.status) {
      matchStage['status'] = queryCondition.status;
    }

    if (Object.keys(matchStage).length > 0) {
      stages.push({$match: matchStage});
    }

    stages.push({
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
      }
    });

    stages.push({$unwind: {path: '$userInfo'}});

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
