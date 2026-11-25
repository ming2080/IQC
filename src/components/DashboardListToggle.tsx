import { ChevronDown, ChevronUp } from 'lucide-react';
import { DASHBOARD_LIST_VISIBLE_COUNT } from '../data/iqcDashboard';
import type { DashboardListAccent } from '../types';

interface DashboardListToggleProps {
  /** 过滤后的总条数 */
  totalCount: number;
  /** 当前是否展开全部 */
  expanded: boolean;
  /** 展开 / 收起切换回调 */
  onToggle: () => void;
  /** 配色，与清单卡片的主题色一致 */
  accent: DashboardListAccent;
}

const ACCENT_STYLES: Record<DashboardListAccent, string> = {
  blue: 'text-blue-600 hover:bg-blue-50',
  cyan: 'text-cyan-600 hover:bg-cyan-50',
  emerald: 'text-emerald-600 hover:bg-emerald-50',
};

/**
 * 首页看板清单展开 / 收起切换：收起时只显示前 5 条，
 * 条数不超过 5 条时不显示。展开状态三张清单共用。
 */
export default function DashboardListToggle({ totalCount, expanded, onToggle, accent }: DashboardListToggleProps) {
  if (totalCount <= DASHBOARD_LIST_VISIBLE_COUNT) return null;
  const Icon = expanded ? ChevronUp : ChevronDown;
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-center gap-1 px-4 py-2.5 text-xs font-bold border-t border-slate-100 transition ${ACCENT_STYLES[accent]}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {expanded ? '收起，只看前 5 条' : `展开全部（共 ${totalCount} 条）`}
    </button>
  );
}
