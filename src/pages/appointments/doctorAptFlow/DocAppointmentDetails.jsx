import { ChevronLeft, History, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import CustTable from "./components/CustTable";
import EditableMedicineTable from "./components/EditableMedicineTable";
import PrescribeTests from "./components/PrescribeTests";
import CustModal from "./components/CustModal";

import { useAuth } from "../../../utils/AuthContext";
import axiosInstance from "../../../constants/axiosInstance";
import { formatDate } from "../../../constants";

const DocAppointmentDetails = () => {
  const navigate = useNavigate();
  const { aptId } = useParams();
  const { user } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [patientData, setPatientData] = useState(null);

  const [reason, setReason] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");

  const [prescription, setPrescription] = useState([]);
  const [prescribedTests, setPrescribedTests] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToday, setIsToday] = useState(false);

  if (!user) return <Navigate to="/" replace />;

  const role = user.role?.toLowerCase().trim();

  if (!role?.includes("doctor")) {
    return <Navigate to="/dashboard" replace />;
  }

  const patientColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "bloodGroup", label: "Blood Group" },
    { key: "bloodPressure", label: "Blood Pressure" },
    { key: "spo2", label: "SpO2" },
    { key: "temperature", label: "Temperature" },
  ];

  /* -------------------------------- FETCH APPOINTMENT -------------------------------- */

  const fetchAppointment = async () => {
    try {
      const res = await axiosInstance.get(`/opd/visits/findOne/${aptId}`);
      const data = res.data.data;

      setAppointment(data);
      setPrescription(data.prescription || []);
      setPrescribedTests(data.medical_tests || []);

      if (data.patient) {
        setPatientData({
          name: `${data.patient.first_name} ${data.patient.last_name}`,
          email: data.patient.email,
          phone: data.patient.phone,
          age: data.patient.age,
          gender: data.patient.gender,
          bloodGroup: data.patient.blood_group,
          bloodPressure: data?.vitals?.bp,
          spo2: data?.vitals?.spo2,
          temperature: data?.vitals?.temperature_c,
        });
      }

      if (data?.visit_date) {
        const appointmentDate = new Date(data.visit_date)
          .toISOString()
          .split("T")[0];

        const today = new Date().toISOString().split("T")[0];

        setIsToday(appointmentDate === today);
      }
    } catch (error) {
      toast.error("Failed to fetch appointment");
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [aptId]);

  /* -------------------------------- UPDATE API -------------------------------- */

  const updateAppointment = async (payload, successMessage) => {
    try {
      const { data } = await axiosInstance.put(
        `/opd/visits/update/${aptId}`,
        payload
      );

      if (data?.success) {
        toast.success(successMessage);
        fetchAppointment();
        setReason("");
        setDoctorNotes("");
      }
    } catch (error) {
      toast.error("Error updating appointment");
      console.log(error);
    }
  };

  /* -------------------------------- ACTION HANDLERS -------------------------------- */

  const handleSave = () => {
    updateAppointment(
      {
        chief_complaint: reason,
        notes: doctorNotes,
      },
      "Details Updated Successfully!"
    );
  };

  const handleStartApt = () => {
    updateAppointment({ status: "ongoing" }, "Appointment Started!");
  };

  const handleConfirmComplete = () => {
    updateAppointment({ status: "completed" }, "Appointment Completed!");
  };

  const handleToggle = () => {
    if (isEditing) {
      handleSave();
    }
    setIsEditing((prev) => !prev);
  };

  const handleCompleteClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-10">
        {/* Header */}
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-[#878A99] border border-[#878A99] rounded-md p-0.5"
          >
            <ChevronLeft strokeWidth={1.25} />
          </button>
          Appointment Details
        </h1>

        {/* Appointment Info */}
        <div className="bg-white border px-5 py-3 text-sm font-semibold flex justify-between">
          <h2>
            Date:{" "}
            <span className="font-normal">
              {formatDate(appointment?.visit_date)}
            </span>
          </h2>

          <h2>
            Reason:{" "}
            <span className="font-normal">
              {appointment?.chief_complaint || "-"}
            </span>
          </h2>

          <h2>
            Status:{" "}
            <span className="font-normal">{appointment?.status}</span>
          </h2>
        </div>

        {/* Patient Info */}
        <div>
          <h2 className="font-semibold">Patient Information</h2>
          <CustTable
            columns={patientColumns}
            data={patientData ? [patientData] : []}
          />
        </div>

        {/* Medical History */}
        <div className="flex gap-3 items-center">
          <button className="border border-[#878A99] text-sm text-[#878A99] py-2 px-2 rounded-md flex gap-2 items-center">
            <History strokeWidth={1.25} />
            View Medical History
          </button>

          <h2 className="text-sm text-[#495057]">
            Available For 365 days
          </h2>
        </div>

        <hr />

        {/* Start / Complete Appointment */}
        {appointment?.status?.toUpperCase() !== "COMPLETED" && (
          <button
            onClick={
              appointment?.status?.toUpperCase() === "PENDING"
                ? handleStartApt
                : handleCompleteClick
            }
            className="border border-red-400 w-full md:w-auto md:px-7 py-2 text-red-400 rounded-md"
          >
            {appointment?.status?.toUpperCase() === "PENDING"
              ? "Start Appointment"
              : "Complete Appointment"}
          </button>
        )}

        {/* Doctor Section */}
        {appointment?.status?.toUpperCase() !== "PENDING" && (
          <>
            {/* Reason */}
            <div className="space-y-3">
              <h2 className="font-semibold">Reason To Visit</h2>

              <div className="relative bg-[#E1E1E1] rounded-md border border-[#C8CED8]">
                <input
                  type="text"
                  readOnly={!isEditing}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={`w-full rounded-md p-2 text-sm outline-none ${
                    !isEditing
                      ? "cursor-not-allowed bg-[#E1E1E1]"
                      : "bg-white"
                  }`}
                  placeholder={appointment?.chief_complaint}
                />

                <button
                  type="button"
                  onClick={handleToggle}
                  className="flex items-center gap-2 absolute right-2 top-2 text-sm text-[#3577F1]"
                >
                  <SquarePen size={20} />
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>
            </div>

            {/* Medicines */}
            <EditableMedicineTable
              id={aptId}
              isToday={isToday}
              existingPrescription={prescription}
              fetchAppointment={fetchAppointment}
            />

            {/* Tests */}
            <PrescribeTests
              id={aptId}
              isToday={isToday}
              prescribedTests={prescribedTests}
              fetchAppointment={fetchAppointment}
            />

            {/* Notes */}
            <div className="space-y-3">
              <h2 className="font-semibold">Add Note</h2>

              <small className="text-gray-700 block">
                Added Note : {appointment?.notes}
              </small>

              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="w-full border p-3 rounded-md"
                placeholder="Add note here"
              />

              {doctorNotes.trim().length > 0 && (
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md"
                >
                  Save Note
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Complete Modal */}
      <CustModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmComplete}
        title="Confirmation"
        btnName="Complete"
        message="Are you sure you want to complete this appointment?"
      />
    </>
  );
};

export default DocAppointmentDetails;