import { Contorller } from "../abstract/Contorller";
import { Request, response, Response } from "express";
import { UserService } from "../Service/UserService";
import { resp } from "../utils/resp";
import { DBResp } from "../interfaces/DBResp";
import { Student } from "../interfaces/Student";
require('dotenv').config()

export class UserController extends Contorller {
    protected service: UserService;

    constructor() {
        super();
        this.service = new UserService();
    }

    public async findAll(Request: Request, Response: Response) {

        const res: resp<Array<DBResp<Student>> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }

        const dbResp = await this.service.getAllStudents();
        if (dbResp) {
            res.body = dbResp;
            res.message = "find sucess";
            Response.send(res);
        } else {
            res.code = 500;
            res.message = "server error";
            Response.status(500).send(res);
        }

    }

    public async insertOne(Request: Request, Response: Response) {
        const res: resp<Student | undefined> = {
            code: 200,
            message: "",
            body: undefined,
        };
    
        try {
            const dbResp = await this.service.insertOne(Request.body);
    
            if (dbResp) {
                // 轉換 dbResp 為符合 Student 格式的物件
                const student: Student = {
                    userName: dbResp.userName,
                    sid: dbResp.sid,
                    name: dbResp.name,
                    department: dbResp.department,
                    grade: dbResp.grade,
                    class: dbResp.class,
                    email: dbResp.email,
                    absences: dbResp.absences !== undefined ? dbResp.absences : 0,
                };
    
                res.body = student;
                res.message = "insert success";
                Response.send(res);
            } else {
                res.code = 500;
                res.message = "server error";
                Response.status(500).send(res);
            }
        } catch (error) {
            res.code = 500;
            res.message = "server error";
            Response.status(500).send(res);
        }
    }    
    
}