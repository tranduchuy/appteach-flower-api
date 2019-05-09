import { injectable } from 'inversify';
import distance from 'google-distance-matrix';
import { GOOGLE_DISTANCE_MATRIX } from "../utils/secrets";

@injectable()
export class GoogleDistanceMatrixService {
  distance = distance;
  constructor(){
    this.distance.key(GOOGLE_DISTANCE_MATRIX);
    this.distance.units('imperial')
    console.log(this.distance);
  }

  calculateDistance = async ( origins, destinations) => {
      return new Promise( async (resolve, reject)=>{
        try {
          await this.distance.matrix(origins, destinations, (err, distances) =>{
            if(!distances) {
              reject('no distances');
            }
            if (distances.status == 'OK') {
              resolve(distances);
            }
          });
        } catch (e) {
          reject(e);
        }
      })
  };


}