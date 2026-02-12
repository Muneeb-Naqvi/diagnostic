import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // adjust if your db util name is different
import Appointment from "@/models/Appointment";
import mongoose from "mongoose";

/* ======================================================
   POST: Patient creates appointment request
   ====================================================== */
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      patientId,
      doctorId,
      reportId,
      disease,
      preferredDate,
      preferredTime,
    } = body;

    // 🔒 Basic validation
    if (!patientId || !doctorId || !disease) {
      return NextResponse.json(
        { error: "patientId, doctorId and disease are required" },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(patientId) ||
      !mongoose.Types.ObjectId.isValid(doctorId)
    ) {
      return NextResponse.json(
        { error: "Invalid patientId or doctorId" },
        { status: 400 }
      );
    }

    // Parse preferred date (optional)
    let parsedPreferredDate = null;
    if (preferredDate) {
      parsedPreferredDate = new Date(preferredDate);
      if (isNaN(parsedPreferredDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid preferredDate format" },
          { status: 400 }
        );
      }
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      reportId: reportId || null,
      disease: disease.trim(),
      preferredDate: parsedPreferredDate,
      preferredTime: preferredTime ? preferredTime.trim() : null,
      status: "pending",
    });

    return NextResponse.json(
      {
        message: "Appointment request sent successfully",
        appointment: {
          id: appointment._id,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          disease: appointment.disease,
          preferredDate: appointment.preferredDate,
          preferredTime: appointment.preferredTime,
          status: appointment.status,
          createdAt: appointment.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

/* ======================================================
   GET: Fetch appointments (Doctor / Patient)
   ====================================================== */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");
    const status = searchParams.get("status");

    // At least one filter is required
    if (!doctorId && !patientId) {
      return NextResponse.json(
        { error: "doctorId or patientId is required" },
        { status: 400 }
      );
    }

    const query = {};

    if (doctorId) {
      if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return NextResponse.json(
          { error: "Invalid doctorId" },
          { status: 400 }
        );
      }
      query.doctorId = doctorId;
    }

    if (patientId) {
      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return NextResponse.json(
          { error: "Invalid patientId" },
          { status: 400 }
        );
      }
      query.patientId = patientId;
    }

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { appointments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
