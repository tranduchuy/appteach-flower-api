import { controller, httpGet, httpPut } from "inversify-express-utils";
import TYPES from "../../constant/types";
import { inject } from "inversify";
import { SystemConfigService } from "../../services/system-config.service";
import { Request, Response } from "express";
import { IRes } from "../../interfaces/i-res";
import { ResponseMessages } from "../../constant/messages";
import { SystemConfig } from "../../models/system-config";
import AdminUserChangeStatus from "../../validation-schemas/user/admin-user-change-status.schema";
import * as HttpStatus from "http-status-codes";
import { HttpCodes } from "../../constant/http-codes";
import Joi from '@hapi/joi';
@controller('/admin/system-config')
export class AdminSystemConfigController {
  constructor(@inject(TYPES.SystemConfigService) private systemConfigService: SystemConfigService,) {
  }
  @httpGet('/')
  public getProducts(request: Request, response: Response): Promise<IRes<SystemConfig>> {
    return new Promise<IRes<SystemConfig>>(async (resolve, reject) =>{
      const config = await this.systemConfigService.getConfig();
      const result: IRes<SystemConfig> = {
        status: 1,
        messages: [ResponseMessages.SUCCESS],
        data: config
      };

      resolve(result);
    });
  }

  @httpPut('/logo', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public updateLogo(req: Request): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.body, AdminUserChangeStatus);
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

        const {logo} = req.body;

        await this.systemConfigService.updateLogo(logo);

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