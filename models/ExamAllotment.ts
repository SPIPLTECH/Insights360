import { Schema, models, model } from "mongoose";

/** Which examination events were allotted to an ALC. ALCs without a record show "NA" for every event. */
const ExamAllotmentSchema = new Schema(
  {
    alcCode: { type: String, required: true, unique: true, trim: true },
    events: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default models.ExamAllotment || model("ExamAllotment", ExamAllotmentSchema);
