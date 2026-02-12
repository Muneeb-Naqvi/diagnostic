"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function AppointmentRequests({ doctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  /* =========================================
     Fetch pending appointments for doctor
     ========================================= */
  useEffect(() => {
    if (!doctorId) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `/api/appointments?doctorId=${doctorId}&status=pending`
        );
        const data = await res.json();

        if (res.ok) {
          setAppointments(data.appointments || []);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  /* =========================================
     Approve / Reject handler
     ========================================= */
  const handleDecision = async (appointmentId, status) => {
    const notes =
      status === "approved"
        ? prompt("Optional: Confirmation notes")
        : prompt("Optional: Rejection reason");

    setProcessingId(appointmentId);

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          doctorNotes: notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Action failed");
        return;
      }

      // Remove updated appointment from pending list
      setAppointments((prev) =>
        prev.filter((a) => a._id !== appointmentId)
      );
    } catch (error) {
      console.error("Failed to update appointment:", error);
    } finally {
      setProcessingId(null);
    }
  };

  /* =========================================
     UI states
     ========================================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading appointment requests...
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No pending appointment requests
      </div>
    );
  }

  /* =========================================
     Render UI
     ========================================= */
  return (
    <div className="space-y-5">
      {appointments.map((appointment) => (
        <div
          key={appointment._id}
          className="rounded-2xl bg-white border border-gray-100 shadow-md p-6"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {appointment.patientId?.name || "Patient"}
              </h3>
              <p className="text-sm text-gray-500">
                {appointment.patientId?.email}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Disease:{" "}
                <span className="font-medium">
                  {appointment.disease}
                </span>
              </p>
            </div>

            <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
              <Clock size={16} />
              Pending
            </span>
          </div>

          {/* Date & Time */}
          <div className="mt-3 text-sm text-gray-600">
            Preferred Date:{" "}
            <span className="font-medium">
              {appointment.preferredDate
                ? new Date(
                    appointment.preferredDate
                  ).toLocaleDateString()
                : "Not specified"}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={() =>
                handleDecision(appointment._id, "approved")
              }
              disabled={processingId === appointment._id}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60"
            >
              <CheckCircle size={18} />
              Approve
            </button>

            <button
              onClick={() =>
                handleDecision(appointment._id, "rejected")
              }
              disabled={processingId === appointment._id}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
            >
              <XCircle size={18} />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
