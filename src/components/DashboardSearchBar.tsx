import { Search, X } from 'lucide-react';

interface DashboardSearchBarProps {
  /** 当前关键词 */
  value: string;
  /** 关键词变化回调 */
  onChange: (value: string) => void;
  /** 三张清单的总条数 */
  totalCount: number;
  /** 关键词过滤后的总条数 */
  matchedCount: number;
}

/**
 * 首页看板清单关键词搜索框：按物料编码 / 名称 / 供应商 / 检验员
 * 模糊匹配待检、检验中、检验结果三张清单。
 */
export default function DashboardSearchBar({ value, onChange, totalCount, matchedCount }: DashboardSearchBarProps) {
  const searching = value.trim() !== '';
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 flex items-center gap-3">
      <Search className="w-4 h-4 text-slate-400 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索物料编码 / 名称 / 供应商 / 检验员"
        className="flex-1 min-w-0 text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
      />
      {searching && (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          共 {matchedCount} / {totalCount} 条
        </span>
      )}
      {searching && (
        <button
          onClick={() => onChange('')}
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
          aria-label="清空搜索"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
