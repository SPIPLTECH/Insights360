import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "dcu" | "mrcu" | "admin";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string; // login id, e.g. "dcu_nagpur"
  passwordHash: string;
  role: UserRole;
  // For role "dcu", the district this login is scoped to (submissions are
  // stamped with this district and DCU dashboards only see their own).
  // Not used for "mrcu" / "admin" (they see every district).
  district: string | null;
  displayName: string;
  failedAttempts: number; // wrong-password count since last successful login
  disabled: boolean; // locked after too many failed attempts
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["dcu", "mrcu", "admin"], required: true },
    district: { type: String, default: null },
    displayName: { type: String, required: true },
    failedAttempts: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
