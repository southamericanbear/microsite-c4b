const mongoose = require("mongoose");
const Book = require("./book");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  authorImage: {
    type: Buffer,
    required: true,
  },
  authorImageType: {
    type: String,
    required: true,
  },
});

authorSchema.pre("remove", function (next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error("This author has no books"));
    } else {
      next();
    }
  });
});

authorSchema.virtual("authorImagePath").get(function () {
  if (this.authorImage != null && this.authorImageType != null) {
    return `data:${
      this.authorImageType
    };charset=utf-8;base64,${this.authorImage.toString("base64")}`;
  }
});

module.exports = mongoose.model("Author", authorSchema);
