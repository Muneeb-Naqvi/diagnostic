// "use client"

// import { useEffect, useState } from "react"
// import { toast } from "sonner"
// import { AlertCircle, CheckCircle2, Info } from "lucide-react"

// export default function PatientDashboardContent({ patientId }) {
//   const [reports, setReports] = useState([])
//   const [selectedReports, setSelectedReports] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [analyzing, setAnalyzing] = useState(false)

//   // 1️⃣ LOAD REPORTS
//   const loadReports = async () => {
//     try {
//       setLoading(true)

//       const res = await fetch(`/api/lab-reports?patientId=${patientId}`)
//       const data = await res.json()

//       if (!data.success) {
//         throw new Error(data.error || "Failed to load reports")
//       }

//       setReports(data.data || [])
//     } catch (err) {
//       console.error("LOAD REPORTS ERROR:", err)
//       toast.error("Failed to load your reports")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // 2️⃣ ANALYZE SELECTED REPORTS
//   const handleAnalyzeAllReports = async () => {
//     if (selectedReports.length === 0) {
//       toast.error("Please select at least one report")
//       return
//     }

//     try {
//       setAnalyzing(true)

//       const reportIds = selectedReports.map(r => r.reportId || r._id)

//       const res = await fetch("/api/lab-reports/analyze-bulk", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reportIds }),
//       })

//       const data = await res.json()

//       if (!data.success) {
//         throw new Error(data.error || "AI analysis failed")
//       }

//       await loadReports() // refresh
//       setSelectedReports([])
//       toast.success("AI analysis completed successfully")
//     } catch (err) {
//       console.error("ANALYZE ERROR:", err)
//       toast.error(err.message || "Something went wrong during analysis")
//     } finally {
//       setAnalyzing(false)
//     }
//   }

//   useEffect(() => {
//     if (patientId) loadReports()
//   }, [patientId])

//   return (
//     <div className="space-y-8">
//       {/* Header / Actions */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h2 className="text-2xl font-bold text-gray-800">Your Health Reports</h2>

//         <button
//           onClick={handleAnalyzeAllReports}
//           disabled={analyzing || selectedReports.length === 0}
//           className={`
//             px-6 py-2.5 rounded-lg font-medium transition-all
//             ${analyzing || selectedReports.length === 0
//               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//               : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
//             }
//           `}
//         >
//           {analyzing ? "Analyzing..." : "Analyze Selected Reports"}
//         </button>
//       </div>

//       {/* AI vs Doctor Comparison Section */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b">
//           <h3 className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
//             <Info size={20} />
//             Disease Detection Comparison
//           </h3>
//           <p className="text-sm text-indigo-700 mt-1">
//             AI-assisted analysis vs Doctor's confirmation
//           </p>
//         </div>

//         <div className="p-6">
//           {reports.length === 0 ? (
//             <div className="text-center py-10 text-gray-500">
//               No reports available yet
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[640px] text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b">
//                     <th className="px-5 py-3 text-left font-medium text-gray-700">Report Date</th>
//                     <th className="px-5 py-3 text-left font-medium text-gray-700">AI Detected</th>
//                     <th className="px-5 py-3 text-left font-medium text-gray-700">Confidence</th>
//                     <th className="px-5 py-3 text-left font-medium text-gray-700">Doctor Confirmed</th>
//                     <th className="px-5 py-3 text-left font-medium text-gray-700">Notes</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {reports.map((report) => (
//                     <tr key={report._id || report.reportId} className="hover:bg-gray-50/50 transition-colors">
//                       <td className="px-5 py-4 text-gray-600">
//                         {new Date(report.createdAt || report.date).toLocaleDateString()}
//                       </td>
//                       <td className="px-5 py-4">
//                         <div className="font-medium text-gray-800">
//                           {report.aiAnalysis?.disease || "—"}
//                         </div>
//                       </td>
//                       <td className="px-5 py-4">
//                         {report.aiAnalysis?.confidence ? (
//                           <span className={`font-medium ${report.aiAnalysis.confidence > 85 ? "text-green-600" :
//                             report.aiAnalysis.confidence > 65 ? "text-amber-600" : "text-red-600"}`}>
//                             {report.aiAnalysis.confidence}%
//                           </span>
//                         ) : "—"}
//                       </td>
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-2">
//                           {report.doctorDiagnosis?.disease ? (
//                             <>
//                               <CheckCircle2 size={16} className="text-green-600" />
//                               <span className="font-medium text-gray-800">
//                                 {report.doctorDiagnosis.disease}
//                               </span>
//                             </>
//                           ) : (
//                             <span className="text-gray-500 italic">Pending</span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-5 py-4 text-gray-600 max-w-xs truncate">
//                         {report.doctorDiagnosis?.notes || "—"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Disclaimer */}
//         <div className="bg-amber-50/70 border-t border-amber-100 px-6 py-4 text-sm text-amber-800 flex items-start gap-3">
//           <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
//           <p>
//             <strong>Important:</strong> AI assists doctors in early detection and analysis but does not replace professional medical diagnosis. Always consult your doctor for final interpretation and treatment.
//           </p>
//         </div>
//       </div>

//       {/* You can keep/add your reports list / selection UI below */}
//       {/* ... your existing reports cards / table / checkboxes ... */}
//     </div>
//   )
// }









"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function PatientDashboardContent({ patientId }) {
  const [reports, setReports] = useState([])
  const [selectedReports, setSelectedReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  // ✅ 1️⃣ LOAD REPORTS
  const loadReports = async () => {
    try {
      setLoading(true)

      const res = await fetch(`/api/lab-reports?patientId=${patientId}`)
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to load reports")
      }

      setReports(data.data || [])
    } catch (err) {
      console.error("LOAD REPORTS ERROR:", err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ 2️⃣ ANALYZE REPORTS
const handleAnalyzeAllReports = async () => {
  if (selectedReports.length === 0) {
    toast.error("Please select at least one report")
    return
  }

  try {
    setAnalyzing(true)

    const reportIds = selectedReports.map(
      (r) => r.reportId || r._id
    )

    const res = await fetch("/api/lab-reports/analyze-bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportIds }),
    })

    const data = await res.json()

    if (!data.success) {
      throw new Error(data.error || "AI analysis failed")
    }

    // 🔥 VERY IMPORTANT
    await loadReports(patientId)

    setSelectedReports([])
    toast.success("AI analysis completed")
  } catch (err) {
    console.error("ANALYZE ERROR:", err)
    toast.error(err.message)
  } finally {
    setAnalyzing(false)
  }
}


  // ✅ LOAD ON PAGE OPEN
  useEffect(() => {
    if (patientId) loadReports()
  }, [patientId])

  return (
    <>
      <button onClick={handleAnalyzeAllReports}>
        Analyze Selected Reports
      </button>

      {/* reports UI */}
    </>
  )
}
