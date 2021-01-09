// const express = require("express");
// const router = express.Router();
// const Author = require("../models/author");

// // All Authors Route
// router.get("/", async (req, res) => {
//   let searchOptions = {};
//   if (req.query.name != null && req.query.name !== "") {
//     searchOptions.name = new RegExp(req.query.name, "i");
//   }
//   try {
//     const authors = await Author.find(searchOptions);
//     res.render("authors/index", {
//       authors: authors,
//       searchOptions: req.query,
//     });
//   } catch {
//     res.redirect("/");
//   }
// });

// // New Author Route
// router.get("/new", (req, res) => {
//   res.render("authors/new", { author: new Author() });
// });

// // Create Author Route
// router.post("/", async (req, res) => {
//   const author = new Author({
//     name: req.body.name,
//     bday: req.body.bday,
//     bio: req.body.bio,
//   });
//   try {
//     const newAuthor = await author.save();
//     // res.redirect(`authors/${newAuthor.id}`)
//     res.redirect(`authors`);
//   } catch {
//     res.render("authors/new", {
//       author: author,
//       errorMessage: "Error creating Author",
//     });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== " ") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors: authors, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});
// New Authors Route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// create author route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
    bio: req.body.bio,
  });

  saveAuthorPhoto(author, req.body.authorImg);

  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${author.id}`);
  } catch {
    res.render("authors/new", {
      author: author,
      erroMessage: "Error creating Author",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();
    res.render("authors/show", {
      author: author,
      booksByAuthor: books,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});

router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    author.bio = req.body.bio;
    if (req.body.authorImg != null && req.body.authorImg !== "") {
      saveAuthorPhoto(author, req.body.authorImg);
    }
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        erroMessage: "Error updating Author",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect("/authors");
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

function saveAuthorPhoto(author, authorImgEncoded) {
  if (authorImgEncoded == null) return;
  const authorImg = JSON.parse(authorImgEncoded);
  if (authorImg != null && imageMimeTypes.includes(authorImg.type)) {
    author.authorImage = new Buffer.from(authorImg.data, "base64");
    author.authorImageType = authorImg.type;
  }
}

module.exports = router;
