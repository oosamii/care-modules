const PatientHeader = ({ patient = {} }) => {
  return (
    <div className="bg-blue-50 border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className="bg-blue-200 text-blue-700 font-semibold w-12 h-12 rounded-full flex items-center justify-center">
          MR
        </div>

        <div>
          <div className="font-semibold text-lg">{patient?.name}</div>
          <div className="text-sm text-gray-600">
            UHID: {patient?.uhid} • {patient?.age} Yrs • {patient?.gender}
          </div>
        </div>

        <div className="ml-auto text-sm">
          <div className="text-gray-500">ALLERGIES</div>
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
            {patient?.allergy}
          </span>
        </div>

        <div className="text-sm">
          <div className="text-gray-500">VITALS SNAPSHOT</div>
          <div>{patient?.vitals}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-sm text-gray-600 border-t pt-3">
        <div>Doctor: {patient?.doctor}</div>
        <div>Dept: {patient?.dept}</div>
        <div>Visit ID: {patient?.visitId}</div>
        <div>Date: {patient?.date}</div>
      </div>
    </div>
  );
};

export default PatientHeader;
