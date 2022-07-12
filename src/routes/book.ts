import { Router } from "express";
import BookController  from "../controllers/BookController"
const router =  Router();

router
    .get('/books', BookController.getBooks )
    .get('/books/:id',BookController.getBook)
    .post('/books',BookController.createBook)
    .delete('/books/:id',BookController.removeBook)
    .put('/books/:id',BookController.updateBook)

     
export default router;
