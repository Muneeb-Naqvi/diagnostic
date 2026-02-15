import getDB from "@/config/database"
import LabReportAPI from "@/lib/labReportAPI"
import { NextResponse } from "next/server"

/* =========================
   GET LAB REPORTS
========================= */
export async function GET(req) {
  try {
    const db = await getDB()

    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get("patientId")

    if (!patientId) {
      return NextResponse.json(
        { success: false, error: "patientId is required" },
        { status: 400 }
      )
    }

    const reports = await LabReportAPI.getAll({ patientId, db })

    const formattedReports = reports.map((r) => ({
      reportId: r._id.toString(),
      name: r.reportTitle,
      type: r.reportType,
      fileUrl: r.fileUrl,
      fileType: r.fileType,
      status: r.status || "pending-analysis",
      uploadDate: new Date(r.createdAt).toLocaleDateString(),
      analysis: r.analysis || null,
    }))

    return NextResponse.json({ success: true, data: formattedReports })
  } catch (error) {
    console.error("[GET /lab-reports]", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/* =========================
   POST LAB REPORT
========================= */
export async function POST(req) {
  try {
    const db = await getDB()

    const formData = await req.formData()

    const patientId = formData.get("patientId")
    const reportTitle = formData.get("name")
    const reportType = formData.get("type")
    const file = formData.get("file")

    if (!patientId || !reportTitle || !file) {
      return NextResponse.json(
        { success: false, error: "patientId, name, file required" },
        { status: 400 }
      )
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Invalid file" },
        { status: 400 }
      )
    }

    /* 📁 Upload file to Cloudinary */
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    // Upload to Cloudinary using direct API call
    const timestamp = Math.round(new Date().getTime() / 1000)
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    // Create signature
    const crypto = require('crypto')
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=lab-reports/${fileName}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex')
    
    // Prepare form data for Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', new Blob([buffer]), file.name)
    cloudinaryFormData.append('public_id', `lab-reports/${fileName}`)
    cloudinaryFormData.append('timestamp', timestamp.toString())
    cloudinaryFormData.append('api_key', process.env.CLOUDINARY_API_KEY)
    cloudinaryFormData.append('signature', signature)
    
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    )
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error("[Cloudinary Error]", errorText)
      throw new Error("Cloudinary upload failed: " + errorText)
    }
    
    const uploadResult = await uploadResponse.json()
    const fileUrl = uploadResult.secure_url
    const fileType = file.type || "application/octet-stream"

    /* 💾 Save DB record */
    const saved = await LabReportAPI.createReport({
      db,
      patientId,
      reportTitle,
      reportType,
      fileUrl,
      fileType,
      status: "pending-analysis",
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          reportId: saved._id.toString(),
          name: saved.reportTitle,
          type: saved.reportType,
          fileUrl,
          fileType,
          status: saved.status,
          uploadDate: new Date(saved.createdAt).toLocaleDateString(),
          analysis: saved.analysis || null,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /lab-reports]", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
