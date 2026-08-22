import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "dcu" | "mrcu";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string; // login id, e.g. "dcu_nagpur"
  passwordHash: string;
  role: UserRole;
  // For role "dcu", the district this login is scoped to (submissions are
  // stamped with this district and DCU dashboards only see their own).
  // Not used for "mrcu" (MRCU sees every district).
  district: string | null;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["dcu", "mrcu"], required: true },
    district: { type: String, default: null },
    displayName: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
