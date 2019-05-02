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

  updateLogo = async (logo) =>{
    return await SystemConfigModel.findOneAndUpdate({},{logo: logo});
  }

}