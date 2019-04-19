import { injectable } from "inversify";

@injectable()
export class UserService {
  public sayHello() {
    console.log("hello world");
  }
}