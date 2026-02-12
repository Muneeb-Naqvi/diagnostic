// import { getDB } from "@/config/database";
// import { ObjectId } from "mongodb";

// const COLLECTION = "prescriptions";
// const APPOINTMENTS_COLLECTION = "appointments";

// const PrescriptionAPI = {
//   // Get all prescriptions
//   async getAllPrescriptions() {
//     return await getDB()
//       .collection(COLLECTION)
//       .find()
//       .sort({ createdAt: -1 })
//       .toArray();
//   },

//   // Get prescription by prescriptionId
//   async getPrescriptionById(prescriptionId) {
//     return await getDB()
//       .collection(COLLECTION)
//       .findOne({ prescriptionId });
//   },

//   // Get prescriptions by patient
//   async getPatientPrescriptions(patientId) {
//     return await getDB()
//       .collection(COLLECTION)
//       .find({ patientId })
//       .sort({ createdAt: -1 })
//       .toArray();
//   },

//   // Get prescriptions by doctor
//   async getDoctorPrescriptions(doctorId) {
//     return await getDB()
//       .collection(COLLECTION)
//       .find({ doctorId })
//       .sort({ createdAt: -1 })
//       .toArray();
//   },

//   // ── UPDATED ── Create new prescription
//   async createPrescription(data) {
//     const {
//       appointmentId,
//       doctorId,
//       patientId,
//       medicines = [],
//       diagnosis = "",
//       advice = "",
//       ...rest
//     } = data;

//     if (!appointmentId) {
//       throw new Error("appointmentId is required to create a prescription");
//     }

//     let appointmentObjectId;
//     try {
//       appointmentObjectId = new ObjectId(appointmentId);
//     } catch (err) {
//       throw new Error("Invalid appointmentId format");
//     }

//     // 1. Check if appointment exists and is in valid status
//     const appointment = await getDB()
//       .collection(APPOINTMENTS_COLLECTION)
//       .findOne({ _id: appointmentObjectId });

//     if (!appointment) {
//       throw new Error("Appointment not found");
//     }

//     // Adjust allowed statuses according to your actual appointment model
//     const allowedStatuses = ["approved", "confirmed", "completed"];

//     if (!allowedStatuses.includes(appointment.status?.toLowerCase())) {
//       throw new Error(
//         `Cannot create prescription: Appointment status is "${appointment.status}". ` +
//           `Allowed statuses: ${allowedStatuses.join(", ")}`
//       );
//     }

//     // 2. Optional: Verify doctor owns this appointment (uncomment if needed)
//     // if (appointment.doctorId?.toString() !== doctorId) {
//     //   throw new Error("Unauthorized: You can only create prescriptions for your own appointments");
//     // }

//     // 3. Use patientId from data or fallback to appointment
//     const finalPatientId = patientId || appointment.patientId;
//     if (!finalPatientId) {
//       throw new Error("Patient ID could not be determined");
//     }

//     // 4. Create prescription document
//     const prescription = {
//       prescriptionId: `RX-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // slightly more unique
//       appointmentId: appointmentObjectId, // ← link to appointment
//       doctorId,
//       patientId: finalPatientId,
//       medicines,
//       diagnosis,
//       advice,
//       status: "active",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       ...rest,
//     };

//     const result = await getDB()
//       .collection(COLLECTION)
//       .insertOne(prescription);

//     // Return the created document with inserted _id
//     return {
//       ...prescription,
//       _id: result.insertedId,
//     };
//   },

//   // Update prescription
//   async updatePrescription(prescriptionId, data) {
//     const result = await getDB()
//       .collection(COLLECTION)
//       .findOneAndUpdate(
//         { prescriptionId },
//         {
//           $set: {
//             ...data,
//             updatedAt: new Date(),
//           },
//         },
//         { returnDocument: "after" }
//       );

//     return result.value;
//   },

//   // Delete prescription
//   async deletePrescription(prescriptionId) {
//     return await getDB()
//       .collection(COLLECTION)
//       .deleteOne({ prescriptionId });
//   },

//   // Optional: Get prescription(s) for a specific appointment
//   async getPrescriptionsByAppointment(appointmentId) {
//     let appointmentObjectId;
//     try {
//       appointmentObjectId = new ObjectId(appointmentId);
//     } catch {
//       return [];
//     }

//     return await getDB()
//       .collection(COLLECTION)
//       .find({ appointmentId: appointmentObjectId })
//       .sort({ createdAt: -1 })
//       .toArray();
//   },
// };

// export default PrescriptionAPI;










import { getDB } from "@/config/database"

const COLLECTION = "prescriptions"

const PrescriptionAPI = {
  // ✅ Get all prescriptions
  async getAllPrescriptions() {
    return await getDB()
      .collection(COLLECTION)
      .find()
      .sort({ createdAt: -1 })
      .toArray()
  },

  // ✅ Get prescription by prescriptionId
  async getPrescriptionById(prescriptionId) {
    return await getDB()
      .collection(COLLECTION)
      .findOne({ prescriptionId })
  },

  // ✅ Get prescriptions by patient
  async getPatientPrescriptions(patientId) {
    return await getDB()
      .collection(COLLECTION)
      .find({ patientId })
      .sort({ createdAt: -1 })
      .toArray()
  },

  // ✅ Get prescriptions by doctor
  async getDoctorPrescriptions(doctorId) {
    return await getDB()
      .collection(COLLECTION)
      .find({ doctorId })
      .sort({ createdAt: -1 })
      .toArray()
  },

  // ✅ Create new prescription
  async createPrescription(data) {
    const prescription = {
      prescriptionId: `RX-${Date.now()}`,
      doctorId: data.doctorId,
      patientId: data.patientId,
      medicines: data.medicines || [],
      diagnosis: data.diagnosis || "",
      advice: data.advice || "",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await getDB().collection(COLLECTION).insertOne(prescription)
    return prescription
  },

  // ✅ Update prescription
  async updatePrescription(prescriptionId, data) {
    const result = await getDB()
      .collection(COLLECTION)
      .findOneAndUpdate(
        { prescriptionId },
        {
          $set: {
            ...data,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      )

    return result.value
  },

  // ✅ Delete prescription
  async deletePrescription(prescriptionId) {
    return await getDB()
      .collection(COLLECTION)
      .deleteOne({ prescriptionId })
  },
}

export default PrescriptionAPI
