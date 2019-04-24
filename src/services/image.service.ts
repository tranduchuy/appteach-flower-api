import { injectable } from "inversify";
import { General } from "../constant/generals";
import * as _ from "lodash";
import request from "request";

@injectable()
export class ImageService {
  confirmImages = (paths) => {
    try {
      const url = General.API_COMFIRM_IMAGE;

      const option = {
        "rejectUnauthorized": false,
        uri: url,
        json: {paths},
        method: 'POST'
      };
      try {
        request(option, (err) => {
          if (err) {
            console.log(`POST CONFIRM IMAGE error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}`);
          } else {
            console.log('POST CONFIRM IMAGE info' + JSON.stringify(option));
          }
        });
      } catch (e) {
        console.log(`POST CONFIRM IMAGE error: ${JSON.stringify(e)}. Params: ${JSON.stringify(option)}`);
      }
    } catch (e) {
      console.log(e);
    }
  }

  updateImages = (oldImages, newImages) => {
    const url = General.API_COMFIRM_IMAGE;
    if (oldImages.constructor !== Array || newImages.constructor !== Array) {
      console.log('oldImages or newImages is not Array', oldImages, newImages);
      throw new Error('oldImages or newImages is not Array');
    }

    console.log('ImageService::putUpdateImage was called with: ' + JSON.stringify({oldImages, newImages}));

    const imagesDelete = _.difference(oldImages, newImages);
    const imagesAdd = _.difference(newImages, oldImages);

    const option = {
      "rejectUnauthorized": false,
      uri: url,
      method: 'PUT',
      json: {oldImages: imagesDelete, newImages: imagesAdd}
    };

    try {
      request.put(option, (err) => {
        if (err) {
          console.log(`POST CONFIRM IMAGE error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}`);
        } else {
          console.log(['PUST UPDATE IMAGE info', url, option]);
        }
      })
    }
    catch (e) {
      console.log(`POST CONFIRM IMAGE error: ${JSON.stringify(e)}. Params: ${JSON.stringify(option)}`);
    }
  }


}