import type {
  DashboardMaterial,
  DashboardMaterialBase,
  InspectionResult,
  RankingItem,
  DefectItem,
  InspectionConclusion,
  InspectionConclusionFilter,
  DashboardMaterialSort,
  MyInspectionStatusFilter,
} from '../types';

/** 首页待检物料清单 */
export const PENDING_MATERIALS: DashboardMaterial[] = [
  { code: '8020080001', name: '车规级多层陶瓷电容器 22uF', qty: 10000, supplier: '村田电子', batch: '20261020', useTime: '20261020', inspector: '李明' },
  { code: '8020080002', name: '车规级精密运算放大器', qty: 5000, supplier: '德州仪器', batch: '20261020', useTime: '20261020', inspector: '王芳' },
  { code: '8020080003', name: '超低功耗蓝牙SoC芯片', qty: 3500, supplier: 'Nordic', batch: '20261019', useTime: '20261019', inspector: '张伟' },
  { code: '8020080004', name: '高频贴片功率电感 4.7uH', qty: 15000, supplier: '顺络电子', batch: '20261019', useTime: '20261019', inspector: '刘洋' },
  { code: '8020080005', name: '车规双向TVS二极管', qty: 20000, supplier: '君耀电子', batch: '20261018', useTime: '20261018', inspector: '陈静' },
  { code: '8020080006', name: '高精度晶体振荡器 24MHz', qty: 8000, supplier: '泰艺电子', batch: '20261018', useTime: '20261018', inspector: '郭敏' },
  { code: '8020080007', name: '汽车级CAN总线收发器', qty: 6000, supplier: '纳芯微', batch: '20261017', useTime: '20261017', inspector: '周浩' },
  { code: '8020080008', name: '工业级SPI Flash存储器 128Mb', qty: 4000, supplier: '兆易创新', batch: '20261017', useTime: '20261017', inspector: '黄健' },
];

/** 首页检验中物料清单 */
export const INSPECTING_MATERIALS: DashboardMaterial[] = [
  { code: '8020080011', name: '功率MOSFET 60V 30A', qty: 5000, supplier: '英飞凌', batch: '20261020', useTime: '20261020', inspector: '王强' },
  { code: '8020080012', name: '高精度厚膜片式电阻 10K', qty: 50000, supplier: '国巨电子', batch: '20261020', useTime: '20261020', inspector: '赵磊' },
  { code: '8020080013', name: '车载电源管理IC 5V/2A', qty: 3000, supplier: '圣邦微', batch: '20261019', useTime: '20261019', inspector: '徐婷' },
  { code: '8020080014', name: '贴片铝电解电容 100uF 35V', qty: 8000, supplier: '艾华集团', batch: '20261019', useTime: '20261019', inspector: '孙涛' },
  { code: '8020080015', name: '高速光耦合器 10Mbit/s', qty: 4000, supplier: '光宝科技', batch: '20261018', useTime: '20261018', inspector: '林芳' },
  { code: '8020080016', name: '肖特基势垒二极管 40V 5A', qty: 15000, supplier: '长电科技', batch: '20261018', useTime: '20261018', inspector: '杨浩' },
  { code: '8020080017', name: '车规级EEPROM存储芯片', qty: 6000, supplier: '意法半导体', batch: '20261017', useTime: '20261017', inspector: '吴杰' },
];

/** 首页检验结果清单 */
export const INSPECTION_RESULTS: InspectionResult[] = [
  { code: '8020080021', name: '高灵敏度霍尔传感器', qty: 5000, supplier: '群创光电', batch: '20261020', useTime: '20261020', conclusion: '合格' },
  { code: '8020080022', name: '低压差线性稳压器 LDO 3.3V', qty: 8000, supplier: '德州仪器', batch: '20261020', useTime: '20261020', conclusion: '让步接收' },
  { code: '8020080023', name: '快速恢复二极管 200V 2A', qty: 12000, supplier: '扬杰科技', batch: '20261019', useTime: '20261019', conclusion: '退货' },
  { code: '8020080024', name: 'ESD静电保护二极管阵列', qty: 30000, supplier: '君耀电子', batch: '20261019', useTime: '20261019', conclusion: '合格' },
  { code: '8020080025', name: '超低功耗双通道运算放大器', qty: 4500, supplier: '圣邦微', batch: '20261018', useTime: '20261018', conclusion: '合格' },
  { code: '8020080026', name: '贴片功率电感 10uH', qty: 10000, supplier: '顺络电子', batch: '20261018', useTime: '20261018', conclusion: '让步接收' },
  { code: '8020080027', name: '车规级贴片晶振 16MHz', qty: 6000, supplier: '泰艺电子', batch: '20261017', useTime: '20261017', conclusion: '退货' },
];

