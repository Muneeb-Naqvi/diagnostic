// src/lib/patientAPI.js
import { getDB } from "@/config/database"
import bcrypt from "bcryptjs"

const PatientAPI = {
  /* =========================
     GET ALL PATIENTS
  ========================= */
  async getAllPatients() {
    try {
      const db = await getDB()
      return db.collection("patients").find().toArray()
    } catch (error) {
      console.error("[PatientAPI] Error getting all patients:", error)
      throw error
    }
  },

  /* =========================
     GET PATIENT BY ID
  ========================= */
  async getPatientById(patientId) {
    try {
      const db = await getDB()
      return db.collection("patients").findOne({ patientId })
    } catch (error) {
      console.error("[PatientAPI] Error getting patient by ID:", error)
      throw error
    }
  },

  /* =========================
     GET PATIENT BY EMAIL
  ========================= */
  async getPatientByEmail(email) {
    try {
      const db = await getDB()
      console.log("[PatientAPI] Looking for patient with email:", email)
      const patient = await db.collection("patients").findOne({ email })
      console.log("[PatientAPI] Patient found:", patient ? patient.patientId : "None")
      return patient
    } catch (error) {
      console.error("[PatientAPI] Error getting patient by email:", error)
      throw error
    }
  },

  /* =========================
     CREATE PATIENT (HASH PASSWORD)
  ========================= */
  async createPatient(data) {
    try {
      const db = await getDB()

      console.log("[PatientAPI] Hashing password for:", data.email)
      const hashedPassword = await bcrypt.hash(data.password, 10)
      console.log("[PatientAPI] Password hashed successfully")

      const patient = {
        ...data,
        password: hashedPassword,
        createdAt: new Date(),
      }

      console.log("[PatientAPI] Inserting patient into database:", data.patientId)
      await db.collection("patients").insertOne(patient)
      console.log("[PatientAPI] Patient inserted successfully")

      // password remove before returning
      delete patient.password
      return patient
    } catch (error) {
      console.error("[PatientAPI] Error creating patient:", error)
      throw error
    }
  },

  /* =========================
     LOGIN VERIFY (FIXED)
  ========================= */
  async verifyPatient(email, password) {
    const db = await getDB()

    const patient = await db.collection("patients").findOne({ email })
    if (!patient) return null

    const isMatch = await bcrypt.compare(password, patient.password)
    if (!isMatch) return null

    return patient
  },

  /* =========================
     UPDATE PATIENT
  ========================= */
  async updatePatient(patientId, data) {
    const db = await getDB()

    await db
      .collection("patients")
      .updateOne({ patientId }, { $set: data })

    return this.getPatientById(patientId)
  },

  /* =========================
     DELETE PATIENT
  ========================= */
  async deletePatient(patientId) {
    const db = await getDB()
    return db.collection("patients").deleteOne({ patientId })
  },

  /* =========================
     🧠 DASHBOARD REPORTS
  ========================= */
  async getPatientReports(patientId) {
    const db = await getDB()

    const reports = await db
      .collection("labReports")
      .find({ patientId })
      .sort({ createdAt: -1 })
      .toArray()

    return reports.map((r) => ({
      reportId: r._id.toString(),
      name: r.reportTitle,
      type: r.reportType,
      fileUrl: r.fileUrl,
      fileType: r.fileType,
      status: r.status || "pending-analysis",
      uploadDate: r.createdAt
        ? new Date(r.createdAt).toLocaleDateString()
        : "—",
      analysis: r.analysis || null,
    }))
  },
}

export default PatientAPI
