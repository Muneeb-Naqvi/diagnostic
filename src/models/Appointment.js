import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    /* =====================
       RELATIONS
    ====================== */
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalReport",
      required: true,
    },

    /* =====================
       AI DETECTION DATA
    ====================== */
    disease: {
      type: String,
      required: true, // AI detected disease
      index: true,
    },

    aiConfidence: {
      type: Number, // optional (0–100%)
      default: null,
    },

    aiSummary: {
      type: String, // short AI explanation
      default: null,
    },

    /* =====================
       APPOINTMENT DETAILS
    ====================== */
    preferredDate: {
      type: Date,
      required: true,
    },

    preferredTime: {
      type: String, // e.g. "10:30 AM"
      required: true,
    },

    appointmentDate: {
      type: Date, // final date set by doctor/admin
      default: null,
    },

    appointmentTime: {
      type: String,
      default: null,
    },

    /* =====================
       STATUS FLOW
       pending   → requested by patient
       approved  → doctor/admin approved
       rejected  → doctor/admin rejected
       completed → prescription added
       cancelled → patient cancelled
    ====================== */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    /* =====================
       DOCTOR PRESCRIPTION
    ====================== */
prescription: {
  diagnosis: {
    type: String,
    default: null,
  },

  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
    },
  ],

  instructions: {
    type: String,
    default: null,
  },

  prescribedAt: {
    type: Date,
    default: null,
  },
},

    /* =====================
       AUDIT / META
    ====================== */
    createdBy: {
      type: String,
      enum: ["patient", "admin"],
      default: "patient",
    },

    notes: {
      type: String,
      default: null, // optional internal notes
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

/* =====================
   SAFE MODEL EXPORT
====================== */
export default mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);














// import mongoose from "mongoose";

// const appointmentSchema = new mongoose.Schema(
//   {
//     patientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Patient",
//       required: [true, "Patient is required"],
//       index: true,
//     },

//     doctorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//       required: [true, "Doctor is required"],
//       index: true,
//     },

//     reportId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "LabReport",
//       default: null,
//     },

//     disease: {
//       type: String,
//       required: [true, "Disease / condition is required"],
//       trim: true,
//     },

//     preferredDate: {
//       type: Date,
//       default: null,
//     },

//     preferredTime: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//       index: true,
//     },

//     // Optional — useful for doctor decision
//     doctorNotes: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     // Optional — useful if doctor proposes a different time
//     confirmedDate: {
//       type: Date,
//       default: null,
//     },

//     confirmedTime: {
//       type: String,
//       trim: true,
//       default: null,
//     },
//   },
//   {
//     timestamps: true, // adds createdAt & updatedAt automatically
//   }
// );

// // 🔥 Compound indexes for performance (doctor dashboard)
// appointmentSchema.index({ doctorId: 1, status: 1 });
// appointmentSchema.index({ patientId: 1, createdAt: -1 });

// const Appointment =
//   mongoose.models.Appointment ||
//   mongoose.model("Appointment", appointmentSchema);

// export default Appointment;
