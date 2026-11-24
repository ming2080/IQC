import { ArrowDownWideNarrow } from 'lucide-react';
import type { DashboardMaterialSort } from '../types';

interface DashboardSortControlProps {
  /** 当前排序方式 */
  value: DashboardMaterialSort;
  /** 排序方式变化回调 */
  onChange: (value: DashboardMaterialSort) => void;
}

const SORT_OPTIONS: DashboardMaterialSort[] = ['默认', '批次最新', '数量最多'];

/**
 * 首页看板清单排序切换：默认 / 批次最新 / 数量最多，
 * 同时作用于待检、检验中、检验结果三张清单。
 */
export default function DashboardSortControl({ value, onChange }: DashboardSortControlProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 flex items-center gap-2 shrink-0">
      <ArrowDownWideNarrow className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="text-xs text-slate-500 whitespace-nowrap">排序</span>
      <div className="flex items-center space-x-1">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-2 py-1 rounded-md text-[11px] font-bold transition ${
              value === option
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
