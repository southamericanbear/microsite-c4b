const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  primaryColor: {
    type: String,
    required: true,
  },
  secondaryColor: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImage: {
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
  secondCoverImage: {
    type: Buffer,
    required: true,
  },
  secondCoverImageType: {
    type: String,
    required: true,
  },
  thirdCoverImage: {
    type: Buffer,
    required: true,
  },
  thirdCoverImageType: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});

bookSchema.virtual("secondCoverImagePath").get(function () {
  if (this.secondCoverImage != null && this.secondCoverImageType != null) {
    return `data:${
      this.secondCoverImageType
    };charset=utf-8;base64,${this.secondCoverImage.toString("base64")}`;
  }
});

bookSchema.virtual("thirdCoverImagePath").get(function () {
  if (this.thirdCoverImage != null && this.thirdCoverImageType != null) {
    return `data:${
      this.thirdCoverImageType
    };charset=utf-8;base64,${this.thirdCoverImage.toString("base64")}`;
  }
});

module.exports = mongoose.model("Book", bookSchema);
