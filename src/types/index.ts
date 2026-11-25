/** 首页看板物料行基础字段 */
export interface DashboardMaterialBase {
  code: string;
  name: string;
  qty: number;
  supplier: string;
  batch: string;
  useTime: string;
}

/** 首页看板物料行（待检 / 检验中清单共用） */
export interface DashboardMaterial extends DashboardMaterialBase {
  inspector: string;
}

/** 检验结论 */
export type InspectionConclusion = '合格' | '让步接收' | '退货';

/** 检验结果清单行 */
export interface InspectionResult extends DashboardMaterialBase {
  conclusion: InspectionConclusion;
}

/** 物料组批数排行榜行 */
export interface RankingItem {
  name: string;
  count: number;
}

/** 不良分布行 */
export interface DefectItem {
  name: string;
  value: number;
  color: string;
}

/** 检验结果结论筛选（含全部） */
export type InspectionConclusionFilter = '全部' | InspectionConclusion;

/** 看板清单排序方式：默认保持原顺序，批次最新按批次倒序，数量最多按数量倒序 */
export type DashboardMaterialSort = '默认' | '批次最新' | '数量最多';

/** 看板清单卡片主题色：待检蓝、检验中青、检验结果绿 */
export type DashboardListAccent = 'blue' | 'cyan' | 'emerald';
