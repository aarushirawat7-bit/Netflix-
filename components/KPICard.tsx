
import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, subValue, icon, color }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group overflow-hidden relative">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <h4 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{value}</h4>
          {subValue && <p className="text-[10px] text-slate-500 mt-0.5">{subValue}</p>}
        </div>
        <div className={`p-2.5 rounded-lg text-white ${color} shadow-sm group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 ${color}`} />
    </div>
  );
};

export default KPICard;
