import { ChevronLeft, History, Mic, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import CustTable from "./components/CustTable";
import EditableMedicineTable from "./components/EditableMedicineTable";
import PrescribeTests from "./components/PrescribeTests";
import DoctorVoiceNoteModal from "./components/DoctorVoiceNoteModal";
import CustModal from "./components/CustModal";
import MedicineModal from "./components/MedicineModal";
import { useAuth } from "../../../utils/AuthContext";
import axiosInstance from "../../../constants/axiosInstance";

const DocAppointmentDetails = () => {
  const navigate = useNavigate();
  const { pId } = useParams();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [medicineModal, setMedicineModal] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [isPrescriptionEdited, setIsPrescriptionEdited] = useState(false);
  const [prescription, setPrescription] = useState([]);
  const [prescribedTests, setPrescribedTests] = useState([]);

  if (!user) return <Navigate to="/" replace />;

  const role = user.role?.toLowerCase().trim();

  if (!role?.includes("doctor")) {
    return <Navigate to="/dashboard" replace />;
  }
  const doctorId = sessionStorage.getItem("responseId");

  const [fetchAptData] = useState({
    dateOfAppointment: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    patientNotes: "Fever and body pain",
    status: "ONGOING",
    doctorNotes: "Initial check completed",
  });

  const [fetchPData] = useState({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    age: 35,
    gender: "Male",
    bloodGroup: "O+",
    bloodPressure: "120/80",
    spo2: "98%",
    temperature: "98.6°F",
  });

  // const [prescription] = useState([
  //   {
  //     id: "med1",
  //     name: "Paracetamol",
  //     reason: "Fever",
  //     dosage: "500mg",
  //     frequency: {
  //       morning: true,
  //       afternoon: false,
  //       night: true,
  //     },
  //     duration: "5 days",
  //     notes: "After food",
  //   },
  // ]);

  // const [prescribedTests] = useState([
  //   { name: "Blood Test" },
  //   { name: "X-Ray" },
  // ]);

  const [isToday] = useState(true);

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

  const fetchAppointment = async () => {
    try {
      const res = await axiosInstance.get(`/opd/visits/findOne/${pId}`);

      const data = res.data.data;

      setAppointment(data);

      setPrescription(data.prescription || []);
      setPrescribedTests(data.medical_tests || []);
      setDoctorNotes(data.notes || "");

      if (data.patient) {
        setPatientData({
          name: `${data.patient.first_name} ${data.patient.last_name}`,
          email: data.patient.email,
          phone: data.patient.phone,
          age: data.patient.age,
          gender: data.patient.gender,
          bloodGroup: data.patient.blood_group,
          bloodPressure: data.vitals?.blood_pressure,
          spo2: data.vitals?.spo2,
          temperature: data.vitals?.temperature,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch appointment");
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [pId]);

  /*
  const fetchAptById = async () => {
    const { data } = await axiosInstance.get(`/appointment/getById/${pId}`);
  };

  const fetchPrescriptionById = async () => {
    const { data } = await axiosInstance.get(
      `/prescription/getByAppointmentId/${pId}`
    );
  };

  const handleSave = async () => {
    await axiosInstance.patch("/appointment/update", {});
  };

  const handleStartApt = async () => {
    await axiosInstance.post("/appointment/start", {});
  };

  const handleConfirmComplete = async () => {
    await axiosInstance.post("/appointment/end", {});
  };
  */

  // ===============================
  // 🔹 STATIC HANDLERS
  // ===============================

  const handleSave = () => {
    toast.success("Static Mode: Save Disabled");
  };

  const handleStartApt = () => {
    toast.success("Static Mode: Start Disabled");
  };

  const handleConfirmComplete = () => {
    toast.success("Static Mode: Complete Disabled");
  };

  const handleToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleConfirm = () => {
    setMedicines([]);
    setMedicineModal(false);
  };

  const handleCompleteClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-10">
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
            Reason:{" "}
            <span className="font-normal">
              {appointment?.chief_complaint || "-"}
            </span>
          </h2>

          <h2>
            Status: <span className="font-normal">{appointment?.status}</span>
          </h2>
        </div>

        {/* Patient Table */}
        <div>
          <h2 className="font-semibold">Patient Information</h2>
          <CustTable
            columns={patientColumns}
            data={patientData ? [patientData] : []}
          />
        </div>

        {/* Prescription */}
        <EditableMedicineTable
          id={pId}
          isToday={isToday}
          fetchPData={fetchPData}
          doctorId={doctorId}
          fetchPrescriptionById={() => {}}
          existingPrescription={prescription || []}
          onEditedChange={setIsPrescriptionEdited}
        />

        {/* Tests */}
        <PrescribeTests
          id={pId}
          isToday={isToday}
          fetchPData={fetchPData}
          doctorId={doctorId}
          fetchPrescriptionById={() => {}}
          prescribedTests={prescribedTests || []}
        />

        {/* Notes */}
        <div>
          <h2 className="font-semibold">Add Note</h2>

          <textarea
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="w-full border p-3 rounded-md"
            placeholder="Add note here"
          />

          <button
            onClick={handleSave}
            className="bg-primary text-white px-6 py-2 rounded-md mt-2"
          >
            Save Note
          </button>
        </div>
      </div>

      {/* Modals */}
      <CustModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmComplete}
        title="Confirmation"
        btnName="Complete"
        message="Are you sure you want to complete this appointment?"
      />

      <MedicineModal
        isOpen={medicineModal}
        onClose={() => setMedicineModal(false)}
        onConfirm={handleConfirm}
        formData={{}}
        onChange={() => {}}
        handleFrequencyChange={() => {}}
      />
    </>
  );
};

export default DocAppointmentDetails;
