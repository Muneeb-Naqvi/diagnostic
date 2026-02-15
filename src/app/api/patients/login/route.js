import { getDB } from "@/config/database"
import PatientAPI from "@/lib/patientAPI"
import { signToken, COOKIE_OPTIONS } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request) {
  try {
    console.log("[LOGIN] Attempting login...")
    const db = await getDB()
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email & password required" },
        { status: 400 }
      )
    }

    console.log("[LOGIN] Verifying patient:", email)
    const patient = await PatientAPI.verifyPatient(email, password)
    console.log("[LOGIN] Patient verification result:", patient ? "Found" : "Not found")

    if (!patient) {
      return Response.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Sign Token
    const token = signToken({ id: patient._id, patientId: patient.patientId || patient._id.toString(), role: "patient" })

    // Set Cookie
    const cookieStore = await cookies()
    cookieStore.set("patientToken", token, COOKIE_OPTIONS)

    console.log("[LOGIN] Login successful for:", email)

    return Response.json({
      success: true,
      message: "Login successful",
      patient: {
        id: patient._id, // Use string ID
        patientId: patient.patientId || patient._id.toString(), // Include clean patientId or fallback
        name: patient.name,
        email: patient.email,
      },
    })
  } catch (error) {
    console.error("[LOGIN ERROR]:", error)
    console.error("[LOGIN ERROR STACK]:", error.stack)
    return Response.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}







// import { connectDB } from "@/config/database"
// import PatientAPI from "@/lib/patientAPI"

// export async function POST(request) {
//   try {
//     await connectDB()
//     const body = await request.json()
//     const { email, password } = body

//     if (!email || !password) {
//       return Response.json({ success: false, error: "Email and password required" }, { status: 400 })
//     }

//     const patient = await PatientAPI.verifyPatient(email, password)

//     if (!patient) {
//       return Response.json({ success: false, error: "Invalid email or password" }, { status: 401 })
//     }

//     return Response.json({ success: true, patient }, { status: 200 })
//   } catch (error) {
//     console.error("[API] Login error:", error)
//     return Response.json({ success: false, error: error.message }, { status: 500 })
//   }
// }
