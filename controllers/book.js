/* eslint-disable no-undef */
const Book = require("../models/Book");
const fs = require("fs");
const sharp = require("sharp");

exports.createBook = async (req, res) => {
	const bookObject = JSON.parse(req.body.book);
	delete bookObject.userId;
	const book = new Book({
		...bookObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get("host")}/images/sharped_${req.file.filename}`
	});
	await sharp(req.file.path)
		.resize(405, 568)
		.png({ quality: 70 })
		.jpeg({ quality: 70 })
		.toFile("images/sharped_" + req.file.filename);
	
	book.save()
		.then(() => res.status(201).json({ message: "Registered!" }))
		.catch(error => res.status(500).json({ error }));
};

exports.modifyBook = async (req, res) => {
	const bookObject = req.file ? {
		...JSON.parse(req.body.book),
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get("host")}/images/sharped_${req.file.filename}`
	} : { ...req.body };
	if (req.file) {
		await sharp(req.file.path)
			.resize(405, 568)
			.png({ quality: 70 })
			.jpeg({ quality: 70 })
			.toFile("images/sharped_" + req.file.filename);
	}

	delete bookObject._userId;
	Book.findOne({_id: req.params.id})
		.then(book => {
			if (book.userId != req.auth.userId) {
				res.status(403).json({ message : "403: unauthorized request" });
			} else {
				Book.updateOne({_id: req.params.id}, { ...bookObject, _id: req.params.id})
					.then(() => res.status(200).json({ message : "Modified!" }))
					.catch(error => res.status(500).json({ error }));
			}
		})
		.catch(error => res.status(500).json({ error }));
};

exports.removeBook = (req, res) => {
	Book.findOne({_id: req.params.id})
		.then(book => {
			if (book.userId != req.auth.userId) {
				res.status(403).json({ message : "403: unauthorized request" });
			} else {
				const filename = book.imageUrl.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					Book.deleteOne({_id: req.params.id})
						.then(() => res.status(200).json({ message : "Modified!" }))
						.catch(error => res.status(500).json({ error }));
				});
			}
		})
		.catch(error => res.status(500).json({ error }));
};

exports.getOneBook = (req, res) => {
	Book.findOne({ _id: req.params.id })
		.then(book => res.status(200).json(book))
		.catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res) => {
	Book.find()
		.then(books => res.status(200).json(books))
		.catch(error => res.status(404).json({ error }));
};

exports.rateBook = (req, res) => {
	let averageRating = req.body.rating;
	Book.findOne({ _id: req.params.id })
		.then(book => {
			if (book.ratings.find(rating => rating.userId === req.auth.userId)) {
				return res.status(405).json({ error: "User has already rated this book" });
			} else {
				book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });
				averageRating = book.ratings.reduce((total, rating) => total + rating.grade, 0) / book.ratings.length;
				averageRating = averageRating.toFixed(1);
				book.averageRating = averageRating;
				return book.save();
			}
		})
		.then(book => res.status(200).json(book))
		.catch(error => res.status(500).json({ error }));
};

exports.getThreeBestBooks = (req, res) => {
	Book.find()
		.then((books) => {
			const sortedBooksRatings = [...books].sort((a, b) => b.averageRating - a.averageRating);
			const threeBestBooks = sortedBooksRatings.slice(0, 3);
			res.status(200).json(threeBestBooks);
		})
		.catch(error => {
			res.status(500).json({ error: error.message });
		});
};
