import React, { useState } from "react";
import {
  UserCheck,
  Activity,
  Clock,
  HeartPulse,
  AlertCircle,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import AddVitalsModal from "../patients/components/AddVitalsModal";

const NurseDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddVitalsModal, setShowAddVitalsModal] = useState(false);

  const patients = [
    {
      id: 1,
      name: "John Doe",
      age: 45,
      condition: "Post-Surgery",
      status: "Critical",
    },
    {
      id: 2,
      name: "Mary Johnson",
      age: 62,
      condition: "Recovery",
      status: "Active",
    },
    {
      id: 3,
      name: "James Brown",
      age: 38,
      condition: "Observation",
      status: "Active",
    },
  ];

  const handleAddVitals = (patient) => {
    setSelectedPatient(patient);
    setShowAddVitalsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Nurse Dashboard
        </h1>
        <p className="text-gray-500">
          Monitor assigned patients and tasks
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Assigned Patients"
          value="8"
          icon={<UserCheck className="text-blue-500" />}
        />

        <StatCard
          title="Critical Patients"
          value="2"
          icon={<Activity className="text-red-500" />}
        />

        <StatCard
          title="Pending Medications"
          value="15"
          icon={<Clock className="text-orange-500" />}
        />

        <StatCard
          title="Completed Tasks"
          value="23"
          icon={<HeartPulse className="text-green-500" />}
        />
      </div>

      {/* Patients + Alerts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Assigned Patients */}
        <div className="col-span-2 bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">
            Assigned Patients
          </h2>

          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Patient</th>
                <th>Age</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-3">{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.condition}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        p.status === "Critical"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleAddVitals(p)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-1"
                    >
                      <HeartPulse size={14} />
                      Add Vitals
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">
            System Alerts
          </h2>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-red-500" size={18} />

              <div>
                <p className="font-semibold">Vitals Alert</p>
                <p className="text-sm text-gray-500">
                  Patient John Doe vitals need attention
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  2 minutes ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Vitals Modal */}
      {showAddVitalsModal && (
        <AddVitalsModal
          isOpen={showAddVitalsModal}
          onClose={() => setShowAddVitalsModal(false)}
          patient={selectedPatient}
        />
      )}
    </div>
  );
};

export default NurseDashboard;