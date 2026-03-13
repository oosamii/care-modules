import { Users, Clock, Stethoscope, UserX, Activity } from "lucide-react";
import StatCard from "../../../components/StatCard";

const ReportsStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <StatCard title="OPD VISITS" value="4,821" icon={<Users />} />

      <StatCard title="AVG WAIT TIME" value="18 mins" icon={<Clock />} />

      <StatCard
        title="DR. PRODUCTIVITY"
        value="45 /day avg"
        icon={<Stethoscope />}
      />

      <StatCard title="NO-SHOW RATE" value="8.4%" icon={<UserX />} />

      <StatCard
        title="TOP DIAGNOSIS"
        value="Viral Infection"
        icon={<Activity />}
      />
    </div>
  );
};

export default ReportsStats;
