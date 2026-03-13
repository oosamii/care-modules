import DoctorProductivityTable from "./opd_components/DoctorProductivityTable";
import ReportsFilterBar from "./opd_components/ReportsFilterBar";
import ReportsStats from "./opd_components/ReportsStats";

const OPDReports = () => {
  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold">OPD Reports</h1>
      </div>

      <ReportsFilterBar />

      <ReportsStats />

      <DoctorProductivityTable />
    </div>
  );
};

export default OPDReports;
