const mongoose = require("mongoose");
const { Schema } = mongoose;
const Counter = require("./Counter");

const OptionSchema = new Schema({
  name: String,
  value: Schema.Types.Mixed,
  include: { type: String, default: "" },
  depth: { type: Number, default: 0 },
  within: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
  nocase: { type: Boolean, default: false },
  endswith: { type: Boolean, default: false },
});

const ModifierSchema = new Schema({
  action: String,
  protocol: String,
  ip_src: { name: String, include: String, value: [String] },
  ip_dest: { name: String, include: String, value: [String] },
  port_src: { name: String, include: String, value: [String] },
  port_dest: { name: String, include: String, value: [String] },
  options: [OptionSchema],
  ruleName: String,
  ruleMethod: String,
  ruleArchived: Boolean,
  ruleVisible: Boolean,
});

const SELKSRuleSchema = new Schema({
  sid: { type: Number, unique: true, required: true },
  new_sid: { type: Number, unique: true, required: false },
  rulename: { type: String, unique: true, required: true },
  modifiers: [ModifierSchema],
  timestamp: { type: Date, default: Date.now },
});

SELKSRuleSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "new_sid" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true, returnDocument: "after" }
      );
      doc.new_sid = counter.seq;
      next();
    } catch (error) {
      console.error("Error in pre-save middleware:", error);
      next(error);
    }
  } else {
    next();
  }
});

const SELKSRule = mongoose.model("SELKSRule", SELKSRuleSchema);

module.exports = SELKSRule;
