import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
      index: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is required"],
      index: true,
    },

    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabReport",
      default: null,
    },

    disease: {
      type: String,
      required: [true, "Disease / condition is required"],
      trim: true,
    },

    preferredDate: {
      type: Date,
      default: null,
    },

    preferredTime: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // Optional — useful for doctor decision
    doctorNotes: {
      type: String,
      trim: true,
      default: null,
    },

    // Optional — useful if doctor proposes a different time
    confirmedDate: {
      type: Date,
      default: null,
    },

    confirmedTime: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// 🔥 Compound indexes for performance (doctor dashboard)
appointmentSchema.index({ doctorId: 1, status: 1 });
appointmentSchema.index({ patientId: 1, createdAt: -1 });

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

export default Appointment;
