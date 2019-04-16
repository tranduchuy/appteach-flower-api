import {
    controller, httpGet, httpPost, httpPut, httpDelete
} from "inversify-express-utils";
import { Request } from "express";
import { User } from "../models/user";
import { inject } from "inversify";
import TYPES from "../constant/types";
import { MongoDBClient } from "../utils/mongodb/client";

@controller("/user")
export class UserController {
    constructor(
        @inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient
    ) { }

    @httpGet("/")
    public getUsers(): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            this.mongoClient.find("user", {}, (error, data: User[]) => {
                resolve(data);
            });
        });
    }

    @httpGet("/:id")
    public getUser(request: Request): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.mongoClient.findOneById("user", request.params.id, (error, data: User) => {
                resolve(data);
            });
        });
    }

    @httpPost("/")
    public newUser(request: Request): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.mongoClient.insert("user", request.body, (error, data: User) => {
                resolve(data);
            });
        });
    }

    @httpPut("/:id")
    public updateUser(request: Request): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.mongoClient.update("user", request.params.id, request.body, (error, data: User) => {
                resolve(data);
            });
        });
    }

    @httpDelete("/:id")
    public deleteUser(request: Request): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.mongoClient.remove("user", request.params.id, (error, data: any) => {
                resolve(data);
            });
        });
    }
}