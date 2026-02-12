import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Appointment from "@/models/Appointment";
import mongoose from "mongoose";

/* ======================================================
   PATCH: Doctor approves or rejects appointment
   ====================================================== */
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { appointmentId } = params;
    const body = await request.json();

    const {
      status,          // "approved" | "rejected"
      doctorNotes,     // optional remarks by doctor
      confirmedDate,   // optional final date
      confirmedTime,   // optional final time
    } = body;

    // 🔒 Validate appointmentId
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointmentId" },
        { status: 400 }
      );
    }

    // 🔒 Validate status
    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be approved or rejected" },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // 🔐 Prevent re-processing
    if (appointment.status !== "pending") {
      return NextResponse.json(
        { error: "Appointment already processed" },
        { status: 400 }
      );
    }

    // Update fields
    appointment.status = status;

    if (doctorNotes) {
      appointment.doctorNotes = doctorNotes.trim();
    }

    if (status === "approved") {
      if (confirmedDate) {
        const parsedDate = new Date(confirmedDate);
        if (isNaN(parsedDate.getTime())) {
          return NextResponse.json(
            { error: "Invalid confirmedDate format" },
            { status: 400 }
          );
        }
        appointment.confirmedDate = parsedDate;
      }

      if (confirmedTime) {
        appointment.confirmedTime = confirmedTime.trim();
      }
    }

    await appointment.save();

    return NextResponse.json(
      {
        message:
          status === "approved"
            ? "Appointment approved successfully"
            : "Appointment rejected successfully",
        appointment: {
          id: appointment._id,
          status: appointment.status,
          doctorNotes: appointment.doctorNotes || null,
          confirmedDate: appointment.confirmedDate || null,
          confirmedTime: appointment.confirmedTime || null,
          updatedAt: appointment.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

/* ======================================================
   GET: Get single appointment detail
   ====================================================== */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { appointmentId } = params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointmentId" },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { appointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}
