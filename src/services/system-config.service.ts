import { injectable } from "inversify";
import SystemConfigModel from '../models/system-config';

@injectable()
export class SystemConfigService {

  init = async () =>{
    const config = new SystemConfigModel();
    await config.save()
  }
  getConfig = async () => {
    return await SystemConfigModel.findOne({});
  }

  updateLogoImage = async (logo) =>{
    return await SystemConfigModel.findOneAndUpdate({},{logoImage: logo});
  }

  updateTopBarBannerImage = async (image) =>{
    return await SystemConfigModel.findOneAndUpdate({},{topBarBannerImage: image});
  }

  updateHomeBannerImage = async (image) =>{
    return await SystemConfigModel.findOneAndUpdate({},{homeBannerImage: image});
  }

  updateCriteriaImages = async (images) =>{
    return await SystemConfigModel.findOneAndUpdate({},{criteriaImages: images});
  }

}