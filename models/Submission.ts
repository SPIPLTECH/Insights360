import mongoose, { Schema, models, model } from "mongoose";

export type ParameterType =
  | "meeting_attendance"
  | "exam_compliance"
  | "social_media"
  | "monthly_enrolment";

export type SubmissionStatus = "pending" | "accepted" | "rejected";

export interface MonthEntry {
  month: string; // "Jan", "Feb", ... — one entry per calendar month
  mscitAdmissions: number;
  klicAdmissions: number;
}

export interface ISubmission {
  _id: mongoose.Types.ObjectId;
  district: string;
  alcCode: string;
  alcName: string;
  parameterType: ParameterType;
  status: SubmissionStatus;

  // Parameter-specific payload — only the relevant fields are set per type.
  attendancePercent?: number; // meeting_attendance
  proofDate?: string; // meeting_attendance
  auditNotes?: string; // exam_compliance
  socialPlatform?: string; // social_media
  socialLink?: string; // social_media
  months?: MonthEntry[]; // monthly_enrolment

  fileUrls: string[]; // Cloudinary secure_urls (proof documents / screenshots)

  // Marks calculated at submission time (meeting_attendance / monthly_enrolment
  // are proportional; exam_compliance / social_media are always 25 here and
  // only zeroed out on rejection). The value actually written to the Google
  // Sheet is always 0 on reject, calculatedMarks on accept.
  calculatedMarks: number;

  submittedBy: mongoose.Types.ObjectId;
  reviewedBy: mongoose.Types.ObjectId | null;
  reviewedAt: Date | null;
  reviewNote: string | null;

  createdAt: Date;
  updatedAt: Date;
}

const MonthEntrySchema = new Schema<MonthEntry>(
  {
    month: { type: String, required: true },
    mscitAdmissions: { type: Number, required: true, min: 0 },
    klicAdmissions: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    district: { type: String, required: true },
    alcCode: { type: String, required: true },
    alcName: { type: String, required: true },
    parameterType: {
      type: String,
      enum: ["meeting_attendance", "exam_compliance", "social_media", "monthly_enrolment"],
      required: true,
    },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },

    attendancePercent: Number,
    proofDate: String,
    auditNotes: String,
    socialPlatform: String,
    socialLink: String,
    months: [MonthEntrySchema],

    fileUrls: { type: [String], default: [] },
    calculatedMarks: { type: Number, required: true, default: 0 },

    submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    reviewNote: { type: String, default: null },
  },
  { timestamps: true }
);

SubmissionSchema.index({ district: 1, alcCode: 1, parameterType: 1, createdAt: -1 });
SubmissionSchema.index({ status: 1 });

export default models.Submission || model<ISubmission>("Submission", SubmissionSchema);
