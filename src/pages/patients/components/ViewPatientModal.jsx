import React, { useEffect, useState } from "react";
import axiosInstance from "../../../constants/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../../../utils/AuthContext";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const ViewPatientModal = ({ isOpen, onClose, patient, onUpdated }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const { user, permissions } = useAuth();

  useEffect(() => {
    if (patient) {
      setForm(patient);
      setErrors({});
      setEditMode(false);
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const validate = () => {
    let newErrors = {};

    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!form.first_name) {
      newErrors.first_name = "First name is required";
    } else if (!nameRegex.test(form.first_name)) {
      newErrors.first_name = "Only letters allowed";
    }

    if (!form.last_name) {
      newErrors.last_name = "Last name is required";
    } else if (!nameRegex.test(form.last_name)) {
      newErrors.last_name = "Only letters allowed";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number required";
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits and start from 6-9";
    }

    if (form.alternate_phone && !phoneRegex.test(form.alternate_phone)) {
      newErrors.alternate_phone = "Phone must be 10 digits starting from 6-9";
    }

    if (!form.blood_group) {
      newErrors.blood_group = "Select blood group";
    }

    if (!form.gender) {
      newErrors.gender = "Gender required";
    }

    if (!form.dob) {
      newErrors.dob = "Date of birth required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Name fields - only letters
    if (name === "first_name" || name === "last_name") {
      newValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    // Phone numbers - digits only
    if (
      name === "phone" ||
      name === "alternate_phone" ||
      name === "emergency_contact_phone"
    ) {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Pincode - digits only, max 6
    if (name === "pincode") {
      newValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleNotesChange = (e) => {
    setForm({
      ...form,
      metadata: {
        ...(form.metadata || {}),
        notes: e.target.value,
      },
    });
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      await axiosInstance.put(`/patients/update/${patient.id}`, form);

      toast.success("Patient updated successfully");
      setEditMode(false);
      onUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update patient");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Patient Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Patient Header */}
        <div className="flex items-center gap-4 border-b pb-4 mb-6">
          <img
            src={
              form.profile_photo_url ||
              `https://ui-avatars.com/api/?name=${form.first_name}+${form.last_name}`
            }
            className="w-16 h-16 rounded-full object-cover border"
            alt="profile"
          />

          <div>
            <h3 className="text-lg font-semibold">
              {form.first_name} {form.last_name}
            </h3>

            <p className="text-sm text-gray-500">
              {form.gender} • {calculateAge(form.dob)} yrs • {form.blood_group}
            </p>

            <p className="text-sm text-gray-500">{form.phone}</p>
          </div>
        </div>

        {/* Personal Info */}

        <Section title="Personal Information">
          <Input
            label="First Name"
            name="first_name"
            value={form.first_name}
            editMode={editMode}
            onChange={handleChange}
            error={errors.first_name}
          />

          <Input
            label="Last Name"
            name="last_name"
            value={form.last_name}
            editMode={editMode}
            onChange={handleChange}
            error={errors.last_name}
          />

          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={form.dob}
            editMode={editMode}
            onChange={handleChange}
            error={errors.dob}
          />

          <Select
            label="Gender"
            name="gender"
            value={form.gender}
            editMode={editMode}
            onChange={handleChange}
            options={["male", "female", "other"]}
            error={errors.gender}
          />

          <Select
            label="Blood Group"
            name="blood_group"
            value={form.blood_group}
            editMode={editMode}
            onChange={handleChange}
            options={bloodGroups}
            error={errors.blood_group}
          />
        </Section>

        {/* Contact Info */}

        <Section title="Contact Information">
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            editMode={editMode}
            onChange={handleChange}
            error={errors.phone}
          />

          <Input
            label="Alternate Phone"
            name="alternate_phone"
            value={form.alternate_phone}
            editMode={editMode}
            onChange={handleChange}
            error={errors.alternate_phone}
          />

          <Input
            label="Email"
            name="email"
            value={form.email}
            editMode={editMode}
            onChange={handleChange}
          />
        </Section>

        {/* Address */}

        <Section title="Address">
          <Input
            label="Address"
            name="address"
            value={form.address}
            editMode={editMode}
            onChange={handleChange}
            col
          />

          <Input
            label="City"
            name="city"
            value={form.city}
            editMode={editMode}
            onChange={handleChange}
          />

          <Input
            label="State"
            name="state"
            value={form.state}
            editMode={editMode}
            onChange={handleChange}
          />

          <Input
            label="Country"
            name="country"
            value={form.country}
            editMode={editMode}
            onChange={handleChange}
          />

          <Input
            label="Pincode"
            name="pincode"
            value={form.pincode}
            editMode={editMode}
            onChange={handleChange}
          />
        </Section>

        {/* Emergency */}

        <Section title="Emergency Contact">
          <Input
            label="Contact Name"
            name="emergency_contact_name"
            value={form.emergency_contact_name}
            editMode={editMode}
            onChange={handleChange}
          />

          <Input
            label="Contact Phone"
            name="emergency_contact_phone"
            value={form.emergency_contact_phone}
            editMode={editMode}
            onChange={handleChange}
          />

          <Input
            label="Relation"
            name="emergency_contact_relation"
            value={form.emergency_contact_relation}
            editMode={editMode}
            onChange={handleChange}
          />
        </Section>

        {/* Medical */}

        <Section title="Medical Information">
          <Input
            label="Allergies"
            value={(form.allergies || []).join(", ")}
            editMode={editMode}
            onChange={(e) =>
              setForm({
                ...form,
                allergies: e.target.value.split(",").map((a) => a.trim()),
              })
            }
            col
          />

          <Input
            label="Chronic Conditions"
            value={(form.chronic_conditions || []).join(", ")}
            editMode={editMode}
            onChange={(e) =>
              setForm({
                ...form,
                chronic_conditions: e.target.value
                  .split(",")
                  .map((c) => c.trim()),
              })
            }
            col
          />
        </Section>

        {/* Notes */}

        <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>

        <textarea
          value={form?.metadata?.notes || ""}
          disabled={!editMode}
          onChange={handleNotesChange}
          className="w-full border rounded p-2 text-sm"
        />

        {/* Buttons */}

        <div className="flex justify-end gap-3 mt-6">
          {!editMode && permissions?.patients?.update && (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
          )}

          {editMode && (
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              setEditMode(false);
            }}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* Section Wrapper */

const Section = ({ title, children }) => (
  <>
    <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="grid grid-cols-2 gap-4 text-sm mb-6">{children}</div>
  </>
);

/* Input Component */

const Input = ({
  label,
  name,
  value,
  onChange,
  editMode,
  col,
  type = "text",
  error,
}) => (
  <div className={col ? "col-span-2" : ""}>
    <label className="text-gray-500 text-xs">{label}</label>

    <input
      type={type}
      name={name}
      value={value || ""}
      disabled={!editMode}
      onChange={onChange}
      className={`w-full border rounded p-2 text-sm ${
        error ? "border-red-500" : ""
      }`}
    />

    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

/* Select Component */

const Select = ({ label, name, value, onChange, editMode, options, error }) => (
  <div>
    <label className="text-gray-500 text-xs">{label}</label>

    <select
      name={name}
      value={value || ""}
      disabled={!editMode}
      onChange={onChange}
      className={`w-full border rounded p-2 text-sm ${
        error ? "border-red-500" : ""
      }`}
    >
      <option value="">Select</option>

      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>

    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default ViewPatientModal;