/** 待检物料组批数排行榜 */
export const PENDING_RANKING_DATA: RankingItem[] = [
  { name: '电容物料组', count: 36 },
  { name: '电阻物料组', count: 32 },
  { name: '芯片IC组', count: 28 },
  { name: '电感磁性器件组', count: 25 },
  { name: '二极管/三极管组', count: 21 },
  { name: '传感器组件组', count: 18 },
  { name: '结构连接器组', count: 15 },
  { name: '光电耦合器件组', count: 12 },
  { name: '晶振时钟器件组', count: 9 },
  { name: '继电器/开关组', count: 7 },
];

/** 检验中物料组批数排行榜 */
export const INSPECTING_RANKING_DATA: RankingItem[] = [
  { name: '芯片集成电路组', count: 29 },
  { name: '车规电容物料组', count: 24 },
  { name: '功率MOSFET组', count: 20 },
  { name: '精密电阻物料组', count: 18 },
  { name: 'TVS防静电管组', count: 15 },
  { name: '高频电感物料组', count: 12 },
  { name: '传感器与模块组', count: 10 },
  { name: '时钟晶振器件组', count: 8 },
  { name: '电源管理IC组', count: 6 },
  { name: '光电传感器组', count: 4 },
];

/** 不良分布 */
export const PROGRESS_DEFECTS: DefectItem[] = [
  { name: '尺寸超差', value: 10.01, color: '#3b82f6' },
  { name: '外观划伤', value: 20.21, color: '#06b6d4' },
  { name: '性能异常', value: 30.20, color: '#10b981' },
  { name: '标志错漏', value: 49.11, color: '#f59e0b' },
  { name: '包装破损', value: 42.51, color: '#ec4899' },
];

/** 完成检验物料组分布统计（与不良分布同一组数据） */
export const DEFECT_DISTRIBUTION: DefectItem[] = PROGRESS_DEFECTS;

/**
 * 首页顶部 6 张指标卡的数值，由数据提供，不再写死在 JSX 里。
 * 评审中批数由原先误写的 -48 修正为 48（批数不可能为负）。
 */
export const DASHBOARD_METRICS = {
  pendingBatches: 230,
  inspectingBatches: 134,
  qualifiedBatches: 298,
  passRate: '92.8%',
  concessionBatches: 13,
  returnedBatches: 10,
  reviewingBatches: 48,
};

/** 按结论汇总检验结果条数 */
export function getInspectionConclusionSummary(results: InspectionResult[]): Record<InspectionConclusion, number> {
  const summary: Record<InspectionConclusion, number> = { '合格': 0, '让步接收': 0, '退货': 0 };
  for (const item of results) {
    summary[item.conclusion] += 1;
  }
  return summary;
}

/** 按结论筛选检验结果，'全部' 返回原列表 */
export function filterInspectionResultsByConclusion(
  results: InspectionResult[],
  filter: InspectionConclusionFilter,
): InspectionResult[] {
  if (filter === '全部') return results;
  return results.filter((item) => item.conclusion === filter);
}

/**
 * 按关键词筛选看板物料行：匹配物料编码、物料名称、供应商，
 * 带检验员字段的行同时匹配检验员。关键词为空或全空白时返回原列表。
 */
export function filterDashboardMaterialsByKeyword<T extends DashboardMaterialBase>(
  items: T[],
  keyword: string,
): T[] {
  const term = keyword.trim().toLowerCase();
  if (!term) return items;
  return items.filter((item) => {
    const inspector = 'inspector' in item ? String((item as DashboardMaterial).inspector) : '';
    return [item.code, item.name, item.supplier, inspector]
      .join(' ')
      .toLowerCase()
      .includes(term);
  });
}

/**
 * 看板清单排序：默认保持原顺序；批次最新按批次倒序（批次为 YYYYMMDD，
 * 字符串比较即时间倒序）；数量最多按数量倒序。返回新数组，不改动原列表。
 */
export function sortDashboardMaterials<T extends DashboardMaterialBase>(
  items: T[],
  sort: DashboardMaterialSort,
): T[] {
  if (sort === '默认') return items;
  const sorted = [...items];
  if (sort === '批次最新') {
    sorted.sort((a, b) => b.batch.localeCompare(a.batch));
  } else {
    sorted.sort((a, b) => b.qty - a.qty);
  }
  return sorted;
}

/** 首页看板清单默认显示条数，超过时卡片底部出现展开切换 */
export const DASHBOARD_LIST_VISIBLE_COUNT = 5;

/**
 * 按检验状态筛选我的检验任务，'全部' 返回原列表。
 * 状态取值为 '待抽样' / '检验中'，与任务行的 status 字段一致。
 */
export function filterMyInspectionsByStatus<T extends { status: string }>(
  items: T[],
  filter: MyInspectionStatusFilter,
): T[] {
  if (filter === '全部') return items;
  return items.filter((item) => item.status === filter);
}

/**
 * 看板清单截取：收起时只取前 DASHBOARD_LIST_VISIBLE_COUNT 条，
 * 展开时返回全部。返回新数组，不改动原列表。
 */
export function limitDashboardMaterials<T extends DashboardMaterialBase>(
  items: T[],
  expanded: boolean,
): T[] {
  if (expanded) return items;
  return items.slice(0, DASHBOARD_LIST_VISIBLE_COUNT);
}
