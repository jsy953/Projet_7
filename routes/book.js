/* eslint-disable no-undef */
/* eslint-disable no-mixed-spaces-and-tabs */
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const booksController = require("../controllers/book");

router.get("/", booksController.getAllBooks);
router.get("/bestrating", booksController.getThreeBestBooks);
router.post("/", auth, multer, booksController.createBook);
router.get("/:id",  booksController.getOneBook);
router.put("/:id", auth, multer,  booksController.modifyBook);
router.delete("/:id", auth, booksController.removeBook);
router.post("/:id/rating", auth, booksController.rateBook);


module.exports = router;