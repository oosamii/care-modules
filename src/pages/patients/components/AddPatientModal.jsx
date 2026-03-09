import React, { useState } from "react";
import { X } from "lucide-react";

const nameRegex = /^[A-Za-z\s]+$/;
const phoneRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddPatientModal = ({ isOpen, onClose, onSubmit }) => {
  const initialState = {
    first_name: "",
    last_name: "",
    dob: "",
    gender: "male",
    blood_group: "",
    phone: "",
    alternate_phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relation: "",
    allergies: "",
    chronic_conditions: "",
    notes: "",
    profile_photo_url: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "first_name" || name === "last_name") {
      if (!/^[A-Za-z\s]*$/.test(value)) return;
    }

    if (
      name === "phone" ||
      name === "alternate_phone" ||
      name === "emergency_contact_phone"
    ) {
      if (!/^\d*$/.test(value)) return;
      if (value.length === 1 && !/[6-9]/.test(value)) return;
      if (value.length > 10) return;
    }

    if (name === "pincode") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 6) return;
    }

    if (name === "profile_photo") {
      setFormData((prev) => ({
        ...prev,
        profile_photo: files[0],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    else if (!nameRegex.test(formData.first_name))
      newErrors.first_name = "Only letters allowed";

    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    else if (!nameRegex.test(formData.last_name))
      newErrors.last_name = "Only letters allowed";

    if (!formData.dob) newErrors.dob = "Date of birth required";

    if (!formData.blood_group) newErrors.blood_group = "Select blood group";

    if (!formData.phone) newErrors.phone = "Phone required";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Invalid phone";

    if (formData.alternate_phone && !phoneRegex.test(formData.alternate_phone))
      newErrors.alternate_phone = "Invalid alternate phone";

    if (formData.email && !emailRegex.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.address) newErrors.address = "Address required";

    if (!formData.city) newErrors.city = "City required";

    if (!formData.state) newErrors.state = "State required";

    if (!pincodeRegex.test(formData.pincode))
      newErrors.pincode = "Invalid pincode";

    if (!formData.emergency_contact_name)
      newErrors.emergency_contact_name = "Emergency contact name required";

    if (!formData.emergency_contact_phone)
      newErrors.emergency_contact_phone = "Emergency phone required";
    else if (!phoneRegex.test(formData.emergency_contact_phone))
      newErrors.emergency_contact_phone =
        "Phone must start with 6-9 and be 10 digits";

    if (!formData.emergency_contact_relation)
      newErrors.emergency_contact_relation = "Relation required";

    setErrors(newErrors);
    console.log(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    return {
      ...formData,
      alternate_phone: formData.alternate_phone || null,
      allergies: formData.allergies
        ? formData.allergies.split(",").map((a) => a.trim())
        : [],
      chronic_conditions: formData.chronic_conditions
        ? formData.chronic_conditions.split(",").map((c) => c.trim())
        : [],
      profile_photo_url: null,
      metadata: {
        notes: formData.notes,
      },
    };
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = buildPayload();

    onSubmit(payload);

    setFormData(initialState);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Add Patient</h2>
          <X
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={onClose}
          />
        </div>

        {/* SCROLLABLE FORM BODY */}
        <div className="overflow-y-auto p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FIRST NAME */}
            <div>
              <label className="text-sm text-gray-600">First Name</label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.first_name && (
                <p className="text-xs text-red-500">{errors?.first_name}</p>
              )}
            </div>

            {/* LAST NAME */}
            <div>
              <label className="text-sm text-gray-600">Last Name</label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.last_name && (
                <p className="text-xs text-red-500">{errors?.last_name}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="text-sm text-gray-600">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.dob && (
                <p className="text-xs text-red-500">{errors?.dob}</p>
              )}
            </div>

            {/* GENDER */}
            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors?.gender && (
                <p className="text-xs text-red-500">{errors?.gender}</p>
              )}
            </div>

            {/* BLOOD GROUP */}
            <div>
              <label className="text-sm text-gray-600">Blood Group</label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              >
                <option value="">Select</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ),
                )}
              </select>
              {errors?.blood_group && (
                <p className="text-xs text-red-500">{errors?.blood_group}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.phone && (
                <p className="text-xs text-red-500">{errors?.phone}</p>
              )}
            </div>

            {/* ALTERNATE PHONE */}
            <div>
              <label className="text-sm text-gray-600">Alternate Phone</label>
              <input
                name="alternate_phone"
                maxLength={10}
                value={formData.alternate_phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.alternate_phone && (
                <p className="text-xs text-red-500">
                  {errors?.alternate_phone}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.email && (
                <p className="text-xs text-red-500">{errors?.email}</p>
              )}
            </div>

            {/* ADDRESS */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.address && (
                <p className="text-xs text-red-500">{errors?.address}</p>
              )}
            </div>

            {/* CITY */}
            <div>
              <label className="text-sm text-gray-600">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.city && (
                <p className="text-xs text-red-500">{errors?.city}</p>
              )}
            </div>

            {/* STATE */}
            <div>
              <label className="text-sm text-gray-600">State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.state && (
                <p className="text-xs text-red-500">{errors?.state}</p>
              )}
            </div>

            {/* PINCODE */}
            <div>
              <label className="text-sm text-gray-600">Pincode</label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.pincode && (
                <p className="text-xs text-red-500">{errors?.pincode}</p>
              )}
            </div>

            {/* EMERGENCY NAME */}
            <div>
              <label className="text-sm text-gray-600">Emergency Contact Name</label>
              <input
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.emergency_contact_name && (
                <p className="text-xs text-red-500">
                  {errors?.emergency_contact_name}
                </p>
              )}
            </div>

            {/* EMERGENCY PHONE */}
            <div>
              <label className="text-sm text-gray-600">Emergency Phone</label>
              <input
                name="emergency_contact_phone"
                maxLength={10}
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.emergency_contact_phone && (
                <p className="text-xs text-red-500">
                  {errors?.emergency_contact_phone}
                </p>
              )}
            </div>

            {/* RELATION */}
            <div>
              <label className="text-sm text-gray-600">Relation</label>
              <input
                name="emergency_contact_relation"
                value={formData.emergency_contact_relation}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.emergency_contact_relation && (
                <p className="text-xs text-red-500">
                  {errors?.emergency_contact_relation}
                </p>
              )}
            </div>

            {/* ALLERGIES */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Allergies</label>
              <input
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.allergies && (
                <p className="text-xs text-red-500">{errors?.allergies}</p>
              )}
            </div>

            {/* CHRONIC CONDITIONS */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">
                Chronic Conditions
              </label>
              <input
                name="chronic_conditions"
                value={formData.chronic_conditions}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.chronic_conditions && (
                <p className="text-xs text-red-500">
                  {errors?.chronic_conditions}
                </p>
              )}
            </div>

            {/* NOTES */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
              {errors?.notes && (
                <p className="text-xs text-red-500">{errors?.notes}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Profile Photo</label>
              <input
                type="file"
                name="profile_photo"
                accept="image/*"
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add Patient
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
