import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Appointment from "@/models/Appointment";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      diagnosis,
      medicines,
      instructions,
      followUpDate,
    } = body;

    if (!diagnosis || !medicines?.length) {
      return NextResponse.json(
        { error: "Diagnosis and medicines are required" },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    appointment.prescription = {
      diagnosis,
      medicines,
      instructions: instructions || "",
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      issuedAt: new Date(),
    };

    appointment.status = "completed";

    await appointment.save();

    return NextResponse.json({
      success: true,
      message: "Prescription saved successfully",
      prescription: appointment.prescription,
    });
  } catch (error) {
    console.error("Prescription error:", error);
    return NextResponse.json(
      { error: "Failed to save prescription" },
      { status: 500 }
    );
  }
}
