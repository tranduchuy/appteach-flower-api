import { injectable } from "inversify";

@injectable()
export class UserService {
  demo() {
    console.log("Test user service");
  }
}
