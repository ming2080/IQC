import { Filter } from 'lucide-react';
import type { MyInspectionStatusFilter } from '../types';

interface MyInspectionStatusFilterControlProps {
  /** 当前状态筛选 */
  value: MyInspectionStatusFilter;
  /** 状态筛选变化回调 */
  onChange: (value: MyInspectionStatusFilter) => void;
  /** 各状态的任务条数 */
  counts: Record<MyInspectionStatusFilter, number>;
}

const STATUS_OPTIONS: MyInspectionStatusFilter[] = ['全部', '待抽样', '检验中'];

/**
 * 我的检验任务状态筛选：全部 / 待抽样 / 检验中，
 * 切换后立即重新筛选任务列表，按钮上显示各状态条数。
 */
export default function MyInspectionStatusFilterControl({ value, onChange, counts }: MyInspectionStatusFilterControlProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        <span>检验状态:</span>
      </span>
      <div className="flex items-center space-x-1">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
              value === option
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {option} ({counts[option]})
          </button>
        ))}
      </div>
    </div>
  );
}
