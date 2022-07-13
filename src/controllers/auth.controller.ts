import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import config from "../config/config";
import { PrismaClient } from "@prisma/client";
import Utils from "../config/utils";
const prisma = new PrismaClient();


export default class AuthController {

    static login = async (req: Request, res: Response) => {

        const { correo, password } = req.body;
        if (!(correo && password)) return res.status(500).send({message:'Error ingrese los datos'});
        console.log(password);
        
        const user = await prisma.user.findUnique({where:{ correo:correo }});
        console.log(user);
        
        if (!user) return res.status(500).send({ message: "Este correo electronico no esta registrado en nuestro sistema" });
        //check password

        const pass= Utils.checkIfUnencryptedPasswordIsValid(password,user.password);
        console.log(pass);
        
        if (!Utils.checkIfUnencryptedPasswordIsValid(password,user.password)) return res.status(500).send({ message: "La contraseña es incorrecta" });
        const token = jwt.sign(
            {
                id: user.id,
                nombres:user.nombres,
                apellidos:user.apellidos,
                correo:user.correo
            },
            config.jwtSecret,
            { expiresIn: '1h' }
        );
        res.header('auth-token', token).json({
            id: user.id,
            nombres:user.nombres,
            apellidos:user.apellidos,
            correo:user.correo,token:token});

    }

    static changePassword = async (req: Request, res: Response) => {

        console.log(req.header('auth-token'));
        
        const id = res.locals.jwtPayload.userId;
        const { oldPassword, newPassword } = req.body;

        if (!(oldPassword && newPassword)) return res.status(400).send();
        
        let user = await prisma.user.findUnique({where:{id:id}});

        if (!user) return res.status(401).send();
        if (!Utils.checkIfUnencryptedPasswordIsValid(oldPassword,user.password)) return res.status(401).send();

        
        const errors = await validate(user);
        
        if (errors.length > 0) return res.status(400).send(errors);
        
        //Hash the new password and save
        await prisma.user.update({
            where:{
                id:id
            },
            data:{
                password: Utils.hashPassword(newPassword)
            }
        
        });
        res.status(204).send();
    };




}