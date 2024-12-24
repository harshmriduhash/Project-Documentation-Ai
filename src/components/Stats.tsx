import { Card } from "./ui/card";

const Stats = () => {
  return (
    <div className="flex justify-center gap-8 mb-12">
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
        <div className="px-6 py-3 flex items-center gap-2">
          <span className="text-2xl font-bold text-emerald-600">7.2M+</span>
          <span className="text-gray-600">Users</span>
        </div>
      </Card>
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
        <div className="px-6 py-3 flex items-center gap-2">
          <span className="text-2xl font-bold text-emerald-600">45+</span>
          <span className="text-gray-600">Languages</span>
        </div>
      </Card>
    </div>
  );
};

export default Stats;