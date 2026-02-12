"use client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { DoctorSidebar } from "@/components/doctor-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PrescriptionModal } from "@/components/prescription-modal"
import {
  Stethoscope,
  User,
  FileText,
  Plus,
  ChevronRight,
  Search,
  Eye,
  Download,
  MessageSquare,
  CheckCircle,
} from "lucide-react"

function DoctorDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "overview"
  const [doctorId, setDoctorId] = useState("")
  const [prescriptionPatient, setPrescriptionPatient] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Smith",
      age: 45,
      condition: "Hypertension",
      lastVisit: "2024-01-18",
      status: "active",
      reports: 3,
    },
    {
      id: 2,
      name: "Sarah Wilson",
      age: 32,
      condition: "Diabetes Type 2",
      lastVisit: "2024-01-17",
      status: "active",
      reports: 5,
    },
    {
      id: 3,
      name: "Michael Johnson",
      age: 55,
      condition: "Heart Disease",
      lastVisit: "2024-01-10",
      status: "inactive",
      reports: 8,
    },
  ])

  const [labReports, setLabReports] = useState([
    {
      id: 1,
      patientName: "John Smith",
      reportType: "Blood Test",
      uploadDate: "2024-01-20",
      status: "pending-analysis",
      findings: "Elevated cholesterol levels",
    },
    {
      id: 2,
      patientName: "Sarah Wilson",
      reportType: "Glucose Test",
      uploadDate: "2024-01-19",
      status: "analyzed",
      findings: "Fasting glucose: 145 mg/dL (elevated)",
    },
    {
      id: 3,
      patientName: "Michael Johnson",
      reportType: "ECG",
      uploadDate: "2024-01-15",
      status: "analyzed",
      findings: "Normal sinus rhythm, no acute changes",
    },
  ])

  const [selectedReport, setSelectedReport] = useState(null)
  const [analysis, setAnalysis] = useState("")

  useEffect(() => {
    const id = localStorage.getItem("doctorId")
    setDoctorId(id || "DR000000000000")
  }, [])

  const handleAnalyzeReport = (reportId) => {
    const report = labReports.find((r) => r.id === reportId)
    setSelectedReport(report)
  }

  const handleSaveAnalysis = () => {
    setLabReports(
      labReports.map((r) =>
        r.id === selectedReport.id ? { ...r, status: "analyzed", findings: analysis } : r
      )
    )
    setSelectedReport(null)
    setAnalysis("")
    alert("Analysis saved successfully!")
  }

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#f8f9fc" }}>
      <DoctorSidebar />

      <div className="ml-64 flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b sticky top-0 z-30 shadow-sm"
          style={{ borderColor: "#e2e8f0" }}
        >
          <div className="flex items-center justify-between px-6 md:px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#020331" }}>
                Doctor Dashboard
              </h1>
              <p className="text-sm" style={{ color: "#64748b" }}>
                ID: {doctorId}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5" style={{ color: "#64748b" }} />
              </button>
              <div
                className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold"
                style={{ backgroundColor: "#3B75FD" }}
              >
                D
              </div>
            </div>
          </div>
        </motion.div>

        <main className="flex-1 p-6 md:p-8 space-y-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="shadow-sm" style={{ borderColor: "#e2e8f0", backgroundColor: "white" }}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <User className="w-8 h-8 mx-auto mb-2" style={{ color: "#3B75FD" }} />
                      <div className="text-3xl font-bold" style={{ color: "#020331" }}>
                        {patients.length}
                      </div>
                      <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                        Total Patients
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm" style={{ borderColor: "#e2e8f0", backgroundColor: "white" }}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: "#3B75FD" }} />
                      <div className="text-3xl font-bold" style={{ color: "#020331" }}>
                        {labReports.filter((r) => r.status === "pending-analysis").length}
                      </div>
                      <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                        Pending Analysis
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm" style={{ borderColor: "#e2e8f0", backgroundColor: "white" }}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: "#3B75FD" }} />
                      <div className="text-3xl font-bold" style={{ color: "#020331" }}>
                        {labReports.filter((r) => r.status === "analyzed").length}
                      </div>
                      <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                        Analyzed Reports
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm" style={{ borderColor: "#e2e8f0", backgroundColor: "white" }}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Stethoscope className="w-8 h-8 mx-auto mb-2" style={{ color: "#3B75FD" }} />
                      <div className="text-3xl font-bold" style={{ color: "#020331" }}>
                        {patients.filter((p) => p.status === "active").length}
                      </div>
                      <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                        Active Patients
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-sm" style={{ borderColor: "#e2e8f0", backgroundColor: "white" }}>
                <CardHeader>
                  <CardTitle style={{ color: "#020331" }}>Recent Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  {patients.slice(0, 3).map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 border-b last:border-0"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#eff6ff" }}
                        >
                          <User className="w-5 h-5" style={{ color: "#3B75FD" }} />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: "#020331" }}>
                            {patient.name}
                          </p>
                          <p className="text-sm" style={{ color: "#64748b" }}>
                            {patient.condition}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5" style={{ color: "#64748b" }} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* My Patients Tab */}
          {activeTab === "patients" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#64748b" }}
                />
                <Input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 border-[#e2e8f0] focus:border-[#3B75FD] focus:ring-[#3B75FD]/20 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow border border-[#e2e8f0]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#eff6ff" }}
                        >
                          <User className="w-6 h-6" style={{ color: "#3B75FD" }} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold" style={{ color: "#020331" }}>
                            {patient.name}
                          </h3>
                          <p className="text-sm" style={{ color: "#64748b" }}>
                            {patient.condition}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          patient.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-5 text-sm">
                      <div>
                        <p className="text-xs" style={{ color: "#64748b" }}>Age</p>
                        <p className="font-semibold" style={{ color: "#020331" }}>{patient.age} years</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "#64748b" }}>Last Visit</p>
                        <p className="font-semibold" style={{ color: "#020331" }}>{patient.lastVisit}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "#64748b" }}>Reports</p>
                        <p className="font-semibold" style={{ color: "#020331" }}>{patient.reports} files</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1 text-white flex items-center justify-center gap-2 py-2 text-sm"
                        style={{ backgroundColor: "#3B75FD" }}
                      >
                        <Eye className="w-4 h-4" />
                        View Records
                      </Button>
                      <Button
                        onClick={() => setPrescriptionPatient(patient.name)}
                        className="flex-1 border border-[#3B75FD] text-[#3B75FD] hover:bg-[#eff6ff] flex items-center justify-center gap-2 py-2 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Prescription
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Lab Reports Tab */}
          {activeTab === "reports" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="space-y-4">
                {labReports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow border border-[#e2e8f0]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5" style={{ color: "#3B75FD" }} />
                          <h3 className="text-lg font-bold" style={{ color: "#020331" }}>
                            {report.reportType}
                          </h3>
                        </div>
                        <p className="text-sm" style={{ color: "#64748b" }}>
                          Patient: {report.patientName}
                        </p>
                        <p className="text-sm" style={{ color: "#64748b" }}>
                          Uploaded: {report.uploadDate}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.status === "analyzed"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {report.status === "analyzed" ? "Analyzed" : "Pending"}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-5 text-sm">
                      <p style={{ color: "#020331" }}>
                        <span className="font-semibold">Findings:</span> {report.findings}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1 border border-[#3B75FD] text-[#3B75FD] hover:bg-[#eff6ff] flex items-center justify-center gap-2 py-2 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        View Report
                      </Button>

                      {report.status === "pending-analysis" && (
                        <Button
                          onClick={() => handleAnalyzeReport(report.id)}
                          className="flex-1 text-white flex items-center justify-center gap-2 py-2 text-sm"
                          style={{ backgroundColor: "#3B75FD" }}
                        >
                          Analyze
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Write Prescription Tab */}
          {activeTab === "prescription" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="shadow-sm" style={{ borderColor: "#e2e8f0", backgroundColor: "white" }}>
                <CardHeader>
                  <CardTitle style={{ color: "#020331" }}>Select Patient</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => setPrescriptionPatient(patient.name)}
                        className="w-full flex items-center justify-between p-4 border border-[#e2e8f0] rounded-lg hover:bg-blue-50 transition-colors text-left"
                      >
                        <div>
                          <p className="font-semibold" style={{ color: "#020331" }}>
                            {patient.name}
                          </p>
                          <p className="text-sm" style={{ color: "#64748b" }}>
                            {patient.condition}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5" style={{ color: "#64748b" }} />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>

      <PrescriptionModal
        isOpen={!!prescriptionPatient}
        onClose={() => setPrescriptionPatient(null)}
        patientName={prescriptionPatient || ""}
      />
    </div>
  )
}

export default function DoctorDashboard() {
  return (
    <Suspense fallback={null}>
      <DoctorDashboardContent />
    </Suspense>
  )
}