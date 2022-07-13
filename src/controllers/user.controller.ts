import { PrismaClient } from "@prisma/client";
import { Response,Request } from "express";
import { validate } from "class-validator";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
export default class UserController {
    static listAll = async (req: Request, res: Response) => {
        try {
          const users = await prisma.user.findMany();
          return res.json(users);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
          }
        }
      };

      static getUser = async (req: Request, res: Response) => {
        try {
          const { id } = req.params;
          const user = await prisma.user.findUnique({where:{ id: parseInt(id)} });
    
          if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    
          return res.json(user);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
          }
        }
      };

      static newUser = async (req: Request, res: Response) => {

        const { nombres,apellidos, tipo_identificacion,identificacion,correo,telefono,password } = req.body;
       
        const verifyUsername = await prisma.user.findUnique({where:{ correo :correo }});
        if (verifyUsername) return res.status(500).send({ message: "El nombre de usuario ya ha sido utilizado" });
        const errors = await validate(prisma.user);

        if (errors.length > 0) return res.status(400).send(errors);
    
        let hashPassword= bcrypt.hashSync(password,8);;
    
        const user  = await prisma.user.create({
          data:{
            nombres:nombres,
            apellidos:apellidos,
            tipo_identificacion:tipo_identificacion,
            identificacion:identificacion,
            correo:correo,
            telefono:telefono,
            password:hashPassword
          }
        }) 
      
        console.log(user);
        return res.json(user);
    
      }
      static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
    
        try {
          const result = await prisma.user.delete({
            where:{
              id:parseInt(id)
            }
          });
    
          if (!result)
            return res.status(404).json({ message: "Usuario no encontrado" });
    
          return res.sendStatus(204);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
          }
        }
      };

      static updateUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { nombres,apellidos, tipo_identificacion,identificacion,correo,telefono } = req.body;

        try {
          const user = await prisma.user.findUnique({
            where:{
              id:parseInt(id)
            }
          });
          if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
         
    
          const errors = await validate(user);
          if (errors.length > 0) return res.status(400).send(errors);
    
          await prisma.user.update({
            where:{
              id:parseInt(id)
            },
            data:{
              nombres:nombres,
              apellidos:apellidos,
              tipo_identificacion:tipo_identificacion,
              identificacion:identificacion,
              correo:correo,
              telefono:telefono,
              
            }
          });
    
          return res.sendStatus(204);
    
        } catch (error) {
          if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
          }
        }
      };
}


