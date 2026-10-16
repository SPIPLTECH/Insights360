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
  attendancePercent?: number; // meeting_attendance (attended / total * 100)
  totalMeetings?: number; // meeting_attendance
  attendedMeetings?: number; // meeting_attendance
  proofDate?: string; // meeting_attendance (legacy)

  examEvent?: string; // exam_compliance — OLD single-event submissions only
  examEvents?: string[]; // exam_compliance — all selected events, e.g. ["Feb","June"]
  cctvSubmittedCount?: number; // exam_compliance — how many of the selected events had CCTV submitted
  examMandatory?: string; // exam_compliance — "Mandatory" | "Not Mandatory"
  cctvSubmitted?: boolean; // exam_compliance
  cctvObservation?: string; // exam_compliance — Bad / Poor / Average / Good / Best (Part 2)
  examGrid?: { event: string; submitted: boolean }[]; // exam_compliance — one entry per allotted & conducted event
  examEligibleCount?: number; // exam_compliance — allotted events already conducted when saved
  cctvPart1Marks?: number; // exam_compliance — Part 1 marks (CCTV events), out of 12.5
  observationMarks?: number; // exam_compliance — Part 2 marks (General Observation), out of 12.5
  auditNotes?: string; // exam_compliance (legacy)

  postedOnSocialMedia?: boolean; // social_media
  socialPresence?: "Regular" | "Irregular"; // social_media — Regular = 25, Irregular = 15.5
  instagramLink?: string; // social_media
  facebookLink?: string; // social_media
  socialPlatform?: string; // social_media (joined, kept for MRCU view/export)
  socialLink?: string; // social_media (joined, kept for MRCU view/export)
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

  sheetSynced: boolean; // true once the result is written to Google Sheet
  sheetError: string | null; // last sheet error, if any

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
    totalMeetings: Number,
    attendedMeetings: Number,
    proofDate: String,

    examEvent: String,
    examEvents: { type: [String], default: undefined },
    cctvSubmittedCount: Number,
    examMandatory: String,
    cctvSubmitted: Boolean,
    cctvObservation: String,
    examGrid: { type: [{ _id: false, event: String, submitted: Boolean }], default: undefined },
    examEligibleCount: Number,
    cctvPart1Marks: Number,
    observationMarks: Number,
    auditNotes: String,

    postedOnSocialMedia: Boolean,
    socialPresence: String,
    instagramLink: String,
    facebookLink: String,
    socialPlatform: String,
    socialLink: String,
    months: [MonthEntrySchema],

    fileUrls: { type: [String], default: [] },
    calculatedMarks: { type: Number, required: true, default: 0 },

    submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    reviewNote: { type: String, default: null },

    sheetSynced: { type: Boolean, default: false },
    sheetError: { type: String, default: null },
  },
  { timestamps: true }
);

SubmissionSchema.index({ district: 1, alcCode: 1, parameterType: 1, createdAt: -1 });
SubmissionSchema.index({ status: 1 });

export default models.Submission || model<ISubmission>("Submission", SubmissionSchema);
