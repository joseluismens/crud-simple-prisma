import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client"
import { generatePrime } from "crypto";
const prisma = new PrismaClient();

export default class BookController {

  static getBooks = async (req: Request, res: Response) => {
    const books = await prisma.book.findMany()
    console.table(books)

    res.json({ books })
  }

  static getBook = async (req: Request, res: Response) => {

    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: {
        id: parseInt(id)
      }
    }
    );
    res.json({ book })
  }
  static createBook = async (req: Request, res: Response) => {

    console.log(req.body);

    const { author, genre, title } = req.body;

    const book = await prisma.book.create({
      data: {
        author_id: author,
        genre: genre,
        title: title
      }
    });
    res.json({ book })
  }

  static removeBook = async (req: Request, res: Response) => {

    const { id } = req.params;

    const book = await prisma.book.delete({
      where: {
        id: parseInt(id)
      }
    });
    res.json({ book })
  }
  static updateBook = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { author_id, genre, page_count, title } = req.body;

    const book = await prisma.book.update({
      where: {
        id: parseInt(id)
      },
      data: {
        author_id: author_id,
        genre: genre,
        page_count: page_count,
        title: title

      }
    });
    res.json({ book })



  }
}