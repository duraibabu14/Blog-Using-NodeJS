const mongoose = require("mongoose");
const marked = require("marked");
const suguify = require("slugify");
const createDomPurifier = require("dompurify");
const { JSDOM } = require("jsdom");

const dompurify = createDomPurifier(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    type: String,
  },
  markdown: {
    required: true,
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitized: {
    type: String,
    required: true,
  },
});
articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = suguify(this.title, { lower: true, strict: true });
  }
  if (this.markdown) {
    this.sanitized = dompurify.sanitize(marked(this.markdown));
  }
  next();
});

module.exports = mongoose.model("Article", articleSchema);
