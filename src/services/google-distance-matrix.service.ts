import { injectable } from 'inversify';
import distance from 'google-distance-matrix';
import { GOOGLE_DISTANCE_MATRIX } from "../utils/secrets";

@injectable()
export class GoogleDistanceMatrixService {
  distance = distance;
  constructor(){
    this.distance.key(GOOGLE_DISTANCE_MATRIX);
    this.distance.units('imperial');
  }

  calculateDistance =  ( origins, destinations) => {
    return new Promise( (resolve, reject)=>{
      this.distance.matrix(origins, destinations, (err, distances) =>{
        if(err){
          reject(err);
        }
        if(!distances) {
          reject('no distances');
        }
        if (distances.status == 'OK') {
          resolve(distances);
        }
      });
    })
  };


}