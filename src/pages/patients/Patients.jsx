import { useEffect, useState } from "react";
import {
  Plus,
  Activity,
  Heart,
  Thermometer,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import AddPatientModal from "./components/AddPatientModal";
import AddVitalsModal from "./components/AddVitalsModal";
import axiosInstance from "../../constants/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../../utils/AuthContext";
import ViewPatientModal from "./components/ViewPatientModal";
import BillModal from "./components/BillModal";

const statsData = {
  Daily: 2,
  Weekly: 8,
  Monthly: 12,
  Quarterly: 36,
};

const Patients = () => {
  const [filter, setFilter] = useState("Monthly");
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddVitalsModal, setShowAddVitalModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { permissions } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("All");
  const [showBillsModal, setShowBillsModal] = useState(false);
  const [bills, setBills] = useState([]);
  const [billsLoading, setBillsLoading] = useState(false);

  console.log(permissions);

  const fetchPatients = async (page = 1) => {
    setLoading(true);
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `/patients/findAll?page=${page}&limit=20`,
      );
      console.log(response.data.data);
      setPatients(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(page);
  }, [page]);

  const handleAddPatient = async (patientData) => {
    try {
      const response = await axiosInstance.post(
        "/patients/create",
        patientData,
      );

      console.log(response.data);
      toast.success("Patient added successfully");

      setShowAddPatientModal(false);
      fetchPatients(page);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  const togglePatientStatus = async (patient) => {
    toast.dismiss();
    try {
      const newStatus = !patient.is_active;

      await axiosInstance.patch(`/patients/toggle-active/${patient.id}`, {
        is_active: newStatus,
      });

      toast.success("Patient status updated");

      fetchPatients(page);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  const searchPatientByPhone = async (phone) => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/patients/search/phone?phone=${phone}`,
      );

      setPatients(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Patient not found");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    if (activeTab === "Active") return patient.is_active;
    if (activeTab === "Critical") return patient.is_critical;
    return true;
  });

  const fetchPatientBills = async (patientId) => {
    try {
      setBillsLoading(true);

      const res = await axiosInstance.get(
        `/billing/bills/findAll?page=1&limit=20&patient_id=${patientId}`,
      );

      setBills(res.data.data.data || []);
      setShowBillsModal(true);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load bills");
    } finally {
      setBillsLoading(false);
    }
  };

    const PageLoader = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
       {loading && <PageLoader />}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
          <p className="text-gray-500 text-sm">
            Manage patient records and information
          </p>
        </div>

        {permissions?.patients?.create && (
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <Plus size={18} />
            Add Patient
          </button>
        )}
      </div>

      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onSubmit={handleAddPatient}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Patients"
          value={statsData[filter]}
          icon={<Activity className="text-blue-500" />}
          filters={["Daily", "Weekly", "Monthly", "Quarterly"]}
          selectedFilter={filter}
          onFilterChange={setFilter}
        />
        <StatCard
          title="Active"
          value="4"
          icon={<Heart className="text-green-500" />}
        />
        <StatCard
          title="Critical"
          value="1"
          icon={<Thermometer className="text-red-500" />}
        />
        <StatCard
          title="New This Month"
          value="12"
          icon={<Plus className="text-blue-500" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-4 text-xs">
        {["All", "Active", "Critical"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              activeTab === tab
                ? "bg-gray-200 text-gray-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab} Patients
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        {/* Table Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b gap-4">
          <h2 className="font-semibold text-gray-700">All Patients</h2>

          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search phone..."
              value={searchPhone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setSearchPhone(value);

                if (value.length > 0) {
                  searchPatientByPhone(value);
                }

                if (value.length === 0) {
                  fetchPatients(page);
                }
              }}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Patient ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Age</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">Blood Group</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Last Visit</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map((patient) => {
                const age =
                  new Date().getFullYear() -
                  new Date(patient.dob).getFullYear();

                return (
                  <tr
                    key={patient.id}
                    className="border-t hover:bg-gray-50 text-xs"
                  >
                    <td className="px-4 py-2">{patient.id.slice(0, 8)}</td>

                    <td className="px-4 py-2">
                      {patient.first_name} {patient.last_name}
                    </td>

                    <td className="px-4 py-2">{age}</td>

                    <td className="px-4 py-2 capitalize">{patient.gender}</td>

                    <td className="px-4 py-2">{patient.blood_group}</td>

                    <td className="px-4 py-2">{patient.phone}</td>

                    <td className="px-4 py-2">
                      {new Date(patient.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          patient.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {patient.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowViewModal(true);
                        }}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                      >
                        View
                      </button>

                      {permissions?.billing?.update && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => fetchPatientBills(patient.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md"
                          >
                            All Bills
                          </button>
                        </div>
                      )}

                      {permissions?.patients?.update && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => togglePatientStatus(patient)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                              patient.is_active ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                                patient.is_active ? "translate-x-5" : ""
                              }`}
                            />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-end items-center p-4 border-t gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`rounded-md border ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <ChevronLeft />
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`rounded-md border ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <ChevronRight />
            </button>
          </div>

          <ViewPatientModal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            patient={selectedPatient}
            onUpdated={() => fetchPatients(page)}
          />

          <AddVitalsModal
            isOpen={showAddVitalsModal}
            onClose={() => setShowAddVitalModal(false)}
            patient={selectedPatient}
            onUpdated={() => fetchPatients(page)}
          />
        </div>

        {showBillsModal && (
          <BillModal
            setShowBillsModal={setShowBillsModal}
            bills={bills}
            billsLoading={billsLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Patients;
