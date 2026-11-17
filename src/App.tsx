import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  FileText,
  Search,
  MapPin,
  Settings,
  Database,
  BarChart3,
  Award,
  Shield,
  HelpCircle,
  Bell,
  LogOut,
  RefreshCw,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Package,
  ArrowUpRight,
  User,
  Lock,
  ArrowRight,
  Check,
  X,
  Menu,
  Plus,
  RotateCcw,
  Edit,
  Trash2,
  Activity,
  Layers,
  Maximize2,
  Wrench,
  Upload,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';
import type { InspectionConclusionFilter } from './types';
import {
  PENDING_MATERIALS,
  INSPECTING_MATERIALS,
  INSPECTION_RESULTS,
  PENDING_RANKING_DATA,
  INSPECTING_RANKING_DATA,
  PROGRESS_DEFECTS,
  DEFECT_DISTRIBUTION,
  DASHBOARD_METRICS,
  getInspectionConclusionSummary,
  filterInspectionResultsByConclusion,
} from './data/iqcDashboard';

const INITIAL_DISPATCH_LIST = [
  { id: 1, code: '8020080001', name: '高灵敏度霍尔传感器', mlot: 'MLOT202610-1', lpn: 'LPN001', supplierCode: '100021', supplierAbbr: '群创光电', batch: '20261020', qty: 5000, orderNo: 'W01110015', goodsNo: '0001805901', spot: '是', paperless: '否', wms: '是', failReason: '', dispatcher: '陈静', inspector: '李明', status: '已派单', remark: '加急件' },
  { id: 2, code: '8020080002', name: '车规级精密运算放大器', mlot: 'MLOT202610-2', lpn: 'LPN002', supplierCode: '100020', supplierAbbr: '德州仪器', batch: '20261019', qty: 8800, orderNo: 'W01110014', goodsNo: '0001805900', spot: '是', paperless: '是', wms: '是', failReason: '', dispatcher: '陈静', inspector: '张伟', status: '已派单', remark: '' },
  { id: 3, code: '8020080003', name: '超低功耗蓝牙SoC', mlot: 'MLOT202610-3', lpn: 'LPN003', supplierCode: '100019', supplierAbbr: 'Nordic', batch: '20261018', qty: 3500, orderNo: 'W01110013', goodsNo: '0001805899', spot: '否', paperless: '否', wms: '是', failReason: '', dispatcher: '王芳', inspector: '李明', status: '已派单', remark: '样品' },
  { id: 4, code: '8020080004', name: '高频贴片功率电感', mlot: 'MLOT202610-4', lpn: 'LPN004', supplierCode: '100018', supplierAbbr: '顺络电子', batch: '20261017', qty: 15000, orderNo: 'W01110012', goodsNo: '0001805898', spot: '是', paperless: '否', wms: '是', failReason: '', dispatcher: '陈静', inspector: '刘洋', status: '已派单', remark: '' },
  { id: 5, code: '8020080005', name: '车规双向TVS二极管', mlot: 'MLOT202610-5', lpn: 'LPN005', supplierCode: '100017', supplierAbbr: '君耀电子', batch: '20261016', qty: 20000, orderNo: 'W01110011', goodsNo: '0001805897', spot: '是', paperless: '是', wms: '是', failReason: '', dispatcher: '周浩', inspector: '李明', status: '已派单', remark: '常规' },
];

const INITIAL_WMS_PENDING_LIST = [
  { id: 1, code: '8020080021', desc: '车规级多层陶瓷电容器 22uF', supplierCode: '100012', supplierName: '村田中国', batch: '2026-10-20', qty: 10000, mlot: 'MLOT20261020-01', lpn: 'LPN9901', orderNo: 'W01110201', goodsNo: '0001805810', failReason: '设置不自动派单', receiveDate: '2026-10-20 14:35', expectedTime: '2026-10-20 18:00' },
  { id: 2, code: '8020080022', desc: '高压大容量独石电容 10uF', supplierCode: '100015', supplierName: '三星电子', batch: '2026-10-20', qty: 5000, mlot: 'MLOT20261020-02', lpn: 'LPN9902', orderNo: 'W01110202', goodsNo: '0001805811', failReason: '物料未定点', receiveDate: '2026-10-20 11:15', expectedTime: '2026-10-20 17:30' },
  { id: 3, code: '8020080023', desc: '贴片功率电感 4.7uH', supplierCode: '100018', supplierName: '顺络电子', batch: '2026-10-19', qty: 8000, mlot: 'MLOT20261019-01', lpn: 'LPN9903', orderNo: 'W01110203', goodsNo: '0001805812', failReason: '待仓库上架复核', receiveDate: '2026-10-19 16:40', expectedTime: '2026-10-20 10:00' },
  { id: 4, code: '8020080024', desc: '低压差线性稳压器 LDO 3.3V', supplierCode: '100022', supplierName: '德州仪器', batch: '2026-10-19', qty: 3000, mlot: 'MLOT20261019-02', lpn: 'LPN9904', orderNo: 'W01110204', goodsNo: '0001805813', failReason: '供应商条码不规范', receiveDate: '2026-10-19 09:25', expectedTime: '2026-10-20 09:00' },
  { id: 5, code: '8020080025', desc: '超高速双向TVS管 5V', supplierCode: '100017', supplierName: '君耀电子', batch: '2026-10-18', qty: 15000, mlot: 'MLOT20261018-01', lpn: 'LPN9905', orderNo: 'W01110205', goodsNo: '0001805814', failReason: '检验规范未发布', receiveDate: '2026-10-18 15:50', expectedTime: '2026-10-19 12:00' },
  { id: 6, code: '8020080026', desc: '车规级EEPROM存储芯片 512Kb', supplierCode: '100025', supplierName: '意法半导体', batch: '2026-10-18', qty: 6000, mlot: 'MLOT20261018-02', lpn: 'LPN9906', orderNo: 'W01110206', goodsNo: '0001805815', failReason: '质量特采审批中', receiveDate: '2026-10-18 10:10', expectedTime: '2026-10-19 10:00' },
  { id: 7, code: '8020080027', desc: '高精度晶体振荡器 24MHz', supplierCode: '100030', supplierName: '泰艺电子', batch: '2026-10-17', qty: 4000, mlot: 'MLOT20261017-01', lpn: 'LPN9907', orderNo: 'W01110207', goodsNo: '0001805816', failReason: '', receiveDate: '2026-10-17 14:00', expectedTime: '2026-10-18 16:00' },
  { id: 8, code: '8020080028', desc: '汽车级CAN收发器芯片', supplierCode: '100020', supplierName: '纳芯微', batch: '2026-10-16', qty: 2500, mlot: 'MLOT20261016-01', lpn: 'LPN9908', orderNo: 'W01110208', goodsNo: '0001805817', failReason: '', receiveDate: '2026-10-16 13:20', expectedTime: '2026-10-17 15:00' },
  { id: 9, code: '8020080029', desc: '高性能低功耗MCU 32位', supplierCode: '100035', supplierName: '兆易创新', batch: '2026-10-15', qty: 3500, mlot: 'MLOT20261015-01', lpn: 'LPN9909', orderNo: 'W01110209', goodsNo: '0001805818', failReason: '', receiveDate: '2026-10-15 11:45', expectedTime: '2026-10-16 14:00' },
  { id: 10, code: '8020080030', desc: '肖特基势垒二极管 100V 10A', supplierCode: '100040', supplierName: '扬杰科技', batch: '2026-10-14', qty: 12000, mlot: 'MLOT20261014-01', lpn: 'LPN9910', orderNo: 'W01110210', goodsNo: '0001805819', failReason: '', receiveDate: '2026-10-14 09:30', expectedTime: '2026-10-15 11:00' },
].sort((a, b) => new Date(b.receiveDate).getTime() - new Date(a.receiveDate).getTime());

const INITIAL_MY_INSPECTION_LIST = [
  { id: 1, status: '待抽样', code: '8020080021', name: '车规级多层陶瓷电容器 22uF', spec: 'CL21-22uF-16V', supplierCode: '100012', supplierAbbr: '村田中国', batch: '20261020', qty: 10000, inspector: '李明', urgent: '是', goodsNo: '0001805714', expectedTime: '20261021', dispatchStatus: '已派单', location: 'A-01-01', rejectReason: '' },
  { id: 2, status: '检验中', code: '8020080022', name: '功率MOSFET 60V 30A', spec: 'TO-252-3L', supplierCode: '100015', supplierAbbr: '英飞凌', batch: '20261019', qty: 5000, inspector: '王芳', urgent: '否', goodsNo: '0001805715', expectedTime: '20261020', dispatchStatus: '已派单', location: 'A-01-02', rejectReason: '' },
  { id: 3, status: '检验中', code: '8020080023', name: '高精度厚膜片式电阻 10K', spec: '0805-1% -10K', supplierCode: '100018', supplierAbbr: '国巨电子', batch: '20261018', qty: 50000, inspector: '张伟', urgent: '是', goodsNo: '0001805716', expectedTime: '20261019', dispatchStatus: '已派单', location: 'B-02-01', rejectReason: '' },
  { id: 4, status: '检验中', code: '8020080024', name: '车载电源管理IC 5V/2A', spec: 'SOP-8-EP', supplierCode: '100020', supplierAbbr: '德州仪器', batch: '20261017', qty: 3000, inspector: '刘洋', urgent: '否', goodsNo: '0001805717', expectedTime: '20261018', dispatchStatus: '已派单', location: 'B-02-03', rejectReason: '引脚氧化' },
  { id: 5, status: '检验中', code: '8020080025', name: '贴片铝电解电容 100uF 35V', spec: 'CD288-35V-100uF', supplierCode: '100025', supplierAbbr: '艾华集团', batch: '20261016', qty: 8000, inspector: '陈静', urgent: '否', goodsNo: '0001805718', expectedTime: '20261017', dispatchStatus: '已派单', location: 'C-01-04', rejectReason: '' },
  { id: 6, status: '检验中', code: '8020080026', name: '高速光耦合器 10Mbit/s', spec: 'SOIC-8', supplierCode: '100028', supplierAbbr: '光宝科技', batch: '20261015', qty: 4000, inspector: '赵强', urgent: '是', goodsNo: '0001805719', expectedTime: '20261016', dispatchStatus: '已派单', location: 'C-02-01', rejectReason: '' },
  { id: 7, status: '检验中', code: '8020080027', name: '肖特基势垒二极管 40V 5A', spec: 'SMA-DO-214AC', supplierCode: '100030', supplierAbbr: '长电科技', batch: '20261014', qty: 15000, inspector: '孙丽', urgent: '否', goodsNo: '0001805720', expectedTime: '20261015', dispatchStatus: '已派单', location: 'D-01-02', rejectReason: '' },
  { id: 8, status: '检验中', code: '8020080028', name: '瞬态电压抑制二极管 TVS', spec: 'SMBJ5.0A', supplierCode: '100032', supplierAbbr: '圣邦微', batch: '20261013', qty: 20000, inspector: '周杰', urgent: '否', goodsNo: '0001805721', expectedTime: '20261014', dispatchStatus: '已派单', location: 'D-02-05', rejectReason: '' },
  { id: 9, status: '检验中', code: '8020080029', name: '高性能低功耗MCU 32位', spec: 'LQFP-48', supplierCode: '100035', supplierAbbr: '兆易创新', batch: '20261012', qty: 3500, inspector: '吴敏', urgent: '是', goodsNo: '0001805722', expectedTime: '20261013', dispatchStatus: '已派单', location: 'E-01-01', rejectReason: '' },
  { id: 10, status: '检验中', code: '8020080030', name: '快速恢复二极管 200V 2A', spec: 'SMB', supplierCode: '100040', supplierAbbr: '扬杰科技', batch: '20261011', qty: 12000, inspector: '郑涛', urgent: '否', goodsNo: '0001805723', expectedTime: '20261012', dispatchStatus: '已派单', location: 'E-02-03', rejectReason: '' },
].sort((a, b) => b.batch.localeCompare(a.batch));

const INITIAL_IQC_AUDIT_LIST = [
  { id: 1, code: '8020080021', name: '车规级多层陶瓷电容器 22uF', supplierAbbr: '村田中国', batch: '20261020', qty: 10000, inspector: '李明', conclusion: '合格', progress: 'IQC主管审核' },
  { id: 2, code: '8020080022', name: '功率MOSFET 60V 30A', supplierAbbr: '英飞凌', batch: '20261019', qty: 5000, inspector: '王芳', conclusion: '不合格', progress: 'IQC主管审核' },
  { id: 3, code: '8020080023', name: '高精度厚膜片式电阻 10K', supplierAbbr: '国巨电子', batch: '20261018', qty: 50000, inspector: '张伟', conclusion: '合格', progress: 'IQC主管审核' },
  { id: 4, code: '8020080024', name: '车载电源管理IC 5V/2A', supplierAbbr: '德州仪器', batch: '20261017', qty: 3000, inspector: '刘洋', conclusion: '合格', progress: 'IQC主管审核' },
  { id: 5, code: '8020080025', name: '贴片铝电解电容 100uF 35V', supplierAbbr: '艾华集团', batch: '20261016', qty: 8000, inspector: '陈静', conclusion: '合格', progress: 'IQC主管审核' },
  { id: 6, code: '8020080026', name: '高速光耦合器 10Mbit/s', supplierAbbr: '光宝科技', batch: '20261015', qty: 4000, inspector: '赵强', conclusion: '不合格', progress: 'IQC主管审核' },
  { id: 7, code: '8020080027', name: '肖特基势垒二极管 40V 5A', supplierAbbr: '长电科技', batch: '20261014', qty: 15000, inspector: '孙丽', conclusion: '合格', progress: 'IQC主管审核' },
  { id: 8, code: '8020080028', name: '瞬态电压抑制二极管 TVS', supplierAbbr: '圣邦微', batch: '20261013', qty: 20000, inspector: '周杰', conclusion: '合格', progress: 'IQC主管审核' },
  { id: 9, code: '8020080029', name: '高性能低功耗MCU 32位', supplierAbbr: '兆易创新', batch: '20261012', qty: 3500, inspector: '吴敏', conclusion: '合格', progress: 'IQC主管审核' },
  { id: 10, code: '8020080030', name: '快速恢复二极管 200V 2A', supplierAbbr: '扬杰科技', batch: '20261011', qty: 12000, inspector: '郑涛', conclusion: '合格', progress: 'IQC主管审核' },
].sort((a, b) => b.batch.localeCompare(a.batch));

const INITIAL_QUALITY_MANAGER_AUDIT_LIST = [
  { id: 1, code: '8020080021', name: '车规级多层陶瓷电容器 22uF', supplierAbbr: '村田中国', batch: '20261020', qty: 10000, iqcConclusion: '合格', status: '主管审核' },
  { id: 2, code: '8020080022', name: '功率MOSFET 60V 30A', supplierAbbr: '英飞凌', batch: '20261019', qty: 5000, iqcConclusion: '退货', status: '主管审核' },
  { id: 3, code: '8020080023', name: '高精度厚膜片式电阻 10K', supplierAbbr: '国巨电子', batch: '20261018', qty: 50000, iqcConclusion: '让步接收', status: '主管审核' },
  { id: 4, code: '8020080024', name: '车载电源管理IC 5V/2A', supplierAbbr: '德州仪器', batch: '20261017', qty: 3000, iqcConclusion: '合格', status: '主管审核' },
  { id: 5, code: '8020080025', name: '贴片铝电解电容 100uF 35V', supplierAbbr: '艾华集团', batch: '20261016', qty: 8000, iqcConclusion: '退货', status: '主管审核' },
  { id: 6, code: '8020080026', name: '高速光耦合器 10Mbit/s', supplierAbbr: '光宝科技', batch: '20261015', qty: 4000, iqcConclusion: '让步接收', status: '主管审核' },
  { id: 7, code: '8020080027', name: '肖特基势垒二极管 40V 5A', supplierAbbr: '长电科技', batch: '20261014', qty: 15000, iqcConclusion: '合格', status: '主管审核' },
  { id: 8, code: '8020080028', name: '瞬态电压抑制二极管 TVS', supplierAbbr: '圣邦微', batch: '20261013', qty: 20000, iqcConclusion: '退货', status: '主管审核' },
  { id: 9, code: '8020080029', name: '高性能低功耗MCU 32位', supplierAbbr: '兆易创新', batch: '20261012', qty: 3500, iqcConclusion: '让步接收', status: '主管审核' },
  { id: 10, code: '8020080030', name: '快速恢复二极管 200V 2A', supplierAbbr: '扬杰科技', batch: '20261011', qty: 12000, iqcConclusion: '合格', status: '主管审核' },
  { id: 11, code: '8020080031', name: '高频贴片功率电感 4.7uH', supplierAbbr: '顺络电子', batch: '20261010', qty: 25000, iqcConclusion: '合格', status: '主管审核' },
  { id: 12, code: '8020080032', name: '低压差线性稳压器 LDO', supplierAbbr: '圣邦微', batch: '20261009', qty: 8000, iqcConclusion: '退货', status: '主管审核' },
  { id: 13, code: '8020080033', name: '车规双向TVS二极管', supplierAbbr: '君耀电子', batch: '20261008', qty: 15000, iqcConclusion: '让步接收', status: '主管审核' },
  { id: 14, code: '8020080034', name: '车规级EEPROM存储芯片', supplierAbbr: '意法半导体', batch: '20261007', qty: 6000, iqcConclusion: '合格', status: '主管审核' },
  { id: 15, code: '8020080035', name: '高精度晶体振荡器 24MHz', supplierAbbr: '泰艺电子', batch: '20261006', qty: 4000, iqcConclusion: '让步接收', status: '主管审核' },
].sort((a, b) => b.batch.localeCompare(a.batch));

const INITIAL_COMPREHENSIVE_QUERY_LIST = [
  { id: 1, routineCheck: '待抽样', lab: '不涉及', progress: '待抽样', code: '8020080021', name: '车规级多层陶瓷电容器 22uF', spec: 'CL21-22uF', supplierAbbr: '村田中国', batch: '20261020', qty: 10000, expectedTime: '2026-10-21 00:00', dispatchTime: '2026-10-20 14:35:57', location: 'K1E0A4102', inspectorCode: 'QC001', materialType: '常规检验物料', conclusion: '合格接收', feedbackNo: '/', report: '报告详情' },
  { id: 2, routineCheck: '待抽样', lab: '不涉及', progress: '检验中', code: '8020080022', name: '功率MOSFET 60V 30A', spec: 'TO-252', supplierAbbr: '英飞凌', batch: '20261019', qty: 5000, expectedTime: '2026-10-20 00:00', dispatchTime: '2026-10-19 11:20:15', location: 'K1E0A4102', inspectorCode: 'QC001', materialType: '常规检验物料', conclusion: '合格接收', feedbackNo: '/', report: '报告详情' },
  { id: 3, routineCheck: '检验中', lab: '不涉及', progress: 'IQC主管审核', code: '8020080023', name: '高精度厚膜片式电阻 10K', spec: '0805-1%', supplierAbbr: '国巨电子', batch: '20261018', qty: 50000, expectedTime: '2026-10-19 00:00', dispatchTime: '2026-10-18 09:10:22', location: 'K1E0A4102', inspectorCode: 'QC002', materialType: '常规检验物料', conclusion: '让步接收', feedbackNo: '220414-001', report: '报告详情' },
  { id: 4, routineCheck: '检验中', lab: '不涉及', progress: '质量主管审核', code: '8020080024', name: '车载电源管理IC 5V/2A', spec: 'SOP-8-EP', supplierAbbr: '德州仪器', batch: '20261017', qty: 3000, expectedTime: '2026-10-18 00:00', dispatchTime: '2026-10-17 16:40:10', location: 'K1E0A4102', inspectorCode: 'QC001', materialType: '常规检验物料', conclusion: '退货', feedbackNo: '220414-002', report: '报告详情' },
  { id: 5, routineCheck: '已检验', lab: '不涉及', progress: '已完结', code: '8020080025', name: '贴片铝电解电容 100uF 35V', spec: 'CD288', supplierAbbr: '艾华集团', batch: '20261016', qty: 8000, expectedTime: '2026-10-17 00:00', dispatchTime: '2026-10-16 10:05:30', location: 'K1E0A4102', inspectorCode: 'QC003', materialType: '常规检验物料', conclusion: '评审', feedbackNo: '220414-003', report: '报告详情' },
  { id: 6, routineCheck: '已检验', lab: '不涉及', progress: '已完结', code: '8020080026', name: '高速光耦合器 10Mbit/s', spec: 'SOIC-8', supplierAbbr: '光宝科技', batch: '20261015', qty: 4000, expectedTime: '2026-10-16 00:00', dispatchTime: '2026-10-15 14:22:40', location: 'K1E0A4102', inspectorCode: 'QC001', materialType: '常规检验物料', conclusion: '合格接收', feedbackNo: '/', report: '报告详情' },
  { id: 7, routineCheck: '已检验', lab: '不涉及', progress: '已完结', code: '8020080027', name: '肖特基势垒二极管 40V 5A', spec: 'SMA', supplierAbbr: '长电科技', batch: '20261014', qty: 15000, expectedTime: '2026-10-15 00:00', dispatchTime: '2026-10-14 08:50:11', location: 'K1E0A4102', inspectorCode: 'QC002', materialType: '常规检验物料', conclusion: '合格接收', feedbackNo: '/', report: '报告详情' },
  { id: 8, routineCheck: '已检验', lab: '不涉及', progress: '已完结', code: '8020080028', name: '瞬态电压抑制二极管 TVS', spec: 'SMBJ', supplierAbbr: '圣邦微', batch: '20261013', qty: 20000, expectedTime: '2026-10-14 00:00', dispatchTime: '2026-10-13 13:15:00', location: 'K1E0A4102', inspectorCode: 'QC003', materialType: '常规检验物料', conclusion: '合格接收', feedbackNo: '/', report: '报告详情' },
  { id: 9, routineCheck: '已检验', lab: '不涉及', progress: '已完结', code: '8020080029', name: '高性能低功耗MCU 32位', spec: 'LQFP-48', supplierAbbr: '兆易创新', batch: '20261012', qty: 3500, expectedTime: '2026-10-13 00:00', dispatchTime: '2026-10-12 11:30:25', location: 'K1E0A4102', inspectorCode: 'QC001', materialType: '常规检验物料', conclusion: '合格接收', feedbackNo: '/', report: '报告详情' },
  { id: 10, routineCheck: '已检验', lab: '不涉及', progress: '已完结', code: '8020080030', name: '快速恢复二极管 200V 2A', spec: 'SMB', supplierAbbr: '扬杰科技', batch: '20261011', qty: 12000, expectedTime: '2026-10-12 00:00', dispatchTime: '2026-10-11 09:05:40', location: 'K1E0A4102', inspectorCode: 'QC002', materialType: '常规检验物料', conclusion: '合格接收', feedbackNo: '/', report: '报告详情' },
].sort((a, b) => b.batch.localeCompare(a.batch));

const INITIAL_SUPPLIER_LIST = [
  { id: 1, code: '101001', abbr: '村田中国', fullName: '村田电子（中国）有限公司', updateTime: '2026-10-20 16:30:00', updater: '陈静' },
  { id: 2, code: '101002', abbr: '长电科技', fullName: '江苏长电科技股份有限公司', updateTime: '2026-10-20 14:15:00', updater: '周浩' },
  { id: 3, code: '101003', abbr: '华天科技', fullName: '天水华天科技股份有限公司', updateTime: '2026-10-19 18:20:00', updater: '李明' },
  { id: 4, code: '101004', abbr: '京东方', fullName: '京东方科技集团股份有限公司', updateTime: '2026-10-19 11:45:00', updater: '张伟' },
  { id: 5, code: '101005', abbr: '胜宏科技', fullName: '胜宏科技（惠州）股份有限公司', updateTime: '2026-10-18 16:10:00', updater: '刘洋' },
  { id: 6, code: '101006', abbr: '顺络电子', fullName: '深圳顺络电子股份有限公司', updateTime: '2026-10-18 10:05:00', updater: '郭敏' },
  { id: 7, code: '101007', abbr: '歌尔股份', fullName: '歌尔股份有限公司', updateTime: '2026-10-17 15:50:00', updater: '王强' },
  { id: 8, code: '101008', abbr: '立讯精密', fullName: '立讯精密工业股份有限公司', updateTime: '2026-10-17 09:30:00', updater: '徐婷' },
  { id: 9, code: '101009', abbr: '风华高科', fullName: '广东风华高新科技股份有限公司', updateTime: '2026-10-16 14:40:00', updater: '赵磊' },
  { id: 10, code: '101010', abbr: '三环集团', fullName: '潮州三环（集团）股份有限公司', updateTime: '2026-10-16 11:15:00', updater: '林芳' },
  { id: 11, code: '101011', abbr: '士兰微', fullName: '杭州士兰微电子股份有限公司', updateTime: '2026-10-15 17:00:00', updater: '孙涛' },
  { id: 12, code: '101012', abbr: '扬杰科技', fullName: '扬州扬杰电子科技股份有限公司', updateTime: '2026-10-15 10:25:00', updater: '黄健' },
  { id: 13, code: '101013', abbr: '韦尔股份', fullName: '上海韦尔半导体股份有限公司', updateTime: '2026-10-14 16:00:00', updater: '吴杰' },
  { id: 14, code: '101014', abbr: '圣邦股份', fullName: '圣邦微电子（北京）股份有限公司', updateTime: '2026-10-14 09:10:00', updater: '杨洋' },
  { id: 15, code: '101015', abbr: '兆易创新', fullName: '兆易创新科技集团股份有限公司', updateTime: '2026-10-13 15:35:00', updater: '郑晨' },
].sort((a, b) => b.updateTime.localeCompare(a.updateTime));

const INITIAL_SPOT_MATERIAL_LIST = [
  { id: 1, supplierCode: '101001', supplierName: '村田电子（中国）有限公司', materialCode: '8020080021', materialName: '车规级多层陶瓷电容器 22uF', drawingNo: 'DWG-CAP-0219', spec: 'CL21-22uF-16V-X7R', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-20 16:45:00', maintainer: '陈静' },
  { id: 2, supplierCode: '101002', supplierName: '江苏长电科技股份有限公司', materialCode: '8020080022', materialName: '功率MOSFET 60V 30A', drawingNo: 'DWG-MOS-0088', spec: 'TO-252-3L 60V/30A', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-20 14:10:00', maintainer: '周浩' },
  { id: 3, supplierCode: '101003', supplierName: '天水华天科技股份有限公司', materialCode: '8020080023', materialName: '高精度厚膜片式电阻 10K', drawingNo: 'DWG-RES-1033', spec: '0805-1%-10K', isConsumable: '是', consumableType: '电子元器件', consumableQty: '5000', consumableStartTime: '2026-10-01', consumableEndTime: '2026-10-31', updateTime: '2026-10-19 18:30:00', maintainer: '李明' },
  { id: 4, supplierCode: '101004', supplierName: '京东方科技集团股份有限公司', materialCode: '8020080024', materialName: '车载电源管理IC 5V/2A', drawingNo: 'DWG-IC-5021', spec: 'SOP-8-EP 5V/2A', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-19 11:20:00', maintainer: '张伟' },
  { id: 5, supplierCode: '101005', supplierName: '胜宏科技（惠州）股份有限公司', materialCode: '8020080025', materialName: '贴片铝电解电容 100uF 35V', drawingNo: 'DWG-CAP-3510', spec: 'CD288-35V-100uF', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-18 16:05:00', maintainer: '刘洋' },
  { id: 6, supplierCode: '101006', supplierName: '深圳顺络电子股份有限公司', materialCode: '8020080026', materialName: '高速光耦合器 10Mbit/s', drawingNo: 'DWG-OPT-1001', spec: 'SOIC-8 10Mbps', isConsumable: '是', consumableType: '结构件', consumableQty: '1200', consumableStartTime: '2026-10-05', consumableEndTime: '2026-10-25', updateTime: '2026-10-18 09:50:00', maintainer: '郭敏' },
  { id: 7, supplierCode: '101007', supplierName: '歌尔股份有限公司', materialCode: '8020080027', materialName: '肖特基势垒二极管 40V 5A', drawingNo: 'DWG-DIO-4050', spec: 'SMA-DO-214AC 40V', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-17 15:40:00', maintainer: '王强' },
  { id: 8, supplierCode: '101008', supplierName: '立讯精密工业股份有限公司', materialCode: '8020080028', materialName: '瞬态电压抑制二极管 TVS', drawingNo: 'DWG-TVS-0005', spec: 'SMBJ5.0A 600W', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-17 09:15:00', maintainer: '徐婷' },
  { id: 9, supplierCode: '101009', supplierName: '广东风华高新科技股份有限公司', materialCode: '8020080029', materialName: '高性能低功耗MCU 32位', drawingNo: 'DWG-MCU-3201', spec: 'LQFP-48 32Bit', isConsumable: '是', consumableType: '包材辅料', consumableQty: '300', consumableStartTime: '2026-10-10', consumableEndTime: '2026-10-30', updateTime: '2026-10-16 14:25:00', maintainer: '赵磊' },
  { id: 10, supplierCode: '101010', supplierName: '潮州三环（集团）股份有限公司', materialCode: '8020080030', materialName: '快速恢复二极管 200V 2A', drawingNo: 'DWG-DIO-2002', spec: 'SMB 200V 2A', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-16 10:50:00', maintainer: '林芳' },
  { id: 11, supplierCode: '101011', supplierName: '杭州士兰微电子股份有限公司', materialCode: '8020080031', materialName: '车规级高压驱动芯片', drawingNo: 'DWG-DRV-8012', spec: 'SOP-16 600V', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-15 16:30:00', maintainer: '孙涛' },
  { id: 12, supplierCode: '101012', supplierName: '扬州扬杰电子科技股份有限公司', materialCode: '8020080032', materialName: '碳化硅功率模块 1200V', drawingNo: 'DWG-SIC-1200', spec: 'SiC-Module 1200V', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-15 10:10:00', maintainer: '黄健' },
  { id: 13, supplierCode: '101013', supplierName: '上海韦尔半导体股份有限公司', materialCode: '8020080033', materialName: '高精度图像传感器芯片', drawingNo: 'DWG-CIS-1080', spec: 'BGA-64 1080P', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-14 15:45:00', maintainer: '吴杰' },
  { id: 14, supplierCode: '101014', supplierName: '圣邦微电子（北京）股份有限公司', materialCode: '8020080034', materialName: '超低功耗运算放大器', drawingNo: 'DWG-OPA-0033', spec: 'SOT-23-5 1.8V', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-14 08:50:00', maintainer: '杨洋' },
  { id: 15, supplierCode: '101015', supplierName: '兆易创新科技集团股份有限公司', materialCode: '8020080035', materialName: 'SPI Flash存储芯片 128Mb', drawingNo: 'DWG-FLS-128M', spec: 'WSON-8 3V 128Mb', isConsumable: '否', consumableType: '—', consumableQty: '—', consumableStartTime: '—', consumableEndTime: '—', updateTime: '2026-10-13 14:15:00', maintainer: '郑晨' },
].sort((a, b) => b.updateTime.localeCompare(a.updateTime));

const INITIAL_MATERIAL_GROUP_LIST = [
  { id: 1, code: 'G001', name: '电容物料组', samplingPlan: 'I', updateTime: '2026-10-20 16:30:00', maintainer: '陈静' },
  { id: 2, code: 'G002', name: '电阻物料组', samplingPlan: 'I', updateTime: '2026-10-20 14:15:00', maintainer: '周浩' },
  { id: 3, code: 'G003', name: '芯片IC物料组', samplingPlan: 'II', updateTime: '2026-10-19 18:20:00', maintainer: '李明' },
  { id: 4, code: 'G004', name: '电感磁性器件物料组', samplingPlan: 'S-3', updateTime: '2026-10-19 11:45:00', maintainer: '张伟' },
  { id: 5, code: 'G005', name: '二极管/三极管物料组', samplingPlan: 'I', updateTime: '2026-10-18 16:10:00', maintainer: '刘洋' },
  { id: 6, code: 'G006', name: '传感器组件物料组', samplingPlan: 'S-4', updateTime: '2026-10-18 10:05:00', maintainer: '郭敏' },
  { id: 7, code: 'G007', name: '结构连接器物料组', samplingPlan: 'I', updateTime: '2026-10-17 15:50:00', maintainer: '王强' },
  { id: 8, code: 'G008', name: '光电耦合器件物料组', samplingPlan: 'II', updateTime: '2026-10-17 09:30:00', maintainer: '徐婷' },
  { id: 9, code: 'G009', name: '晶振时钟物料组', samplingPlan: 'S-3', updateTime: '2026-10-16 14:40:00', maintainer: '赵磊' },
  { id: 10, code: 'G010', name: '继电器/开关物料组', samplingPlan: 'I', updateTime: '2026-10-16 11:15:00', maintainer: '林芳' },
].sort((a, b) => b.updateTime.localeCompare(a.updateTime));

const INITIAL_MATERIAL_MANAGEMENT_LIST = [
  { id: 1, group: '结构连接器物料组', code: '900000000002', name: '螺钉', spec: 'M8x2', drawingNo: '0.000.001', unit: '件', strictDays: 180, isStrict: '否', stdHours: 3, autoDispatch: '是', category: '常规检验物料', lastPatternTime: '2026-07-01 00:00:00', patternInterval: 90, nextPatternTime: '2026-10-01 00:00:00', updateTime: '2026-10-20 16:45:00', maintainer: '陈静' },
  { id: 2, group: '电容物料组', code: '900000000003', name: '车规级多层陶瓷电容器 22uF', spec: 'CL21-22uF-16V', drawingNo: '0.000.002', unit: '件', strictDays: 180, isStrict: '否', stdHours: 3, autoDispatch: '是', category: '常规检验物料', lastPatternTime: '2026-07-01 00:00:00', patternInterval: 90, nextPatternTime: '2026-10-01 00:00:00', updateTime: '2026-10-20 14:10:00', maintainer: '周浩' },
  { id: 3, group: '电阻物料组', code: '900000000004', name: '高精度厚膜片式电阻 10K', spec: '0805-1%-10K', drawingNo: '0.000.003', unit: '件', strictDays: 180, isStrict: '否', stdHours: 3, autoDispatch: '是', category: '常规检验物料', lastPatternTime: '2026-07-01 00:00:00', patternInterval: 90, nextPatternTime: '2026-10-01 00:00:00', updateTime: '2026-10-19 18:20:00', maintainer: '李明' },
  { id: 4, group: '二极管/三极管物料组', code: '900000000005', name: '功率MOSFET 60V 30A', spec: 'TO-252-3L 60V/30A', drawingNo: '0.000.004', unit: '件', strictDays: 90, isStrict: '是', stdHours: 2, autoDispatch: '是', category: '加严检验物料', lastPatternTime: '2026-07-15 00:00:00', patternInterval: 60, nextPatternTime: '2026-09-15 00:00:00', updateTime: '2026-10-19 11:15:00', maintainer: '张伟' },
  { id: 5, group: '芯片IC物料组', code: '900000000006', name: '车载电源管理IC 5V/2A', spec: 'SOP-8-EP 5V/2A', drawingNo: '0.000.005', unit: '件', strictDays: 180, isStrict: '否', stdHours: 4, autoDispatch: '是', category: '常规检验物料', lastPatternTime: '2026-07-01 00:00:00', patternInterval: 90, nextPatternTime: '2026-10-01 00:00:00', updateTime: '2026-10-18 16:05:00', maintainer: '刘洋' },
  { id: 6, group: '电容物料组', code: '900000000007', name: '贴片铝电解电容 100uF 35V', spec: 'CD288-35V-100uF', drawingNo: '0.000.006', unit: '件', strictDays: 180, isStrict: '否', stdHours: 3, autoDispatch: '是', category: '常规检验物料', lastPatternTime: '2026-07-01 00:00:00', patternInterval: 90, nextPatternTime: '2026-10-01 00:00:00', updateTime: '2026-10-18 09:40:00', maintainer: '郭敏' },
  { id: 7, group: '传感器组件物料组', code: '900000000008', name: '高灵敏度霍尔传感器', spec: 'HAL-S220-SOT23', drawingNo: '0.000.007', unit: '件', strictDays: 360, isStrict: '否', stdHours: 1.5, autoDispatch: '否', category: '免检物料', lastPatternTime: '2026-06-01 00:00:00', patternInterval: 180, nextPatternTime: '2026-12-01 00:00:00', updateTime: '2026-10-17 15:30:00', maintainer: '王强' },
  { id: 8, group: '光电耦合器件物料组', code: '900000000009', name: '高速光耦 10Mbit/s', spec: 'SOIC-8 10Mbps', drawingNo: '0.000.008', unit: '件', strictDays: 180, isStrict: '否', stdHours: 2.5, autoDispatch: '是', category: '常规检验物料', lastPatternTime: '2026-07-01 00:00:00', patternInterval: 90, nextPatternTime: '2026-10-01 00:00:00', updateTime: '2026-10-17 09:10:00', maintainer: '徐婷' },
  { id: 9, group: '芯片IC物料组', code: '900000000010', name: '车规级高压驱动芯片', spec: 'SOP-16 600V', drawingNo: '0.000.009', unit: '件', strictDays: 90, isStrict: '是', stdHours: 3.5, autoDispatch: '是', category: '加严检验物料', lastPatternTime: '2026-07-10 00:00:00', patternInterval: 60, nextPatternTime: '2026-09-10 00:00:00', updateTime: '2026-10-16 14:20:00', maintainer: '赵磊' },
  { id: 10, group: '芯片IC物料组', code: '900000000011', name: '低压差线性稳压器 LDO 3.3V', spec: 'SOT-223 3.3V', drawingNo: '0.000.010', unit: '件', strictDays: 180, isStrict: '否', stdHours: 3, autoDispatch: '是', category: '常规检验物料', lastPatternTime: '2026-07-01 00:00:00', patternInterval: 90, nextPatternTime: '2026-10-01 00:00:00', updateTime: '2026-10-16 10:45:00', maintainer: '孙涛' },
].sort((a, b) => b.updateTime.localeCompare(a.updateTime));

const INITIAL_ITEM_STANDARDS_LIST = [
  { id: 1, code: 'ITEM-001', sortOrder: 1, itemName: '电容器外观与极性标识检查', group: '电容物料组', sampleQty: '1', samplingPlan: '-', category: '常规', method: '手动输入', testType: '入厂检验', isEnabled: '启用', updateTime: '2026-10-20 16:30:00', maintainer: '陈静' },
  { id: 2, code: 'ITEM-002', sortOrder: 2, itemName: '电容量与损耗角正切值测量', group: '电容物料组', sampleQty: '1', samplingPlan: '-', category: '常规', method: '手动计量', testType: '型式试验', isEnabled: '关闭', updateTime: '2026-10-20 14:15:00', maintainer: '周浩' },
  { id: 3, code: 'ITEM-003', sortOrder: 3, itemName: '绝缘电阻与介质耐压测试', group: '电容物料组', sampleQty: '-', samplingPlan: 'S-2', category: '常规', method: '手动计量', testType: '入厂检验', isEnabled: '关闭', updateTime: '2026-10-19 18:20:00', maintainer: '李明' },
  { id: 4, code: 'ITEM-004', sortOrder: 4, itemName: '引脚可焊性及镀层测试', group: '电容物料组', sampleQty: '-', samplingPlan: 'S-3', category: '常规', method: '手动计量', testType: '入厂检验', isEnabled: '关闭', updateTime: '2026-10-19 11:45:00', maintainer: '张伟' },
  { id: 5, code: 'ITEM-005', sortOrder: 5, itemName: '精密电阻阻值偏差测量', group: '电阻物料组', sampleQty: '-', samplingPlan: 'S-3', category: '常规', method: '手动计量', testType: '入厂检验', isEnabled: '关闭', updateTime: '2026-10-18 16:10:00', maintainer: '刘洋' },
  { id: 6, code: 'ITEM-006', sortOrder: 6, itemName: '芯片静态电流与功耗测试', group: '芯片IC物料组', sampleQty: '-', samplingPlan: 'S-3', category: '常规', method: '手动计量', testType: '入厂检验', isEnabled: '关闭', updateTime: '2026-10-18 10:05:00', maintainer: '郭敏' },
  { id: 7, code: 'ITEM-007', sortOrder: 7, itemName: '连接器插拔力与接触电阻', group: '结构连接器物料组', sampleQty: '-', samplingPlan: 'S-3', category: '常规', method: '手动计量', testType: '入厂检验', isEnabled: '关闭', updateTime: '2026-10-17 15:50:00', maintainer: '王强' },
  { id: 8, code: 'ITEM-008', sortOrder: 8, itemName: 'MOS管导通电阻RDS(on)测量', group: '二极管/三极管物料组', sampleQty: '-', samplingPlan: 'S-3', category: '常规', method: '手动计量', testType: '入厂检验', isEnabled: '关闭', updateTime: '2026-10-17 09:30:00', maintainer: '徐婷' },
  { id: 9, code: 'ITEM-009', sortOrder: 9, itemName: '霍尔传感器输出电压灵敏度', group: '传感器组件物料组', sampleQty: '-', samplingPlan: 'S-3', category: '常规', method: '手动计量', testType: '入厂检验', isEnabled: '关闭', updateTime: '2026-10-16 14:40:00', maintainer: '赵磊' },
  { id: 10, code: 'ITEM-010', sortOrder: 10, itemName: '光耦隔离电压及传输延迟', group: '光电耦合器件物料组', sampleQty: '-', samplingPlan: 'S-3', category: '常规', method: '手动计量', testType: '入厂检验', isEnabled: '关闭', updateTime: '2026-10-16 11:15:00', maintainer: '林芳' },
].sort((a, b) => b.updateTime.localeCompare(a.updateTime));

const INITIAL_INSPECTION_ITEM_LIST = [
  { id: 1, supplierCode: '101001', supplierName: '苏州精工微电子', materialCode: '900000000002', itemCode: 'ITEM-001', itemName: '外观与极性标识', standard: '23.1-23.5', category: '常规', method: '手动计量', updateTime: '2026-10-20 16:45:00', maintainer: '陈静' },
  { id: 2, supplierCode: '101001', supplierName: '苏州精工微电子', materialCode: '900000000002', itemCode: 'ITEM-002', itemName: '电容量与损耗角正切', standard: '23.1-23.5', category: '常规', method: '手动计量', updateTime: '2026-10-20 14:20:00', maintainer: '周浩' },
  { id: 3, supplierCode: '101002', supplierName: '立讯精密工业', materialCode: '900000000003', itemCode: 'ITEM-003', itemName: '绝缘电阻与介质耐压', standard: 'GB/T 2828.1', category: '常规', method: '手动计量', updateTime: '2026-10-19 18:10:00', maintainer: '李明' },
  { id: 4, supplierCode: '101002', supplierName: '立讯精密工业', materialCode: '900000000003', itemCode: 'ITEM-004', itemName: '引脚可焊性与镀层', standard: 'IEC 60384-1', category: '常规', method: '手动计量', updateTime: '2026-10-19 11:30:00', maintainer: '张伟' },
  { id: 5, supplierCode: '101003', supplierName: '长电科技股份', materialCode: '900000000004', itemCode: 'ITEM-005', itemName: '精密电阻阻值偏差', standard: '23.1-23.5', category: '关键', method: '卡尺输入', updateTime: '2026-10-18 16:15:00', maintainer: '刘洋' },
  { id: 6, supplierCode: '101003', supplierName: '长电科技股份', materialCode: '900000000005', itemCode: 'ITEM-006', itemName: '芯片静态电流与功耗', standard: 'Q/QC-2026-001', category: '主要', method: '仪器检测', updateTime: '2026-10-18 10:05:00', maintainer: '郭敏' },
  { id: 7, supplierCode: '101004', supplierName: '顺络电子', materialCode: '900000000006', itemCode: 'ITEM-007', itemName: '连接器插拔力与接触电阻', standard: 'SJ/T 10620', category: '常规', method: '手动输入', updateTime: '2026-10-17 15:50:00', maintainer: '王强' },
  { id: 8, supplierCode: '101004', supplierName: '顺络电子', materialCode: '900000000007', itemCode: 'ITEM-008', itemName: 'MOS管导通电阻RDS(on)', standard: '23.1-23.5', category: '关键', method: '仪器检测', updateTime: '2026-10-17 09:40:00', maintainer: '徐婷' },
  { id: 9, supplierCode: '101005', supplierName: '泰科电子', materialCode: '900000000008', itemCode: 'ITEM-009', itemName: '霍尔传感器输出电压灵敏度', standard: 'Q/QC-2026-002', category: '常规', method: '手动计量', updateTime: '2026-10-16 14:25:00', maintainer: '赵磊' },
  { id: 10, supplierCode: '101005', supplierName: '泰科电子', materialCode: '900000000009', itemCode: 'ITEM-010', itemName: '光耦隔离电压及传输延迟', standard: '23.1-23.5', category: '常规', method: '手动计量', updateTime: '2026-10-16 11:00:00', maintainer: '林芳' },
].sort((a, b) => b.updateTime.localeCompare(a.updateTime));

const INITIAL_SAMPLING_PLAN_LIST = [
  { id: 1, samplingScheme: 'I', testPlan: 'S-3', aql: '0', qtyMax: 1200, qtyMin: 1, sampleQty: 5, strictSampleQty: 8, updateTime: '2026-10-20 18:25:12', maintainer: '枫叶' },
  { id: 2, samplingScheme: 'I', testPlan: 'S-2', aql: '0', qtyMax: 1200, qtyMin: 1, sampleQty: 3, strictSampleQty: 5, updateTime: '2026-10-20 17:50:33', maintainer: '枫叶' },
  { id: 3, samplingScheme: 'II', testPlan: '正常检验', aql: '0.65', qtyMax: 500, qtyMin: 151, sampleQty: 50, strictSampleQty: 80, updateTime: '2026-10-20 16:42:18', maintainer: '陈静' },
  { id: 4, samplingScheme: 'I', testPlan: 'S-3', aql: '0', qtyMax: 3200, qtyMin: 1201, sampleQty: 8, strictSampleQty: 13, updateTime: '2026-10-20 15:35:45', maintainer: '枫叶' },
  { id: 5, samplingScheme: 'I', testPlan: 'S-2', aql: '0', qtyMax: 3200, qtyMin: 1201, sampleQty: 5, strictSampleQty: 8, updateTime: '2026-10-20 14:18:22', maintainer: '枫叶' },
  { id: 6, samplingScheme: 'II', testPlan: '正常检验', aql: '1.0', qtyMax: 1200, qtyMin: 501, sampleQty: 80, strictSampleQty: 125, updateTime: '2026-10-20 11:20:09', maintainer: '李明' },
  { id: 7, samplingScheme: 'S-4', testPlan: '型式抽样', aql: '0.65', qtyMax: 3200, qtyMin: 501, sampleQty: 13, strictSampleQty: 20, updateTime: '2026-10-20 10:05:40', maintainer: '赵磊' },
  { id: 8, samplingScheme: 'I', testPlan: 'S-3', aql: '0', qtyMax: 10000, qtyMin: 3201, sampleQty: 13, strictSampleQty: 20, updateTime: '2026-10-19 18:30:15', maintainer: '枫叶' },
  { id: 9, samplingScheme: 'I', testPlan: 'S-2', aql: '0', qtyMax: 10000, qtyMin: 3201, sampleQty: 8, strictSampleQty: 13, updateTime: '2026-10-19 16:45:00', maintainer: '枫叶' },
  { id: 10, samplingScheme: 'III', testPlan: '加严检验', aql: '0.65', qtyMax: 3200, qtyMin: 1201, sampleQty: 200, strictSampleQty: 315, updateTime: '2026-10-19 14:12:30', maintainer: '周浩' },
  { id: 11, samplingScheme: 'I', testPlan: 'S-1', aql: '0', qtyMax: 3200, qtyMin: 1201, sampleQty: 3, strictSampleQty: 5, updateTime: '2026-10-19 11:08:44', maintainer: '赵磊' },
  { id: 12, samplingScheme: 'II', testPlan: '正常检验', aql: '0.65', qtyMax: 3200, qtyMin: 1201, sampleQty: 125, strictSampleQty: 200, updateTime: '2026-10-19 09:25:10', maintainer: '王强' },
  { id: 13, samplingScheme: 'I', testPlan: 'S-3', aql: '0', qtyMax: 35000, qtyMin: 10001, sampleQty: 20, strictSampleQty: 32, updateTime: '2026-10-18 17:40:20', maintainer: '枫叶' },
  { id: 14, samplingScheme: 'I', testPlan: 'S-2', aql: '0', qtyMax: 35000, qtyMin: 10001, sampleQty: 13, strictSampleQty: 20, updateTime: '2026-10-18 15:15:35', maintainer: '枫叶' },
  { id: 15, samplingScheme: 'II', testPlan: '正常检验', aql: '1.5', qtyMax: 10000, qtyMin: 3201, sampleQty: 200, strictSampleQty: 315, updateTime: '2026-10-18 13:50:11', maintainer: '刘洋' },
  { id: 16, samplingScheme: 'S-4', testPlan: '型式抽样', aql: '0.65', qtyMax: 5000, qtyMin: 1001, sampleQty: 20, strictSampleQty: 32, updateTime: '2026-10-18 10:30:00', maintainer: '张伟' },
  { id: 17, samplingScheme: 'I', testPlan: 'S-3', aql: '0', qtyMax: 150000, qtyMin: 35001, sampleQty: 32, strictSampleQty: 50, updateTime: '2026-10-17 16:22:45', maintainer: '枫叶' },
  { id: 18, samplingScheme: 'I', testPlan: 'S-2', aql: '0', qtyMax: 150000, qtyMin: 35001, sampleQty: 20, strictSampleQty: 32, updateTime: '2026-10-17 14:10:19', maintainer: '枫叶' },
  { id: 19, samplingScheme: 'II', testPlan: '正常检验', aql: '2.5', qtyMax: 35000, qtyMin: 10001, sampleQty: 315, strictSampleQty: 500, updateTime: '2026-10-17 11:05:50', maintainer: '郭敏' },
  { id: 20, samplingScheme: 'III', testPlan: '加严检验', aql: '0.65', qtyMax: 10000, qtyMin: 3201, sampleQty: 315, strictSampleQty: 500, updateTime: '2026-10-17 09:18:25', maintainer: '孙涛' },
  { id: 21, samplingScheme: 'I', testPlan: 'S-3', aql: '0', qtyMax: 99999999, qtyMin: 150001, sampleQty: 50, strictSampleQty: 80, updateTime: '2026-10-16 16:45:10', maintainer: '枫叶' },
  { id: 22, samplingScheme: 'I', testPlan: 'S-2', aql: '0', qtyMax: 99999999, qtyMin: 150001, sampleQty: 32, strictSampleQty: 50, updateTime: '2026-10-16 14:20:30', maintainer: '枫叶' },
  { id: 23, samplingScheme: 'I', testPlan: 'S-4', aql: '0.65', qtyMax: 99999999, qtyMin: 500001, sampleQty: 80, strictSampleQty: 125, updateTime: '2026-10-16 10:15:45', maintainer: '王强' },
  { id: 24, samplingScheme: 'II', testPlan: '正常检验', aql: '0.65', qtyMax: 150, qtyMin: 91, sampleQty: 20, strictSampleQty: 32, updateTime: '2026-10-15 16:50:00', maintainer: '林芳' },
  { id: 25, samplingScheme: 'I', testPlan: 'S-3', aql: '0', qtyMax: 500, qtyMin: 151, sampleQty: 5, strictSampleQty: 8, updateTime: '2026-10-15 14:35:20', maintainer: '枫叶' },
  { id: 26, samplingScheme: 'II', testPlan: '正常检验', aql: '1.0', qtyMax: 500, qtyMin: 151, sampleQty: 50, strictSampleQty: 80, updateTime: '2026-10-15 11:10:15', maintainer: '陈静' },
  { id: 27, samplingScheme: 'I', testPlan: 'S-1', aql: '0', qtyMax: 1200, qtyMin: 501, sampleQty: 3, strictSampleQty: 5, updateTime: '2026-10-14 17:25:30', maintainer: '赵磊' },
  { id: 28, samplingScheme: 'II', testPlan: '正常检验', aql: '4.0', qtyMax: 500, qtyMin: 151, sampleQty: 50, strictSampleQty: 80, updateTime: '2026-10-14 15:40:10', maintainer: '徐婷' },
  { id: 29, samplingScheme: 'III', testPlan: '加严检验', aql: '1.0', qtyMax: 1200, qtyMin: 501, sampleQty: 125, strictSampleQty: 200, updateTime: '2026-10-14 13:15:00', maintainer: '周浩' },
  { id: 30, samplingScheme: 'I', testPlan: 'S-4', aql: '0', qtyMax: 35000, qtyMin: 10001, sampleQty: 32, strictSampleQty: 50, updateTime: '2026-10-14 09:50:20', maintainer: '王强' },
].sort((a, b) => b.updateTime.localeCompare(a.updateTime));

const INITIAL_DATA_DICTIONARY_LIST = [
  { id: 1, dictName: '抽样方案', dictCode: 'samplePlan', dictValue: 'I / II / III / IV / V / VI', updateTime: '2026-10-20 18:35:10', maintainer: '枫叶' },
  { id: 2, dictName: '科室', dictCode: 'group', dictValue: '外检组/外管组/理化组/计量室/可靠性试验室', updateTime: '2026-10-20 17:40:22', maintainer: '枫叶' },
  { id: 3, dictName: '封存类型', dictCode: 'suspendType', dictValue: '封存物料/整改物料/暂停供货/质量预警', updateTime: '2026-10-20 16:55:00', maintainer: '枫叶' },
  { id: 4, dictName: '物料类别', dictCode: 'materialCategory', dictValue: '常规检验物料/常规免检物料/化工检验物料/高精密核心器件', updateTime: '2026-10-20 15:20:18', maintainer: '枫叶' },
  { id: 5, dictName: '检验方式', dictCode: 'inspectionMethod', dictValue: '手动输入/手动计量/卡尺输入/仪器检测/视觉AI在线质检', updateTime: '2026-10-20 14:15:30', maintainer: '陈静' },
  { id: 6, dictName: '检验方案', dictCode: 'testPlan', dictValue: 'S-1/S-2/S-3/S-4/正常检验/加严检验/放宽检验', updateTime: '2026-10-20 11:30:45', maintainer: '李明' },
  { id: 7, dictName: '检验项目类别', dictCode: 'itemCategory', dictValue: '常规/化工/关键/主要/次要/型式试验', updateTime: '2026-10-20 10:05:12', maintainer: '周浩' },
  { id: 8, dictName: 'AQL标准值', dictCode: 'aqlStandard', dictValue: '0/0.065/0.10/0.15/0.25/0.40/0.65/1.0/1.5/2.5/4.0/6.5', updateTime: '2026-10-19 18:40:25', maintainer: '王强' },
  { id: 9, dictName: '缺陷等级', dictCode: 'defectLevel', dictValue: '致命缺陷(CR)/严重缺陷(MA)/轻微缺陷(MI)', updateTime: '2026-10-19 16:15:00', maintainer: '赵磊' },
  { id: 10, dictName: '判定结论', dictCode: 'inspectionResult', dictValue: '合格/不合格/特采让步/挑选使用/返修/退货', updateTime: '2026-10-19 14:30:10', maintainer: '刘洋' },
  { id: 11, dictName: '物料组类别', dictCode: 'materialGroupType', dictValue: '芯片IC/阻容感/二三极管/连接器/PCB光板/塑胶五金/线束组件', updateTime: '2026-10-19 11:10:00', maintainer: '张伟' },
  { id: 12, dictName: '异常处置方式', dictCode: 'dispositionType', dictValue: '隔离封存/退回供应商/全检挑选/现场返工/报废销毁/降级降价', updateTime: '2026-10-18 17:25:40', maintainer: '郭敏' },
  { id: 13, dictName: '计量单位', dictCode: 'unitCode', dictValue: '件/个/批/箱/卷/米/千克/PCS/SET', updateTime: '2026-10-18 15:10:15', maintainer: '孙涛' },
  { id: 14, dictName: '审核状态', dictCode: 'auditStatus', dictValue: '待质检员审核/待IQC主管审核/待质量主管审核/审核通过/驳回重检', updateTime: '2026-10-18 13:45:00', maintainer: '林芳' },
  { id: 15, dictName: '加严判定标识', dictCode: 'strictFlag', dictValue: '是/否/转常规/转放宽', updateTime: '2026-10-18 10:20:30', maintainer: '徐婷' },
  { id: 16, dictName: '检验类型', dictCode: 'inspectionType', dictValue: '到货全检/抽样检验/首件检验/型式试验/出厂复验', updateTime: '2026-10-17 16:50:00', maintainer: '枫叶' },
  { id: 17, dictName: '异常等级', dictCode: 'abnormalLevel', dictValue: '一般质量异常/严重质量隐患/重大质量停线事故', updateTime: '2026-10-17 14:15:20', maintainer: '陈静' },
  { id: 18, dictName: '纸质标识', dictCode: 'paperlessTag', dictValue: '电子化单据/纸质伴随单/混合流转', updateTime: '2026-10-17 11:00:10', maintainer: '李明' },
  { id: 19, dictName: '派单模式', dictCode: 'dispatchMode', dictValue: '自动派单/人工指定/抢单分配/应急派单', updateTime: '2026-10-16 16:30:45', maintainer: '周浩' },
  { id: 20, dictName: '抽样体系标准', dictCode: 'samplingStandard', dictValue: 'GB/T 2828.1-2012/ISO 2859-1/MIL-STD-105E/ANSI ASQ Z1.4', updateTime: '2026-10-16 14:10:00', maintainer: '王强' },
  { id: 21, dictName: '设备计量状态', dictCode: 'gaugeStatus', dictValue: '合格在用/待校准/停用封存/报废/送外检', updateTime: '2026-10-16 10:05:30', maintainer: '赵磊' },
  { id: 22, dictName: '供应商等级', dictCode: 'supplierLevel', dictValue: '战略核心(A)/合格优质(B)/整改观察(C)/黑名单淘汰(D)', updateTime: '2026-10-15 16:40:00', maintainer: '刘洋' },
  { id: 23, dictName: '复核结论', dictCode: 'recheckResult', dictValue: '维持原判/改判合格/改判特采/安排加严复验', updateTime: '2026-10-15 14:20:15', maintainer: '张伟' },
  { id: 24, dictName: '物料状态', dictCode: 'materialStatus', dictValue: '正常采购/冻结禁用/生命周期EOL/试产备料', updateTime: '2026-10-15 10:50:00', maintainer: '郭敏' },
  { id: 25, dictName: '质量归因类别', dictCode: 'causeCategory', dictValue: '供方制程不良/运输包装破损/来料混料/尺寸超差/电气性能不达标', updateTime: '2026-10-14 17:15:30', maintainer: '孙涛' },
].sort((a, b) => b.updateTime.localeCompare(a.updateTime));

const INITIAL_EQUIPMENT_LIST = [
  { id: 1, category: '粗糙度计', code: '00008801', name: '便携式表面粗糙度测量仪', model: 'SJ-210', department: '质检部', location: '1-1', enterDate: '2026-10-20', status: '在用', owner: '枫叶', calibrateDate: '2026-10-20', calibratePeriod: 180 },
  { id: 2, category: '三坐标测量机', code: '00008802', name: '高精度桥式三坐标测量机', model: 'Zeiss DuraMax 5/5/5', department: '计量室', location: '1-2', enterDate: '2026-10-19', status: '在用', owner: '枫叶', calibrateDate: '2026-10-18', calibratePeriod: 365 },
  { id: 3, category: '影像测量仪', code: '00008803', name: '全自动二次元影像测量仪', model: 'Keyence IM-7020', department: '质检部', location: '1-1', enterDate: '2026-10-18', status: '在用', owner: '李明', calibrateDate: '2026-10-17', calibratePeriod: 180 },
  { id: 4, category: '数显千分尺', code: '00008804', name: '数显外径千分尺 (0-25mm)', model: 'Mitutoyo 293-240-30', department: '冲压车间', location: '2-1', enterDate: '2026-10-17', status: '在用', owner: '王芳', calibrateDate: '2026-10-16', calibratePeriod: 180 },
  { id: 5, category: '数显卡尺', code: '00008805', name: '高精度数显卡尺 (0-150mm)', model: 'Mitutoyo 500-196-30', department: '组装车间', location: '2-2', enterDate: '2026-10-16', status: '在用', owner: '张伟', calibrateDate: '2026-10-15', calibratePeriod: 180 },
  { id: 6, category: '洛氏硬度计', code: '00008806', name: '电动数显洛氏硬度计', model: 'HR-150A', department: '中心实验室', location: '3-1', enterDate: '2026-10-15', status: '在用', owner: '刘洋', calibrateDate: '2026-10-14', calibratePeriod: 365 },
  { id: 7, category: '膜厚仪', code: '00008807', name: '高精度涡流涂镀层测厚仪', model: 'Time TT260', department: '质检部', location: '1-3', enterDate: '2026-10-14', status: '在用', owner: '陈静', calibrateDate: '2026-10-13', calibratePeriod: 180 },
  { id: 8, category: '电子天平', code: '00008808', name: '万分之一精密电子分析天平', model: 'Mettler ME204E', department: '实验室', location: '3-2', enterDate: '2026-10-13', status: '在用', owner: '周浩', calibrateDate: '2026-10-12', calibratePeriod: 365 },
  { id: 9, category: '盐雾试验箱', code: '00008809', name: '智能型盐雾腐蚀试验箱', model: 'YWX/Q-250', department: '实验室', location: '3-3', enterDate: '2026-10-12', status: '报废', owner: '枫叶', calibrateDate: '2026-10-10', calibratePeriod: 365 },
  { id: 10, category: '数字示波器', code: '00008810', name: '四通道数字荧光示波器 100MHz', model: 'TBS1104B', department: '电气测试组', location: '4-1', enterDate: '2026-10-11', status: '在用', owner: '郭敏', calibrateDate: '2026-10-09', calibratePeriod: 365 },
  { id: 11, category: '高低温试验箱', code: '00008811', name: '可程式高低温湿热试验箱', model: 'THS-020A', department: '可靠性实验室', location: '3-4', enterDate: '2026-10-10', status: '在用', owner: '王强', calibrateDate: '2026-10-08', calibratePeriod: 365 },
  { id: 12, category: '数字万用表', code: '00008812', name: '真有效值精密数字万用表', model: 'Fluke 87V', department: '质检部', location: '1-1', enterDate: '2026-10-09', status: '在用', owner: '徐婷', calibrateDate: '2026-10-07', calibratePeriod: 365 },
  { id: 13, category: '扭力计', code: '00008813', name: '智能数字式螺丝扭力测试仪', model: 'HIOS HP-100', department: '组装车间', location: '2-3', enterDate: '2026-10-08', status: '在用', owner: '赵磊', calibrateDate: '2026-10-05', calibratePeriod: 180 },
  { id: 14, category: '高度规', code: '00008814', name: '数显精密双柱高度测量仪 (0-600mm)', model: 'Mitutoyo 192-663-10', department: '质检部', location: '1-2', enterDate: '2026-10-07', status: '在用', owner: '林芳', calibrateDate: '2026-10-03', calibratePeriod: 180 },
  { id: 15, category: '光谱分析仪', code: '00008815', name: '手持式XRF合金成分分析仪', model: 'Thermo NITON XL2', department: '化学分析室', location: '3-5', enterDate: '2026-10-06', status: '在用', owner: '孙涛', calibrateDate: '2026-10-02', calibratePeriod: 365 },
  { id: 16, category: '推拉力计', code: '00008816', name: '数显推拉力计配机台 (500N)', model: 'SHSIWI HF-500', department: '力学实验室', location: '3-6', enterDate: '2026-10-05', status: '在用', owner: '黄健', calibrateDate: '2026-09-30', calibratePeriod: 180 },
  { id: 17, category: '投影仪', code: '00008817', name: '数显精密卧式光学投影仪', model: 'JT-300', department: '模具质检组', location: '4-2', enterDate: '2026-10-04', status: '在用', owner: '吴杰', calibrateDate: '2026-09-28', calibratePeriod: 365 },
  { id: 18, category: '粗糙度计', code: '00008818', name: '便携式光洁度粗糙度仪', model: 'Mahr MarSurf M300', department: '精密加工组', location: '2-4', enterDate: '2026-10-03', status: '在用', owner: '杨洋', calibrateDate: '2026-09-25', calibratePeriod: 180 },
  { id: 19, category: '超声波测厚仪', code: '00008819', name: '高精度数字超声波测厚仪', model: 'Olympus 38DL PLUS', department: '品质部', location: '1-3', enterDate: '2026-10-02', status: '在用', owner: '郑晨', calibrateDate: '2026-09-22', calibratePeriod: 180 },
  { id: 20, category: '耐压测试仪', code: '00008820', name: '数显交直流耐压绝缘电阻测试仪', model: 'Chroma 19052', department: '安规测试区', location: '4-3', enterDate: '2026-10-01', status: '在用', owner: '枫叶', calibrateDate: '2026-09-20', calibratePeriod: 365 },
  { id: 21, category: 'LCR数字电桥', code: '00008821', name: '精密阻抗分析仪 LCR电桥', model: 'Tonghui TH2829C', department: '电子器件检验室', location: '1-4', enterDate: '2026-09-30', status: '在用', owner: '李明', calibrateDate: '2026-09-18', calibratePeriod: 365 },
  { id: 22, category: '旋转粘度计', code: '00008822', name: '数显旋转粘度计', model: 'Brookfield DV2T', department: '化学实验室', location: '3-7', enterDate: '2026-09-29', status: '在用', owner: '王芳', calibrateDate: '2026-09-15', calibratePeriod: 365 },
  { id: 23, category: '分光色差仪', code: '00008823', name: '高精密分光测色仪', model: 'X-Rite Ci62', department: '外观检验组', location: '1-5', enterDate: '2026-09-28', status: '在用', owner: '张伟', calibrateDate: '2026-09-12', calibratePeriod: 365 },
  { id: 24, category: '杠杆千分表', code: '00008824', name: '数显杠杆千分表 (0-12.7mm)', model: 'Mitutoyo 543-782', department: '机械加工部', location: '2-5', enterDate: '2026-09-27', status: '在用', owner: '刘洋', calibrateDate: '2026-09-10', calibratePeriod: 180 },
  { id: 25, category: '插拔力试验机', code: '00008825', name: '全自动连接器插拔寿命试验机', model: 'Auto-1220S', department: '可靠性实验室', location: '3-8', enterDate: '2026-09-26', status: '在用', owner: '陈静', calibrateDate: '2026-09-08', calibratePeriod: 365 },
  { id: 26, category: '红外热像仪', code: '00008826', name: '工业高分辨率红外热成像仪', model: 'FLIR E8-XT', department: '研发测试室', location: '4-4', enterDate: '2026-09-25', status: '在用', owner: '周浩', calibrateDate: '2026-09-05', calibratePeriod: 365 },
  { id: 27, category: '恒温水浴锅', code: '00008827', name: '精密数显恒温水浴锅', model: 'DK-98-II', department: '化学分析室', location: '3-9', enterDate: '2026-09-24', status: '在用', owner: '郭敏', calibrateDate: '2026-09-02', calibratePeriod: 365 },
  { id: 28, category: '体视显微镜', code: '00008828', name: '连续变倍体视金相显微镜', model: 'Olympus SZ61', department: '金相检验室', location: '3-10', enterDate: '2026-09-23', status: '在用', owner: '王强', calibrateDate: '2026-08-30', calibratePeriod: 365 },
  { id: 29, category: '显微硬度计', code: '00008829', name: '数显显微维氏硬度计', model: 'HV-1000Z', department: '实验室', location: '3-11', enterDate: '2026-09-22', status: '报废', owner: '徐婷', calibrateDate: '2026-08-25', calibratePeriod: 365 },
  { id: 30, category: '电磁振动台', code: '00008830', name: '高频垂直水平电磁振动试验台', model: 'ES-10-240', department: '包装测试组', location: '4-5', enterDate: '2026-09-21', status: '在用', owner: '赵磊', calibrateDate: '2026-08-20', calibratePeriod: 365 },
].sort((a, b) => b.enterDate.localeCompare(a.enterDate));

// 物料组分析报表数据 (updated with 100% realistic matching names)
const INITIAL_MATERIAL_GROUP_REPORT_DATA = [
  { id: 1,  group: '主控MCU与微处理器',   passed: 245, concession: 3, rejected: 2, review: 1, totalBatches: 251, passRate: '98.8%', rejectRate: '0.80%', inspectDate: '2026-10-21' },
  { id: 2,  group: '铝合金精密模组件',     passed: 310, concession: 5, rejected: 3, review: 0, totalBatches: 318, passRate: '99.1%', rejectRate: '0.94%', inspectDate: '2026-10-21' },
  { id: 3,  group: 'SMT车规贴片电容',      passed: 420, concession: 8, rejected: 4, review: 1, totalBatches: 433, passRate: '98.8%', rejectRate: '0.92%', inspectDate: '2026-10-20' },
  { id: 4,  group: '工业级连接器线束',      passed: 188, concession: 4, rejected: 2, review: 1, totalBatches: 195, passRate: '98.5%', rejectRate: '1.03%', inspectDate: '2026-10-20' },
  { id: 5,  group: '注塑阻燃外壳模组',     passed: 260, concession: 6, rejected: 3, review: 1, totalBatches: 270, passRate: '98.5%', rejectRate: '1.11%', inspectDate: '2026-10-20' },
  { id: 6,  group: '高频抗干扰传输线缆',   passed: 195, concession: 3, rejected: 2, review: 0, totalBatches: 200, passRate: '99.0%', rejectRate: '1.00%', inspectDate: '2026-10-19' },
  { id: 7,  group: '液压电磁控制阀门',     passed: 172, concession: 4, rejected: 3, review: 1, totalBatches: 180, passRate: '97.8%', rejectRate: '1.67%', inspectDate: '2026-10-19' },
  { id: 8,  group: '光学高精透镜组件',     passed: 150, concession: 2, rejected: 1, review: 1, totalBatches: 154, passRate: '98.7%', rejectRate: '0.65%', inspectDate: '2026-10-19' },
  { id: 9,  group: '动力电池BMS保护板',   passed: 285, concession: 5, rejected: 4, review: 1, totalBatches: 295, passRate: '98.3%', rejectRate: '1.36%', inspectDate: '2026-10-18' },
  { id: 10, group: '无刷直流驱动电机',     passed: 210, concession: 4, rejected: 3, review: 1, totalBatches: 218, passRate: '98.2%', rejectRate: '1.38%', inspectDate: '2026-10-18' },
  { id: 11, group: '高精度PT100感温棒',    passed: 330, concession: 6, rejected: 3, review: 1, totalBatches: 340, passRate: '98.8%', rejectRate: '0.88%', inspectDate: '2026-10-18' },
  { id: 12, group: '开关电源大功率适配器', passed: 240, concession: 5, rejected: 4, review: 1, totalBatches: 250, passRate: '98.0%', rejectRate: '1.60%', inspectDate: '2026-10-17' },
  { id: 13, group: '不锈钢精密弹片冲压件', passed: 390, concession: 8, rejected: 5, review: 2, totalBatches: 405, passRate: '98.3%', rejectRate: '1.23%', inspectDate: '2026-10-17' },
  { id: 14, group: '防静电防震缓冲包装',   passed: 520, concession: 10, rejected: 3, review: 1, totalBatches: 534, passRate: '99.3%', rejectRate: '0.56%', inspectDate: '2026-10-17' },
  { id: 15, group: '耐高温硅胶密封套圈',   passed: 270, concession: 5, rejected: 3, review: 1, totalBatches: 279, passRate: '98.6%', rejectRate: '1.08%', inspectDate: '2026-10-16' },
  { id: 16, group: '压敏电阻与浪涌防护管', passed: 305, concession: 6, rejected: 4, review: 1, totalBatches: 316, passRate: '98.4%', rejectRate: '1.27%', inspectDate: '2026-10-16' },
];

const MATERIAL_GROUP_CHART_DATA = [
  { name: '主控MCU与微处理器', passedBatches: 245, unpassedBatches: 6, totalBatches: 251, passRateNum: 98.8 },
  { name: '铝合金精密模组件', passedBatches: 310, unpassedBatches: 8, totalBatches: 318, passRateNum: 99.1 },
  { name: 'SMT车规贴片电容', passedBatches: 420, unpassedBatches: 13, totalBatches: 433, passRateNum: 98.8 },
  { name: '工业级连接器线束', passedBatches: 188, unpassedBatches: 7, totalBatches: 195, passRateNum: 98.5 },
  { name: '注塑阻燃外壳模组', passedBatches: 260, unpassedBatches: 10, totalBatches: 270, passRateNum: 98.5 },
  { name: '高频抗干扰传输线缆', passedBatches: 195, unpassedBatches: 5, totalBatches: 200, passRateNum: 99.0 },
  { name: '液压电磁控制阀门', passedBatches: 172, unpassedBatches: 8, totalBatches: 180, passRateNum: 97.8 },
  { name: '光学高精透镜组件', passedBatches: 150, unpassedBatches: 4, totalBatches: 154, passRateNum: 98.7 },
  { name: '动力电池BMS保护板', passedBatches: 285, unpassedBatches: 10, totalBatches: 295, passRateNum: 98.3 },
  { name: '无刷直流驱动电机', passedBatches: 210, unpassedBatches: 8, totalBatches: 218, passRateNum: 98.2 },
  { name: '高精度PT100感温棒', passedBatches: 330, unpassedBatches: 10, totalBatches: 340, passRateNum: 98.8 },
  { name: '开关电源大功率适配器', passedBatches: 240, unpassedBatches: 10, totalBatches: 250, passRateNum: 98.0 },
  { name: '不锈钢精密弹片冲压件', passedBatches: 390, unpassedBatches: 15, totalBatches: 405, passRateNum: 98.3 },
  { name: '防静电防震缓冲包装', passedBatches: 520, unpassedBatches: 14, totalBatches: 534, passRateNum: 99.3 },
  { name: '耐高温硅胶密封套圈', passedBatches: 270, unpassedBatches: 9, totalBatches: 279, passRateNum: 98.6 },
  { name: '压敏电阻与浪涌防护管', passedBatches: 305, unpassedBatches: 11, totalBatches: 316, passRateNum: 98.4 },
];

const INITIAL_PASS_RATE_REPORT_DATA = [
  { id: 1, category: '电气核心性能测试', passed: 412, concession: 5, rejected: 3, review: 1, totalBatches: 421, passRate: '97.9%', rejectRate: '0.71%', inspectDate: '2026-10-21' },
  { id: 2, category: '精密尺寸与公差', passed: 530, concession: 8, rejected: 4, review: 2, totalBatches: 544, passRate: '97.4%', rejectRate: '0.74%', inspectDate: '2026-10-21' },
  { id: 3, category: '外观与包装缺陷', passed: 615, concession: 12, rejected: 5, review: 1, totalBatches: 633, passRate: '97.2%', rejectRate: '0.79%', inspectDate: '2026-10-20' },
  { id: 4, category: '化学成分及光谱分析', passed: 280, concession: 4, rejected: 2, review: 1, totalBatches: 287, passRate: '97.6%', rejectRate: '0.70%', inspectDate: '2026-10-20' },
  { id: 5, category: '高低温环境可靠性', passed: 195, concession: 3, rejected: 2, review: 0, totalBatches: 200, passRate: '97.5%', rejectRate: '1.00%', inspectDate: '2026-10-19' },
  { id: 6, category: '盐雾腐蚀与防护检验', passed: 165, concession: 2, rejected: 1, review: 1, totalBatches: 169, passRate: '97.6%', rejectRate: '0.59%', inspectDate: '2026-10-19' },
  { id: 7, category: '机械抗拉与插拔寿命', passed: 310, concession: 6, rejected: 3, review: 1, totalBatches: 320, passRate: '96.9%', rejectRate: '0.94%', inspectDate: '2026-10-18' },
  { id: 8, category: '安规与耐压绝缘测试', passed: 385, concession: 7, rejected: 4, review: 1, totalBatches: 397, passRate: '97.0%', rejectRate: '1.01%', inspectDate: '2026-10-18' },
  { id: 9, category: '硬度与金相组织分析', passed: 240, concession: 4, rejected: 2, review: 0, totalBatches: 246, passRate: '97.6%', rejectRate: '0.81%', inspectDate: '2026-10-17' },
  { id: 10, category: '微观结构与缺陷扫描', passed: 215, concession: 3, rejected: 2, review: 1, totalBatches: 221, passRate: '97.3%', rejectRate: '0.90%', inspectDate: '2026-10-17' },
];

const PASS_RATE_CHART_DATA = [
  { name: '电气核心', passedBatches: 412, unpassedBatches: 9, totalBatches: 421, passRateNum: 97.9 },
  { name: '精密尺寸', passedBatches: 530, unpassedBatches: 14, totalBatches: 544, passRateNum: 97.4 },
  { name: '外观包装', passedBatches: 615, unpassedBatches: 18, totalBatches: 633, passRateNum: 97.2 },
  { name: '化学成分', passedBatches: 280, unpassedBatches: 7, totalBatches: 287, passRateNum: 97.6 },
  { name: '高低温', passedBatches: 195, unpassedBatches: 5, totalBatches: 200, passRateNum: 97.5 },
  { name: '盐雾腐蚀', passedBatches: 165, unpassedBatches: 4, totalBatches: 169, passRateNum: 97.6 },
  { name: '抗拉寿命', passedBatches: 310, unpassedBatches: 10, totalBatches: 320, passRateNum: 96.9 },
  { name: '安规耐压', passedBatches: 385, unpassedBatches: 12, totalBatches: 397, passRateNum: 97.0 },
  { name: '硬度金相', passedBatches: 240, unpassedBatches: 6, totalBatches: 246, passRateNum: 97.6 },
  { name: '微观结构', passedBatches: 215, unpassedBatches: 6, totalBatches: 221, passRateNum: 97.3 },
];

const INITIAL_INSPECTOR_TIMELINESS_LIST = [
  { id: 1, name: '张伟', totalBatches: 345, completedBatches: 342, completionRate: '99.1%', timelyBatches: 330, timelyRate: '96.5%', passed: 325, concession: 12, rejected: 4, review: 1, inspectDate: '2026-10-21' },
  { id: 2, name: '李明', totalBatches: 280, completedBatches: 275, completionRate: '98.2%', timelyBatches: 260, timelyRate: '94.5%', passed: 262, concession: 8, rejected: 3, review: 2, inspectDate: '2026-10-21' },
  { id: 3, name: '王强', totalBatches: 410, completedBatches: 405, completionRate: '98.8%', timelyBatches: 390, timelyRate: '96.3%', passed: 388, concession: 14, rejected: 3, review: 0, inspectDate: '2026-10-20' },
  { id: 4, name: '陈静', totalBatches: 295, completedBatches: 290, completionRate: '98.3%', timelyBatches: 280, timelyRate: '96.6%', passed: 278, concession: 9, rejected: 2, review: 1, inspectDate: '2026-10-20' },
  { id: 5, name: '周浩', totalBatches: 360, completedBatches: 355, completionRate: '98.6%', timelyBatches: 342, timelyRate: '96.3%', passed: 340, concession: 11, rejected: 3, review: 1, inspectDate: '2026-10-20' },
  { id: 6, name: '林芳', totalBatches: 310, completedBatches: 304, completionRate: '98.1%', timelyBatches: 290, timelyRate: '95.4%', passed: 290, concession: 10, rejected: 3, review: 1, inspectDate: '2026-10-19' },
  { id: 7, name: '徐婷', totalBatches: 250, completedBatches: 246, completionRate: '98.4%', timelyBatches: 238, timelyRate: '96.7%', passed: 235, concession: 8, rejected: 2, review: 1, inspectDate: '2026-10-19' },
  { id: 8, name: '郭敏', totalBatches: 330, completedBatches: 325, completionRate: '98.5%', timelyBatches: 312, timelyRate: '96.0%', passed: 310, concession: 10, rejected: 4, review: 1, inspectDate: '2026-10-18' },
  { id: 9, name: '孙涛', totalBatches: 290, completedBatches: 285, completionRate: '98.3%', timelyBatches: 272, timelyRate: '95.4%', passed: 270, concession: 10, rejected: 4, review: 1, inspectDate: '2026-10-18' },
  { id: 10, name: '刘洋', totalBatches: 380, completedBatches: 374, completionRate: '98.4%', timelyBatches: 358, timelyRate: '95.7%', passed: 355, concession: 13, rejected: 5, review: 1, inspectDate: '2026-10-17' },
  { id: 11, name: '赵磊', totalBatches: 315, completedBatches: 310, completionRate: '98.4%', timelyBatches: 298, timelyRate: '96.1%', passed: 295, concession: 10, rejected: 4, review: 1, inspectDate: '2026-10-17' },
  { id: 12, name: '枫叶', totalBatches: 420, completedBatches: 415, completionRate: '98.8%', timelyBatches: 400, timelyRate: '96.4%', passed: 395, concession: 15, rejected: 4, review: 1, inspectDate: '2026-10-16' },
  { id: 13, name: '黄健', totalBatches: 270, completedBatches: 265, completionRate: '98.1%', timelyBatches: 252, timelyRate: '95.1%', passed: 250, concession: 10, rejected: 4, review: 1, inspectDate: '2026-10-16' },
  { id: 14, name: '吴杰', totalBatches: 340, completedBatches: 335, completionRate: '98.5%', timelyBatches: 320, timelyRate: '95.5%', passed: 320, concession: 11, rejected: 3, review: 1, inspectDate: '2026-10-15' },
  { id: 15, name: '杨洋', totalBatches: 290, completedBatches: 285, completionRate: '98.3%', timelyBatches: 270, timelyRate: '94.7%', passed: 270, concession: 10, rejected: 4, review: 1, inspectDate: '2026-10-15' },
  { id: 16, name: '郑晨', totalBatches: 320, completedBatches: 315, completionRate: '98.4%', timelyBatches: 300, timelyRate: '95.2%', passed: 300, concession: 10, rejected: 4, review: 1, inspectDate: '2026-10-14' },
  { id: 17, name: '王芳', totalBatches: 300, completedBatches: 295, completionRate: '98.3%', timelyBatches: 280, timelyRate: '94.9%', passed: 280, concession: 10, rejected: 4, review: 1, inspectDate: '2026-10-14' },
  { id: 18, name: '李强', totalBatches: 260, completedBatches: 255, completionRate: '98.1%', timelyBatches: 242, timelyRate: '94.9%', passed: 240, concession: 10, rejected: 4, review: 1, inspectDate: '2026-10-13' },
  { id: 19, name: '张敏', totalBatches: 350, completedBatches: 345, completionRate: '98.6%', timelyBatches: 330, timelyRate: '95.7%', passed: 330, concession: 10, rejected: 4, review: 1, inspectDate: '2026-10-13' },
  { id: 20, name: '刘涛', totalBatches: 310, completedBatches: 305, completionRate: '98.4%', timelyBatches: 290, timelyRate: '95.1%', passed: 290, concession: 10, rejected: 4, review: 1, inspectDate: '2026-10-12' },
];

const INITIAL_USER_MANAGEMENT_LIST = Array.from({ length: 60 }, (_, i) => {
  const id = i + 1;
  const names = ['张伟', '王伟', '李娜', '王芳', '张敏', '李伟', '刘洋', '陈静', '杨洋', '黄健', '吴杰', '郑晨', '王强', '刘涛', '李强', '赵磊', '孙涛', '郭敏', '周涛', '林峰'];
  const operators = ['张伟', '李娜', '王强', '刘洋', '陈静', '张敏', '李伟', '王芳', '刘军', '陈涛'];
  const name = names[i % names.length];
  const operator = operators[i % operators.length];
  const account = 10001 + i;
  return {
    id,
    enabled: true,
    account: String(account),
    name: `${name}${i > 19 ? Math.floor(i / 20) + 1 : ''}`,
    department: i % 3 === 0 ? '质检部' : i % 3 === 1 ? '计量室' : '实验室',
    dispatchOrder: i + 1,
    signRole: i % 2 === 0 ? '外检组长' : '质检经理',
    userRole: 'IQC检验员',
    inspectorCode: `QC${String(i + 1).padStart(3, '0')}`,
    autoDispatch: i % 3 === 0 ? '否' : '是',
    materialGroup: i % 2 === 0 ? '主控MCU与微处理器' : 'SMT车规贴片电容',
    ip: `192.168.1.${101 + (i % 100)}`,
    email: `user${account}@company.com`,
    leaveStart: '—',
    leaveEnd: '—',
    operator,
    updateTime: '2026-10-20 12:12'
  };
});

const INITIAL_EMAIL_GROUP_LIST = Array.from({ length: 25 }, (_, i) => {
  const id = i + 1;
  const codes = ['A001', 'A002', 'A003', 'A004', 'A005', 'A006', 'A007', 'A008', 'A009', 'A010'];
  const names = ['不合格信息通知', '质检异常提醒', '巡检超期预警', '外协件送检通知', 'IQC批次审核通知', 'IPQC巡检异常通告', 'FQC成品放行通告', '质量客诉跟进通知', '计量设备校准通知', '供方质量月报推送'];
  const descs = ['入厂检验不合格信息通知', '生产过程异常即时推送', '巡检任务超时未完成预警', '外协件到货送检提醒', 'IQC来料检验批次审核通告', 'IPQC制程巡检异常通告', 'FQC成品检验放行通知', '客诉问题跟进处理派发通知', '检验设备到期校准提醒', '供应商质量表现月报自动推送'];
  const operators = ['张伟', '李娜', '王强', '刘洋', '陈静', '张敏', '李伟', '王芳', '刘军', '陈涛'];
  const code = codes[i % codes.length];
  const name = names[i % names.length];
  const desc = descs[i % descs.length];
  const operator = operators[i % operators.length];
  const dateObj = new Date(Date.now() - i * 3600 * 1000 * 2);
  const updateTime = dateObj.toISOString().replace('T', ' ').substring(0, 16);
  return {
    id,
    groupCode: code,
    groupName: name,
    groupDesc: desc,
    operator,
    updateTime
  };
});

const INITIAL_AUTO_DISPATCH_LIST = Array.from({ length: 25 }, (_, i) => {
  const id = i + 1;
  const materialGroups = [
    '物料组1', '物料组2', '物料组3', '物料组4', '物料组5',
    '物料组6', '物料组7', '物料组8', '物料组9', '物料组10',
    '主控MCU与微处理器', 'SMT车规贴片电容', '功率半导体MOSFET',
    '高密度双面PCB电路板', '高精度贴片电阻', '车规级晶振谐振器'
  ];
  const materialGroup = materialGroups[i % materialGroups.length];
  const operators = ['张伟', '李娜', '王强', '刘洋', '陈静', '张敏', '李伟', '王芳', '刘军', '陈涛'];
  const operator = operators[i % operators.length];
  const dateObj = new Date(Date.now() - i * 3600 * 1000 * 2);
  const updateTime = dateObj.toISOString().replace('T', ' ').substring(0, 16);
  return {
    id,
    materialGroup,
    enabled: i % 4 !== 0,
    operator,
    updateTime
  };
});

const INITIAL_ROLE_MANAGEMENT_LIST = Array.from({ length: 25 }, (_, i) => {
  const id = i + 1;
  const roleNames = [
    '系统管理员', '质量总监', '质检经理', '外检组长', 'IQC检验员', 
    'IPQC检验员', 'FQC检验员', '计量管理员', '质量审计员', '仓管主管',
    '生产组长', '工艺工程师', '设备维护员', '供应商协同员', '客诉专员',
    '可靠性测试员', '实验室主任', '数据统计员', '文档管理员', '安全员',
    '高级检验专家', '来料检验长', '过程巡检长', '成品放行长', '质量协调员'
  ];
  const roleCodes = [
    'ROLE_ADMIN', 'ROLE_QUALITY_DIR', 'ROLE_QUALITY_MGR', 'ROLE_LEADER_EXT', 'ROLE_INSPECTOR_IQC',
    'ROLE_INSPECTOR_IPQC', 'ROLE_INSPECTOR_FQC', 'ROLE_METROLOGY', 'ROLE_AUDITOR', 'ROLE_WAREHOUSE',
    'ROLE_PROD_LEADER', 'ROLE_PROCESS_ENG', 'ROLE_EQUIP_MAINT', 'ROLE_SUPPLIER_CO', 'ROLE_CUSTOMER_SVC',
    'ROLE_RELIABILITY', 'ROLE_LAB_DIRECTOR', 'ROLE_DATA_ANALYST', 'ROLE_DOC_ADMIN', 'ROLE_SAFETY',
    'ROLE_SENIOR_EXP', 'ROLE_IQC_HEAD', 'ROLE_IPQC_HEAD', 'ROLE_FQC_HEAD', 'ROLE_QUALITY_COORD'
  ];
  const operators = ['张伟', '李娜', '王强', '刘洋', '陈静', '张敏', '李伟', '王芳', '刘军', '陈涛'];
  const name = roleNames[i % roleNames.length];
  const code = roleCodes[i % roleCodes.length];
  const operator = operators[i % operators.length];
  return {
    id,
    enabled: true,
    roleCode: code,
    roleName: name,
    roleDesc: `${name}负责相关模块的管理与日常质量管控审批工作`,
    permissions: '全部权限 / 检验 / 审核 / 报表',
    operator,
    updateTime: '2026-10-20 14:30'
  };
});

const INITIAL_FEEDBACK_LIST = Array.from({ length: 25 }, (_, i) => {
  const id = i + 1;
  const types = ['功能建议', '界面优化', '缺陷报错', '性能体验', '其它'];
  const titles = [
    '建议增加移动端扫码验货便捷通道', '优化IQC质检表单自动填充字段', '物料组筛选下拉菜单反应偶发延迟',
    '质检看板增加导出Excel报表快捷按钮', '批量启用派单时提示信息不够明显', '检验员及时性统计报表增加月度环比',
    '邮件组管理页面支持一键测试发送', '设备管理页面的校准提醒颜色加深', '用户管理角色权限分配支持多选折叠',
    '自动派单设置增加规则生效时间段配置'
  ];
  const contents = [
    '在车间现场使用平板或手机时，希望能够直接调用摄像头扫码进行物料录入与派单确认，减少手工输入错误。',
    '希望在录入检验批次时，系统能够根据物料编码自动带出默认的标准检验项目和抽样方案，提高录入效率。',
    '在数据量较大时，物料组下拉选择框偶有轻微卡顿，建议进行前端虚拟滚动或列表缓存优化。',
    '目前的图表分析功能很实用，如果能支持一键导出为Excel或PDF格式的完整质量周报/月报就更完美了。',
    '批量启用/关闭操作执行后，弹出的提示不够醒目，建议增加Toast浮动提示条。',
    '希望能为各检验小组或个人增加月度、季度质量合格率及工作效率的环比趋势图表。'
  ];
  const statuses = ['已处理', '处理中', '待处理'];
  const operators = ['张伟', '李娜', '王强', '刘洋', '陈静', '张敏', '李伟', '王芳', '刘军', '陈涛'];
  
  const type = types[i % types.length];
  const title = titles[i % titles.length];
  const content = contents[i % contents.length];
  const status = statuses[i % statuses.length];
  const operator = operators[i % operators.length];
  const dateObj = new Date(Date.now() - i * 3600 * 1000 * 3);
  const updateTime = dateObj.toISOString().replace('T', ' ').substring(0, 16);

  return {
    id,
    type,
    title,
    content,
    operator,
    contact: `1380013${String(1000 + i).slice(-4)}`,
    status,
    updateTime
  };
});


const INITIAL_SUPPLIER_REPORT_DATA = [
  { id: 1, code: '101001', supplier: '深圳市德赛电池有限公司', passed: 318, concession: 14, rejected: 2, review: 0, totalBatches: 334, passRate: '95.2%', rejectRate: '0.60%', inspectDate: '2026-10-21' },
  { id: 2, code: '101001', supplier: '深圳市比克动力电池有限公司', passed: 226, concession: 16, rejected: 0, review: 0, totalBatches: 242, passRate: '93.4%', rejectRate: '0.00%', inspectDate: '2026-10-21' },
  { id: 3, code: '101002', supplier: '惠州市中京电子科技股份有限公司', passed: 252, concession: 12, rejected: 3, review: 0, totalBatches: 267, passRate: '94.4%', rejectRate: '1.12%', inspectDate: '2026-10-20' },
  { id: 4, code: '101004', supplier: '东莞市新能源科技有限公司', passed: 296, concession: 9, rejected: 1, review: 0, totalBatches: 306, passRate: '96.7%', rejectRate: '0.33%', inspectDate: '2026-10-20' },
  { id: 5, code: '101021', supplier: '珠海市GDS半导体有限公司', passed: 357, concession: 25, rejected: 3, review: 0, totalBatches: 385, passRate: '92.7%', rejectRate: '0.78%', inspectDate: '2026-10-20' },
  { id: 6, code: '101007', supplier: '歌尔股份有限公司', passed: 410, concession: 18, rejected: 4, review: 1, totalBatches: 433, passRate: '94.7%', rejectRate: '0.92%', inspectDate: '2026-10-19' },
  { id: 7, code: '101008', supplier: '立讯精密工业股份有限公司', passed: 435, concession: 15, rejected: 2, review: 0, totalBatches: 452, passRate: '96.2%', rejectRate: '0.44%', inspectDate: '2026-10-19' },
  { id: 8, code: '101015', supplier: '瑞声科技控股有限公司', passed: 385, concession: 20, rejected: 3, review: 1, totalBatches: 409, passRate: '94.1%', rejectRate: '0.73%', inspectDate: '2026-10-18' },
  { id: 9, code: '101006', supplier: '顺络电子股份有限公司', passed: 312, concession: 12, rejected: 2, review: 0, totalBatches: 326, passRate: '95.7%', rejectRate: '0.61%', inspectDate: '2026-10-18' },
  { id: 10, code: '101019', supplier: '三花智控股份有限公司', passed: 395, concession: 16, rejected: 3, review: 0, totalBatches: 414, passRate: '95.4%', rejectRate: '0.72%', inspectDate: '2026-10-17' },
];

const SUPPLIER_CHART_DATA = [
  { name: '德赛电池', passedBatches: 318, unpassedBatches: 16, totalBatches: 334, passRateNum: 95.2 },
  { name: '比克动力', passedBatches: 226, unpassedBatches: 16, totalBatches: 242, passRateNum: 93.4 },
  { name: '中京电子', passedBatches: 252, unpassedBatches: 15, totalBatches: 267, passRateNum: 94.4 },
  { name: '新能源科技', passedBatches: 296, unpassedBatches: 10, totalBatches: 306, passRateNum: 96.7 },
  { name: 'GDS半导体', passedBatches: 357, unpassedBatches: 28, totalBatches: 385, passRateNum: 92.7 },
  { name: '歌尔股份', passedBatches: 410, unpassedBatches: 23, totalBatches: 433, passRateNum: 94.7 },
  { name: '立讯精密', passedBatches: 435, unpassedBatches: 17, totalBatches: 452, passRateNum: 96.2 },
  { name: '瑞声科技', passedBatches: 385, unpassedBatches: 24, totalBatches: 409, passRateNum: 94.1 },
  { name: '顺络电子', passedBatches: 312, unpassedBatches: 14, totalBatches: 326, passRateNum: 95.7 },
  { name: '三花智控', passedBatches: 395, unpassedBatches: 19, totalBatches: 414, passRateNum: 95.4 },
  { name: '艾华电子', passedBatches: 280, unpassedBatches: 12, totalBatches: 292, passRateNum: 95.9 },
  { name: '扬杰科技', passedBatches: 340, unpassedBatches: 15, totalBatches: 355, passRateNum: 95.8 },
  { name: '圣邦微', passedBatches: 215, unpassedBatches: 10, totalBatches: 225, passRateNum: 95.6 },
  { name: '兆易创新', passedBatches: 310, unpassedBatches: 14, totalBatches: 324, passRateNum: 95.7 },
  { name: '长电科技', passedBatches: 450, unpassedBatches: 20, totalBatches: 470, passRateNum: 95.7 },
  { name: '村田中国', passedBatches: 510, unpassedBatches: 18, totalBatches: 528, passRateNum: 96.6 },
  { name: '华天科技', passedBatches: 290, unpassedBatches: 15, totalBatches: 305, passRateNum: 95.1 },
  { name: '京东方', passedBatches: 480, unpassedBatches: 22, totalBatches: 502, passRateNum: 95.6 },
  { name: '胜宏科技', passedBatches: 260, unpassedBatches: 13, totalBatches: 273, passRateNum: 95.2 },
  { name: '士兰微', passedBatches: 330, unpassedBatches: 16, totalBatches: 346, passRateNum: 95.4 },
];

export default function App() {
  const [activeMenu, setActiveMenu] = useState('物料组分析');
  const [homeOpen, setHomeOpen] = useState(true);
  const [materialDispatchOpen, setMaterialDispatchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultConclusionFilter, setResultConclusionFilter] = useState<InspectionConclusionFilter>('全部');
  const resultConclusionSummary = getInspectionConclusionSummary(INSPECTION_RESULTS);
  const filteredInspectionResults = filterInspectionResultsByConclusion(INSPECTION_RESULTS, resultConclusionFilter);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginAccount, setLoginAccount] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAccount.trim() || !loginPassword.trim()) {
      setLoginError('请输入账号和密码');
      return;
    }
    setIsLoggedIn(true);
  };

  // Sporadic Dispatch filter states
  const [filterMaterialCode, setFilterMaterialCode] = useState('');
  const [filterSupplierCode, setFilterSupplierCode] = useState('');
  const [filterGoodsNo, setFilterGoodsNo] = useState('');
  const [dispatchList, setDispatchList] = useState(INITIAL_DISPATCH_LIST);
  const [showAddModal, setShowAddModal] = useState(false);

  // WMS Pending Dispatch filter states
  const [wmsMaterialCode, setWmsMaterialCode] = useState('');
  const [wmsSupplierCode, setWmsSupplierCode] = useState('');
  const [wmsGoodsNo, setWmsGoodsNo] = useState('');
  const [wmsList, setWmsList] = useState(INITIAL_WMS_PENDING_LIST);

  // My Inspection states
  const [materialInspectionOpen, setMaterialInspectionOpen] = useState(false);
  const [inspectMaterialCode, setInspectMaterialCode] = useState('');
  const [inspectSupplierCode, setInspectSupplierCode] = useState('');
  const [inspectList, setInspectList] = useState(INITIAL_MY_INSPECTION_LIST);

  // IQC Audit states
  const [iqcAuditOpen, setIqcAuditOpen] = useState(false);
  const [iqcMaterialCode, setIqcMaterialCode] = useState('');
  const [iqcAuditList, setIqcAuditList] = useState(INITIAL_IQC_AUDIT_LIST);

  const handleSearchIqcAudit = () => {
    let filtered = INITIAL_IQC_AUDIT_LIST;
    if (iqcMaterialCode.trim()) {
      filtered = filtered.filter(item => item.code.includes(iqcMaterialCode.trim()));
    }
    setIqcAuditList(filtered);
  };

  const handleResetIqcAudit = () => {
    setIqcMaterialCode('');
    setIqcAuditList(INITIAL_IQC_AUDIT_LIST);
  };

  // Quality Manager Audit states
  const [qmMaterialCode, setQmMaterialCode] = useState('');
  const [qmAuditList, setQmAuditList] = useState(INITIAL_QUALITY_MANAGER_AUDIT_LIST);

  const handleSearchQmAudit = () => {
    let filtered = INITIAL_QUALITY_MANAGER_AUDIT_LIST;
    if (qmMaterialCode.trim()) {
      filtered = filtered.filter(item => item.code.includes(qmMaterialCode.trim()));
    }
    setQmAuditList(filtered);
  };

  const handleResetQmAudit = () => {
    setQmMaterialCode('');
    setQmAuditList(INITIAL_QUALITY_MANAGER_AUDIT_LIST);
  };

  // Comprehensive Query states
  const [compMaterialCode, setCompMaterialCode] = useState('');
  const [compMaterialName, setCompMaterialName] = useState('');
  const [compSupplierCode, setCompSupplierCode] = useState('');
  const [compSupplierAbbr, setCompSupplierAbbr] = useState('');
  const [compList, setCompList] = useState(INITIAL_COMPREHENSIVE_QUERY_LIST);

  const handleSearchComp = () => {
    let filtered = INITIAL_COMPREHENSIVE_QUERY_LIST;
    if (compMaterialCode.trim()) {
      filtered = filtered.filter(item => item.code.includes(compMaterialCode.trim()));
    }
    if (compMaterialName.trim()) {
      filtered = filtered.filter(item => item.name.includes(compMaterialName.trim()));
    }
    setCompList(filtered);
  };

  const handleResetComp = () => {
    setCompMaterialCode('');
    setCompMaterialName('');
    setCompSupplierCode('');
    setCompSupplierAbbr('');
    setCompList(INITIAL_COMPREHENSIVE_QUERY_LIST);
  };

  // Comprehensive Query Edit & Detail modal/view states
  const [showCompEdit, setShowCompEdit] = useState(false);
  const [showCompDetail, setShowCompDetail] = useState(false);

  // Comp Edit form states
  const [editSampleSize, setEditSampleSize] = useState('13');
  const [editUnqualifiedQty, setEditUnqualifiedQty] = useState('0');
  const [editQualifiedQty, setEditQualifiedQty] = useState('13');
  const [editDefectClass, setEditDefectClass] = useState('无');
  const [editConclusion, setEditConclusion] = useState('合格接收');
  const [editWriteErp, setEditWriteErp] = useState('否');
  const [editImpact, setEditImpact] = useState('各检测参数符合设计标准，产品质量可控。');
  const [editAdvice, setEditAdvice] = useState('按正常流程办理物料入库手续。');
  const [editIqcSupervisor, setEditIqcSupervisor] = useState('张主管');
  const [editQualityManager, setEditQualityManager] = useState('张伟');
  const [editEmailGroup, setEditEmailGroup] = useState('支持多选');

  // Comprehensive Query Action Modals
  const [showCompUrgentModal, setShowCompUrgentModal] = useState(false);
  const [showCompDeleteModal, setShowCompDeleteModal] = useState(false);
  const [showCompChangeStatusModal, setShowCompChangeStatusModal] = useState(false);
  const [showCompChangeInspectorModal, setShowCompChangeInspectorModal] = useState(false);

  // Form states for the 4 actions
  const [urgentLevel, setUrgentLevel] = useState('特急');
  const [urgentReason, setUrgentReason] = useState('产线关键物料即将断料，申请优先安排检验入库。');
  const [urgentTargetTime, setUrgentTargetTime] = useState('2026-10-20 18:00');

  const [deleteReason, setDeleteReason] = useState('单据录入重复，申请作废处理。');

  const [changeStatusTarget, setChangeStatusTarget] = useState('检验中');
  const [changeStatusReason, setChangeStatusReason] = useState('常规检验项目已完成，进入综合判定节点。');

  const [changeInspectorTarget, setChangeInspectorTarget] = useState('QC002');
  const [changeInspectorReason, setChangeInspectorReason] = useState('原检验员工作负荷过高，按质量管理规定合理分流转派。');

  const handleConfirmUrgent = () => {
    if (currentInspectItem) {
      setCompList(compList.map(item =>
        item.id === currentInspectItem.id
          ? { ...item, routineCheck: '加急待检', progress: '加急检验中' }
          : item
      ));
      alert(`物料 ${currentInspectItem.code} 已成功设置为【${urgentLevel}】状态！`);
    }
    setShowCompUrgentModal(false);
  };

  const handleConfirmCompDelete = () => {
    if (currentInspectItem) {
      setCompList(compList.filter(item => item.id !== currentInspectItem.id));
      alert(`物料 ${currentInspectItem.code} 检验任务已被成功作废删除！`);
    }
    setShowCompDeleteModal(false);
  };

  const handleConfirmChangeStatus = () => {
    if (currentInspectItem) {
      setCompList(compList.map(item =>
        item.id === currentInspectItem.id
          ? { ...item, progress: changeStatusTarget, routineCheck: changeStatusTarget === '待抽样' ? '待抽样' : '检验中' }
          : item
      ));
      alert(`物料 ${currentInspectItem.code} 待检节点状态已更新为【${changeStatusTarget}】！`);
    }
    setShowCompChangeStatusModal(false);
  };

  const handleConfirmChangeInspector = () => {
    if (currentInspectItem) {
      setCompList(compList.map(item =>
        item.id === currentInspectItem.id
          ? { ...item, inspectorCode: changeInspectorTarget }
          : item
      ));
      alert(`物料 ${currentInspectItem.code} 的检验员已成功转派为【${changeInspectorTarget}】！`);
    }
    setShowCompChangeInspectorModal(false);
  };

  // Supplier List states
  const [fixedInfoOpen, setFixedInfoOpen] = useState(true);
  const [basicManagementOpen, setBasicManagementOpen] = useState(true);
  const [supplierCodeFilter, setSupplierCodeFilter] = useState('');
  const [supplierAbbrFilter, setSupplierAbbrFilter] = useState('');
  const [supplierList, setSupplierList] = useState(INITIAL_SUPPLIER_LIST);

  // Material Group (基础管理 -> 物料组) states & handlers
  const [filterMgCode, setFilterMgCode] = useState('');
  const [filterMgName, setFilterMgName] = useState('');
  const [materialGroupList, setMaterialGroupList] = useState(INITIAL_MATERIAL_GROUP_LIST);
  const [showAddMgModal, setShowAddMgModal] = useState(false);
  const [showEditMgModal, setShowEditMgModal] = useState(false);
  const [showDeleteMgModal, setShowDeleteMgModal] = useState(false);
  const [editingMgItem, setEditingMgItem] = useState<any>(null);
  const [deletingMgItem, setDeletingMgItem] = useState<any>(null);

  const [mgFormCode, setMgFormCode] = useState('');
  const [mgFormName, setMgFormName] = useState('');
  const [mgFormSamplingPlan, setMgFormSamplingPlan] = useState('I');

  const handleSearchMg = () => {
    let filtered = INITIAL_MATERIAL_GROUP_LIST;
    if (filterMgCode.trim()) {
      filtered = filtered.filter(item => item.code.toLowerCase().includes(filterMgCode.trim().toLowerCase()));
    }
    if (filterMgName.trim()) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(filterMgName.trim().toLowerCase()));
    }
    setMaterialGroupList(filtered);
  };

  const handleResetMg = () => {
    setFilterMgCode('');
    setFilterMgName('');
    setMaterialGroupList(INITIAL_MATERIAL_GROUP_LIST);
  };

  const openAddMgModal = () => {
    setMgFormCode('');
    setMgFormName('');
    setMgFormSamplingPlan('I');
    setShowAddMgModal(true);
  };

  const handleAddMg = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      code: mgFormCode || `G00${materialGroupList.length + 1}`,
      name: mgFormName || '未命名物料组',
      samplingPlan: mgFormSamplingPlan || 'I',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      maintainer: '陈静'
    };
    setMaterialGroupList([newItem, ...materialGroupList]);
    setShowAddMgModal(false);
    alert('新增物料组成功！');
  };

  const openEditMgModal = (item: any) => {
    setEditingMgItem(item);
    setMgFormCode(item.code || '');
    setMgFormName(item.name || '');
    setMgFormSamplingPlan(item.samplingPlan || 'I');
    setShowEditMgModal(true);
  };

  const handleSaveEditMg = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMgItem) {
      setMaterialGroupList(materialGroupList.map(item => item.id === editingMgItem.id ? {
        ...item,
        code: mgFormCode,
        name: mgFormName,
        samplingPlan: mgFormSamplingPlan,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        maintainer: '陈静'
      } : item));
    }
    setShowEditMgModal(false);
    alert('物料组修改成功！');
  };

  const openDeleteMgModal = (item: any) => {
    setDeletingMgItem(item);
    setShowDeleteMgModal(true);
  };

  const handleConfirmDeleteMg = () => {
    if (deletingMgItem) {
      setMaterialGroupList(materialGroupList.filter(item => item.id !== deletingMgItem.id));
      setShowDeleteMgModal(false);
      alert(`物料组【${deletingMgItem.code} - ${deletingMgItem.name}】记录已被成功删除！`);
    }
  };

  // Material Management (基础管理 -> 物料管理) states & handlers
  const [mmGroupFilter, setMmGroupFilter] = useState('');
  const [mmCodeFilter, setMmCodeFilter] = useState('');
  const [mmTypeFilter, setMmTypeFilter] = useState('');
  const [mmAutoDispatchFilter, setMmAutoDispatchFilter] = useState('');
  const [materialManagementList, setMaterialManagementList] = useState(INITIAL_MATERIAL_MANAGEMENT_LIST);
  
  const [showAddMmModal, setShowAddMmModal] = useState(false);
  const [showEditMmModal, setShowEditMmModal] = useState(false);
  const [showDeleteMmModal, setShowDeleteMmModal] = useState(false);
  const [editingMmItem, setEditingMmItem] = useState<any>(null);
  const [deletingMmItem, setDeletingMmItem] = useState<any>(null);

  // Form states for 物料管理
  const [mmGroupForm, setMmGroupForm] = useState('');
  const [mmCodeForm, setMmCodeForm] = useState('');
  const [mmNameForm, setMmNameForm] = useState('');
  const [mmSpecForm, setMmSpecForm] = useState('');
  const [mmDrawingNoForm, setMmDrawingNoForm] = useState('');
  const [mmUnitForm, setMmUnitForm] = useState('');
  const [mmStrictDaysForm, setMmStrictDaysForm] = useState<number | string>('');
  const [mmIsStrictForm, setMmIsStrictForm] = useState('否');
  const [mmStdHoursForm, setMmStdHoursForm] = useState<number | string>('');
  const [mmAutoDispatchForm, setMmAutoDispatchForm] = useState('是');
  const [mmCategoryForm, setMmCategoryForm] = useState('常规检验物料');
  const [mmLastPatternTimeForm, setMmLastPatternTimeForm] = useState('');
  const [mmPatternIntervalForm, setMmPatternIntervalForm] = useState<number | string>('');
  const [mmNextPatternTimeForm, setMmNextPatternTimeForm] = useState('');

  const handleSearchMm = () => {
    let filtered = INITIAL_MATERIAL_MANAGEMENT_LIST;
    if (mmGroupFilter.trim()) {
      filtered = filtered.filter(i => i.group.toLowerCase().includes(mmGroupFilter.trim().toLowerCase()));
    }
    if (mmCodeFilter.trim()) {
      filtered = filtered.filter(i => i.code.toLowerCase().includes(mmCodeFilter.trim().toLowerCase()));
    }
    if (mmTypeFilter) {
      filtered = filtered.filter(i => i.category === mmTypeFilter);
    }
    if (mmAutoDispatchFilter) {
      filtered = filtered.filter(i => i.autoDispatch === mmAutoDispatchFilter);
    }
    setMaterialManagementList(filtered);
  };

  const handleResetMm = () => {
    setMmGroupFilter('');
    setMmCodeFilter('');
    setMmTypeFilter('');
    setMmAutoDispatchFilter('');
    setMaterialManagementList(INITIAL_MATERIAL_MANAGEMENT_LIST);
  };

  const openAddMmModal = () => {
    setMmGroupForm('');
    setMmCodeForm('');
    setMmNameForm('');
    setMmSpecForm('');
    setMmDrawingNoForm('');
    setMmUnitForm('');
    setMmStrictDaysForm('');
    setMmIsStrictForm('否');
    setMmStdHoursForm('');
    setMmAutoDispatchForm('是');
    setMmCategoryForm('常规检验物料');
    setMmLastPatternTimeForm('');
    setMmPatternIntervalForm('');
    setMmNextPatternTimeForm('');
    setShowAddMmModal(true);
  };

  const handleAddMm = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      group: mmGroupForm || '物料组1',
      code: mmCodeForm || `9000000000${materialManagementList.length + 10}`,
      name: mmNameForm || '新物料',
      spec: mmSpecForm || '规格通用',
      drawingNo: mmDrawingNoForm || '0.000.001',
      unit: mmUnitForm || '件',
      strictDays: Number(mmStrictDaysForm) || 180,
      isStrict: mmIsStrictForm || '否',
      stdHours: Number(mmStdHoursForm) || 3,
      autoDispatch: mmAutoDispatchForm || '是',
      category: mmCategoryForm || '常规检验物料',
      lastPatternTime: mmLastPatternTimeForm || '2026-07-01 00:00:00',
      patternInterval: Number(mmPatternIntervalForm) || 90,
      nextPatternTime: mmNextPatternTimeForm || '2026-10-01 00:00:00',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      maintainer: '陈静'
    };
    setMaterialManagementList([newItem, ...materialManagementList]);
    setShowAddMmModal(false);
    alert('新增物料成功！');
  };

  const openEditMmModal = (item: any) => {
    setEditingMmItem(item);
    setMmGroupForm(item.group || '物料组1');
    setMmCodeForm(item.code || '');
    setMmNameForm(item.name || '');
    setMmSpecForm(item.spec || '');
    setMmDrawingNoForm(item.drawingNo || '0.000.001');
    setMmUnitForm(item.unit || '件');
    setMmStrictDaysForm(item.strictDays || 180);
    setMmIsStrictForm(item.isStrict || '否');
    setMmStdHoursForm(item.stdHours || 3);
    setMmAutoDispatchForm(item.autoDispatch || '是');
    setMmCategoryForm(item.category || '常规检验物料');
    setMmLastPatternTimeForm(item.lastPatternTime || '2026-07-01 00:00:00');
    setMmPatternIntervalForm(item.patternInterval || 90);
    setMmNextPatternTimeForm(item.nextPatternTime || '2026-10-01 00:00:00');
    setShowEditMmModal(true);
  };

  const handleSaveEditMm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMmItem) {
      setMaterialManagementList(materialManagementList.map(item => item.id === editingMmItem.id ? {
        ...item,
        group: mmGroupForm,
        code: mmCodeForm,
        name: mmNameForm,
        spec: mmSpecForm,
        drawingNo: mmDrawingNoForm,
        unit: mmUnitForm,
        strictDays: Number(mmStrictDaysForm),
        isStrict: mmIsStrictForm,
        stdHours: Number(mmStdHoursForm),
        autoDispatch: mmAutoDispatchForm,
        category: mmCategoryForm,
        lastPatternTime: mmLastPatternTimeForm,
        patternInterval: Number(mmPatternIntervalForm),
        nextPatternTime: mmNextPatternTimeForm,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        maintainer: '陈静'
      } : item));
    }
    setShowEditMmModal(false);
    alert('物料修改成功！');
  };

  const openDeleteMmModal = (item: any) => {
    setDeletingMmItem(item);
    setShowDeleteMmModal(true);
  };

  const handleConfirmDeleteMm = () => {
    if (deletingMmItem) {
      setMaterialManagementList(materialManagementList.filter(item => item.id !== deletingMmItem.id));
      setShowDeleteMmModal(false);
      alert(`物料【${deletingMmItem.code} - ${deletingMmItem.name}】记录已被成功删除！`);
    }
  };

  // Item Standards (基础管理 -> 项目标准) states & handlers
  const [psGroupFilter, setPsGroupFilter] = useState('');
  const [psCodeFilter, setPsCodeFilter] = useState('');
  const [psItemFilter, setPsItemFilter] = useState('');
  const [psCategoryFilter, setPsCategoryFilter] = useState('');
  const [itemStandardsList, setItemStandardsList] = useState(INITIAL_ITEM_STANDARDS_LIST);

  const [showAddPsModal, setShowAddPsModal] = useState(false);
  const [showEditPsModal, setShowEditPsModal] = useState(false);
  const [showDeletePsModal, setShowDeletePsModal] = useState(false);
  const [editingPsItem, setEditingPsItem] = useState<any>(null);
  const [deletingPsItem, setDeletingPsItem] = useState<any>(null);

  // Form states for 项目标准 (cleared / initialized when adding)
  const [psCodeForm, setPsCodeForm] = useState('');
  const [psSortOrderForm, setPsSortOrderForm] = useState<number | string>('');
  const [psItemNameForm, setPsItemNameForm] = useState('');
  const [psGroupForm, setPsGroupForm] = useState('分液器部件');
  const [psSampleQtyForm, setPsSampleQtyForm] = useState('');
  const [psSamplingPlanForm, setPsSamplingPlanForm] = useState('-');
  const [psCategoryForm, setPsCategoryForm] = useState('常规');
  const [psMethodForm, setPsMethodForm] = useState('手动计量');
  const [psTestTypeForm, setPsTestTypeForm] = useState('入厂检验');
  const [psIsEnabledForm, setPsIsEnabledForm] = useState('启用');

  // Sub-table rows state for 物料标准新增 (matching screenshot image_e850dd70.png)
  const [psTableRows, setPsTableRows] = useState<any[]>([]);

  const handleSearchPs = () => {
    let filtered = INITIAL_ITEM_STANDARDS_LIST;
    if (psGroupFilter) {
      filtered = filtered.filter(i => i.group === psGroupFilter);
    }
    if (psCodeFilter.trim()) {
      filtered = filtered.filter(i => i.code.toLowerCase().includes(psCodeFilter.trim().toLowerCase()));
    }
    if (psItemFilter.trim()) {
      filtered = filtered.filter(i => i.itemName.toLowerCase().includes(psItemFilter.trim().toLowerCase()));
    }
    if (psCategoryFilter) {
      filtered = filtered.filter(i => i.category === psCategoryFilter);
    }
    setItemStandardsList(filtered);
  };

  const handleResetPs = () => {
    setPsGroupFilter('');
    setPsCodeFilter('');
    setPsItemFilter('');
    setPsCategoryFilter('');
    setItemStandardsList(INITIAL_ITEM_STANDARDS_LIST);
  };

  const openAddPsModal = () => {
    setPsGroupForm('分液器部件');
    setPsCodeForm('');
    setPsSortOrderForm('');
    setPsItemNameForm('');
    setPsSampleQtyForm('');
    setPsSamplingPlanForm('-');
    setPsTableRows([]);
    setShowAddPsModal(true);
  };

  const addNewPsRow = () => {
    const nextOrder = psTableRows.length + 1;
    const prefix = psGroupForm || '分液器部件';
    const newRow = {
      id: Date.now() + Math.random(),
      code: `${prefix}00${nextOrder}`,
      sortOrder: nextOrder,
      itemName: '新检验项目',
      category: '常规',
      sampleQty: '1',
      samplingPlan: '-',
      testType: '入厂检验',
      method: '手动输入',
      isEnabled: true
    };
    setPsTableRows([...psTableRows, newRow]);
  };

  const deletePsRow = (idx: number) => {
    setPsTableRows(psTableRows.filter((_, i) => i !== idx));
  };

  const updatePsRow = (idx: number, field: string, val: any) => {
    setPsTableRows(psTableRows.map((row, i) => i === idx ? { ...row, [field]: val } : row));
  };

  const handleAddPs = (e: React.FormEvent) => {
    e.preventDefault();
    if (psTableRows.length === 0) {
      alert('请至少保留或新增一行检验规范项目！');
      return;
    }
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newItems = psTableRows.map(row => ({
      id: row.id || Date.now() + Math.random(),
      code: row.code || `${psGroupForm}001`,
      sortOrder: Number(row.sortOrder) || 1,
      itemName: row.itemName || '新检验项目',
      group: psGroupForm || '分液器部件物料组',
      sampleQty: row.sampleQty || '-',
      samplingPlan: row.samplingPlan || '-',
      category: row.category || '常规',
      method: row.method || '手动输入',
      testType: row.testType || '入厂检验',
      isEnabled: row.isEnabled ? '启用' : '关闭',
      updateTime: nowTime,
      maintainer: '陈静'
    }));
    setItemStandardsList([...newItems, ...itemStandardsList]);
    setShowAddPsModal(false);
    alert('成功新增物料项目标准规范！');
  };

  // Sub-table state for 物料标准编辑
  const [psEditTableRows, setPsEditTableRows] = useState<any[]>([]);

  const openEditPsModal = (item: any) => {
    setEditingPsItem(item);
    setPsGroupForm(item.group || '分液器部件');
    
    // Load all items belonging to the same material group
    const relatedItems = itemStandardsList.filter(i => i.group === item.group);
    if (relatedItems.length > 0) {
      setPsEditTableRows(relatedItems.map(row => ({
        id: row.id,
        code: row.code,
        sortOrder: row.sortOrder,
        itemName: row.itemName,
        category: row.category,
        sampleQty: row.sampleQty,
        samplingPlan: row.samplingPlan,
        testType: row.testType,
        method: row.method,
        isEnabled: row.isEnabled === '启用'
      })));
    } else {
      setPsEditTableRows([{
        id: item.id,
        code: item.code || 'ITEM-001',
        sortOrder: item.sortOrder || 1,
        itemName: item.itemName || '检验项目',
        category: item.category || '常规',
        sampleQty: item.sampleQty || '-',
        samplingPlan: item.samplingPlan || '-',
        testType: item.testType || '入厂检验',
        method: item.method || '手动计量',
        isEnabled: item.isEnabled === '启用'
      }]);
    }
    
    setShowEditPsModal(true);
  };

  const addNewPsEditRow = () => {
    const nextOrder = psEditTableRows.length + 1;
    const prefix = psGroupForm || '分液器部件';
    const newRow = {
      id: Date.now() + Math.random(),
      code: `${prefix}00${nextOrder}`,
      sortOrder: nextOrder,
      itemName: '新检验项目',
      category: '常规',
      sampleQty: '1',
      samplingPlan: '-',
      testType: '入厂检验',
      method: '手动输入',
      isEnabled: true
    };
    setPsEditTableRows([...psEditTableRows, newRow]);
  };

  const deletePsEditRow = (idx: number) => {
    setPsEditTableRows(psEditTableRows.filter((_, i) => i !== idx));
  };

  const updatePsEditRow = (idx: number, field: string, val: any) => {
    setPsEditTableRows(psEditTableRows.map((row, i) => i === idx ? { ...row, [field]: val } : row));
  };

  const handleSaveEditPs = (e: React.FormEvent) => {
    e.preventDefault();
    if (psEditTableRows.length === 0) {
      alert('请至少保留或新增一行检验规范项目！');
      return;
    }
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    const oldGroup = editingPsItem ? editingPsItem.group : psGroupForm;
    const remainingItems = itemStandardsList.filter(i => i.group !== oldGroup);
    
    const updatedItems = psEditTableRows.map(row => ({
      id: row.id || Date.now() + Math.random(),
      code: row.code || `${psGroupForm}001`,
      sortOrder: Number(row.sortOrder) || 1,
      itemName: row.itemName || '检验项目',
      group: psGroupForm || oldGroup,
      sampleQty: row.sampleQty || '-',
      samplingPlan: row.samplingPlan || '-',
      category: row.category || '常规',
      method: row.method || '手动输入',
      testType: row.testType || '入厂检验',
      isEnabled: row.isEnabled ? '启用' : '关闭',
      updateTime: nowTime,
      maintainer: '陈静'
    }));

    setItemStandardsList([...updatedItems, ...remainingItems].sort((a, b) => b.updateTime.localeCompare(a.updateTime)));
    setShowEditPsModal(false);
    alert('成功更新物料项目标准规范！');
  };

  const openDeletePsModal = (item: any) => {
    setDeletingPsItem(item);
    setShowDeletePsModal(true);
  };

  const handleConfirmDeletePs = () => {
    if (deletingPsItem) {
      setItemStandardsList(itemStandardsList.filter(item => item.id !== deletingPsItem.id));
      setShowDeletePsModal(false);
      alert(`项目标准【${deletingPsItem.code} - ${deletingPsItem.itemName}】记录已被成功删除！`);
    }
  };

  // Inspection Item (基础管理 -> 检验项目) states & handlers
  const [iiMaterialCodeFilter, setIiMaterialCodeFilter] = useState('');
  const [iiItemFilter, setIiItemFilter] = useState('');
  const [iiCategoryFilter, setIiCategoryFilter] = useState('');
  const [iiSupplierFilter, setIiSupplierFilter] = useState('');
  const [inspectionItemList, setInspectionItemList] = useState(INITIAL_INSPECTION_ITEM_LIST);

  const [showAddIiModal, setShowAddIiModal] = useState(false);
  const [showEditIiModal, setShowEditIiModal] = useState(false);
  const [showDeleteIiModal, setShowDeleteIiModal] = useState(false);
  const [showIiChangeModal, setShowIiChangeModal] = useState(false);
  const [editingIiItem, setEditingIiItem] = useState<any>(null);
  const [deletingIiItem, setDeletingIiItem] = useState<any>(null);

  // Form states for 检验项目 Add/Edit Modal (matching screenshot image_761ab4c0.png)
  const [iiGroupForm, setIiGroupForm] = useState('分液器部件');
  const [iiSimilarCodeForm, setIiSimilarCodeForm] = useState('');
  const [iiSimilarSupplierCodeForm, setIiSimilarSupplierCodeForm] = useState('');
  const [iiSimilarSupplierNameForm, setIiSimilarSupplierNameForm] = useState('');
  const [iiMaterialCodeForm, setIiMaterialCodeForm] = useState('');
  const [iiSupplierCodeForm, setIiSupplierCodeForm] = useState('');
  const [iiSupplierNameForm, setIiSupplierNameForm] = useState('');

  // Sub-table rows for 检验项目 Add/Edit Modal
  const [iiTableRows, setIiTableRows] = useState<any[]>([]);

  // Change modal states
  const [changeOldItem, setChangeOldItem] = useState('');
  const [changeNewItem, setChangeNewItem] = useState('');
  const [changeNewStandard, setChangeNewStandard] = useState('');

  const handleSearchIi = () => {
    let filtered = INITIAL_INSPECTION_ITEM_LIST;
    if (iiMaterialCodeFilter.trim()) {
      filtered = filtered.filter(i => i.materialCode.toLowerCase().includes(iiMaterialCodeFilter.trim().toLowerCase()));
    }
    if (iiItemFilter) {
      filtered = filtered.filter(i => i.itemName.includes(iiItemFilter) || i.itemCode.includes(iiItemFilter));
    }
    if (iiCategoryFilter) {
      filtered = filtered.filter(i => i.category === iiCategoryFilter);
    }
    if (iiSupplierFilter) {
      filtered = filtered.filter(i => i.supplierName.includes(iiSupplierFilter) || i.supplierCode.includes(iiSupplierFilter));
    }
    setInspectionItemList(filtered);
  };

  const handleResetIi = () => {
    setIiMaterialCodeFilter('');
    setIiItemFilter('');
    setIiCategoryFilter('');
    setIiSupplierFilter('');
    setInspectionItemList(INITIAL_INSPECTION_ITEM_LIST);
  };

  // Handler for [ 查询1 ] in Modal (Queries inspection standards for selected Material Group)
  const handleQuery1 = () => {
    const groupPrefix = iiGroupForm || '分液器部件';
    setIiTableRows([
      { id: Date.now() + 1, selected: true, itemCode: `${groupPrefix}001`, sortOrder: 1, itemName: '标识包装', standard: '23.1-23.5', category: '常规', method: '手动输入', isEnabled: true },
      { id: Date.now() + 2, selected: true, itemCode: `${groupPrefix}002`, sortOrder: 2, itemName: '附属物件', standard: '23.1-23.5', category: '常规', method: '手动输入', isEnabled: true },
      { id: Date.now() + 3, selected: true, itemCode: `${groupPrefix}003`, sortOrder: 3, itemName: '外观', standard: '23.1-23.5', category: '常规', method: '手动输入', isEnabled: true },
      { id: Date.now() + 4, selected: true, itemCode: `${groupPrefix}004`, sortOrder: 4, itemName: '直管厚度', standard: '23.1-23.5', category: '常规', method: '手动计量', isEnabled: true },
      { id: Date.now() + 5, selected: true, itemCode: `${groupPrefix}005`, sortOrder: 5, itemName: '有害物质', standard: 'Q/QC-2026-001', category: '化工', method: '手动输入', isEnabled: true },
    ]);
  };

  // Handler for [ 查询2 ] in Modal (Auto-fills material code, supplier code and supplier name)
  const handleQuery2 = () => {
    if (iiSimilarCodeForm || iiSimilarSupplierCodeForm || iiSimilarSupplierNameForm) {
      setIiMaterialCodeForm(iiSimilarCodeForm || '900000000002');
      setIiSupplierCodeForm(iiSimilarSupplierCodeForm || '101001');
      setIiSupplierNameForm(iiSimilarSupplierNameForm || '苏州精工微电子');
    } else {
      setIiMaterialCodeForm('900000000002');
      setIiSupplierCodeForm('101001');
      setIiSupplierNameForm('苏州精工微电子');
    }
  };

  const addNewIiTableRow = () => {
    const nextOrder = iiTableRows.length + 1;
    const prefix = iiGroupForm || '分液器部件';
    const newRow = {
      id: Date.now() + Math.random(),
      selected: true,
      itemCode: `${prefix}00${nextOrder}`,
      sortOrder: nextOrder,
      itemName: '新检验项目',
      standard: '23.1-23.5',
      category: '常规',
      method: '手动输入',
      isEnabled: true
    };
    setIiTableRows([...iiTableRows, newRow]);
  };

  const deleteIiTableRow = (idx: number) => {
    setIiTableRows(iiTableRows.filter((_, i) => i !== idx));
  };

  const updateIiTableRow = (idx: number, field: string, val: any) => {
    setIiTableRows(iiTableRows.map((row, i) => i === idx ? { ...row, [field]: val } : row));
  };

  const toggleSelectAllIiRows = (checked: boolean) => {
    setIiTableRows(iiTableRows.map(row => ({ ...row, selected: checked })));
  };

  const openAddIiModal = () => {
    setIiGroupForm('分液器部件');
    setIiSimilarCodeForm('');
    setIiSimilarSupplierCodeForm('');
    setIiSimilarSupplierNameForm('');
    setIiMaterialCodeForm('');
    setIiSupplierCodeForm('');
    setIiSupplierNameForm('');
    setIiTableRows([]);
    setShowAddIiModal(true);
  };

  const handleAddIi = (e: React.FormEvent) => {
    e.preventDefault();
    const activeRows = iiTableRows.filter(r => r.selected);
    if (activeRows.length === 0) {
      alert('请至少勾选或新增一项检验项目！');
      return;
    }
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newItems = activeRows.map(row => ({
      id: row.id || Date.now() + Math.random(),
      supplierCode: iiSupplierCodeForm || '101001',
      supplierName: iiSupplierNameForm || '苏州精工微电子',
      materialCode: iiMaterialCodeForm || '900000000002',
      itemCode: row.itemCode || 'ITEM-001',
      itemName: row.itemName || '新检验项目',
      standard: row.standard || '23.1-23.5',
      category: row.category || '常规',
      method: row.method || '手动输入',
      updateTime: nowTime,
      maintainer: '陈静'
    }));
    setInspectionItemList([...newItems, ...inspectionItemList]);
    setShowAddIiModal(false);
    alert('成功新增检验项目列表！');
  };

  const openEditIiModal = (item: any) => {
    setEditingIiItem(item);
    setIiGroupForm('分液器部件');
    setIiSimilarCodeForm('');
    setIiSimilarSupplierCodeForm('');
    setIiSimilarSupplierNameForm('');
    setIiMaterialCodeForm(item.materialCode || '900000000002');
    setIiSupplierCodeForm(item.supplierCode || '101001');
    setIiSupplierNameForm(item.supplierName || '苏州精工微电子');

    // Find related items matching same material code or supplier code
    const related = inspectionItemList.filter(i => i.materialCode === item.materialCode || i.supplierCode === item.supplierCode);
    if (related.length > 0) {
      setIiTableRows(related.map((row, idx) => ({
        id: row.id,
        selected: true,
        itemCode: row.itemCode,
        sortOrder: idx + 1,
        itemName: row.itemName,
        standard: row.standard || '23.1-23.5',
        category: row.category || '常规',
        method: row.method || '手动计量',
        isEnabled: true
      })));
    } else {
      setIiTableRows([{
        id: item.id,
        selected: true,
        itemCode: item.itemCode || 'ITEM-001',
        sortOrder: 1,
        itemName: item.itemName || '检验项目',
        standard: item.standard || '23.1-23.5',
        category: item.category || '常规',
        method: item.method || '手动计量',
        isEnabled: true
      }]);
    }
    setShowEditIiModal(true);
  };

  const handleSaveEditIi = (e: React.FormEvent) => {
    e.preventDefault();
    const activeRows = iiTableRows.filter(r => r.selected);
    if (activeRows.length === 0) {
      alert('请至少保留一项已勾选的检验项目！');
      return;
    }
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    // Remove old matching items and add updated items
    const oldMaterialCode = editingIiItem ? editingIiItem.materialCode : iiMaterialCodeForm;
    const remainingItems = inspectionItemList.filter(i => i.materialCode !== oldMaterialCode);

    const updatedItems = activeRows.map(row => ({
      id: row.id || Date.now() + Math.random(),
      supplierCode: iiSupplierCodeForm || '101001',
      supplierName: iiSupplierNameForm || '苏州精工微电子',
      materialCode: iiMaterialCodeForm || '900000000002',
      itemCode: row.itemCode || 'ITEM-001',
      itemName: row.itemName || '检验项目',
      standard: row.standard || '23.1-23.5',
      category: row.category || '常规',
      method: row.method || '手动输入',
      updateTime: nowTime,
      maintainer: '陈静'
    }));

    setInspectionItemList([...updatedItems, ...remainingItems].sort((a, b) => b.updateTime.localeCompare(a.updateTime)));
    setShowEditIiModal(false);
    alert('成功更新检验项目列表！');
  };

  const openDeleteIiModal = (item: any) => {
    setDeletingIiItem(item);
    setShowDeleteIiModal(true);
  };

  const handleConfirmDeleteIi = () => {
    if (deletingIiItem) {
      setInspectionItemList(inspectionItemList.filter(item => item.id !== deletingIiItem.id));
      setShowDeleteIiModal(false);
      alert(`检验项目【${deletingIiItem.itemCode} - ${deletingIiItem.itemName}】记录已被成功删除！`);
    }
  };

  const handleApplyIiChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeOldItem || !changeNewItem) {
      alert('请填写完整的变更原项目与新项目！');
      return;
    }
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setInspectionItemList(inspectionItemList.map(item => {
      if (item.itemName.includes(changeOldItem) || item.itemCode.includes(changeOldItem)) {
        return {
          ...item,
          itemName: changeNewItem,
          standard: changeNewStandard || item.standard,
          updateTime: nowTime,
          maintainer: '陈静'
        };
      }
      return item;
    }));
    setShowIiChangeModal(false);
    alert(`已批量将【${changeOldItem}】变更替换为【${changeNewItem}】！`);
  };

  // Sampling Plan (基础管理 -> 抽样方案) states & handlers
  const [spTestPlanFilter, setSpTestPlanFilter] = useState('');
  const [spAqlFilter, setSpAqlFilter] = useState('');
  const [samplingPlanList, setSamplingPlanList] = useState(INITIAL_SAMPLING_PLAN_LIST);
  const [spCurrentPage, setSpCurrentPage] = useState(1);
  const [spJumpPage, setSpJumpPage] = useState('1');
  const spPageSize = 10;
  const totalSpCount = samplingPlanList.length;
  const totalSpPages = Math.max(1, Math.ceil(totalSpCount / spPageSize));
  const currentSpList = samplingPlanList.slice((spCurrentPage - 1) * spPageSize, spCurrentPage * spPageSize);

  const [showAddSpModal, setShowAddSpModal] = useState(false);
  const [showEditSpModal, setShowEditSpModal] = useState(false);
  const [showDeleteSpModal, setShowDeleteSpModal] = useState(false);
  const [editingSpItem, setEditingSpItem] = useState<any>(null);
  const [deletingSpItem, setDeletingSpItem] = useState<any>(null);

  // Form states for 抽样方案 Add/Edit Modal (cleared when adding per user instruction)
  const [spSamplingSchemeForm, setSpSamplingSchemeForm] = useState('');
  const [spTestPlanForm, setSpTestPlanForm] = useState('');
  const [spAqlForm, setSpAqlForm] = useState('');
  const [spQtyMaxForm, setSpQtyMaxForm] = useState<number | string>('');
  const [spQtyMinForm, setSpQtyMinForm] = useState<number | string>('');
  const [spSampleQtyForm, setSpSampleQtyForm] = useState<number | string>('');
  const [spStrictSampleQtyForm, setSpStrictSampleQtyForm] = useState<number | string>('');

  const handleSearchSp = () => {
    let filtered = INITIAL_SAMPLING_PLAN_LIST;
    if (spTestPlanFilter) {
      filtered = filtered.filter(i => i.testPlan === spTestPlanFilter);
    }
    if (spAqlFilter) {
      filtered = filtered.filter(i => i.aql === spAqlFilter);
    }
    setSamplingPlanList(filtered);
    setSpCurrentPage(1);
    setSpJumpPage('1');
  };

  const handleResetSp = () => {
    setSpTestPlanFilter('');
    setSpAqlFilter('');
    setSamplingPlanList(INITIAL_SAMPLING_PLAN_LIST);
    setSpCurrentPage(1);
    setSpJumpPage('1');
  };

  const openAddSpModal = () => {
    // Completely clear all fields in Add Modal per user request
    setSpSamplingSchemeForm('');
    setSpTestPlanForm('');
    setSpAqlForm('');
    setSpQtyMaxForm('');
    setSpQtyMinForm('');
    setSpSampleQtyForm('');
    setSpStrictSampleQtyForm('');
    setShowAddSpModal(true);
  };

  const handleAddSp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spSamplingSchemeForm) {
      alert('请选择抽样方案！');
      return;
    }
    if (!spTestPlanForm) {
      alert('请选择检验方案！');
      return;
    }
    if (!spAqlForm) {
      alert('请选择AQL！');
      return;
    }
    if (spQtyMinForm === '') {
      alert('请输入来货数量下限！');
      return;
    }
    if (spQtyMaxForm === '') {
      alert('请输入来货数量上限！');
      return;
    }
    if (spSampleQtyForm === '') {
      alert('请输入抽样数量！');
      return;
    }
    if (spStrictSampleQtyForm === '') {
      alert('请输入加严抽样数量！');
      return;
    }
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newItem = {
      id: Date.now(),
      samplingScheme: spSamplingSchemeForm,
      testPlan: spTestPlanForm,
      aql: spAqlForm,
      qtyMax: Number(spQtyMaxForm),
      qtyMin: Number(spQtyMinForm),
      sampleQty: Number(spSampleQtyForm),
      strictSampleQty: Number(spStrictSampleQtyForm),
      updateTime: nowTime,
      maintainer: '枫叶'
    };
    setSamplingPlanList([newItem, ...samplingPlanList].sort((a, b) => b.updateTime.localeCompare(a.updateTime)));
    setShowAddSpModal(false);
    setSpCurrentPage(1);
    setSpJumpPage('1');
    alert('成功新增抽样方案！');
  };

  const openEditSpModal = (item: any) => {
    setEditingSpItem(item);
    setSpSamplingSchemeForm(item.samplingScheme || 'I');
    setSpTestPlanForm(item.testPlan || 'S-3');
    setSpAqlForm(item.aql || '0');
    setSpQtyMaxForm(item.qtyMax);
    setSpQtyMinForm(item.qtyMin);
    setSpSampleQtyForm(item.sampleQty);
    setSpStrictSampleQtyForm(item.strictSampleQty);
    setShowEditSpModal(true);
  };

  const handleSaveEditSp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpItem) return;
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated = samplingPlanList.map(item => {
      if (item.id === editingSpItem.id) {
        return {
          ...item,
          samplingScheme: spSamplingSchemeForm,
          testPlan: spTestPlanForm,
          aql: spAqlForm,
          qtyMax: Number(spQtyMaxForm),
          qtyMin: Number(spQtyMinForm),
          sampleQty: Number(spSampleQtyForm),
          strictSampleQty: Number(spStrictSampleQtyForm),
          updateTime: nowTime,
          maintainer: '枫叶'
        };
      }
      return item;
    });
    setSamplingPlanList(updated.sort((a, b) => b.updateTime.localeCompare(a.updateTime)));
    setShowEditSpModal(false);
    alert('抽样方案修改成功！');
  };

  const openDeleteSpModal = (item: any) => {
    setDeletingSpItem(item);
    setShowDeleteSpModal(true);
  };

  const handleConfirmDeleteSp = () => {
    if (deletingSpItem) {
      setSamplingPlanList(samplingPlanList.filter(item => item.id !== deletingSpItem.id));
      setShowDeleteSpModal(false);
      alert(`抽样方案【${deletingSpItem.samplingScheme} - ${deletingSpItem.testPlan}】已被成功删除！`);
    }
  };

  // Data Dictionary (基础管理 -> 数据字典) states & handlers matching screenshot image_02518582.png
  const [dictNameFilter, setDictNameFilter] = useState('');
  const [dictCodeFilter, setDictCodeFilter] = useState('');
  const [dataDictionaryList, setDataDictionaryList] = useState(INITIAL_DATA_DICTIONARY_LIST);
  const [ddCurrentPage, setDdCurrentPage] = useState(1);
  const [ddJumpPage, setDdJumpPage] = useState('1');
  const ddPageSize = 10;
  const totalDdCount = dataDictionaryList.length;
  const totalDdPages = Math.max(1, Math.ceil(totalDdCount / ddPageSize));
  const currentDdList = dataDictionaryList.slice((ddCurrentPage - 1) * ddPageSize, ddCurrentPage * ddPageSize);

  const [showAddDdModal, setShowAddDdModal] = useState(false);
  const [showEditDdModal, setShowEditDdModal] = useState(false);
  const [showDeleteDdModal, setShowDeleteDdModal] = useState(false);
  const [editingDdItem, setEditingDdItem] = useState<any>(null);
  const [deletingDdItem, setDeletingDdItem] = useState<any>(null);

  // Form states for 数据字典 Add/Edit Modal (cleared when adding per user instruction)
  const [ddNameForm, setDdNameForm] = useState('');
  const [ddCodeForm, setDdCodeForm] = useState('');
  const createEmptyDdRows = () => [
    { id: 1, value: '', order: 1 },
    { id: 2, value: '', order: 2 },
    { id: 3, value: '', order: 3 },
    { id: 4, value: '', order: 4 },
    { id: 5, value: '', order: 5 },
  ];
  const [ddSubRows, setDdSubRows] = useState<any[]>(createEmptyDdRows());

  const addDdSubRow = (afterIndex?: number) => {
    const newRow = {
      id: Date.now() + Math.random(),
      value: '',
      order: ddSubRows.length + 1
    };
    if (typeof afterIndex === 'number' && afterIndex >= 0) {
      const updated = [...ddSubRows];
      updated.splice(afterIndex + 1, 0, newRow);
      setDdSubRows(updated.map((r, i) => ({ ...r, order: i + 1 })));
    } else {
      setDdSubRows([...ddSubRows, newRow]);
    }
  };

  const deleteDdSubRow = (index: number) => {
    const updated = ddSubRows.filter((_, i) => i !== index);
    if (updated.length === 0) {
      setDdSubRows([{ id: Date.now(), value: '', order: 1 }]);
    } else {
      setDdSubRows(updated.map((r, i) => ({ ...r, order: i + 1 })));
    }
  };

  const updateDdSubRow = (index: number, field: 'value' | 'order', val: any) => {
    const updated = [...ddSubRows];
    updated[index] = { ...updated[index], [field]: val };
    setDdSubRows(updated);
  };

  const handleSearchDd = () => {
    let filtered = INITIAL_DATA_DICTIONARY_LIST;
    if (dictNameFilter.trim()) {
      filtered = filtered.filter(i => i.dictName.includes(dictNameFilter.trim()));
    }
    if (dictCodeFilter.trim()) {
      filtered = filtered.filter(i => i.dictCode.toLowerCase().includes(dictCodeFilter.trim().toLowerCase()));
    }
    setDataDictionaryList(filtered);
    setDdCurrentPage(1);
    setDdJumpPage('1');
  };

  const handleResetDd = () => {
    setDictNameFilter('');
    setDictCodeFilter('');
    setDataDictionaryList(INITIAL_DATA_DICTIONARY_LIST);
    setDdCurrentPage(1);
    setDdJumpPage('1');
  };

  const openAddDdModal = () => {
    // Completely clear all fields in Add Modal per user request matching screenshot image_346263e6.png
    setDdNameForm('');
    setDdCodeForm('');
    setDdSubRows(createEmptyDdRows());
    setShowAddDdModal(true);
  };

  const handleAddDd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ddNameForm.trim()) {
      alert('请输入字典名称！');
      return;
    }
    if (!ddCodeForm.trim()) {
      alert('请输入字典code！');
      return;
    }
    const validValues = ddSubRows.map(r => (typeof r.value === 'string' ? r.value.trim() : '')).filter(Boolean);
    if (validValues.length === 0) {
      alert('请在检验规范表格中至少输入一个字典值！');
      return;
    }
    const joinedValue = validValues.join('/');
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newItem = {
      id: Date.now(),
      dictName: ddNameForm.trim(),
      dictCode: ddCodeForm.trim(),
      dictValue: joinedValue,
      updateTime: nowTime,
      maintainer: '枫叶'
    };
    setDataDictionaryList([newItem, ...dataDictionaryList].sort((a, b) => b.updateTime.localeCompare(a.updateTime)));
    setShowAddDdModal(false);
    setDdCurrentPage(1);
    setDdJumpPage('1');
    alert('成功新增数据字典！');
  };

  const openEditDdModal = (item: any) => {
    setEditingDdItem(item);
    setDdNameForm(item.dictName);
    setDdCodeForm(item.dictCode);
    const parsedValues = item.dictValue
      ? item.dictValue.split('/').map((s: string) => s.trim()).filter(Boolean)
      : [];
    if (parsedValues.length > 0) {
      setDdSubRows(parsedValues.map((v: string, idx: number) => ({
        id: idx + 1,
        value: v,
        order: idx + 1
      })));
    } else {
      setDdSubRows(createEmptyDdRows());
    }
    setShowEditDdModal(true);
  };

  const handleSaveEditDd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDdItem) return;
    if (!ddNameForm.trim()) {
      alert('请输入字典名称！');
      return;
    }
    if (!ddCodeForm.trim()) {
      alert('请输入字典code！');
      return;
    }
    const validValues = ddSubRows.map(r => (typeof r.value === 'string' ? r.value.trim() : '')).filter(Boolean);
    if (validValues.length === 0) {
      alert('请在检验规范表格中至少输入一个字典值！');
      return;
    }
    const joinedValue = validValues.join('/');
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated = dataDictionaryList.map(item => {
      if (item.id === editingDdItem.id) {
        return {
          ...item,
          dictName: ddNameForm.trim(),
          dictCode: ddCodeForm.trim(),
          dictValue: joinedValue,
          updateTime: nowTime,
          maintainer: '枫叶'
        };
      }
      return item;
    });
    setDataDictionaryList(updated.sort((a, b) => b.updateTime.localeCompare(a.updateTime)));
    setShowEditDdModal(false);
    alert('数据字典修改成功！');
  };

  const openDeleteDdModal = (item: any) => {
    setDeletingDdItem(item);
    setShowDeleteDdModal(true);
  };

  const handleConfirmDeleteDd = () => {
    if (deletingDdItem) {
      setDataDictionaryList(dataDictionaryList.filter(item => item.id !== deletingDdItem.id));
      setShowDeleteDdModal(false);
      alert(`数据字典【${deletingDdItem.dictName} - ${deletingDdItem.dictCode}】已被成功删除！`);
    }
  };

  // 资产管理 -> 设备管理 (matching screenshot image_5d52405f.png)
  const [assetManagementOpen, setAssetManagementOpen] = useState(true);
  const [eqCodeFilter, setEqCodeFilter] = useState('');
  const [eqNameFilter, setEqNameFilter] = useState('');
  const [eqModelFilter, setEqModelFilter] = useState('');
  const [equipmentList, setEquipmentList] = useState(INITIAL_EQUIPMENT_LIST);
  const [eqCurrentPage, setEqCurrentPage] = useState(1);
  const [eqJumpPage, setEqJumpPage] = useState('1');
  const eqPageSize = 10; // Strictly 10 per page as requested
  const totalEqCount = equipmentList.length;
  const totalEqPages = Math.max(1, Math.ceil(totalEqCount / eqPageSize));
  const currentEqList = equipmentList.slice((eqCurrentPage - 1) * eqPageSize, eqCurrentPage * eqPageSize);

  const [showAddEqModal, setShowAddEqModal] = useState(false);
  const [showEditEqModal, setShowEditEqModal] = useState(false);
  const [showDeleteEqModal, setShowDeleteEqModal] = useState(false);
  const [showImportEqModal, setShowImportEqModal] = useState(false);
  const [editingEqItem, setEditingEqItem] = useState<any>(null);
  const [deletingEqItem, setDeletingEqItem] = useState<any>(null);

  // Form states for Equipment Add/Edit (cleared on open per user standard)
  const [eqCategoryForm, setEqCategoryForm] = useState('');
  const [eqCodeForm, setEqCodeForm] = useState('');
  const [eqNameForm, setEqNameForm] = useState('');
  const [eqModelForm, setEqModelForm] = useState('');
  const [eqDepartmentForm, setEqDepartmentForm] = useState('');
  const [eqLocationForm, setEqLocationForm] = useState('');
  const [eqEnterDateForm, setEqEnterDateForm] = useState('');
  const [eqStatusForm, setEqStatusForm] = useState('在用');
  const [eqOwnerForm, setEqOwnerForm] = useState('');
  const [eqCalibrateDateForm, setEqCalibrateDateForm] = useState('');
  const [eqCalibratePeriodForm, setEqCalibratePeriodForm] = useState('180');

  const handleSearchEq = () => {
    let filtered = INITIAL_EQUIPMENT_LIST;
    if (eqCodeFilter.trim()) {
      filtered = filtered.filter(item => item.code.toLowerCase().includes(eqCodeFilter.trim().toLowerCase()));
    }
    if (eqNameFilter.trim()) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(eqNameFilter.trim().toLowerCase()));
    }
    if (eqModelFilter.trim()) {
      filtered = filtered.filter(item => item.model.toLowerCase().includes(eqModelFilter.trim().toLowerCase()));
    }
    setEquipmentList(filtered);
    setEqCurrentPage(1);
    setEqJumpPage('1');
  };

  const handleResetEq = () => {
    setEqCodeFilter('');
    setEqNameFilter('');
    setEqModelFilter('');
    setEquipmentList(INITIAL_EQUIPMENT_LIST);
    setEqCurrentPage(1);
    setEqJumpPage('1');
  };

  const openAddEqModal = () => {
    // Reset/clear all form fields
    setEqCategoryForm('');
    setEqCodeForm('');
    setEqNameForm('');
    setEqModelForm('');
    setEqDepartmentForm('');
    setEqLocationForm('');
    setEqEnterDateForm(new Date().toISOString().substring(0, 10));
    setEqStatusForm('在用');
    setEqOwnerForm('');
    setEqCalibrateDateForm(new Date().toISOString().substring(0, 10));
    setEqCalibratePeriodForm('180');
    setShowAddEqModal(true);
  };

  const handleAddEq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqNameForm.trim()) {
      alert('请输入设备名称！');
      return;
    }
    if (!eqCodeForm.trim()) {
      alert('请输入设备编码！');
      return;
    }
    const newItem = {
      id: Date.now(),
      category: eqCategoryForm.trim() || '通用检测仪',
      code: eqCodeForm.trim(),
      name: eqNameForm.trim(),
      model: eqModelForm.trim() || 'STD-01',
      department: eqDepartmentForm.trim() || '质检部',
      location: eqLocationForm.trim() || '1-1',
      enterDate: eqEnterDateForm.trim() || new Date().toISOString().substring(0, 10),
      status: eqStatusForm || '在用',
      owner: eqOwnerForm.trim() || '枫叶',
      calibrateDate: eqCalibrateDateForm.trim() || new Date().toISOString().substring(0, 10),
      calibratePeriod: parseInt(eqCalibratePeriodForm, 10) || 180,
    };
    setEquipmentList([newItem, ...equipmentList].sort((a, b) => b.enterDate.localeCompare(a.enterDate)));
    setShowAddEqModal(false);
    setEqCurrentPage(1);
    setEqJumpPage('1');
    alert(`成功新增检验设备【${newItem.name} (${newItem.code})】！`);
  };

  const openEditEqModal = (item: any) => {
    setEditingEqItem(item);
    setEqCategoryForm(item.category || '');
    setEqCodeForm(item.code || '');
    setEqNameForm(item.name || '');
    setEqModelForm(item.model || '');
    setEqDepartmentForm(item.department || '');
    setEqLocationForm(item.location || '');
    setEqEnterDateForm(item.enterDate || '');
    setEqStatusForm(item.status || '在用');
    setEqOwnerForm(item.owner || '');
    setEqCalibrateDateForm(item.calibrateDate || '');
    setEqCalibratePeriodForm(String(item.calibratePeriod || 180));
    setShowEditEqModal(true);
  };

  const handleSaveEditEq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEqItem) return;
    if (!eqNameForm.trim()) {
      alert('请输入设备名称！');
      return;
    }
    if (!eqCodeForm.trim()) {
      alert('请输入设备编码！');
      return;
    }
    const updated = equipmentList.map(item => {
      if (item.id === editingEqItem.id) {
        return {
          ...item,
          category: eqCategoryForm.trim() || item.category,
          code: eqCodeForm.trim(),
          name: eqNameForm.trim(),
          model: eqModelForm.trim() || item.model,
          department: eqDepartmentForm.trim() || item.department,
          location: eqLocationForm.trim() || item.location,
          enterDate: eqEnterDateForm.trim() || item.enterDate,
          status: eqStatusForm || item.status,
          owner: eqOwnerForm.trim() || item.owner,
          calibrateDate: eqCalibrateDateForm.trim() || item.calibrateDate,
          calibratePeriod: parseInt(eqCalibratePeriodForm, 10) || item.calibratePeriod,
        };
      }
      return item;
    });
    setEquipmentList(updated.sort((a, b) => b.enterDate.localeCompare(a.enterDate)));
    setShowEditEqModal(false);
    alert('检验设备信息修改成功！');
  };

  const openDeleteEqModal = (item: any) => {
    setDeletingEqItem(item);
    setShowDeleteEqModal(true);
  };

  const handleConfirmDeleteEq = () => {
    if (deletingEqItem) {
      setEquipmentList(equipmentList.filter(item => item.id !== deletingEqItem.id));
      setShowDeleteEqModal(false);
      alert(`设备【${deletingEqItem.name} - ${deletingEqItem.code}】已被成功删除！`);
    }
  };

  // 分析报表 -> 物料组分析 (matching screenshot image_dd3e37eb.png)
  const [reportOpen, setReportOpen] = useState(true);
  const [perfManagementOpen, setPerfManagementOpen] = useState(true);
  const [mgStartDate, setMgStartDate] = useState('2026-09-20');
  const [mgEndDate, setMgEndDate] = useState('2026-10-20');
  const [mgSelectedGroup, setMgSelectedGroup] = useState('');
  const [materialGroupReportList, setMaterialGroupReportList] = useState(INITIAL_MATERIAL_GROUP_REPORT_DATA);
  const [mgExportNotification, setMgExportNotification] = useState<string | null>(null);

  const handleSearchMgReport = () => {
    let filtered = INITIAL_MATERIAL_GROUP_REPORT_DATA;
    if (mgSelectedGroup.trim()) {
      filtered = filtered.filter(item => item.group === mgSelectedGroup.trim());
    }
    if (mgStartDate) {
      filtered = filtered.filter(item => item.inspectDate >= mgStartDate);
    }
    if (mgEndDate) {
      filtered = filtered.filter(item => item.inspectDate <= mgEndDate);
    }
    setMaterialGroupReportList(filtered);
  };

  const handleResetMgReport = () => {
    setMgStartDate('2026-09-20');
    setMgEndDate('2026-10-20');
    setMgSelectedGroup('');
    setMaterialGroupReportList(INITIAL_MATERIAL_GROUP_REPORT_DATA);
  };

  const handleExportMgReport = () => {
    setMgExportNotification(`已成功导出【物料组合格率分析报表_${new Date().toISOString().slice(0, 10)}.xlsx】，共 ${materialGroupReportList.length} 条统计记录。`);
    setTimeout(() => {
      setMgExportNotification(null);
    }, 3500);
  };

  // 分析报表 -> 供应商分析 (matching screenshot image_2b105fe3.png)
  const [supStartDate, setSupStartDate] = useState('2026-09-20');
  const [supEndDate, setSupEndDate] = useState('2026-10-20');
  const [supSelectedAbbr, setSupSelectedAbbr] = useState('');
  const [supplierReportList, setSupplierReportList] = useState(INITIAL_SUPPLIER_REPORT_DATA);
  const [supExportNotification, setSupExportNotification] = useState<string | null>(null);

  const handleSearchSupReport = () => {
    let filtered = INITIAL_SUPPLIER_REPORT_DATA;
    if (supSelectedAbbr.trim()) {
      filtered = filtered.filter(item => item.supplier.includes(supSelectedAbbr.trim()) || item.code.includes(supSelectedAbbr.trim()));
    }
    if (supStartDate) {
      filtered = filtered.filter(item => item.inspectDate >= supStartDate);
    }
    if (supEndDate) {
      filtered = filtered.filter(item => item.inspectDate <= supEndDate);
    }
    setSupplierReportList(filtered);
  };

  const handleResetSupReport = () => {
    setSupStartDate('2026-09-20');
    setSupEndDate('2026-10-20');
    setSupSelectedAbbr('');
    setSupplierReportList(INITIAL_SUPPLIER_REPORT_DATA);
  };

  const handleExportSupReport = () => {
    setSupExportNotification(`已成功导出【供应商合格率分析报表_${new Date().toISOString().slice(0, 10)}.xlsx】，共 ${supplierReportList.length} 条统计记录。`);
    setTimeout(() => {
      setSupExportNotification(null);
    }, 3500);
  };

  // 分析报表 -> 合格率分析
  const [prStartDate, setPrStartDate] = useState('2026-09-20');
  const [prEndDate, setPrEndDate] = useState('2026-10-20');
  const [prSelectedCategory, setPrSelectedCategory] = useState('');
  const [passRateReportList, setPassRateReportList] = useState(INITIAL_PASS_RATE_REPORT_DATA);
  const [prExportNotification, setPrExportNotification] = useState<string | null>(null);

  const handleSearchPrReport = () => {
    let filtered = INITIAL_PASS_RATE_REPORT_DATA;
    if (prSelectedCategory.trim()) {
      filtered = filtered.filter(item => item.category.includes(prSelectedCategory.trim()));
    }
    if (prStartDate) {
      filtered = filtered.filter(item => item.inspectDate >= prStartDate);
    }
    if (prEndDate) {
      filtered = filtered.filter(item => item.inspectDate <= prEndDate);
    }
    setPassRateReportList(filtered);
  };

  const handleResetPrReport = () => {
    setPrStartDate('2026-09-20');
    setPrEndDate('2026-10-20');
    setPrSelectedCategory('');
    setPassRateReportList(INITIAL_PASS_RATE_REPORT_DATA);
  };

  const handleExportPrReport = () => {
    setPrExportNotification(`已成功导出【合格率分析报表_${new Date().toISOString().slice(0, 10)}.xlsx】，共 ${passRateReportList.length} 条统计记录。`);
    setTimeout(() => {
      setPrExportNotification(null);
    }, 3500);
  };

  // 绩效管理 -> 检验员及时性
  const [itStartDate, setItStartDate] = useState('2026-09-20');
  const [itEndDate, setItEndDate] = useState('2026-10-20');
  const [itInspectorName, setItInspectorName] = useState('');
  const [inspectorTimelinessList, setInspectorTimelinessList] = useState(INITIAL_INSPECTOR_TIMELINESS_LIST);
  const [itCurrentPage, setItCurrentPage] = useState(1);
  const [itJumpPage, setItJumpPage] = useState('1');
  const itPageSize = 10;
  const totalItCount = inspectorTimelinessList.length;
  const totalItPages = Math.max(1, Math.ceil(totalItCount / itPageSize));
  const currentItList = inspectorTimelinessList.slice((itCurrentPage - 1) * itPageSize, itCurrentPage * itPageSize);
  const [itExportNotification, setItExportNotification] = useState<string | null>(null);

  const handleSearchItReport = () => {
    let filtered = INITIAL_INSPECTOR_TIMELINESS_LIST;
    if (itInspectorName.trim()) {
      filtered = filtered.filter(item => item.name.includes(itInspectorName.trim()));
    }
    if (itStartDate) {
      filtered = filtered.filter(item => item.inspectDate >= itStartDate);
    }
    if (itEndDate) {
      filtered = filtered.filter(item => item.inspectDate <= itEndDate);
    }
    setInspectorTimelinessList(filtered);
    setItCurrentPage(1);
    setItJumpPage('1');
  };

  const handleResetItReport = () => {
    setItStartDate('2026-09-20');
    setItEndDate('2026-10-20');
    setItInspectorName('');
    setInspectorTimelinessList(INITIAL_INSPECTOR_TIMELINESS_LIST);
    setItCurrentPage(1);
    setItJumpPage('1');
  };

  const handleExportItReport = () => {
    setItExportNotification(`已成功导出【检验员及时性考核报表_${new Date().toISOString().slice(0, 10)}.xlsx】，共 ${inspectorTimelinessList.length} 条统计记录。`);
    setTimeout(() => {
      setItExportNotification(null);
    }, 3500);
  };

  // 权限管理 -> 用户管理
  const [permissionManagementOpen, setPermissionManagementOpen] = useState(true);
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userManagementList, setUserManagementList] = useState(INITIAL_USER_MANAGEMENT_LIST);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userJumpPage, setUserJumpPage] = useState('1');
  const userPageSize = 10;
  const filteredUserList = userManagementList.filter(item => {
    if (!userRoleFilter.trim()) return true;
    return item.account.includes(userRoleFilter.trim()) || item.name.includes(userRoleFilter.trim()) || item.inspectorCode.includes(userRoleFilter.trim());
  });
  const totalUserCount = filteredUserList.length;
  const totalUserPages = Math.max(1, Math.ceil(totalUserCount / userPageSize));
  const currentUserList = filteredUserList.slice((userCurrentPage - 1) * userPageSize, userCurrentPage * userPageSize);

  const handleSearchUser = () => {
    setUserCurrentPage(1);
  };

  const handleResetUser = () => {
    setUserRoleFilter('');
    setUserCurrentPage(1);
  };

  // User Modal States & Form Fields
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [editingUserItem, setEditingUserItem] = useState<any>(null);
  const [deletingUserItem, setDeletingUserItem] = useState<any>(null);

  const [uAccount, setUAccount] = useState('');
  const [uName, setUName] = useState('');
  const [uDepartment, setUDepartment] = useState('质检部');
  const [uUserRole, setUUserRole] = useState('IQC检验员');
  const [uSignRole, setUSignRole] = useState('外检组長');
  const [uInspectorCode, setUInspectorCode] = useState('');
  const [uInspectionCategory, setUInspectionCategory] = useState('IQC');
  const [uDispatchOrder, setUDispatchOrder] = useState('1');
  const [uIp, setUIp] = useState('192.168.1.101');
  const [uEmail, setUEmail] = useState('');
  const [uPassword, setUPassword] = useState('');
  const [uAutoDispatch, setUAutoDispatch] = useState('是');
  const [uMaterialGroup, setUMaterialGroup] = useState('电子元器件组');
  const [uWorkStatus, setUWorkStatus] = useState('在岗');
  const [uLeaveStart, setULeaveStart] = useState('');
  const [uLeaveEnd, setULeaveEnd] = useState('');

  const handleOpenAddUser = () => {
    setUAccount('');
    setUName('');
    setUDepartment('质检部');
    setUUserRole('IQC检验员');
    setUSignRole('外检组长');
    setUInspectorCode('');
    setUInspectionCategory('IQC');
    setUDispatchOrder('1');
    setUIp('192.168.1.101');
    setUEmail('');
    setUPassword('');
    setUAutoDispatch('是');
    setUMaterialGroup('电子元器件组');
    setUWorkStatus('在岗');
    setULeaveStart('');
    setULeaveEnd('');
    setShowAddUserModal(true);
  };

  const handleOpenEditUser = (item: any) => {
    setEditingUserItem(item);
    setUAccount(item.account);
    setUName(item.name);
    setUDepartment(item.department);
    setUUserRole(item.userRole);
    setUSignRole(item.signRole);
    setUInspectorCode(item.inspectorCode);
    setUInspectionCategory(item.inspectionCategory || 'IQC');
    setUDispatchOrder(String(item.dispatchOrder));
    setUIp(item.ip);
    setUEmail(item.email);
    setUPassword('******');
    setUAutoDispatch(item.autoDispatch);
    setUMaterialGroup(item.materialGroup);
    setUWorkStatus(item.workStatus || '在岗');
    setULeaveStart(item.leaveStart === '—' ? '' : item.leaveStart);
    setULeaveEnd(item.leaveEnd === '—' ? '' : item.leaveEnd);
    setShowEditUserModal(true);
  };

  const handleOpenDeleteUser = (item: any) => {
    setDeletingUserItem(item);
    setShowDeleteUserModal(true);
  };

  const handleConfirmAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      enabled: true,
      account: uAccount || String(10000 + userManagementList.length + 1),
      name: uName || '新用户',
      department: uDepartment,
      dispatchOrder: parseInt(uDispatchOrder, 10) || 1,
      signRole: uSignRole,
      userRole: uUserRole,
      inspectorCode: uInspectorCode || `QC${String(userManagementList.length + 1).padStart(3, '0')}`,
      autoDispatch: uAutoDispatch,
      materialGroup: uMaterialGroup,
      ip: uIp,
      email: uEmail || `${uAccount || 'user'}@company.com`,
      leaveStart: uLeaveStart || '—',
      leaveEnd: uLeaveEnd || '—',
      operator: '张伟',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setUserManagementList([newUser, ...userManagementList]);
    setShowAddUserModal(false);
  };

  const handleConfirmEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserItem) return;
    setUserManagementList(userManagementList.map(u => u.id === editingUserItem.id ? {
      ...u,
      account: uAccount,
      name: uName,
      department: uDepartment,
      dispatchOrder: parseInt(uDispatchOrder, 10) || 1,
      signRole: uSignRole,
      userRole: uUserRole,
      inspectorCode: uInspectorCode,
      autoDispatch: uAutoDispatch,
      materialGroup: uMaterialGroup,
      ip: uIp,
      email: uEmail,
      leaveStart: uLeaveStart || '—',
      leaveEnd: uLeaveEnd || '—',
      operator: '李娜',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
    } : u));
    setShowEditUserModal(false);
  };

  const handleConfirmDeleteUser = () => {
    if (!deletingUserItem) return;
    setUserManagementList(userManagementList.filter(u => u.id !== deletingUserItem.id));
    setShowDeleteUserModal(false);
    setDeletingUserItem(null);
  };

  // 权限管理 -> 角色管理
  const [roleNameFilter, setRoleNameFilter] = useState('');
  const [roleManagementList, setRoleManagementList] = useState(INITIAL_ROLE_MANAGEMENT_LIST);
  const [roleCurrentPage, setRoleCurrentPage] = useState(1);
  const [roleJumpPage, setRoleJumpPage] = useState('1');
  const rolePageSize = 10;
  const filteredRoleList = roleManagementList.filter(item => {
    if (!roleNameFilter.trim()) return true;
    return item.roleName.includes(roleNameFilter.trim()) || item.roleCode.includes(roleNameFilter.trim());
  });
  const totalRoleCount = filteredRoleList.length;
  const totalRolePages = Math.max(1, Math.ceil(totalRoleCount / rolePageSize));
  const currentRoleList = filteredRoleList.slice((roleCurrentPage - 1) * rolePageSize, roleCurrentPage * rolePageSize);

  const handleSearchRole = () => {
    setRoleCurrentPage(1);
  };
  const handleResetRole = () => {
    setRoleNameFilter('');
    setRoleCurrentPage(1);
  };

  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
  const [editingRoleItem, setEditingRoleItem] = useState<any>(null);
  const [deletingRoleItem, setDeletingRoleItem] = useState<any>(null);

  const [rCode, setRCode] = useState('');
  const [rName, setRName] = useState('');
  const [rDesc, setRDesc] = useState('');
  const [rPermissions, setRPermissions] = useState('全部权限 / 检验 / 审核 / 报表');

  const handleOpenAddRole = () => {
    setRCode(`ROLE_${Date.now().toString().slice(-4)}`);
    setRName('');
    setRDesc('');
    setRPermissions('全部权限 / 检验 / 审核 / 报表');
    setShowAddRoleModal(true);
  };

  const handleConfirmAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    const newRole = {
      id: Date.now(),
      enabled: true,
      roleCode: rCode || `ROLE_${roleManagementList.length + 1}`,
      roleName: rName || '新业务角色',
      roleDesc: rDesc || '新添加的系统业务角色描述信息',
      permissions: rPermissions,
      operator: '张伟',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setRoleManagementList([newRole, ...roleManagementList]);
    setShowAddRoleModal(false);
  };

  const handleOpenEditRole = (item: any) => {
    setEditingRoleItem(item);
    setRCode(item.roleCode);
    setRName(item.roleName);
    setRDesc(item.roleDesc);
    setRPermissions(item.permissions);
    setShowEditRoleModal(true);
  };

  const handleConfirmEditRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoleItem) return;
    setRoleManagementList(roleManagementList.map(r => r.id === editingRoleItem.id ? {
      ...r,
      roleCode: rCode,
      roleName: rName,
      roleDesc: rDesc,
      permissions: rPermissions,
      operator: '李娜',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
    } : r));
    setShowEditRoleModal(false);
  };

  const handleOpenDeleteRole = (item: any) => {
    setDeletingRoleItem(item);
    setShowDeleteRoleModal(true);
  };

  const handleConfirmDeleteRole = () => {
    if (!deletingRoleItem) return;
    setRoleManagementList(roleManagementList.filter(r => r.id !== deletingRoleItem.id));
    setShowDeleteRoleModal(false);
    setDeletingRoleItem(null);
  };

  // 权限管理 -> 邮件组管理
  const [emailGroupCodeFilter, setEmailGroupCodeFilter] = useState('');
  const [emailGroupNameFilter, setEmailGroupNameFilter] = useState('');
  const [emailGroupManagementList, setEmailGroupManagementList] = useState(INITIAL_EMAIL_GROUP_LIST);
  const [emailGroupCurrentPage, setEmailGroupCurrentPage] = useState(1);
  const [emailGroupJumpPage, setEmailGroupJumpPage] = useState('1');
  const emailGroupPageSize = 10;

  const filteredEmailGroupList = emailGroupManagementList.filter(item => {
    if (emailGroupCodeFilter.trim() && !item.groupCode.includes(emailGroupCodeFilter.trim())) return false;
    if (emailGroupNameFilter.trim() && !item.groupName.includes(emailGroupNameFilter.trim())) return false;
    return true;
  });
  const totalEmailGroupCount = filteredEmailGroupList.length;
  const totalEmailGroupPages = Math.max(1, Math.ceil(totalEmailGroupCount / emailGroupPageSize));
  const currentEmailGroupList = filteredEmailGroupList.slice((emailGroupCurrentPage - 1) * emailGroupPageSize, emailGroupCurrentPage * emailGroupPageSize);

  const handleSearchEmailGroup = () => {
    setEmailGroupCurrentPage(1);
  };
  const handleResetEmailGroup = () => {
    setEmailGroupCodeFilter('');
    setEmailGroupNameFilter('');
    setEmailGroupCurrentPage(1);
  };

  const [showAddEmailGroupModal, setShowAddEmailGroupModal] = useState(false);
  const [showEditEmailGroupModal, setShowEditEmailGroupModal] = useState(false);
  const [showDeleteEmailGroupModal, setShowDeleteEmailGroupModal] = useState(false);
  const [editingEmailGroupItem, setEditingEmailGroupItem] = useState<any>(null);
  const [deletingEmailGroupItem, setDeletingEmailGroupItem] = useState<any>(null);

  const [egCode, setEgCode] = useState('');
  const [egName, setEgName] = useState('');
  const [egDesc, setEgDesc] = useState('');

  const handleOpenAddEmailGroup = () => {
    setEgCode(`A0${emailGroupManagementList.length + 1}`);
    setEgName('');
    setEgDesc('');
    setShowAddEmailGroupModal(true);
  };

  const handleConfirmAddEmailGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const newGroup = {
      id: Date.now(),
      groupCode: egCode || `A0${emailGroupManagementList.length + 1}`,
      groupName: egName || '新建邮件组',
      groupDesc: egDesc || '新建邮件组通知说明',
      operator: '张伟',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setEmailGroupManagementList([newGroup, ...emailGroupManagementList]);
    setShowAddEmailGroupModal(false);
  };

  const handleOpenEditEmailGroup = (item: any) => {
    setEditingEmailGroupItem(item);
    setEgCode(item.groupCode);
    setEgName(item.groupName);
    setEgDesc(item.groupDesc);
    setShowEditEmailGroupModal(true);
  };

  const handleConfirmEditEmailGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmailGroupItem) return;
    setEmailGroupManagementList(emailGroupManagementList.map(g => g.id === editingEmailGroupItem.id ? {
      ...g,
      groupCode: egCode,
      groupName: egName,
      groupDesc: egDesc,
      operator: '李娜',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
    } : g));
    setShowEditEmailGroupModal(false);
  };

  const handleOpenDeleteEmailGroup = (item: any) => {
    setDeletingEmailGroupItem(item);
    setShowDeleteEmailGroupModal(true);
  };

  const handleConfirmDeleteEmailGroup = () => {
    if (!deletingEmailGroupItem) return;
    setEmailGroupManagementList(emailGroupManagementList.filter(g => g.id !== deletingEmailGroupItem.id));
    setShowDeleteEmailGroupModal(false);
    setDeletingEmailGroupItem(null);
  };

  // 权限管理 -> 自动派单设置
  const [autoDispatchMaterialFilter, setAutoDispatchMaterialFilter] = useState('');
  const [autoDispatchManagementList, setAutoDispatchManagementList] = useState(INITIAL_AUTO_DISPATCH_LIST);
  const [autoDispatchCurrentPage, setAutoDispatchCurrentPage] = useState(1);
  const [autoDispatchJumpPage, setAutoDispatchJumpPage] = useState('1');
  const [autoDispatchSelectedIds, setAutoDispatchSelectedIds] = useState<number[]>([]);
  const autoDispatchPageSize = 10;

  const filteredAutoDispatchList = autoDispatchManagementList.filter(item => {
    if (autoDispatchMaterialFilter.trim() && !item.materialGroup.includes(autoDispatchMaterialFilter.trim())) return false;
    return true;
  });

  const totalAutoDispatchCount = filteredAutoDispatchList.length;
  const totalAutoDispatchPages = Math.max(1, Math.ceil(totalAutoDispatchCount / autoDispatchPageSize));
  const currentAutoDispatchList = filteredAutoDispatchList.slice((autoDispatchCurrentPage - 1) * autoDispatchPageSize, autoDispatchCurrentPage * autoDispatchPageSize);

  const handleSearchAutoDispatch = () => {
    setAutoDispatchCurrentPage(1);
  };

  const handleResetAutoDispatch = () => {
    setAutoDispatchMaterialFilter('');
    setAutoDispatchCurrentPage(1);
  };

  const handleToggleAutoDispatchItem = (id: number) => {
    setAutoDispatchManagementList(autoDispatchManagementList.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  const handleToggleSelectAutoDispatch = (id: number) => {
    if (autoDispatchSelectedIds.includes(id)) {
      setAutoDispatchSelectedIds(autoDispatchSelectedIds.filter(i => i !== id));
    } else {
      setAutoDispatchSelectedIds([...autoDispatchSelectedIds, id]);
    }
  };

  const handleSelectAllAutoDispatch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setAutoDispatchSelectedIds(currentAutoDispatchList.map(item => item.id));
    } else {
      setAutoDispatchSelectedIds([]);
    }
  };

  const handleBatchEnableAutoDispatch = () => {
    if (autoDispatchSelectedIds.length === 0) return;
    setAutoDispatchManagementList(autoDispatchManagementList.map(item => autoDispatchSelectedIds.includes(item.id) ? { ...item, enabled: true } : item));
    setAutoDispatchSelectedIds([]);
  };

  const handleBatchDisableAutoDispatch = () => {
    if (autoDispatchSelectedIds.length === 0) return;
    setAutoDispatchManagementList(autoDispatchManagementList.map(item => autoDispatchSelectedIds.includes(item.id) ? { ...item, enabled: false } : item));
    setAutoDispatchSelectedIds([]);
  };

  // 帮助中心 / 意见反馈
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);
  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK_LIST);
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState('');
  const [feedbackKeyword, setFeedbackKeyword] = useState('');
  const [feedbackCurrentPage, setFeedbackCurrentPage] = useState(1);
  const [feedbackJumpPage, setFeedbackJumpPage] = useState('1');
  const feedbackPageSize = 10;

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [newFeedbackType, setNewFeedbackType] = useState('功能建议');
  const [newFeedbackTitle, setNewFeedbackTitle] = useState('');
  const [newFeedbackContent, setNewFeedbackContent] = useState('');
  const [newFeedbackContact, setNewFeedbackContact] = useState('');

  const filteredFeedbackList = feedbackList.filter(item => {
    if (feedbackTypeFilter && item.type !== feedbackTypeFilter) return false;
    if (feedbackKeyword.trim() && !item.title.includes(feedbackKeyword.trim()) && !item.content.includes(feedbackKeyword.trim())) return false;
    return true;
  });

  const totalFeedbackCount = filteredFeedbackList.length;
  const totalFeedbackPages = Math.max(1, Math.ceil(totalFeedbackCount / feedbackPageSize));
  const currentFeedbackList = filteredFeedbackList.slice((feedbackCurrentPage - 1) * feedbackPageSize, feedbackCurrentPage * feedbackPageSize);

  const handleSearchFeedback = () => {
    setFeedbackCurrentPage(1);
  };

  const handleResetFeedback = () => {
    setFeedbackTypeFilter('');
    setFeedbackKeyword('');
    setFeedbackCurrentPage(1);
  };

  const handleOpenAddFeedback = () => {
    setNewFeedbackType('功能建议');
    setNewFeedbackTitle('');
    setNewFeedbackContent('');
    setNewFeedbackContact('张伟 / 13800138888');
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackTitle.trim() || !newFeedbackContent.trim()) {
      alert('请填写反馈标题和详细内容！');
      return;
    }
    const item = {
      id: Date.now(),
      type: newFeedbackType,
      title: newFeedbackTitle,
      content: newFeedbackContent,
      operator: '张伟',
      contact: newFeedbackContact || '13800138888',
      status: '待处理',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setFeedbackList([item, ...feedbackList]);
    setShowFeedbackModal(false);
    alert('意见反馈提交成功，感谢您的宝贵建议！');
  };



  const handleExportEq = () => {
    const headers = ['序号', '设备类别', '设备编码', '设备名称', '设备型号', '使用单位', '摆放位置', '入厂时间', '状态', '归属人', '校对时间', '校对周期/天'];
    const rows = equipmentList.map((item, idx) => [
      idx + 1,
      item.category,
      item.code,
      item.name,
      item.model,
      item.department,
      item.location,
      item.enterDate,
      item.status,
      item.owner,
      item.calibrateDate,
      item.calibratePeriod
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `检验设备管理_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportEq = () => {
    setShowImportEqModal(true);
  };

  // Supplier Modals
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showEditSupplierModal, setShowEditSupplierModal] = useState(false);
  const [showDeleteSupplierModal, setShowDeleteSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<any>(null);

  // Form states for supplier
  const [suppFormCode, setSuppFormCode] = useState('');
  const [suppFormAbbr, setSuppFormAbbr] = useState('');
  const [suppFormFullName, setSuppFormFullName] = useState('');

  const handleSearchSupplier = () => {
    let filtered = INITIAL_SUPPLIER_LIST;
    if (supplierCodeFilter.trim()) {
      filtered = filtered.filter(s => s.code.includes(supplierCodeFilter.trim()));
    }
    if (supplierAbbrFilter.trim()) {
      filtered = filtered.filter(s => s.abbr.includes(supplierAbbrFilter.trim()));
    }
    setSupplierList(filtered);
  };

  const handleResetSupplier = () => {
    setSupplierCodeFilter('');
    setSupplierAbbrFilter('');
    setSupplierList(INITIAL_SUPPLIER_LIST);
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupp = {
      id: Date.now(),
      code: suppFormCode || `101${Math.floor(Math.random() * 800 + 100)}`,
      abbr: suppFormAbbr,
      fullName: suppFormFullName,
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updater: '陈静',
    };
    setSupplierList([newSupp, ...supplierList]);
    setShowAddSupplierModal(false);
    alert('新增供应商成功！');
  };

  const openEditSupplier = (item: any) => {
    setEditingSupplier(item);
    setSuppFormCode(item.code);
    setSuppFormAbbr(item.abbr);
    setSuppFormFullName(item.fullName);
    setShowEditSupplierModal(true);
  };

  const handleSaveEditSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      setSupplierList(supplierList.map(s => s.id === editingSupplier.id ? { ...s, code: suppFormCode, abbr: suppFormAbbr, fullName: suppFormFullName, updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19), updater: '陈静' } : s));
    }
    setShowEditSupplierModal(false);
    alert('供应商信息修改成功！');
  };

  const openDeleteSupplierModal = (item: any) => {
    setDeletingSupplier(item);
    setShowDeleteSupplierModal(true);
  };

  const handleConfirmDeleteSupplier = () => {
    if (deletingSupplier) {
      setSupplierList(supplierList.filter(s => s.id !== deletingSupplier.id));
      setShowDeleteSupplierModal(false);
      alert(`供应商【${deletingSupplier.abbr}】记录已被成功作废删除！`);
    }
  };

  // Designated Material (定点物料信息) states
  const [spotSupplierCodeFilter, setSpotSupplierCodeFilter] = useState('');
  const [spotSupplierAbbrFilter, setSpotSupplierAbbrFilter] = useState('');
  const [spotMaterialCodeFilter, setSpotMaterialCodeFilter] = useState('');
  const [spotMaterialNameFilter, setSpotMaterialNameFilter] = useState('');
  const [spotMaterialList, setSpotMaterialList] = useState(INITIAL_SPOT_MATERIAL_LIST);

  // Spot Material Modals
  const [showAddSpotModal, setShowAddSpotModal] = useState(false);
  const [showEditSpotModal, setShowEditSpotModal] = useState(false);
  const [showDeleteSpotModal, setShowDeleteSpotModal] = useState(false);
  const [editingSpotMaterial, setEditingSpotMaterial] = useState<any>(null);
  const [deletingSpotMaterial, setDeletingSpotMaterial] = useState<any>(null);

  // Spot Material Form states
  const [spotFormSupplierCode, setSpotFormSupplierCode] = useState('');
  const [spotFormSupplierName, setSpotFormSupplierName] = useState('');
  const [spotFormMaterialCode, setSpotFormMaterialCode] = useState('');
  const [spotFormMaterialName, setSpotFormMaterialName] = useState('');
  const [spotFormDrawingNo, setSpotFormDrawingNo] = useState('');
  const [spotFormSpec, setSpotFormSpec] = useState('');
  const [spotFormIsConsumable, setSpotFormIsConsumable] = useState('否');
  const [spotFormConsumableType, setSpotFormConsumableType] = useState('—');
  const [spotFormConsumableQty, setSpotFormConsumableQty] = useState('—');
  const [spotFormConsumableStartTime, setSpotFormConsumableStartTime] = useState('—');
  const [spotFormConsumableEndTime, setSpotFormConsumableEndTime] = useState('—');

  const handleSearchSpotMaterial = () => {
    let filtered = INITIAL_SPOT_MATERIAL_LIST;
    if (spotSupplierCodeFilter.trim()) {
      filtered = filtered.filter(item => item.supplierCode.includes(spotSupplierCodeFilter.trim()));
    }
    if (spotSupplierAbbrFilter.trim()) {
      filtered = filtered.filter(item => item.supplierName.includes(spotSupplierAbbrFilter.trim()));
    }
    if (spotMaterialCodeFilter.trim()) {
      filtered = filtered.filter(item => item.materialCode.includes(spotMaterialCodeFilter.trim()));
    }
    if (spotMaterialNameFilter.trim()) {
      filtered = filtered.filter(item => item.materialName.includes(spotMaterialNameFilter.trim()));
    }
    setSpotMaterialList(filtered);
  };

  const handleResetSpotMaterial = () => {
    setSpotSupplierCodeFilter('');
    setSpotSupplierAbbrFilter('');
    setSpotMaterialCodeFilter('');
    setSpotMaterialNameFilter('');
    setSpotMaterialList(INITIAL_SPOT_MATERIAL_LIST);
  };

  const openAddSpotModal = () => {
    setSpotFormSupplierCode('');
    setSpotFormSupplierName('');
    setSpotFormMaterialCode('');
    setSpotFormMaterialName('');
    setSpotFormDrawingNo('');
    setSpotFormSpec('');
    setSpotFormIsConsumable('否');
    setSpotFormConsumableType('');
    setSpotFormConsumableQty('');
    setSpotFormConsumableStartTime('');
    setSpotFormConsumableEndTime('');
    setShowAddSpotModal(true);
  };

  const handleAddSpotMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      supplierCode: spotFormSupplierCode || '101009',
      supplierName: spotFormSupplierName || '长电科技股份有限公司',
      materialCode: spotFormMaterialCode || `802008${Math.floor(Math.random() * 800 + 100)}`,
      materialName: spotFormMaterialName || '新增电子物料',
      drawingNo: spotFormDrawingNo || 'DWG-NEW-001',
      spec: spotFormSpec || '常规规格',
      isConsumable: spotFormIsConsumable || '否',
      consumableType: spotFormConsumableType || '—',
      consumableQty: spotFormConsumableQty || '—',
      consumableStartTime: spotFormConsumableStartTime || '—',
      consumableEndTime: spotFormConsumableEndTime || '—',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      maintainer: '陈静',
    };
    setSpotMaterialList([newItem, ...spotMaterialList]);
    setShowAddSpotModal(false);
    alert('新增物料清单提交成功！');
  };

  const openEditSpotModal = (item: any) => {
    setEditingSpotMaterial(item);
    setSpotFormSupplierCode(item.supplierCode || '');
    setSpotFormSupplierName(item.supplierName || '');
    setSpotFormMaterialCode(item.materialCode || '');
    setSpotFormMaterialName(item.materialName || '');
    setSpotFormDrawingNo(item.drawingNo || '');
    setSpotFormSpec(item.spec || '');
    setSpotFormIsConsumable(item.isConsumable || '否');
    setSpotFormConsumableType(item.consumableType || '');
    setSpotFormConsumableQty(item.consumableQty || '');
    setSpotFormConsumableStartTime(item.consumableStartTime || '');
    setSpotFormConsumableEndTime(item.consumableEndTime || '');
    setShowEditSpotModal(true);
  };

  const handleSaveEditSpotMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSpotMaterial) {
      setSpotMaterialList(spotMaterialList.map(item => item.id === editingSpotMaterial.id ? {
        ...item,
        supplierCode: spotFormSupplierCode,
        supplierName: spotFormSupplierName,
        materialCode: spotFormMaterialCode,
        materialName: spotFormMaterialName,
        drawingNo: spotFormDrawingNo,
        spec: spotFormSpec,
        isConsumable: spotFormIsConsumable,
        consumableType: spotFormConsumableType,
        consumableQty: spotFormConsumableQty,
        consumableStartTime: spotFormConsumableStartTime,
        consumableEndTime: spotFormConsumableEndTime,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        maintainer: '陈静'
      } : item));
    }
    setShowEditSpotModal(false);
    alert('物料清单修改成功！');
  };

  const openDeleteSpotModal = (item: any) => {
    setDeletingSpotMaterial(item);
    setShowDeleteSpotModal(true);
  };

  const handleConfirmDeleteSpotMaterial = () => {
    if (deletingSpotMaterial) {
      setSpotMaterialList(spotMaterialList.filter(item => item.id !== deletingSpotMaterial.id));
      setShowDeleteSpotModal(false);
      alert(`物料【${deletingSpotMaterial.materialCode} - ${deletingSpotMaterial.materialName}】定点记录已被成功作废删除！`);
    }
  };

  // Inspection Maintenance states
  const [showInspectionMaintenance, setShowInspectionMaintenance] = useState(false);
  const [currentInspectItem, setCurrentInspectItem] = useState<any>(null);

  // IQC Audit Detail states
  const [showIqcAuditDetail, setShowIqcAuditDetail] = useState(false);
  const [auditDecision, setAuditDecision] = useState('通过');
  const [auditRejectReason, setAuditRejectReason] = useState('');
  const [auditImpact, setAuditImpact] = useState('经评估，该批次轻微超差不影响产品电气性能及整体结构装配。');
  const [auditAdvice, setAuditAdvice] = useState('同意让步接收，后续加强来料管控及供应商制程辅导。');
  const [auditComprehensive, setAuditComprehensive] = useState('合格接收');
  const [auditManager, setAuditManager] = useState('张伟');
  const [auditEmailGroup, setAuditEmailGroup] = useState('质量中心核心邮件组 (qa_group@company.com)');
  const [inspectionRows, setInspectionRows] = useState([
    { id: 1, name: '标识、包装', plan: '—', sample: 1, std: '检验规范', manual: true, values: ['1'], qualified: 1, unqualified: 0, result: '合格', file: '', remark: '' },
    { id: 2, name: '产品检验合格证明', plan: '—', sample: 1, std: '检验规范', manual: true, values: ['1'], qualified: 1, unqualified: 0, result: '合格', file: '', remark: '' },
    { id: 3, name: '外观', plan: 'S-2', sample: 13, std: '检验规范', manual: true, values: ['13'], qualified: 13, unqualified: 0, result: '合格', file: '', remark: '' },
    { id: 4, name: '安装面的平面度', plan: '—', sample: 5, std: '≤0.3', manual: false, values: ['0.12', '0.15', '0.14', '0.13', '0.16'], qualified: 5, unqualified: 0, result: '合格', file: '', remark: '' },
    { id: 5, name: '净重', plan: '—', sample: 5, std: '净重', manual: false, values: ['50.2', '50.3', '50.1', '50.2', '50.4'], qualified: 5, unqualified: 0, result: '合格', file: '', remark: '' },
    { id: 6, name: '净重', plan: '—', sample: 5, std: '净重', manual: true, values: ['50.2'], qualified: 5, unqualified: 0, result: '合格', file: '', remark: '' },
    { id: 7, name: '安装板宽度', plan: '—', sample: 5, std: '—', manual: false, values: ['10.1', '10.2', '10.1', '10.2', '10.1'], qualified: 5, unqualified: 0, result: '合格', file: '', remark: '' },
    { id: 8, name: '新增项目1', plan: 'S-3', sample: 5, std: '20.1-20.2', manual: false, values: ['20.1', '20.2', '20.1', '20.1', '20.2'], qualified: 5, unqualified: 0, result: '合格', file: '', remark: '' },
    { id: 9, name: '新增项目2', plan: '—', sample: 5, std: '检验规范', manual: true, values: ['5'], qualified: 5, unqualified: 0, result: '合格', file: '', remark: '' },
    { id: 10, name: '新增项目3', plan: 'S-3', sample: 5, std: '20.1-20.2', manual: false, values: ['20.1', '20.1', '20.2', '20.1', '20.2'], qualified: 5, unqualified: 0, result: '合格', file: '', remark: '' },
  ]);
  const [overallResult, setOverallResult] = useState('合格');
  const [defectCategory, setDefectCategory] = useState('无');
  const [warrantyCard, setWarrantyCard] = useState('有');
  const [badDescription, setBadDescription] = useState('');
  const [inspectionRemark, setInspectionRemark] = useState('');

  const openInspectionMaintenance = (item: any) => {
    setCurrentInspectItem(item);
    setShowInspectionMaintenance(true);
  };

  const handleAddInspectionRow = () => {
    const newId = inspectionRows.length + 1;
    setInspectionRows([
      ...inspectionRows,
      { id: Date.now(), name: `新增检验项目${newId}`, plan: '—', sample: 5, std: '检验规范', manual: false, values: ['', '', '', '', ''], qualified: 5, unqualified: 0, result: '合格', file: '', remark: '' }
    ]);
  };

  const handleDeleteInspectionRow = (id: number) => {
    setInspectionRows(inspectionRows.filter(r => r.id !== id));
  };

  const handleAutoBadDesc = () => {
    setBadDescription('自动生成：所有检验项目实测值符合QJ-QC-0219及QJ-QC-0298规范要求，标识、外观及尺寸均在公差范围内。');
  };

  const handleClearBadDesc = () => {
    setBadDescription('');
  };

  const handleResetInspectionForm = () => {
    setOverallResult('合格');
    setDefectCategory('无');
    setWarrantyCard('有');
    setBadDescription('');
    setInspectionRemark('');
    alert('表单已重置！');
  };

  const handleSaveDraftInspection = () => {
    alert('检验记录已成功临时保存！');
  };

  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault();
    setShowInspectionMaintenance(false);
    alert('检验记录提交成功！');
  };

  // Add Dispatch form states (initially empty as requested)
  const [addCode, setAddCode] = useState('');
  const [addName, setAddName] = useState('');
  const [addMlot, setAddMlot] = useState('');
  const [addLpn, setAddLpn] = useState('');
  const [addSupplierCode, setAddSupplierCode] = useState('');
  const [addSupplierAbbr, setAddSupplierAbbr] = useState('');
  const [addSpot, setAddSpot] = useState('是');
  const [addWms, setAddWms] = useState('是');
  const [addOrderNo, setAddOrderNo] = useState('');
  const [addGoodsNo, setAddGoodsNo] = useState('');
  const [addBatch, setAddBatch] = useState('');
  const [addQty, setAddQty] = useState('');
  const [addInspector, setAddInspector] = useState('李明');
  const [addPaperless, setAddPaperless] = useState('否');
  const [addRemark, setAddRemark] = useState('');

  // Edit Dispatch states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [editMlot, setEditMlot] = useState('');
  const [editLpn, setEditLpn] = useState('');
  const [editSupplierCode, setEditSupplierCode] = useState('');
  const [editSupplierAbbr, setEditSupplierAbbr] = useState('');
  const [editSpot, setEditSpot] = useState('是');
  const [editWms, setEditWms] = useState('是');
  const [editOrderNo, setEditOrderNo] = useState('');
  const [editGoodsNo, setEditGoodsNo] = useState('');
  const [editBatch, setEditBatch] = useState('');
  const [editQty, setEditQty] = useState('');
  const [editInspector, setEditInspector] = useState('');
  const [editPaperless, setEditPaperless] = useState('否');
  const [editRemark, setEditRemark] = useState('');

  // Delete Dispatch states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  const menuItems = [
    {
      name: '首页',
      icon: LayoutDashboard,
      hasSub: true,
      subItems: ['首页', '今日检验进度看板', 'IQC质量管理看板']
    },
    {
      name: '物料派单',
      icon: ClipboardList,
      hasSub: true,
      subItems: ['零星物料派单', 'WMS待单']
    },
    {
      name: '物料检验',
      icon: CheckSquare,
      hasSub: true,
      subItems: ['我的检验']
    },
    {
      name: '检验结果',
      icon: FileText,
      hasSub: true,
      subItems: ['IQC主管审核', '质量主管审核']
    },
    { name: '综合查询', icon: Search },
    {
      name: '定点信息',
      icon: MapPin,
      hasSub: true,
      subItems: ['供应商清单', '定点物料']
    },
    {
      name: '基础管理',
      icon: Settings,
      hasSub: true,
      subItems: ['物料组', '物料管理', '项目标准', '检验项目', '抽样方案', '数据字典']
    },
    {
      name: '资产管理',
      icon: Wrench,
      hasSub: true,
      subItems: ['设备管理']
    },
    {
      name: '分析报表',
      icon: BarChart3,
      hasSub: true,
      subItems: ['物料组分析', '供应商分析', '合格率分析']
    },
    {
      name: '绩效管理',
      icon: Award,
      hasSub: true,
      subItems: ['检验员及时性']
    },
    {
      name: '权限管理',
      icon: Shield,
      hasSub: true,
      subItems: ['角色管理', '用户管理', '邮件组管理', '自动派单设置']
    },
    {
      name: '帮助中心',
      icon: HelpCircle,
      hasSub: true,
      subItems: ['意见反馈']
    },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleAiAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiResponse(`【Gemini 2026-10 质检实时大模型诊断报告】\n1. 今日检验进度：待检138批，检验中226批，已合格206批，整体产线送检节奏平稳。\n2. 质量监控：缺陷4占比49.11%，建议重点核查包装与防潮情况。\n3. 人员负荷：检验员 QC001-QC003 运转高效。`);
    }, 1000);
  };

  const handleSearchDispatch = () => {
    let filtered = INITIAL_DISPATCH_LIST.filter(item => {
      const matchCode = filterMaterialCode ? item.code.includes(filterMaterialCode) : true;
      const matchSupplier = filterSupplierCode ? item.supplierCode.includes(filterSupplierCode) : true;
      const matchGoods = filterGoodsNo ? item.goodsNo.includes(filterGoodsNo) : true;
      return matchCode && matchSupplier && matchGoods;
    });
    setDispatchList(filtered);
  };

  const handleResetDispatch = () => {
    setFilterMaterialCode('');
    setFilterSupplierCode('');
    setFilterGoodsNo('');
    setDispatchList(INITIAL_DISPATCH_LIST);
  };

  const handleSearchWms = () => {
    let filtered = INITIAL_WMS_PENDING_LIST;
    if (wmsMaterialCode) {
      filtered = filtered.filter(item => item.code.includes(wmsMaterialCode));
    }
    if (wmsSupplierCode) {
      filtered = filtered.filter(item => item.supplierCode.includes(wmsSupplierCode));
    }
    if (wmsGoodsNo) {
      filtered = filtered.filter(item => item.goodsNo.includes(wmsGoodsNo));
    }
    setWmsList(filtered);
  };

  const handleResetWms = () => {
    setWmsMaterialCode('');
    setWmsSupplierCode('');
    setWmsGoodsNo('');
    setWmsList(INITIAL_WMS_PENDING_LIST);
  };

  const handleSearchInspect = () => {
    let filtered = INITIAL_MY_INSPECTION_LIST.filter(item => {
      const matchCode = inspectMaterialCode ? item.code.includes(inspectMaterialCode) : true;
      const matchSupplier = inspectSupplierCode ? item.supplierCode.includes(inspectSupplierCode) : true;
      return matchCode && matchSupplier;
    });
    setInspectList(filtered);
  };

  const handleResetInspect = () => {
    setInspectMaterialCode('');
    setInspectSupplierCode('');
    setInspectList(INITIAL_MY_INSPECTION_LIST);
  };

  // WMS Dispatch Modal states
  const [showWmsDispatchModal, setShowWmsDispatchModal] = useState(false);
  const [activeWmsItem, setActiveWmsItem] = useState<any>(null);
  const [wmsDispatchForm, setWmsDispatchForm] = useState({
    code: '', name: '', mlot: '', lpn: '', supplierCode: '', supplierName: '',
    spot: '是', paperless: '否', orderNo: '', goodsNo: '', batch: '', qty: '',
    inspector: '李明', pauseSupply: '否', sameDayDispatched: '否',
    chemicalProject: '否', firstBatch: '否', remark: ''
  });

  // WMS Paperless Modal states
  const [showPaperlessModal, setShowPaperlessModal] = useState(false);
  const [paperlessItem, setPaperlessItem] = useState<any>(null);
  const [paperlessEnabled, setPaperlessEnabled] = useState('是');

  // WMS Exception Recovery Modal states
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const handleWmsRecovery = () => {
    setShowRecoveryModal(true);
  };

  const handleWmsAction = (item: any, type: string) => {
    setActiveWmsItem(item);
    if (type === '派单') {
      setWmsDispatchForm({
        code: item.code || '',
        name: item.desc || '',
        mlot: item.mlot || 'MLOT20261020',
        lpn: item.lpn || 'LPN9901',
        supplierCode: item.supplierCode || '',
        supplierName: item.supplierName || '',
        spot: '是',
        paperless: '否',
        orderNo: item.orderNo || '',
        goodsNo: item.goodsNo || '',
        batch: item.batch || '',
        qty: item.qty || '',
        inspector: '李明',
        pauseSupply: '否',
        sameDayDispatched: '否',
        chemicalProject: '否',
        firstBatch: '否',
        remark: item.failReason ? `异常原因: ${item.failReason}` : ''
      });
      setShowWmsDispatchModal(true);
    } else if (type === '无纸化') {
      setPaperlessItem(item);
      setPaperlessEnabled(item.paperless || '是');
      setShowPaperlessModal(true);
    }
  };

  const handleConfirmWmsDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeWmsItem) {
      setWmsList(wmsList.filter(i => i.id !== activeWmsItem.id));
    }
    setShowWmsDispatchModal(false);
    alert('WMS 派单提交成功！已生成正式派单记录。');
  };

  const handleConfirmPaperless = () => {
    if (paperlessItem) {
      setWmsList(wmsList.map(i => i.id === paperlessItem.id ? { ...i, paperless: paperlessEnabled } : i));
    }
    setShowPaperlessModal(false);
    alert('无纸化派单设置已保存！');
  };

  const handleExecuteRecovery = (item: any) => {
    setWmsList(wmsList.map(i => i.id === item.id ? { ...i, failReason: '' } : i));
    alert(`物料 ${item.code} 异常状态已成功恢复！`);
  };

  const handleAddDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      code: addCode,
      name: addName,
      mlot: addMlot,
      lpn: addLpn,
      supplierCode: addSupplierCode,
      supplierAbbr: addSupplierAbbr,
      spot: addSpot,
      wms: addWms,
      orderNo: addOrderNo,
      goodsNo: addGoodsNo,
      batch: addBatch,
      qty: Number(addQty) || 0,
      inspector: addInspector,
      paperless: addPaperless,
      remark: addRemark,
      dispatcher: '系统管理员',
      status: '已派单',
      failReason: ''
    };
    const updated = [newItem, ...dispatchList].sort((a, b) => b.batch.localeCompare(a.batch));
    setDispatchList(updated);
    setShowAddModal(false);
    alert('零星物料派单新增成功！');
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditCode(item.code || '');
    setEditName(item.name || '');
    setEditMlot(item.mlot || '');
    setEditLpn(item.lpn || '');
    setEditSupplierCode(item.supplierCode || '');
    setEditSupplierAbbr(item.supplierAbbr || '');
    setEditSpot(item.spot || '是');
    setEditWms(item.wms || '是');
    setEditOrderNo(item.orderNo || '');
    setEditGoodsNo(item.goodsNo || '');
    setEditBatch(item.batch || '');
    setEditQty(String(item.qty || ''));
    setEditInspector(item.inspector || '李明');
    setEditPaperless(item.paperless || '否');
    setEditRemark(item.remark || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const updatedList = dispatchList.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          code: editCode,
          name: editName,
          mlot: editMlot,
          lpn: editLpn,
          supplierCode: editSupplierCode,
          supplierAbbr: editSupplierAbbr,
          spot: editSpot,
          wms: editWms,
          orderNo: editOrderNo,
          goodsNo: editGoodsNo,
          batch: editBatch,
          qty: Number(editQty) || 0,
          inspector: editInspector,
          paperless: editPaperless,
          remark: editRemark,
        };
      }
      return item;
    });
    setDispatchList(updatedList);
    setShowEditModal(false);
    alert('派单记录修改成功！');
  };

  const openDeleteModal = (item: any) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    setDispatchList(dispatchList.filter(item => item.id !== deletingItem.id));
    setShowDeleteModal(false);
    setDeletingItem(null);
    alert('派单记录已删除！');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col lg:flex-row font-sans antialiased">
        {/* Left Login Window */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white z-10 shadow-2xl">
          <div className="max-w-md w-full space-y-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">IQC数字化质量管理系统</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                请输入您的账号和密码登录企业质量管理与智能派单平台
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-medium">
                  {loginError}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">账号 / 工号</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={loginAccount}
                    onChange={(e) => setLoginAccount(e.target.value)}
                    placeholder="请输入工号或账号"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:bg-white outline-none text-xs text-slate-800 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">登录密码</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('请联系IT管理员重置密码 (账号: admin / 密码: 任意)'); }} className="text-[11px] text-indigo-600 hover:underline">
                    忘记密码?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="请输入登录密码"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:bg-white outline-none text-xs text-slate-800 transition font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 cursor-pointer text-slate-600">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                  <span>记住登录状态</span>
                </label>
                <span className="text-[11px] text-slate-400">测试账号: admin</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>立即登录</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Enterprise Quality Platform v3.5</span>
              <span>Technical Support</span>
            </div>
          </div>
        </div>

        {/* Right Industrial Image Banner */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80"
              alt="Industrial Manufacturing Command Center"
              className="w-full h-full object-cover opacity-60 scale-105 transform hover:scale-100 transition duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-indigo-950/60"></div>
          </div>
          <div className="relative z-10 p-16 text-white max-w-lg space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>智能制造与质量全闭环</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-tight">
              数字驱动质检未来 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">智联卓越制造协同平台</span>
            </h1>
            <p className="text-slate-300 text-xs leading-relaxed">
              全面集成零星物料派单、WMS智能仓储对接、IQC精密来料检验、多维质量分析与自动化派单引擎，赋能现代电子与精密制造企业。
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold text-cyan-400">99.2%</p>
                <p className="text-[11px] text-slate-400 mt-0.5">检验按时完成率</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-400">10万+</p>
                <p className="text-[11px] text-slate-400 mt-0.5">月均处理批次</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">Zero</p>
                <p className="text-[11px] text-slate-400 mt-0.5">漏检率控制目标</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      {/* Sidebar Navigation (Hidden when viewing 今日检验进度看板 full screen mode or shown normally) */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 shadow-xl z-25`}>
        <div className="h-16 flex items-center px-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <h1 className="font-bold text-white tracking-wide text-base">IQC数字化质量管理系统</h1>
                <p className="text-xs text-slate-400">Enterprise Quality Hub</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isHome = item.name === '首页';
            const isMaterialDispatch = item.name === '物料派单';
            const isMaterialInspection = item.name === '物料检验';
            const isInspectionResult = item.name === '检验结果';
            const isFixedInfo = item.name === '定点信息';
            const isBasicManagement = item.name === '基础管理';
            const isAssetManagement = item.name === '资产管理';
            const isReport = item.name === '分析报表';
            const isPerf = item.name === '绩效管理';
            const isPermission = item.name === '权限管理';
            const isHelpCenter = item.name === '帮助中心';
            const isActive = activeMenu === item.name || 
              (isHome && (activeMenu === '首页' || activeMenu === '今日检验进度看板' || activeMenu === 'IQC质量管理看板')) || 
              (isMaterialDispatch && (activeMenu === '零星物料派单' || activeMenu === 'WMS待派单' || activeMenu === 'WMS待单')) ||
              (isMaterialInspection && (activeMenu === '我的检验' || activeMenu === '物料检验')) ||
              (isInspectionResult && (activeMenu === 'IQC主管审核' || activeMenu === '质量主管审核' || activeMenu === '检验结果')) ||
              (isFixedInfo && (activeMenu === '供应商清单' || activeMenu === '定点物料' || activeMenu === '定点信息')) ||
              (isBasicManagement && (activeMenu === '物料组' || activeMenu === '物料管理' || activeMenu === '项目标准' || activeMenu === '检验项目' || activeMenu === '抽样方案' || activeMenu === '数据字典' || activeMenu === '基础管理')) ||
              (isAssetManagement && (activeMenu === '设备管理' || activeMenu === '检验设备管理' || activeMenu === '资产管理')) ||
              (isReport && (activeMenu === '物料组分析' || activeMenu === '物料组合格率分析' || activeMenu === '供应商分析' || activeMenu === '合格率分析' || activeMenu === '分析报表')) ||
              (isPerf && (activeMenu === '检验员及时性' || activeMenu === '绩效管理')) ||
              (isPermission && (activeMenu === '角色管理' || activeMenu === '用户管理' || activeMenu === '邮件组管理' || activeMenu === '自动派单设置' || activeMenu === '权限管理')) ||
              (isHelpCenter && (activeMenu === '帮助中心' || activeMenu === '意见反馈'));
            
            return (
              <div key={item.name}>
                <button
                  onClick={() => {
                    if (isHome) {
                      setHomeOpen(!homeOpen);
                      setActiveMenu('首页');
                    } else if (isMaterialDispatch) {
                      setMaterialDispatchOpen(!materialDispatchOpen);
                      setActiveMenu('零星物料派单');
                    } else if (isMaterialInspection) {
                      setMaterialInspectionOpen(!materialInspectionOpen);
                      setActiveMenu('我的检验');
                    } else if (isInspectionResult) {
                      setIqcAuditOpen(!iqcAuditOpen);
                      setActiveMenu('IQC主管审核');
                    } else if (isFixedInfo) {
                      setFixedInfoOpen(!fixedInfoOpen);
                      setActiveMenu('供应商清单');
                    } else if (isBasicManagement) {
                      setBasicManagementOpen(!basicManagementOpen);
                      setActiveMenu('物料组');
                    } else if (isAssetManagement) {
                      setAssetManagementOpen(!assetManagementOpen);
                      setActiveMenu('设备管理');
                    } else if (isReport) {
                      setReportOpen(!reportOpen);
                      setActiveMenu('物料组分析');
                    } else if (isPerf) {
                      setPerfManagementOpen(!perfManagementOpen);
                      setActiveMenu('检验员及时性');
                    } else if (isPermission) {
                      setPermissionManagementOpen(!permissionManagementOpen);
                      setActiveMenu('用户管理');
                    } else if (isHelpCenter) {
                      setHelpCenterOpen(!helpCenterOpen);
                      setActiveMenu('意见反馈');
                    } else {
                      setActiveMenu(item.name);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-medium'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                    {!sidebarCollapsed && <span className="text-sm truncate">{item.name}</span>}
                  </div>
                  {item.hasSub && !sidebarCollapsed && (
                    <ChevronDown className={`w-4 h-4 transition-transform ${(isHome && homeOpen) || (isMaterialDispatch && materialDispatchOpen) || (isMaterialInspection && materialInspectionOpen) || (isInspectionResult && iqcAuditOpen) || (isFixedInfo && fixedInfoOpen) || (isBasicManagement && basicManagementOpen) || (isAssetManagement && assetManagementOpen) || (isReport && reportOpen) || (isPerf && perfManagementOpen) || (isPermission && permissionManagementOpen) || (isHelpCenter && helpCenterOpen) ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Submenu for 首页 */}
                {isHome && homeOpen && !sidebarCollapsed && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/70 rounded-xl my-1">
                    <button
                      onClick={() => setActiveMenu('首页')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '首页'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>首页</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('今日检验进度看板')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '今日检验进度看板'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>今日检验进度看板</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('IQC质量管理看板')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === 'IQC质量管理看板'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>IQC质量管理看板</span>
                    </button>
                  </div>
                )}

                {/* Submenu for 物料派单 */}
                {isMaterialDispatch && materialDispatchOpen && !sidebarCollapsed && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/70 rounded-xl my-1">
                    <button
                      onClick={() => setActiveMenu('零星物料派单')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '零星物料派单'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>零星物料派单</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('WMS待派单')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === 'WMS待派单' || activeMenu === 'WMS待单'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>WMS待派单</span>
                    </button>
                  </div>
                )}

                {/* Submenu for 物料检验 */}
                {isMaterialInspection && materialInspectionOpen && !sidebarCollapsed && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/70 rounded-xl my-1">
                    <button
                      onClick={() => setActiveMenu('我的检验')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '我的检验' || activeMenu === '物料检验'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>我的检验</span>
                    </button>
                  </div>
                )}

                {/* Submenu for 检验结果 */}
                {isInspectionResult && iqcAuditOpen && !sidebarCollapsed && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/70 rounded-xl my-1">
                    <button
                      onClick={() => setActiveMenu('IQC主管审核')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === 'IQC主管审核'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>IQC主管审核</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('质量主管审核')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '质量主管审核'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>质量主管审核</span>
                    </button>
                  </div>
                )}

                {/* Submenu for 定点信息 */}
                {isFixedInfo && fixedInfoOpen && !sidebarCollapsed && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/70 rounded-xl my-1">
                    <button
                      onClick={() => setActiveMenu('供应商清单')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '供应商清单' || activeMenu === '定点信息'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>供应商清单</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('定点物料')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '定点物料'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>定点物料</span>
                    </button>
                  </div>
                )}

                {/* Submenu for 基础管理 */}
                {isBasicManagement && basicManagementOpen && !sidebarCollapsed && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/70 rounded-xl my-1">
                    <button
                      onClick={() => setActiveMenu('物料组')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '物料组' || activeMenu === '基础管理'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>物料组</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('物料管理')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '物料管理'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>物料管理</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('项目标准')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '项目标准'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>项目标准</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('检验项目')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '检验项目'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>检验项目</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('抽样方案')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '抽样方案'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>抽样方案</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('数据字典')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '数据字典'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>数据字典</span>
                    </button>
                  </div>
                )}

                {/* Submenu for 资产管理 matching screenshot image_5d52405f.png */}
                {isAssetManagement && assetManagementOpen && !sidebarCollapsed && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/70 rounded-xl my-1">
                    <button
                      onClick={() => setActiveMenu('设备管理')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '设备管理' || activeMenu === '检验设备管理'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>设备管理</span>
                    </button>
                  </div>
                )}

                {/* Submenu for 分析报表 matching screenshot image_dd3e37eb.png */}
                {isReport && reportOpen && !sidebarCollapsed && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/70 rounded-xl my-1">
                    <button
                      onClick={() => setActiveMenu('物料组分析')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '物料组分析' || activeMenu === '物料组合格率分析'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>物料组分析</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('供应商分析')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '供应商分析'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>供应商分析</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('合格率分析')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '合格率分析'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>合格率分析</span>
                    </button>
                  </div>
                )}

                {/* Submenu for 绩效管理 matching screenshot image_dd3e37eb.png */}
                {isPerf && perfManagementOpen && !sidebarCollapsed && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/70 rounded-xl my-1">
                    <button
                      onClick={() => setActiveMenu('检验员及时性')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '检验员及时性'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>检验员及时性</span>
                    </button>
                  </div>
                )}

                {/* Submenu for 权限管理 matching screenshot image_c70620ca.png */}
                {isPermission && permissionManagementOpen && !sidebarCollapsed && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/70 rounded-xl my-1">
                    <button
                      onClick={() => setActiveMenu('角色管理')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '角色管理'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>角色管理</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('用户管理')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '用户管理'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>用户管理</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('邮件组管理')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '邮件组管理'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>邮件组管理</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('自动派单设置')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '自动派单设置'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>自动派单设置</span>
                    </button>
                  </div>
                )}

                {/* Submenu for 帮助中心 */}
                {isHelpCenter && helpCenterOpen && !sidebarCollapsed && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/70 rounded-xl my-1">
                    <button
                      onClick={() => setActiveMenu('意见反馈')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center space-x-2.5 ${
                        activeMenu === '意见反馈'
                          ? 'bg-[#181c24] text-white font-bold border-l-2 border-amber-400 pl-2 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-2xs inline-block flex-shrink-0"></span>
                      <span>意见反馈</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
          >
            <Menu className="w-4 h-4" />
            {!sidebarCollapsed && <span>{sidebarCollapsed ? '展开菜单' : '折叠菜单'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Only rendered when not in progress dashboard immersive mode, or styled accordingly) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm font-medium text-slate-500">
              {activeMenu === '物料组' ? (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('物料组')}>基础信息</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-800 font-semibold">物料组</span>
                </>
              ) : activeMenu === '物料管理' ? (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('物料管理')}>基础信息</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-800 font-semibold">物料管理</span>
                </>
              ) : activeMenu === '项目标准' ? (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('项目标准')}>基础信息</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-800 font-semibold">项目标准</span>
                </>
              ) : activeMenu === '检验项目' ? (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('检验项目')}>基础信息</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-800 font-semibold">检验项目</span>
                </>
              ) : activeMenu === '抽样方案' ? (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('抽样方案')}>基础信息</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-800 font-semibold">抽样方案</span>
                </>
              ) : activeMenu === '数据字典' ? (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('数据字典')}>基础信息</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-800 font-semibold">数据字典</span>
                </>
              ) : activeMenu === '供应商清单' ? (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('供应商清单')}>定点信息</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-800 font-semibold">供应商清单</span>
                </>
              ) : activeMenu === '设备管理' || activeMenu === '检验设备管理' ? (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('设备管理')}>资产管理</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-800 font-semibold">检验设备管理</span>
                </>
              ) : activeMenu === '物料组分析' || activeMenu === '物料组合格率分析' ? (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('物料组分析')}>分析报表</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-800 font-semibold">物料组合格率分析</span>
                </>
              ) : activeMenu === '用户管理' || activeMenu === '角色管理' || activeMenu === '邮件组管理' || activeMenu === '自动派单设置' ? (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('用户管理')}>权限管理</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-800 font-semibold">{activeMenu}</span>
                </>
              ) : activeMenu === '帮助中心' || activeMenu === '意见反馈' ? (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('帮助中心')}>帮助中心</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-800 font-semibold">{activeMenu}</span>
                </>
              ) : (
                <>
                  <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveMenu('首页')}>首页</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span className="text-indigo-600 font-semibold">{activeMenu}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition ${refreshing ? 'animate-spin text-indigo-600' : ''}`}
              title="刷新数据"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowNotificationModal(!showNotificationModal)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="通知提醒"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-md uppercase">
                {loginAccount ? (loginAccount.length > 3 ? loginAccount.slice(0, 3) : loginAccount) : 'adm'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800">账号: {loginAccount || 'admin'}</p>
                <p className="text-[10px] text-slate-500">IQC系统管理员</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsLoggedIn(false);
                alert('已成功注销登录');
              }}
              className="flex items-center space-x-1 text-rose-600 hover:text-rose-700 text-sm font-medium px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition"
              title="注销"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">注销</span>
            </button>
          </div>
        </header>

        {/* Sub-Header Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveMenu('首页')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm ${activeMenu === '首页' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              <span>首页</span>
            </button>
            {activeMenu === '今日检验进度看板' && (
              <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>今日检验进度看板</span>
                <X className="w-3.5 h-3.5 hover:bg-indigo-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
            {activeMenu === 'IQC质量管理看板' && (
              <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>IQC质量管理看板</span>
                <X className="w-3.5 h-3.5 hover:bg-indigo-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
            {activeMenu === '零星物料派单' && (
              <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>零星物料派单</span>
                <X className="w-3.5 h-3.5 hover:bg-indigo-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
            {activeMenu === '供应商清单' && (
              <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>供应商清单</span>
                <X className="w-3.5 h-3.5 hover:bg-indigo-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
            {activeMenu === '物料组' && (
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>物料组</span>
                <X className="w-3.5 h-3.5 hover:bg-blue-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
            {activeMenu === '物料管理' && (
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>物料管理</span>
                <X className="w-3.5 h-3.5 hover:bg-blue-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
            {activeMenu === '项目标准' && (
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>项目标准</span>
                <X className="w-3.5 h-3.5 hover:bg-blue-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
            {activeMenu === '检验项目' && (
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>检验项目</span>
                <X className="w-3.5 h-3.5 hover:bg-blue-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
            {activeMenu === '抽样方案' && (
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>抽样方案</span>
                <X className="w-3.5 h-3.5 hover:bg-blue-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
            {activeMenu === '数据字典' && (
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>数据字典</span>
                <X className="w-3.5 h-3.5 hover:bg-blue-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
            {(activeMenu === '设备管理' || activeMenu === '检验设备管理') && (
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>检验设备管理</span>
                <X className="w-3.5 h-3.5 hover:bg-blue-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
            {(activeMenu === '物料组分析' || activeMenu === '物料组合格率分析') && (
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <span>物料组合格率</span>
                <X className="w-3.5 h-3.5 hover:bg-blue-700 rounded p-0.5 cursor-pointer" onClick={() => setActiveMenu('首页')} />
              </button>
            )}
          </div>
          <button onClick={handleRefresh} className="p-1 text-slate-400 hover:text-slate-600">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-6">
          {activeMenu === '首页' ? (
            <div className="space-y-6">
              {/* Top 6 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-blue-300 transition relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">待检批数</span>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Clock className="w-5 h-5" /></div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800 tracking-tight">{DASHBOARD_METRICS.pendingBatches}</div>
                  <div className="mt-2 flex items-center text-xs text-blue-600 font-medium">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1" /><span>实时 +8%</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-cyan-300 transition relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-600"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">检验中批数</span>
                    <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl"><PlayCircle className="w-5 h-5" /></div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800 tracking-tight">{DASHBOARD_METRICS.inspectingBatches}</div>
                  <div className="mt-2 flex items-center text-xs text-cyan-600 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /><span>产线送检高效</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-emerald-300 transition relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">合格批数</span>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800 tracking-tight">{DASHBOARD_METRICS.qualifiedBatches}</div>
                  <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
                    <Check className="w-3.5 h-3.5 mr-1" /><span>合格率 {DASHBOARD_METRICS.passRate}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-amber-300 transition relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">让步批数</span>
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle className="w-5 h-5" /></div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800 tracking-tight">{DASHBOARD_METRICS.concessionBatches}</div>
                  <div className="mt-2 text-xs text-amber-600 font-medium">特采审批中</div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-rose-300 transition relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">退货批数</span>
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><XCircle className="w-5 h-5" /></div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800 tracking-tight">{DASHBOARD_METRICS.returnedBatches}</div>
                  <div className="mt-2 text-xs text-rose-600 font-medium">已通知供应商</div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-purple-300 transition relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">评审中批数</span>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><HelpCircle className="w-5 h-5" /></div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800 tracking-tight">{DASHBOARD_METRICS.reviewingBatches}</div>
                  <div className="mt-2 text-xs text-purple-600 font-medium">MRB多方会审</div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-5 bg-indigo-600 rounded-full"></div>
                      <h3 className="font-bold text-slate-800 text-sm">待检物料组批数排行榜</h3>
                    </div>
                    <span className="text-xs text-slate-400">Top 10</span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={PENDING_RANKING_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                        <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="#94a3b8" width={65} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                        <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-5 bg-cyan-600 rounded-full"></div>
                      <h3 className="font-bold text-slate-800 text-sm">检验中物料组批数排行榜</h3>
                    </div>
                    <span className="text-xs text-slate-400">Top 10</span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={INSPECTING_RANKING_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCyan)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-5 bg-emerald-600 rounded-full"></div>
                      <h3 className="font-bold text-slate-800 text-sm">完成检验物料组分布统计</h3>
                    </div>
                    <span className="text-xs text-slate-400">总批数 50</span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={DEFECT_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* 3 Material Lists Section with Modern Table Styling */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. 待检物料清单 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-5 bg-blue-600 rounded-full"></div>
                      <h3 className="font-bold text-slate-800 text-sm">待检物料清单</h3>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-80 custom-scrollbar">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-100/70 text-slate-700 sticky top-0 uppercase tracking-wider text-[10px] font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">物料名称/代码</th>
                          <th className="py-2.5 px-2">数量</th>
                          <th className="py-2.5 px-2">批次/厂家</th>
                          <th className="py-2.5 px-2 text-right">检验员</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {PENDING_MATERIALS.map((item, idx) => (
                          <tr
                            key={idx}
                            onClick={() => setSelectedRow({ type: '待检物料', ...item })}
                            className="hover:bg-blue-50/50 cursor-pointer transition"
                          >
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-800 truncate max-w-[110px]">{item.name}</div>
                              <div className="font-mono text-[10px] text-blue-600">{item.code}</div>
                            </td>
                            <td className="py-2.5 px-2 font-bold text-slate-700 whitespace-nowrap">{item.qty}</td>
                            <td className="py-2.5 px-2">
                              <div className="font-mono text-[10px] text-slate-600">{item.batch}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[90px]">{item.supplier}</div>
                            </td>
                            <td className="py-2.5 px-2 text-right">
                              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-medium">
                                {item.inspector}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. 检验中物料清单 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-5 bg-cyan-600 rounded-full"></div>
                      <h3 className="font-bold text-slate-800 text-sm">检验中物料清单</h3>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-80 custom-scrollbar">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-100/70 text-slate-700 sticky top-0 uppercase tracking-wider text-[10px] font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">物料名称/代码</th>
                          <th className="py-2.5 px-2">数量</th>
                          <th className="py-2.5 px-2">批次/厂家</th>
                          <th className="py-2.5 px-2 text-right">检验员</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {INSPECTING_MATERIALS.map((item, idx) => (
                          <tr
                            key={idx}
                            onClick={() => setSelectedRow({ type: '检验中物料', ...item })}
                            className="hover:bg-cyan-50/50 cursor-pointer transition"
                          >
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-800 truncate max-w-[110px]">{item.name}</div>
                              <div className="font-mono text-[10px] text-cyan-600">{item.code}</div>
                            </td>
                            <td className="py-2.5 px-2 font-bold text-slate-700 whitespace-nowrap">{item.qty}</td>
                            <td className="py-2.5 px-2">
                              <div className="font-mono text-[10px] text-slate-600">{item.batch}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[90px]">{item.supplier}</div>
                            </td>
                            <td className="py-2.5 px-2 text-right">
                              <span className="bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded text-[10px] font-medium">
                                {item.inspector}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. 检验结果清单 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-5 bg-emerald-600 rounded-full"></div>
                      <h3 className="font-bold text-slate-800 text-sm">检验结果清单</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      {(['全部', '合格', '让步接收', '退货'] as const).map((option) => (
                        <button
                          key={option}
                          onClick={() => setResultConclusionFilter(option)}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition ${
                            resultConclusionFilter === option
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {option}（{option === '全部' ? INSPECTION_RESULTS.length : resultConclusionSummary[option]}）
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-80 custom-scrollbar">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-100/70 text-slate-700 sticky top-0 uppercase tracking-wider text-[10px] font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">物料名称/代码</th>
                          <th className="py-2.5 px-2">数量</th>
                          <th className="py-2.5 px-2">批次</th>
                          <th className="py-2.5 px-2 text-right">结论</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredInspectionResults.map((item, idx) => (
                          <tr
                            key={idx}
                            onClick={() => setSelectedRow({ type: '检验结果', ...item })}
                            className="hover:bg-emerald-50/50 cursor-pointer transition"
                          >
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-800 truncate max-w-[110px]">{item.name}</div>
                              <div className="font-mono text-[10px] text-emerald-600">{item.code}</div>
                            </td>
                            <td className="py-2.5 px-2 font-bold text-slate-700 whitespace-nowrap">{item.qty}</td>
                            <td className="py-2.5 px-2">
                              <div className="font-mono text-[10px] text-slate-600">{item.batch}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[90px]">{item.supplier}</div>
                            </td>
                            <td className="py-2.5 px-2 text-right">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                                  item.conclusion === '合格'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : item.conclusion === '让步接收'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {item.conclusion}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredInspectionResults.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 px-3 text-center text-slate-400">
                              该结论下暂无检验结果
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '今日检验进度看板' ? (
            /* 今日检验进度看板 (Dark Tech War Room Dashboard matching screenshot) */
            <div className="bg-slate-950 text-slate-100 min-h-[85vh] p-6 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
              {/* Background Sci-Fi Grid Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

              {/* Progress Dashboard Top Header matching screenshot */}
              <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-800 relative z-10">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                  <button
                    onClick={() => setActiveMenu('首页')}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-md shadow-indigo-600/30 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>← 返回</span>
                  </button>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-blue-400">
                    今日检验进度看板
                  </h2>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="text-right">
                    <div className="font-mono font-bold text-cyan-400 text-sm tracking-wider">
                      {String(currentTime.getHours()).padStart(2, '0')}:{String(currentTime.getMinutes()).padStart(2, '0')}:{String(currentTime.getSeconds()).padStart(2, '0')}
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      {['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][currentTime.getDay()]} {currentTime.getFullYear()}年{currentTime.getMonth() + 1}月{currentTime.getDate()}日
                    </div>
                  </div>
                  <button
                    onClick={() => alert('已切换为全屏数字大屏模式')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition shadow"
                  >
                    全屏
                  </button>
                </div>
              </div>

              {/* Telemetry Status Bar (Non-card style) */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-6 relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Clock className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">待检批数</span>
                    <span className="text-xl font-black text-white font-mono">138</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg"><PlayCircle className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">检验中批数</span>
                    <span className="text-xl font-black text-white font-mono">226</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">合格批数</span>
                    <span className="text-xl font-black text-white font-mono">206</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">让步批数</span>
                    <span className="text-xl font-black text-white font-mono">38</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg"><XCircle className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">退货批数</span>
                    <span className="text-xl font-black text-white font-mono">12</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><HelpCircle className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">评审中批数</span>
                    <span className="text-xl font-black text-white font-mono">44</span>
                  </div>
                </div>
              </div>

              {/* 3 Cyber List Cards Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                {/* 1. 待检物料清单 */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col">
                  <h3 className="text-sm font-bold text-cyan-400 mb-3 pb-2 border-b border-slate-800">
                    <span>待检物料清单</span>
                  </h3>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    {PENDING_MATERIALS.map((item, i) => (
                      <div key={i} className="p-3 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800/90 hover:border-blue-500/50 rounded-xl transition group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-200 text-xs group-hover:text-cyan-400 transition">{item.name}</span>
                          <span className="font-mono text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800/50">{item.code}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                          <div>数量: <strong className="text-slate-200 font-mono">{item.qty} Pcs</strong></div>
                          <div>批次: <strong className="text-slate-200 font-mono">{item.batch}</strong></div>
                          <div className="truncate col-span-2">厂家: {item.supplier}</div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                          <span>预使用: {item.useTime}</span>
                          <span className="text-indigo-400 font-medium">检验员: {item.inspector}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 检验中物料清单 */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col">
                  <h3 className="text-sm font-bold text-cyan-400 mb-3 pb-2 border-b border-slate-800">
                    <span>检验中物料清单</span>
                  </h3>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    {INSPECTING_MATERIALS.map((item, i) => (
                      <div key={i} className="p-3 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800/90 hover:border-cyan-500/50 rounded-xl transition group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-200 text-xs group-hover:text-cyan-400 transition">{item.name}</span>
                          <span className="font-mono text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/50">{item.code}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                          <div>数量: <strong className="text-slate-200 font-mono">{item.qty} Pcs</strong></div>
                          <div>批次: <strong className="text-slate-200 font-mono">{item.batch}</strong></div>
                          <div className="truncate col-span-2">厂家: {item.supplier}</div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                          <span>预使用: {item.useTime}</span>
                          <span className="text-cyan-400 font-medium">检验员: {item.inspector}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. 检验结果清单 */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col">
                  <h3 className="text-sm font-bold text-cyan-400 mb-3 pb-2 border-b border-slate-800">
                    <span>检验结果清单</span>
                  </h3>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    {INSPECTION_RESULTS.map((item, i) => (
                      <div key={i} className="p-3 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800/90 hover:border-emerald-500/50 rounded-xl transition group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-200 text-xs group-hover:text-emerald-400 transition">{item.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.conclusion === '合格' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                            {item.conclusion}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                          <div>数量: <strong className="text-slate-200 font-mono">{item.qty} Pcs</strong></div>
                          <div>批次: <strong className="text-slate-200 font-mono">{item.batch}</strong></div>
                          <div className="truncate col-span-2">厂家: {item.supplier}</div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                          <span>代码: <strong className="font-mono text-cyan-300">{item.code}</strong></span>
                          <span>预使用: {item.useTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3 Charts Section matching screenshot */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col">
                  <h3 className="text-sm font-bold text-cyan-400 mb-3">待检物料组批数排行榜</h3>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PENDING_RANKING_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBlueProgress" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#64748b" />
                        <YAxis tick={{ fontSize: 9 }} stroke="#64748b" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                        <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorBlueProgress)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col">
                  <h3 className="text-sm font-bold text-cyan-400 mb-3">检验中物料组批数排行榜</h3>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={INSPECTING_RANKING_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                        <XAxis type="number" tick={{ fontSize: 9 }} stroke="#64748b" />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} stroke="#64748b" width={55} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                        <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col">
                  <h3 className="text-sm font-bold text-cyan-400 mb-3">完成检验物料组分布统计</h3>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={PROGRESS_DEFECTS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#64748b" />
                        <YAxis tick={{ fontSize: 9 }} stroke="#64748b" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {PROGRESS_DEFECTS.map((entry, index) => (
                            <Cell key={`cell-bar-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === 'IQC质量管理看板' ? (
            /* IQC质量管理看板 View (Dark Tech War Room Dashboard matching screenshot) */
            <div className="bg-slate-950 text-slate-100 min-h-[85vh] p-6 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
              {/* Background Sci-Fi Grid Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

              {/* Top Header matching screenshot */}
              <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-800 relative z-10">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                  <div className="text-xs font-mono text-cyan-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg tracking-wider">
                    {currentTime.getFullYear()}年{String(currentTime.getMonth() + 1).padStart(2, '0')}月{String(currentTime.getDate()).padStart(2, '0')}日 {String(currentTime.getHours()).padStart(2, '0')}:{String(currentTime.getMinutes()).padStart(2, '0')}:{String(currentTime.getSeconds()).padStart(2, '0')}
                  </div>
                  <button
                    onClick={() => setActiveMenu('首页')}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-md shadow-indigo-600/30 flex items-center space-x-1"
                  >
                    <span>← 返回</span>
                  </button>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-blue-400">
                    IQC质量管理看板
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => alert('已切换为全屏数字大屏模式')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow"
                  >
                    全屏
                  </button>
                </div>
              </div>

              {/* Today's Inspection Overview (7 Metric Status Bar) */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">合格批数</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">10</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden lg:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">让步批数</span>
                    <span className="text-xl font-black text-amber-400 font-mono">22</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden lg:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg"><XCircle className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">退货批数</span>
                    <span className="text-xl font-black text-rose-400 font-mono">3</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden lg:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><HelpCircle className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">评审批数</span>
                    <span className="text-xl font-black text-purple-400 font-mono">3</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden lg:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Package className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">来料总批数</span>
                    <span className="text-xl font-black text-blue-400 font-mono">102</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden lg:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg"><CheckSquare className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">检验完成批数</span>
                    <span className="text-xl font-black text-cyan-400 font-mono">12</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden lg:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><Award className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">完成率 / 合格率</span>
                    <span className="text-base font-black text-indigo-300 font-mono">11.76% / 83.33%</span>
                  </div>
                </div>
              </div>

              {/* Charts Grid Section (Distinct styles as requested) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                {/* 1. 日检验完成率总览 (Composed Chart with 3 elements) */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-cyan-400">日检验完成率总览</h3>
                    <div className="flex items-center space-x-3 text-[10px] text-slate-300">
                      <span className="flex items-center"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm mr-1"></span>来料批数</span>
                      <span className="flex items-center"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm mr-1"></span>完成批数</span>
                      <span className="flex items-center"><span className="w-3 h-0.5 bg-amber-500 mr-1"></span>检验完成率</span>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={[
                        { day: '11/1', incoming: 450, completed: 380, rate: 78 },
                        { day: '11/2', incoming: 430, completed: 380, rate: 78 },
                        { day: '11/3', incoming: 450, completed: 380, rate: 78 },
                        { day: '11/4', incoming: 380, completed: 300, rate: 68 },
                        { day: '11/5', incoming: 420, completed: 300, rate: 72 },
                        { day: '11/6', incoming: 450, completed: 380, rate: 85 },
                        { day: '11/7', incoming: 430, completed: 380, rate: 82 },
                        { day: '11/8', incoming: 450, completed: 380, rate: 79 },
                        { day: '11/9', incoming: 380, completed: 300, rate: 78 },
                        { day: '11/10', incoming: 420, completed: 300, rate: 88 },
                        { day: '11/11', incoming: 450, completed: 380, rate: 80 },
                        { day: '11/12', incoming: 430, completed: 380, rate: 72 },
                        { day: '11/13', incoming: 450, completed: 380, rate: 75 },
                        { day: '11/14', incoming: 380, completed: 300, rate: 60 },
                        { day: '11/15', incoming: 420, completed: 380, rate: 58 },
                        { day: '11/16', incoming: 450, completed: 380, rate: 62 },
                        { day: '11/17', incoming: 430, completed: 380, rate: 63 },
                        { day: '11/18', incoming: 450, completed: 380, rate: 58 },
                        { day: '11/19', incoming: 380, completed: 300, rate: 59 },
                        { day: '11/20', incoming: 420, completed: 380, rate: 68 },
                      ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="#64748b" />
                        <YAxis yAxisId="left" tick={{ fontSize: 9 }} stroke="#64748b" domain={[0, 500]} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} stroke="#64748b" domain={[0, 100]} unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                        <Bar yAxisId="left" dataKey="incoming" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={8} />
                        <Bar yAxisId="left" dataKey="completed" fill="#10b981" radius={[2, 2, 0, 0]} barSize={8} />
                        <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. 日物料组来料批次统计 (Line Trend) */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col">
                  <h3 className="text-sm font-bold text-cyan-400 mb-4">日物料组来料批次统计 (总计 102 批)</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { group: '集成电路IC', count: 25 },
                        { group: '阻容感器件', count: 20 },
                        { group: 'PCB印制板', count: 15 },
                        { group: '连接器线束', count: 12 },
                        { group: '结构五金件', count: 10 },
                        { group: '光电元器件', count: 8 },
                        { group: '电源模块', count: 6 },
                        { group: '磁性器件', count: 6 },
                      ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="group" tick={{ fontSize: 8 }} stroke="#64748b" interval={0} angle={-15} textAnchor="end" />
                        <YAxis tick={{ fontSize: 9 }} stroke="#64748b" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5, fill: '#06b6d4' }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. 本月检验员完成率Top10 (Horizontal Bar with 10 real inspectors) */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col">
                  <h3 className="text-sm font-bold text-cyan-400 mb-4">本月检验员完成率 Top10</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={[
                        { name: '张明(QC01)', rate: 98.5 },
                        { name: '李伟(QC02)', rate: 97.2 },
                        { name: '王芳(QC03)', rate: 96.8 },
                        { name: '刘洋(QC04)', rate: 95.5 },
                        { name: '陈静(QC05)', rate: 94.9 },
                        { name: '杨超(QC06)', rate: 93.8 },
                        { name: '黄强(QC07)', rate: 92.4 },
                        { name: '赵敏(QC08)', rate: 91.5 },
                        { name: '周杰(QC09)', rate: 90.2 },
                        { name: '吴娜(QC10)', rate: 89.0 },
                      ]} margin={{ top: 5, right: 10, left: 15, bottom: 0 }}>
                        <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 9 }} stroke="#64748b" />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 8 }} stroke="#64748b" width={65} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                        <Bar dataKey="rate" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Second Row of Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                {/* 4. 日检验合格率总览 (Composed Chart with 3 elements) */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-cyan-400">日检验合格率总览</h3>
                    <div className="flex items-center space-x-3 text-[10px] text-slate-300">
                      <span className="flex items-center"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm mr-1"></span>来料批数</span>
                      <span className="flex items-center"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm mr-1"></span>合格批数</span>
                      <span className="flex items-center"><span className="w-3 h-0.5 bg-amber-500 mr-1"></span>检验合格率</span>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={[
                        { day: '11/1', incoming: 450, passed: 380, rate: 83.3 },
                        { day: '11/2', incoming: 430, passed: 380, rate: 88.3 },
                        { day: '11/3', incoming: 450, passed: 380, rate: 84.4 },
                        { day: '11/4', incoming: 380, passed: 300, rate: 78.9 },
                        { day: '11/5', incoming: 420, passed: 300, rate: 71.4 },
                        { day: '11/6', incoming: 450, passed: 380, rate: 84.4 },
                        { day: '11/7', incoming: 430, passed: 380, rate: 88.3 },
                        { day: '11/8', incoming: 450, passed: 380, rate: 84.4 },
                        { day: '11/9', incoming: 380, passed: 300, rate: 78.9 },
                        { day: '11/10', incoming: 420, passed: 300, rate: 71.4 },
                        { day: '11/11', incoming: 450, passed: 380, rate: 84.4 },
                        { day: '11/12', incoming: 430, passed: 380, rate: 88.3 },
                        { day: '11/13', incoming: 450, passed: 380, rate: 84.4 },
                        { day: '11/14', incoming: 380, passed: 300, rate: 78.9 },
                        { day: '11/15', incoming: 420, passed: 380, rate: 90.4 },
                        { day: '11/16', incoming: 450, passed: 380, rate: 84.4 },
                        { day: '11/17', incoming: 430, passed: 380, rate: 88.3 },
                        { day: '11/18', incoming: 450, passed: 380, rate: 84.4 },
                        { day: '11/19', incoming: 380, passed: 300, rate: 78.9 },
                        { day: '11/20', incoming: 420, passed: 380, rate: 90.4 },
                      ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="#64748b" />
                        <YAxis yAxisId="left" tick={{ fontSize: 9 }} stroke="#64748b" domain={[0, 500]} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} stroke="#64748b" domain={[0, 100]} unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                        <Bar yAxisId="left" dataKey="incoming" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={8} />
                        <Bar yAxisId="left" dataKey="passed" fill="#10b981" radius={[2, 2, 0, 0]} barSize={8} />
                        <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 5. 日来料缺陷分布统计 (Bar Chart) */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col">
                  <h3 className="text-sm font-bold text-cyan-400 mb-4">日来料缺陷分布统计 (缺陷类型占比)</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={PROGRESS_DEFECTS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#64748b" />
                        <YAxis tick={{ fontSize: 9 }} stroke="#64748b" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {PROGRESS_DEFECTS.map((entry, index) => (
                            <Cell key={`cell-iqc-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 6. 本月供应商合格率Top10 (Horizontal Bar Chart with 10 real suppliers) */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col">
                  <h3 className="text-sm font-bold text-cyan-400 mb-4">本月供应商合格率 Top10</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={[
                        { supplier: '华为技术', rate: 99.2 },
                        { supplier: '比亚迪电子', rate: 98.8 },
                        { supplier: '立讯精密', rate: 98.5 },
                        { supplier: '歌尔股份', rate: 98.1 },
                        { supplier: '蓝思科技', rate: 97.6 },
                        { supplier: '鹏鼎控股', rate: 97.2 },
                        { supplier: '欣旺达', rate: 96.8 },
                        { supplier: '东山精密', rate: 96.4 },
                        { supplier: '环旭电子', rate: 96.0 },
                        { supplier: '深南电路', rate: 95.5 },
                      ]} margin={{ top: 5, right: 10, left: 15, bottom: 0 }}>
                        <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 9 }} stroke="#64748b" />
                        <YAxis dataKey="supplier" type="category" tick={{ fontSize: 8 }} stroke="#64748b" width={70} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                        <Bar dataKey="rate" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '零星物料派单' ? (
            /* Sporadic Material Dispatch Grid Card Layout */
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-slate-600">物料编码:</label>
                  <input
                    type="text"
                    placeholder="请输入物料编码"
                    value={filterMaterialCode}
                    onChange={(e) => setFilterMaterialCode(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-500 w-44"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-slate-600">供方代码:</label>
                  <input
                    type="text"
                    placeholder="请输入供方代码"
                    value={filterSupplierCode}
                    onChange={(e) => setFilterSupplierCode(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-500 w-44"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-slate-600">收货单号:</label>
                  <input
                    type="text"
                    placeholder="请输入收货单号"
                    value={filterGoodsNo}
                    onChange={(e) => setFilterGoodsNo(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-500 w-44"
                  />
                </div>

                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    onClick={handleSearchDispatch}
                    className="flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                  <button
                    onClick={handleResetDispatch}
                    className="flex items-center space-x-1.5 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                  <button
                    onClick={() => {
                      setAddCode('');
                      setAddName('');
                      setAddMlot('');
                      setAddLpn('');
                      setAddSupplierCode('');
                      setAddSupplierAbbr('');
                      setAddSpot('是');
                      setAddWms('是');
                      setAddOrderNo('');
                      setAddGoodsNo('');
                      setAddBatch('');
                      setAddQty('');
                      setAddInspector('李明');
                      setAddPaperless('否');
                      setAddRemark('');
                      setShowAddModal(true);
                    }}
                    className="flex items-center space-x-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>新增派单</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {dispatchList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${item.status === '已派单' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                          {item.code}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.status === '已派单' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {item.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-800 text-sm mb-3 group-hover:text-indigo-600 transition">
                        {item.name}
                      </h4>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl mb-4">
                        <div>
                          <span className="text-slate-400 block text-[10px]">供方简称</span>
                          <span className="font-medium text-slate-700">{item.supplierAbbr}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">派单批次 (降序)</span>
                          <span className="font-mono font-bold text-indigo-600">{item.batch}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">派单数量</span>
                          <span className="font-bold text-slate-800">{item.qty} Pcs</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">订单号</span>
                          <span className="font-mono text-slate-700">{item.orderNo}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[10px]">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">定点: {item.spot}</span>
                        <span className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded font-medium">无纸化: {item.paperless}</span>
                        <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded font-medium">WMS: {item.wms}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">派单员: {item.dispatcher}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">检验员: {item.inspector}</span>
                      </div>
                      {item.failReason && (
                        <div className="mb-3 p-2 bg-rose-50 text-rose-700 text-[11px] rounded-lg font-medium">
                          失败原因: {item.failReason}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[10px]">收货单: {item.goodsNo}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition flex items-center space-x-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>编辑</span>
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-medium transition flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>删除</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeMenu === 'WMS待派单' || activeMenu === 'WMS待单' ? (
            /* WMS Pending Dispatch Table Layout matching screenshot and recent date descending sort */
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-slate-600">物料编码:</label>
                  <input
                    type="text"
                    placeholder="请输入物料编码"
                    value={wmsMaterialCode}
                    onChange={(e) => setWmsMaterialCode(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-500 w-44"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-slate-600">供方代码:</label>
                  <input
                    type="text"
                    placeholder="请输入供方代码"
                    value={wmsSupplierCode}
                    onChange={(e) => setWmsSupplierCode(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-500 w-44"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-slate-600">收货单号:</label>
                  <input
                    type="text"
                    placeholder="请输入收货单号"
                    value={wmsGoodsNo}
                    onChange={(e) => setWmsGoodsNo(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-500 w-44"
                  />
                </div>

                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    onClick={handleSearchWms}
                    className="flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                  <button
                    onClick={handleResetWms}
                    className="flex items-center space-x-1.5 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleWmsRecovery}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>物料异常恢复</span>
                  </button>
                  <span className="text-xs text-slate-400">事件按近期的降序排列</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 text-center w-12">序号</th>
                        <th className="p-3 text-center w-28">操作</th>
                        <th className="p-3">物料编码</th>
                        <th className="p-3">物料描述</th>
                        <th className="p-3">供方代号</th>
                        <th className="p-3">供方名称</th>
                        <th className="p-3">批次 (降序)</th>
                        <th className="p-3">数量</th>
                        <th className="p-3">MLOT</th>
                        <th className="p-3">LPN</th>
                        <th className="p-3">订单号</th>
                        <th className="p-3">收货单号</th>
                        <th className="p-3">自动派单失败原因</th>
                        <th className="p-3">收货日期</th>
                        <th className="p-3">预计使用时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      {wmsList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-center font-medium">{idx + 1}</td>
                          <td className="p-3 text-center space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleWmsAction(item, '派单')}
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              派单
                            </button>
                            <button
                              onClick={() => handleWmsAction(item, '无纸化')}
                              className="text-indigo-600 hover:underline font-semibold"
                            >
                              无纸化
                            </button>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-800">{item.code}</td>
                          <td className="p-3 font-medium">{item.desc}</td>
                          <td className="p-3">{item.supplierCode}</td>
                          <td className="p-3">{item.supplierName}</td>
                          <td className="p-3 font-mono font-bold text-indigo-600">{item.batch}</td>
                          <td className="p-3 font-bold">{item.qty}</td>
                          <td className="p-3 font-mono text-[11px]">{item.mlot}</td>
                          <td className="p-3 font-mono text-[11px]">{item.lpn}</td>
                          <td className="p-3 font-mono">{item.orderNo}</td>
                          <td className="p-3 font-mono">{item.goodsNo}</td>
                          <td className="p-3 text-rose-600 font-medium">{item.failReason || '-'}</td>
                          <td className="p-3 text-[11px] text-slate-500 font-mono">{item.receiveDate}</td>
                          <td className="p-3 text-[11px] text-slate-500 font-mono">{item.expectedTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 {wmsList.length} 条记录 第 1 / 1 页</span>
                  <div className="flex items-center space-x-1">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded font-medium">1</button>
                    <span className="px-2">10条/页</span>
                    <span>跳至</span>
                    <input type="text" defaultValue="1" className="w-10 px-2 py-1 border border-slate-300 rounded text-center" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : showCompUrgentModal ? (
            /* Comprehensive Query - Urgent Setup Full Page */
            <div className="space-y-6">
              {/* Tab Header Navigation */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setShowCompUrgentModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>综合查询 - 加急设置</span>
                  <button onClick={() => setShowCompUrgentModal(false)} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Basic Metadata Header Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">
                  <span>单据与物料基础信息</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">供应商简称：</label>
                    <input type="text" readOnly value={currentInspectItem?.supplierAbbr || '村田中国'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货批次：</label>
                    <input type="text" readOnly value={currentInspectItem?.batch || '20261020'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货数量：</label>
                    <input type="text" readOnly value={currentInspectItem?.qty || '10000'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料类型：</label>
                    <input type="text" readOnly value={currentInspectItem?.materialType || '常规物料'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料编码：</label>
                    <input type="text" readOnly value={currentInspectItem?.code || '8020080021'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料名称：</label>
                    <input type="text" readOnly value={currentInspectItem?.name || '车规级多层陶瓷电容器 22uF'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">派单时间：</label>
                    <input type="text" readOnly value={currentInspectItem?.dispatchTime || '2026-10-20 12:12'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono text-[11px]" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">当前进度节点：</label>
                    <input type="text" readOnly value={currentInspectItem?.progress || '待抽样'} className="w-full px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 font-bold" />
                  </div>
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">
                  <span>加急通道与时效控制</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">紧急程度：</label>
                    <select
                      value={urgentLevel}
                      onChange={(e) => setUrgentLevel(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-bold text-indigo-600"
                    >
                      <option value="特急">特急 (优先插入当前最前排队)</option>
                      <option value="紧急">紧急 (半小时内安排开检)</option>
                      <option value="普通">普通 (正常排队优先)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">期望完成时间：</label>
                    <input
                      type="text"
                      value={urgentTargetTime}
                      onChange={(e) => setUrgentTargetTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">产线停线风险评级：</label>
                    <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-slate-700">
                      <option value="高风险">高风险 (即将断料停线)</option>
                      <option value="中风险">中风险 (产能降速预警)</option>
                      <option value="低风险">低风险 (常规安全库存备用)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">加急申请原因说明：</label>
                    <textarea
                      rows={4}
                      value={urgentReason}
                      onChange={(e) => setUrgentReason(e.target.value)}
                      placeholder="请输入详细的加急申请原因，如产线急需、急料补充等..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-indigo-500 text-xs resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">加急申请部门/发起人：</label>
                      <input type="text" readOnly value="生产调度中心 - 周浩 (调度经理)" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">检验接收负责人：</label>
                      <input type="text" readOnly value="李明 (QC001 - 高级检验员)" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setShowCompUrgentModal(false)}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition text-xs shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirmUrgent}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition text-xs shadow-md"
                  >
                    确认加急
                  </button>
                </div>
              </div>
            </div>
          ) : showCompDeleteModal ? (
            /* Comprehensive Query - Delete / Invalidate Full Page */
            <div className="space-y-6">
              {/* Tab Header Navigation */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setShowCompDeleteModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-rose-600">
                  <span>综合查询 - 作废删除</span>
                  <button onClick={() => setShowCompDeleteModal(false)} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Warning Card */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-xs text-rose-800">
                <Trash2 className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm text-rose-900">⚠️ 严正警告：您正在作废删除检验任务单</p>
                  <p className="leading-relaxed">
                    您正在对物料编码为【{currentInspectItem?.code || '8020080021'}】（{currentInspectItem?.name || '车规级多层陶瓷电容器 22uF'}）的检验记录进行作废删除操作。此操作将从数据库中直接清除该单据，不可撤销！
                  </p>
                </div>
              </div>

              {/* Target Item Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-l-4 border-rose-600 pl-2">
                  <span>拟作废单据详情</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">供应商简称：</label>
                    <input type="text" readOnly value={currentInspectItem?.supplierAbbr || '村田中国'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货批次：</label>
                    <input type="text" readOnly value={currentInspectItem?.batch || '20261020'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货数量：</label>
                    <input type="text" readOnly value={currentInspectItem?.qty || '10000'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">派单时间：</label>
                    <input type="text" readOnly value={currentInspectItem?.dispatchTime || '2026-10-20 12:12'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono text-[11px]" />
                  </div>
                </div>
              </div>

              {/* Delete Form Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-l-4 border-rose-600 pl-2">
                  <span>作废审批与审计留痕</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">作废原因分类：</label>
                    <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-rose-500 text-slate-700">
                      <option value="单据录入重复">单据录入重复 (系统重复派单)</option>
                      <option value="供应商撤回">供应商撤回送货 (物流退回)</option>
                      <option value="批次重新送检">批次重发 (作废旧检验单)</option>
                      <option value="测试数据作废">测试数据作废</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">授权操作工号/签名：</label>
                    <input
                      type="text"
                      readOnly
                      value="QC001 - 李明 (质量调度员)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-slate-700 block mb-1.5">详细作废删除说明：</label>
                  <textarea
                    rows={4}
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="请输入详细的作废原因与审批编号..."
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-rose-500 text-xs resize-none"
                  />
                </div>

                <div className="flex items-center justify-center space-x-4 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setShowCompDeleteModal(false)}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition text-xs shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirmCompDelete}
                    className="px-8 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition text-xs shadow-md"
                  >
                    确认作废删除
                  </button>
                </div>
              </div>
            </div>
          ) : showCompChangeStatusModal ? (
            /* Comprehensive Query - Change Pending Node Full Page */
            <div className="space-y-6">
              {/* Tab Header Navigation */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setShowCompChangeStatusModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>综合查询 - 变更待检节点</span>
                  <button onClick={() => setShowCompChangeStatusModal(false)} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Basic Metadata Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">
                  <span>检验单进度节点信息</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">供应商简称：</label>
                    <input type="text" readOnly value={currentInspectItem?.supplierAbbr || '村田中国'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货批次：</label>
                    <input type="text" readOnly value={currentInspectItem?.batch || '20261020'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料编码：</label>
                    <input type="text" readOnly value={currentInspectItem?.code || '8020080021'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">当前进度节点：</label>
                    <input type="text" readOnly value={currentInspectItem?.progress || '待抽样'} className="w-full px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 font-bold" />
                  </div>
                </div>
              </div>

              {/* Node Change Form Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">
                  <span>质量节点变更控制</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">变更目标节点：</label>
                    <select
                      value={changeStatusTarget}
                      onChange={(e) => setChangeStatusTarget(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-bold text-indigo-600"
                    >
                      <option value="待抽样">待抽样 (重新进入抽样队列)</option>
                      <option value="检验中">检验中 (进入检验实验室测定)</option>
                      <option value="IQC主管审核">IQC主管审核 (等待初审量化评估)</option>
                      <option value="质量主管审核">质量主管审核 (进入终审决策)</option>
                      <option value="待复检">待复检 (复核测量偏离试样)</option>
                      <option value="暂缓检验">暂缓检验 (等待技术规范确认)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">变更执行责任人：</label>
                    <input type="text" readOnly value="李明 (QC001 - 质量调度员)" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-indigo-900 space-y-1">
                  <span className="font-bold block">节点流转关联影响提示：</span>
                  <p className="text-slate-600">
                    变更目标节点为【{changeStatusTarget}】后，单据将自动归集至对应工作台列表，并自动发送代办提示给节点负责人。
                  </p>
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-slate-700 block mb-1.5">节点变更原因说明：</label>
                  <textarea
                    rows={4}
                    value={changeStatusReason}
                    onChange={(e) => setChangeStatusReason(e.target.value)}
                    placeholder="请输入节点变更原因..."
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-indigo-500 text-xs resize-none"
                  />
                </div>

                <div className="flex items-center justify-center space-x-4 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setShowCompChangeStatusModal(false)}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition text-xs shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirmChangeStatus}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition text-xs shadow-md"
                  >
                    确认变更状态
                  </button>
                </div>
              </div>
            </div>
          ) : showCompChangeInspectorModal ? (
            /* Comprehensive Query - Change Inspector Full Page */
            <div className="space-y-6">
              {/* Tab Header Navigation */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setShowCompChangeInspectorModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>综合查询 - 变更检验员</span>
                  <button onClick={() => setShowCompChangeInspectorModal(false)} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Task Header Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">
                  <span>检验任务与原检验员信息</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料编码：</label>
                    <input type="text" readOnly value={currentInspectItem?.code || '8020080021'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料名称：</label>
                    <input type="text" readOnly value={currentInspectItem?.name || '车规级多层陶瓷电容器 22uF'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货批次：</label>
                    <input type="text" readOnly value={currentInspectItem?.batch || '20261020'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">当前指派检验员：</label>
                    <input type="text" readOnly value={currentInspectItem?.inspectorCode || 'QC001 - 周浩'} className="w-full px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 font-bold" />
                  </div>
                </div>
              </div>

              {/* Reassign Inspector Form Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">
                  <span>转派新检验员</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">新指派检验员：</label>
                    <select
                      value={changeInspectorTarget}
                      onChange={(e) => setChangeInspectorTarget(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-bold text-indigo-600"
                    >
                      <option value="QC001">QC001 - 周浩 (高级电子检验员)</option>
                      <option value="QC002">QC002 - 李明 (尺寸与外观专项组)</option>
                      <option value="QC003">QC003 - 王芳 (结构件与力学测定组)</option>
                      <option value="QC004">QC004 - 张伟 (可靠性试验组)</option>
                      <option value="QC005">QC005 - 陈静 (电气性能检测组)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">资质与负荷评估：</label>
                    <input type="text" readOnly value="资质匹配：高级电子检验资质 | 当前负载：3件待检" className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium" />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-slate-700 block mb-1.5">转派原因说明：</label>
                  <textarea
                    rows={4}
                    value={changeInspectorReason}
                    onChange={(e) => setChangeInspectorReason(e.target.value)}
                    placeholder="请输入转派原因，如负荷调整、专项检测等..."
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-indigo-500 text-xs resize-none"
                  />
                </div>

                <div className="flex items-center justify-center space-x-4 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setShowCompChangeInspectorModal(false)}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition text-xs shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirmChangeInspector}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition text-xs shadow-md"
                  >
                    确认转派检验员
                  </button>
                </div>
              </div>
            </div>
          ) : showCompEdit ? (
            /* Comprehensive Query Edit Page matching image_125fe5d3.png & image_a6190037.png */
            <div className="space-y-6">
              {/* Tab Header */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setShowCompEdit(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>综合查询</span>
                  <button onClick={() => setShowCompEdit(false)} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Top Metadata Fields */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">供应商简称：</label>
                    <input type="text" readOnly value={currentInspectItem?.supplierAbbr || '村田中国'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货批次：</label>
                    <input type="text" readOnly value={currentInspectItem?.batch || '20261020'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货数量：</label>
                    <input type="text" readOnly value={currentInspectItem?.qty || '10000'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料类型：</label>
                    <input type="text" readOnly value="常规物料" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料编码：</label>
                    <input type="text" readOnly value={currentInspectItem?.code || '8020080021'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料名称：</label>
                    <input type="text" readOnly value={currentInspectItem?.name || '车规级多层陶瓷电容器 22uF'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">图号：</label>
                    <input type="text" readOnly value="DWG-2026-0912" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">图纸版本号：</label>
                    <input type="text" readOnly value="V2.1" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-slate-500 font-medium block mb-1">厂家MLOT：</label>
                    <input type="text" readOnly value="MLOT20261020-01" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-slate-500 font-medium block mb-1">物料LPN：</label>
                    <input type="text" readOnly value="LPN9901" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">检验规范：</label>
                    <div className="py-2">
                      <a href="#spec" onClick={(e) => { e.preventDefault(); alert('正在查阅检验规范：QJ-QC-0219, QJ-QC-0298'); }} className="text-blue-600 hover:underline font-medium">
                        QJ-QC-0219, QJ-QC-0298
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">检验员：</label>
                    <input type="text" readOnly value="李明" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">检验员结论：</label>
                    <input type="text" readOnly value="合格" className="w-full px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">缺陷类别：</label>
                    <input type="text" readOnly value="无" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-slate-500 font-medium block mb-1">厂家报告：</label>
                    <div className="flex items-center space-x-2">
                      <a href="#report" onClick={(e) => { e.preventDefault(); alert('查看厂家报告：Murata_Certificate_20261020.pdf'); }} className="text-blue-600 hover:underline font-medium">
                        点击查看
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">不良描述：</label>
                    <textarea rows={2} defaultValue="物料外观正常，公差在标准范围内。" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 resize-none" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">备注：</label>
                    <textarea rows={2} defaultValue="" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 resize-none" />
                  </div>
                </div>
              </div>

              {/* Inspection Report Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3 text-xs">
                <h3 className="font-bold text-slate-800 text-sm border-l-4 border-indigo-600 pl-2">检验报告</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-600">检验报告：</span>
                  <a href="#rep" onClick={(e) => { e.preventDefault(); alert('查看检验报告全文'); }} className="text-blue-600 hover:underline font-medium">
                    点击查看
                  </a>
                </div>
              </div>

              {/* Audit / Edit Form Section matching image_a6190037.png */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 text-xs">
                <h3 className="font-bold text-slate-800 text-sm border-l-4 border-indigo-600 pl-2">审核</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">抽样数量：</label>
                      <input
                        type="text"
                        value={editSampleSize}
                        onChange={(e) => setEditSampleSize(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">不合格数量：</label>
                      <input
                        type="text"
                        value={editUnqualifiedQty}
                        onChange={(e) => setEditUnqualifiedQty(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">合格数量：</label>
                      <input
                        type="text"
                        value={editQualifiedQty}
                        onChange={(e) => setEditQualifiedQty(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-medium text-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="font-semibold text-slate-600 shrink-0">缺陷类别：</label>
                      {['A', 'B', 'C', 'D', '无'].map((cat) => (
                        <label key={cat} className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="radio"
                            name="editDefectClass"
                            checked={editDefectClass === cat}
                            onChange={() => setEditDefectClass(cat)}
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="font-semibold text-slate-600 shrink-0">检验结论：</label>
                      {['合格接收', '让步接收', '退货', '评审', '待检中', '退单'].map((c) => (
                        <label key={c} className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="radio"
                            name="editConclusion"
                            checked={editConclusion === c}
                            onChange={() => setEditConclusion(c)}
                          />
                          <span>{c}</span>
                        </label>
                      ))}
                      <div className="flex items-center space-x-1 ml-auto">
                        <label className="font-semibold text-slate-600 shrink-0">是否反写ERP</label>
                        <select
                          value={editWriteErp}
                          onChange={(e) => setEditWriteErp(e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg outline-none text-xs"
                        >
                          <option value="否">否</option>
                          <option value="是">是</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">不合格品对产品影响：</label>
                      <textarea
                        rows={3}
                        value={editImpact}
                        onChange={(e) => setEditImpact(e.target.value)}
                        placeholder="请输入不合格品对产品影响分析..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs resize-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">不合格品处理意见：</label>
                      <textarea
                        rows={3}
                        value={editAdvice}
                        onChange={(e) => setEditAdvice(e.target.value)}
                        placeholder="请输入不合格品处理意见..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">外检IQC主管：</label>
                      <select
                        value={editIqcSupervisor}
                        onChange={(e) => setEditIqcSupervisor(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                      >
                        <option value="张主管">张主管</option>
                        <option value="李主管">李主管</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">质量主管：</label>
                      <select
                        value={editQualityManager}
                        onChange={(e) => setEditQualityManager(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                      >
                        <option value="张伟">张伟 (高级质量主管)</option>
                        <option value="李敏">李敏 (IQC主管)</option>
                        <option value="王强">王强 (质量经理)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">发送邮件组：</label>
                      <select
                        value={editEmailGroup}
                        onChange={(e) => setEditEmailGroup(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                      >
                        <option value="支持多选">支持多选 (质量中心核心邮件组)</option>
                        <option value="IQC特采邮件组">IQC特采邮件组</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setShowCompEdit(false)}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition text-xs shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      alert('综合查询记录修改成功并已保存！');
                      setShowCompEdit(false);
                    }}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition text-xs shadow-sm"
                  >
                    提交
                  </button>
                </div>
              </div>
            </div>
          ) : showCompDetail ? (
            /* Comprehensive Query Detail / Report Detail Page matching image_6aa828c5.png & image_948cee43.png */
            <div className="space-y-6">
              {/* Tab Header */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setShowCompDetail(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>综合查询</span>
                  <button onClick={() => setShowCompDetail(false)} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Top Readonly Form Grid */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">供应商简称：</label>
                    <input type="text" readOnly value={currentInspectItem?.supplierAbbr || '村田中国'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货批次：</label>
                    <input type="text" readOnly value={currentInspectItem?.batch || '20261020'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货数量：</label>
                    <input type="text" readOnly value={currentInspectItem?.qty || '10000'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料类型：</label>
                    <input type="text" readOnly value="常规物料" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料编码：</label>
                    <input type="text" readOnly value={currentInspectItem?.code || '8020080021'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料名称：</label>
                    <input type="text" readOnly value={currentInspectItem?.name || '车规级多层陶瓷电容器 22uF'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">图号：</label>
                    <input type="text" readOnly value="DWG-2026-0912" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">图纸版本号：</label>
                    <input type="text" readOnly value="V2.1" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-slate-500 font-medium block mb-1">厂家MLOT：</label>
                    <input type="text" readOnly value="MLOT20261020-01" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-slate-500 font-medium block mb-1">物料LPN：</label>
                    <input type="text" readOnly value="LPN9901" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">检验规范：</label>
                    <div className="py-2">
                      <a href="#spec" onClick={(e) => { e.preventDefault(); alert('正在查阅检验规范：QJ-QC-0219, QJ-QC-0298'); }} className="text-blue-600 hover:underline font-medium">
                        QJ-QC-0219, QJ-QC-0298
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">检验员：</label>
                    <input type="text" readOnly value="李明" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">检验员结论：</label>
                    <input type="text" readOnly value="合格" className="w-full px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">缺陷类别：</label>
                    <input type="text" readOnly value="无" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-slate-500 font-medium block mb-1">厂家报告：</label>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded text-[11px] text-slate-600">选择文件</span>
                      <span className="text-slate-500 text-xs">未选择文件</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">不良描述：</label>
                    <textarea readOnly rows={2} value="" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 resize-none" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">备注：</label>
                    <textarea readOnly rows={2} value="" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 resize-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs pt-2">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">反馈单号：</label>
                    <input type="text" readOnly value="/" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">检验周期：</label>
                    <input type="text" readOnly value="1" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">派单时间：</label>
                    <input type="text" readOnly value="2026-10-20 12:12" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono text-[11px]" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">出单时间：</label>
                    <input type="text" readOnly value="2026-10-21 12:12" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono text-[11px]" />
                  </div>
                </div>
              </div>

              {/* Inspection Report Table Section matching image_6aa828c5.png */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center space-x-3">
                  <h3 className="font-bold text-slate-800 text-sm border-l-4 border-indigo-600 pl-2">检验报告</h3>
                  <button
                    onClick={() => alert('已成功导出检验报告 PDF 文件！')}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition shadow-sm"
                  >
                    导出检验报告
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 text-center w-12">序号</th>
                        <th className="p-3">检验项目</th>
                        <th className="p-3 text-center">AQL</th>
                        <th className="p-3 text-center">抽样数</th>
                        <th className="p-3">标准</th>
                        <th className="p-3">实测值</th>
                        <th className="p-3 text-center">合格数</th>
                        <th className="p-3 text-center">不合格数</th>
                        <th className="p-3 text-center">判定</th>
                        <th className="p-3 text-center">附件</th>
                        <th className="p-3">备注</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-center font-medium">1</td>
                        <td className="p-3 font-semibold">标识、包装</td>
                        <td className="p-3 text-center">—</td>
                        <td className="p-3 text-center">1</td>
                        <td className="p-3">检验规范</td>
                        <td className="p-3 font-mono">具备</td>
                        <td className="p-3 text-center font-bold text-emerald-600">1</td>
                        <td className="p-3 text-center">0</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">合格</span></td>
                        <td className="p-3 text-center"><a href="#att" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">附件1</a></td>
                        <td className="p-3 text-slate-400">—</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-center font-medium">2</td>
                        <td className="p-3 font-semibold">产品检验合格证明</td>
                        <td className="p-3 text-center">—</td>
                        <td className="p-3 text-center">1</td>
                        <td className="p-3">检验规范</td>
                        <td className="p-3 font-mono">具备</td>
                        <td className="p-3 text-center font-bold text-emerald-600">1</td>
                        <td className="p-3 text-center">0</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">合格</span></td>
                        <td className="p-3 text-center"><a href="#att" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">附件2</a></td>
                        <td className="p-3 text-slate-400">—</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-center font-medium">3</td>
                        <td className="p-3 font-semibold">外观</td>
                        <td className="p-3 text-center">2.5</td>
                        <td className="p-3 text-center">13</td>
                        <td className="p-3">检验规范</td>
                        <td className="p-3 font-mono">具备</td>
                        <td className="p-3 text-center font-bold text-emerald-600">13</td>
                        <td className="p-3 text-center">0</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">合格</span></td>
                        <td className="p-3 text-center text-slate-400">—</td>
                        <td className="p-3 text-slate-400">—</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-center font-medium">4</td>
                        <td className="p-3 font-semibold">安装面的平面度</td>
                        <td className="p-3 text-center">—</td>
                        <td className="p-3 text-center">5</td>
                        <td className="p-3">≤0.3</td>
                        <td className="p-3 font-mono">0.1/0.2/0.1/0.2/0.3</td>
                        <td className="p-3 text-center font-bold text-emerald-600">0</td>
                        <td className="p-3 text-center">0</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">合格</span></td>
                        <td className="p-3 text-center text-slate-400">—</td>
                        <td className="p-3 text-slate-400">—</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-center font-medium">6</td>
                        <td className="p-3 font-semibold">净重</td>
                        <td className="p-3 text-center">—</td>
                        <td className="p-3 text-center">5</td>
                        <td className="p-3">69.5-73.5</td>
                        <td className="p-3 font-mono">69.6/69.6/70.5/70.1/70.5</td>
                        <td className="p-3 text-center font-bold text-emerald-600">0</td>
                        <td className="p-3 text-center">0</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">合格</span></td>
                        <td className="p-3 text-center text-slate-400">—</td>
                        <td className="p-3 text-slate-400">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Conclusion Section matching image_948cee43.png */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3 text-xs">
                <h3 className="font-bold text-slate-800 text-sm border-l-4 border-indigo-600 pl-2">结论</h3>
                <div className="flex items-center space-x-2">
                  <label className="text-slate-600 font-semibold shrink-0">检验结论：</label>
                  <input
                    type="text"
                    readOnly
                    value={currentInspectItem?.conclusion || '合格接收'}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-emerald-700 font-bold w-48 text-xs"
                  />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-center space-x-4 pt-4">
                <button
                  onClick={() => alert('导出综合查询详情数据成功！')}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition text-xs shadow-md"
                >
                  导出
                </button>
                <button
                  onClick={() => setShowCompDetail(false)}
                  className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition text-xs shadow-md"
                >
                  返回
                </button>
              </div>
            </div>
          ) : showIqcAuditDetail ? (
            /* IQC Supervisor Audit Detail Page matching screenshots image_2fdccb67.png & image_88537455.png */
            <div className="space-y-6">
              {/* Tab Header */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setShowIqcAuditDetail(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>IQC主管审核</span>
                  <button onClick={() => setShowIqcAuditDetail(false)} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Top Info Form Grid */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">供应商简称：</label>
                    <input type="text" readOnly value={currentInspectItem?.supplierAbbr || '村田中国'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货批次：</label>
                    <input type="text" readOnly value={currentInspectItem?.batch || '20261020'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货数量：</label>
                    <input type="text" readOnly value={currentInspectItem?.qty || '10000'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料类型：</label>
                    <input type="text" readOnly value="常规物料" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料编码：</label>
                    <input type="text" readOnly value={currentInspectItem?.code || '8020080021'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料名称：</label>
                    <input type="text" readOnly value={currentInspectItem?.name || '车规级多层陶瓷电容器 22uF'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">图号：</label>
                    <input type="text" readOnly value="DWG-2026-0912" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">图纸版本号：</label>
                    <input type="text" readOnly value="V2.1" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">检验规范：</label>
                    <div className="py-2">
                      <a href="#spec" onClick={(e) => { e.preventDefault(); alert('正在查阅检验规范：QJ-QC-0219, QJ-QC-0298'); }} className="text-blue-600 hover:underline font-medium">
                        QJ-QC-0219, QJ-QC-0298
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">检验员：</label>
                    <input type="text" readOnly value={currentInspectItem?.inspector || '李明'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">检验员结论：</label>
                    <input type="text" readOnly value={currentInspectItem?.conclusion || '合格'} className="w-full px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">缺陷类别：</label>
                    <input type="text" readOnly value="无" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-slate-500 font-medium block mb-1">厂家报告：</label>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">选择文件</span>
                      <a href="#report" onClick={(e) => { e.preventDefault(); alert('正在下载厂家报告：Murata_Certificate_20261020.pdf'); }} className="text-blue-600 hover:underline text-xs">
                        Murata_Certificate_20261020.pdf
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">不良描述：</label>
                    <textarea readOnly rows={2} value="各项外观、包装、尺寸测试均符合标准，无开裂及氧化现象。" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 resize-none" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">备注：</label>
                    <textarea readOnly rows={2} value="加急车规级料，优先送检完成。" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 resize-none" />
                  </div>
                </div>
              </div>

              {/* Inspection Report Table matching screenshot */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-l-4 border-indigo-600 pl-2">检验报告</h3>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 text-center w-12">序号</th>
                        <th className="p-3">检验项目</th>
                        <th className="p-3 text-center">AQL</th>
                        <th className="p-3 text-center">抽样数</th>
                        <th className="p-3">标准</th>
                        <th className="p-3">实测值</th>
                        <th className="p-3 text-center">合格数</th>
                        <th className="p-3 text-center">不合格数</th>
                        <th className="p-3 text-center">判定</th>
                        <th className="p-3 text-center">附件</th>
                        <th className="p-3">备注</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-center font-medium">1</td>
                        <td className="p-3 font-semibold">标识、包装</td>
                        <td className="p-3 text-center">—</td>
                        <td className="p-3 text-center">1</td>
                        <td className="p-3">检验规范</td>
                        <td className="p-3 font-mono">具备</td>
                        <td className="p-3 text-center font-bold text-emerald-600">1</td>
                        <td className="p-3 text-center">0</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">合格</span></td>
                        <td className="p-3 text-center"><a href="#att" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">附件1</a></td>
                        <td className="p-3 text-slate-400">—</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-center font-medium">2</td>
                        <td className="p-3 font-semibold">产品检验合格证明</td>
                        <td className="p-3 text-center">—</td>
                        <td className="p-3 text-center">1</td>
                        <td className="p-3">检验规范</td>
                        <td className="p-3 font-mono">具备</td>
                        <td className="p-3 text-center font-bold text-emerald-600">1</td>
                        <td className="p-3 text-center">0</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">合格</span></td>
                        <td className="p-3 text-center"><a href="#att" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">附件2</a></td>
                        <td className="p-3 text-slate-400">—</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-center font-medium">3</td>
                        <td className="p-3 font-semibold">外观</td>
                        <td className="p-3 text-center">2.5</td>
                        <td className="p-3 text-center">13</td>
                        <td className="p-3">检验规范</td>
                        <td className="p-3 font-mono">具备</td>
                        <td className="p-3 text-center font-bold text-emerald-600">13</td>
                        <td className="p-3 text-center">0</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">合格</span></td>
                        <td className="p-3 text-center text-slate-400">—</td>
                        <td className="p-3 text-slate-400">—</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-center font-medium">4</td>
                        <td className="p-3 font-semibold">安装面的平面度</td>
                        <td className="p-3 text-center">—</td>
                        <td className="p-3 text-center">5</td>
                        <td className="p-3">≤0.3</td>
                        <td className="p-3 font-mono">0.1/0.2/0.1/0.2/0.3</td>
                        <td className="p-3 text-center font-bold text-emerald-600">5</td>
                        <td className="p-3 text-center">0</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">合格</span></td>
                        <td className="p-3 text-center text-slate-400">—</td>
                        <td className="p-3 text-slate-400">—</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 text-center font-medium">5</td>
                        <td className="p-3 font-semibold">净重</td>
                        <td className="p-3 text-center">—</td>
                        <td className="p-3 text-center">5</td>
                        <td className="p-3">69.5-73.5</td>
                        <td className="p-3 font-mono">69.6/69.6/70.5/70.1/70.5</td>
                        <td className="p-3 text-center font-bold text-emerald-600">5</td>
                        <td className="p-3 text-center">0</td>
                        <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">合格</span></td>
                        <td className="p-3 text-center text-slate-400">—</td>
                        <td className="p-3 text-slate-400">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Action Section matching image_88537455.png */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                <h3 className="font-bold text-slate-800 text-sm border-l-4 border-indigo-600 pl-2">审核</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-6">
                      <label className="font-semibold text-slate-600 w-24">审核：</label>
                      <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="auditDecision"
                            checked={auditDecision === '通过'}
                            onChange={() => {
                              setAuditDecision('通过');
                              setAuditRejectReason('');
                              setAuditImpact('各项指标及检验项目均符合技术规范，不影响产品装配与电性能。');
                              setAuditComprehensive('合格接收');
                              setAuditAdvice('同意接收，按常规入库流程处理，并抄送质量档案。');
                            }}
                          />
                          <span className="font-medium text-emerald-700">通过</span>
                        </label>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="auditDecision"
                            checked={auditDecision === '驳回'}
                            onChange={() => {
                              setAuditDecision('驳回');
                              setAuditRejectReason('送货实测数据超出图纸技术规范要求（如尺寸、外观或性能不达标），不符合出厂质量标准。');
                              setAuditImpact('物料存在严重质量缺陷，若投入生产将直接导致产品装配失效或性能故障，影响重大。');
                              setAuditComprehensive('退货');
                              setAuditAdvice('不合格品全数退回供应商，并要求供应商在3个工作日内提交8D整改报告。');
                            }}
                          />
                          <span className="font-medium text-rose-700">驳回</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-600 block mb-1.5">
                        不合格品对产品影响 {auditDecision === '驳回' && <span className="text-rose-600 font-bold">*</span>}
                      </label>
                      <textarea
                        rows={3}
                        value={auditImpact}
                        onChange={(e) => setAuditImpact(e.target.value)}
                        placeholder="请输入不合格品对产品影响分析..."
                        className={`w-full px-3 py-2 border rounded-xl outline-none text-xs resize-none ${
                          auditDecision === '驳回'
                            ? 'bg-rose-50/40 border-rose-300 focus:border-rose-500 text-rose-900 font-medium'
                            : 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-700'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-600 block mb-1.5">综合结论：</label>
                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input type="radio" name="auditComprehensive" checked={auditComprehensive === '合格接收'} onChange={() => setAuditComprehensive('合格接收')} />
                          <span className={auditDecision === '通过' ? 'text-emerald-700 font-semibold' : ''}>合格接收</span>
                        </label>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input type="radio" name="auditComprehensive" checked={auditComprehensive === '让步接收'} onChange={() => setAuditComprehensive('让步接收')} />
                          <span>让步接收</span>
                        </label>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input type="radio" name="auditComprehensive" checked={auditComprehensive === '退货'} onChange={() => setAuditComprehensive('退货')} />
                          <span className={auditDecision === '驳回' ? 'text-rose-700 font-semibold' : ''}>退货</span>
                        </label>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input type="radio" name="auditComprehensive" checked={auditComprehensive === '评审'} onChange={() => setAuditComprehensive('评审')} />
                          <span>评审</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1.5 flex items-center justify-between">
                        <span>驳回原因：</span>
                        {auditDecision === '通过' && (
                          <span className="text-emerald-600 font-normal text-[11px]">（审核通过，无需填写驳回原因）</span>
                        )}
                        {auditDecision === '驳回' && (
                          <span className="text-rose-600 font-bold text-[11px]">（必填项）</span>
                        )}
                      </label>
                      <textarea
                        rows={3}
                        value={auditRejectReason}
                        disabled={auditDecision === '通过'}
                        onChange={(e) => setAuditRejectReason(e.target.value)}
                        placeholder={auditDecision === '通过' ? '审核已通过，无需填写驳回原因...' : '请输入详细的驳回原因，如实测值超差、包装破损等...'}
                        className={`w-full px-3 py-2 border rounded-xl outline-none text-xs resize-none ${
                          auditDecision === '通过'
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-rose-50/40 border-rose-300 focus:border-rose-500 text-rose-900 font-medium'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-600 block mb-1.5">不合格品处理意见：</label>
                      <textarea
                        rows={3}
                        value={auditAdvice}
                        onChange={(e) => setAuditAdvice(e.target.value)}
                        placeholder="请输入不合格品处理意见..."
                        className={`w-full px-3 py-2 border rounded-xl outline-none text-xs resize-none ${
                          auditDecision === '驳回'
                            ? 'bg-rose-50/40 border-rose-300 focus:border-rose-500 text-rose-900'
                            : 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-700'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">质量主管：</label>
                        <select
                          value={auditManager}
                          onChange={(e) => setAuditManager(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                        >
                          <option value="张伟">张伟 (高级质量主管)</option>
                          <option value="李敏">李敏 (IQC主管)</option>
                          <option value="王强">王强 (质量经理)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">发送邮件组：</label>
                        <select
                          value={auditEmailGroup}
                          onChange={(e) => setAuditEmailGroup(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                        >
                          <option value="质量中心核心邮件组 (qa_group@company.com)">质量中心核心邮件组</option>
                          <option value="IQC特采邮件组 (iqc_special@company.com)">IQC特采邮件组</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setShowIqcAuditDetail(false)}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition text-xs shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      alert('IQC主管审核提交成功！进度已流转至质量主管审核阶段。');
                      setShowIqcAuditDetail(false);
                    }}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition text-xs shadow-md"
                  >
                    提交
                  </button>
                </div>
              </div>
            </div>
          ) : showInspectionMaintenance ? (
            /* Inspection Maintenance / Paperless Inspection View matching screenshots image_a52c3855.png & image_9e952f01.png */
            <div className="space-y-6">
              {/* Tab Header */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setShowInspectionMaintenance(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>我的检验-无纸</span>
                  <button onClick={() => setShowInspectionMaintenance(false)} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Top Info Form Grid */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">供应商简称：</label>
                    <input type="text" readOnly value={currentInspectItem?.supplierAbbr || '供应1'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货批次：</label>
                    <input type="text" readOnly value={currentInspectItem?.batch || '20211212'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">送货数量：</label>
                    <input type="text" readOnly value={currentInspectItem?.qty || '2000'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料类型：</label>
                    <input type="text" readOnly value="电子元器件" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料编码：</label>
                    <input type="text" readOnly value={currentInspectItem?.code || '1000001'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">物料名称：</label>
                    <input type="text" readOnly value={currentInspectItem?.name || '内容内容'} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">图号：</label>
                    <input type="text" defaultValue="DWG-2026-01" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">图纸版本号：</label>
                    <input type="text" defaultValue="v1.2" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">检验规范：</span>
                  <a href="#spec" onClick={(e) => { e.preventDefault(); alert('正在查看标准规范: QJ-QC-0219, QJ-QC-0298'); }} className="text-blue-600 hover:underline font-medium">
                    QJ-QC-0219, QJ-QC-0298
                  </a>
                </div>
              </div>

              {/* Inspection Report Table Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">
                  <span>检验报告</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 text-center w-12">序号</th>
                        <th className="p-3">检验项目</th>
                        <th className="p-3 text-center w-24">检验方案</th>
                        <th className="p-3 text-center w-20">抽样数</th>
                        <th className="p-3">标准</th>
                        <th className="p-3 text-center w-20">手动输入</th>
                        <th className="p-3">实测值</th>
                        <th className="p-3 text-center w-20">合格数</th>
                        <th className="p-3 text-center w-20">不合格数</th>
                        <th className="p-3 text-center w-28">判定</th>
                        <th className="p-3 w-32">附件</th>
                        <th className="p-3 w-40">备注</th>
                        <th className="p-3 text-center w-16">编辑</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      {inspectionRows.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-center font-medium">{idx + 1}</td>
                          <td className="p-3 font-semibold text-slate-800">
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) => {
                                const updated = [...inspectionRows];
                                updated[idx].name = e.target.value;
                                setInspectionRows(updated);
                              }}
                              className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded outline-none"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <select
                              value={row.plan}
                              onChange={(e) => {
                                const updated = [...inspectionRows];
                                updated[idx].plan = e.target.value;
                                setInspectionRows(updated);
                              }}
                              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded outline-none text-xs"
                            >
                              <option value="—">—</option>
                              <option value="S-2">S-2</option>
                              <option value="S-3">S-3</option>
                            </select>
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              value={row.sample}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const updated = [...inspectionRows];
                                updated[idx].sample = val;
                                updated[idx].qualified = val - updated[idx].unqualified;
                                setInspectionRows(updated);
                              }}
                              className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-center outline-none"
                            />
                          </td>
                          <td className="p-3 font-mono">
                            <input
                              type="text"
                              value={row.std}
                              onChange={(e) => {
                                const updated = [...inspectionRows];
                                updated[idx].std = e.target.value;
                                setInspectionRows(updated);
                              }}
                              className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded outline-none font-mono"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={row.manual}
                              onChange={(e) => {
                                const updated = [...inspectionRows];
                                updated[idx].manual = e.target.checked;
                                setInspectionRows(updated);
                              }}
                              className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {row.values.map((v, vIdx) => (
                                <input
                                  key={vIdx}
                                  type="text"
                                  value={v}
                                  onChange={(e) => {
                                    const updated = [...inspectionRows];
                                    updated[idx].values[vIdx] = e.target.value;
                                    setInspectionRows(updated);
                                  }}
                                  className="w-14 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-center font-mono text-xs outline-none focus:border-indigo-500"
                                  placeholder={`测${vIdx + 1}`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-center font-bold text-emerald-600">
                            <input
                              type="number"
                              value={row.qualified}
                              onChange={(e) => {
                                const updated = [...inspectionRows];
                                updated[idx].qualified = parseInt(e.target.value) || 0;
                                setInspectionRows(updated);
                              }}
                              className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-center outline-none font-bold text-emerald-600"
                            />
                          </td>
                          <td className="p-3 text-center font-bold text-rose-600">
                            <input
                              type="number"
                              value={row.unqualified}
                              onChange={(e) => {
                                const updated = [...inspectionRows];
                                updated[idx].unqualified = parseInt(e.target.value) || 0;
                                setInspectionRows(updated);
                              }}
                              className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-center outline-none font-bold text-rose-600"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <select
                              value={row.result}
                              onChange={(e) => {
                                const updated = [...inspectionRows];
                                updated[idx].result = e.target.value;
                                setInspectionRows(updated);
                              }}
                              className={`px-2 py-1 rounded font-semibold text-xs outline-none ${row.result === '合格' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
                            >
                              <option value="合格">合格</option>
                              <option value="不合格">不合格</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <label className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] cursor-pointer text-slate-700 font-medium">
                                <span>选择文件</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const updated = [...inspectionRows];
                                      updated[idx].file = file.name;
                                      setInspectionRows(updated);
                                    }
                                  }}
                                />
                              </label>
                              <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                                {row.file || '未选择任何文件'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={row.remark}
                              onChange={(e) => {
                                const updated = [...inspectionRows];
                                updated[idx].remark = e.target.value;
                                setInspectionRows(updated);
                              }}
                              placeholder="填写备注"
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs outline-none"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteInspectionRow(row.id)}
                              className="text-rose-600 hover:underline font-semibold"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <button
                    onClick={handleAddInspectionRow}
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-semibold text-xs py-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加检验行</span>
                  </button>
                </div>
              </div>

              {/* Overall Assessment & Controls */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  <div className="flex items-center space-x-4">
                    <label className="font-semibold text-slate-700">综合判定：</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input type="radio" name="overallResult" checked={overallResult === '合格'} onChange={() => setOverallResult('合格')} className="text-indigo-600" />
                        <span className="font-medium text-slate-700">合格</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input type="radio" name="overallResult" checked={overallResult === '不合格'} onChange={() => setOverallResult('不合格')} className="text-indigo-600" />
                        <span className="font-medium text-slate-700">不合格</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="font-semibold text-slate-700">缺陷类别：</label>
                    <div className="flex items-center space-x-3">
                      {['A', 'B', 'C', 'D', '无'].map(cat => (
                        <label key={cat} className="flex items-center space-x-1 cursor-pointer">
                          <input type="radio" name="defectCategory" checked={defectCategory === cat} onChange={() => setDefectCategory(cat)} className="text-indigo-600" />
                          <span className="font-medium text-slate-700">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="font-semibold text-slate-700">质保书：</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input type="radio" name="warrantyCard" checked={warrantyCard === '有'} onChange={() => setWarrantyCard('有')} className="text-indigo-600" />
                        <span className="font-medium text-slate-700">有</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input type="radio" name="warrantyCard" checked={warrantyCard === '无'} onChange={() => setWarrantyCard('无')} className="text-indigo-600" />
                        <span className="font-medium text-slate-700">无</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-3">
                    <label className="w-20 font-semibold text-slate-700">上传报告：</label>
                    <div className="flex-1 flex items-center space-x-2">
                      <input type="file" className="hidden" id="reportFile" />
                      <label htmlFor="reportFile" className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium cursor-pointer transition shadow-sm">
                        选取文件
                      </label>
                      <input type="text" readOnly placeholder="未选择任何文件" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-500 text-xs" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="w-20 font-semibold text-slate-700">厂家报告：</label>
                    <div className="flex-1 flex items-center space-x-2">
                      <input type="file" className="hidden" id="factoryFile" />
                      <label htmlFor="factoryFile" className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium cursor-pointer transition shadow-sm">
                        选取文件
                      </label>
                      <input type="text" readOnly placeholder="未选择任何文件" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-500 text-xs" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Judgment / Bad Description & Remarks Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">
                  <span>结果判定</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-700 text-xs">不良描述：</label>
                      <div className="space-x-2">
                        <button
                          type="button"
                          onClick={handleAutoBadDesc}
                          className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[11px] font-semibold transition shadow-sm"
                        >
                          自动
                        </button>
                        <button
                          type="button"
                          onClick={handleClearBadDesc}
                          className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[11px] font-semibold transition shadow-sm"
                        >
                          清除
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={5}
                      value={badDescription}
                      onChange={(e) => setBadDescription(e.target.value)}
                      placeholder="请输入不良描述或点击自动生成..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-indigo-500 text-xs resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-slate-700 text-xs block">备注：</label>
                    <textarea
                      rows={5}
                      value={inspectionRemark}
                      onChange={(e) => setInspectionRemark(e.target.value)}
                      placeholder="请输入检验备注信息..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-indigo-500 text-xs resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setShowInspectionMaintenance(false)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow transition"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleResetInspectionForm}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-xs shadow transition"
                  >
                    重置
                  </button>
                  <button
                    onClick={handleSaveDraftInspection}
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold text-xs shadow transition"
                  >
                    临时保存
                  </button>
                  <button
                    onClick={handleSubmitInspection}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow transition"
                  >
                    提交
                  </button>
                </div>
              </div>
            </div>
          ) : activeMenu === '我的检验' || activeMenu === '物料检验' ? (
            /* My Inspection Table Layout matching screenshot and descending sort */
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-slate-600">物料编码:</label>
                  <input
                    type="text"
                    placeholder="请输入物料编码"
                    value={inspectMaterialCode}
                    onChange={(e) => setInspectMaterialCode(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-500 w-48"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-slate-600">供方代码:</label>
                  <input
                    type="text"
                    placeholder="请输入供方代码"
                    value={inspectSupplierCode}
                    onChange={(e) => setInspectSupplierCode(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-500 w-48"
                  />
                </div>

                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    onClick={handleSearchInspect}
                    className="flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                  <button
                    onClick={handleResetInspect}
                    className="flex items-center space-x-1.5 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>我的检验任务列表 (时间降序排列)</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 text-center w-12">序号</th>
                        <th className="p-3 text-center w-20">操作</th>
                        <th className="p-3 text-center">状态</th>
                        <th className="p-3">物料编码</th>
                        <th className="p-3">物料名称</th>
                        <th className="p-3">规格型号</th>
                        <th className="p-3">供方代码</th>
                        <th className="p-3">供方简称</th>
                        <th className="p-3">批次 (降序)</th>
                        <th className="p-3">数量</th>
                        <th className="p-3">检验员</th>
                        <th className="p-3 text-center">加急</th>
                        <th className="p-3">收货单号</th>
                        <th className="p-3">预计使用时间</th>
                        <th className="p-3">状态</th>
                        <th className="p-3">收货库位</th>
                        <th className="p-3">驳回原因</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      {inspectList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-center font-medium">{idx + 1}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => openInspectionMaintenance(item)}
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              维护
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${item.status === '待抽样' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-800">{item.code}</td>
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="p-3 font-mono">{item.spec}</td>
                          <td className="p-3 font-mono">{item.supplierCode}</td>
                          <td className="p-3">{item.supplierAbbr}</td>
                          <td className="p-3 font-mono font-bold text-indigo-600">{item.batch}</td>
                          <td className="p-3 font-bold">{item.qty}</td>
                          <td className="p-3">{item.inspector}</td>
                          <td className="p-3 text-center">
                            <span className="text-rose-600 font-bold">{item.urgent}</span>
                          </td>
                          <td className="p-3 font-mono">{item.goodsNo}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">{item.expectedTime}</td>
                          <td className="p-3 font-medium">{item.dispatchStatus}</td>
                          <td className="p-3 font-mono">{item.location}</td>
                          <td className="p-3 text-slate-400">{item.rejectReason || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 200 条记录 第 1 / 60 页</span>
                  <div className="flex items-center space-x-1">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded font-medium">1</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">2</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">3</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">4</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">5</button>
                    <span className="px-2">10条/页</span>
                    <span>跳至</span>
                    <input type="text" defaultValue="1" className="w-10 px-2 py-1 border border-slate-300 rounded text-center" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === 'IQC主管审核' ? (
            /* IQC Supervisor Audit Table Layout matching screenshot image_61ef8bf9.png */
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveMenu('首页')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>IQC主管审核</span>
                  <button onClick={() => setActiveMenu('首页')} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-slate-600">物料编码：</label>
                  <input
                    type="text"
                    placeholder="请输入物料编码"
                    value={iqcMaterialCode}
                    onChange={(e) => setIqcMaterialCode(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-500 w-48"
                  />
                </div>

                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    onClick={handleSearchIqcAudit}
                    className="flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                  <button
                    onClick={handleResetIqcAudit}
                    className="flex items-center space-x-1.5 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>IQC主管审核任务列表 (时间降序排列)</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 text-center w-12">序号</th>
                        <th className="p-3 text-center w-24">操作</th>
                        <th className="p-3">物料编码</th>
                        <th className="p-3">物料名称</th>
                        <th className="p-3">供方简称</th>
                        <th className="p-3">批次 (降序)</th>
                        <th className="p-3">数量</th>
                        <th className="p-3">检验员</th>
                        <th className="p-3 text-center">检验员结论</th>
                        <th className="p-3 text-center">进度节点</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      {iqcAuditList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-center font-medium">{idx + 1}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setCurrentInspectItem(item);
                                setShowIqcAuditDetail(true);
                              }}
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              审核
                            </button>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-800">{item.code}</td>
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="p-3">{item.supplierAbbr}</td>
                          <td className="p-3 font-mono font-bold text-indigo-600">{item.batch}</td>
                          <td className="p-3 font-bold">{item.qty}</td>
                          <td className="p-3">{item.inspector}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${item.conclusion === '合格' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              {item.conclusion}
                            </span>
                          </td>
                          <td className="p-3 text-center font-semibold text-indigo-600">{item.progress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 200 条记录 第 1 / 60 页</span>
                  <div className="flex items-center space-x-1">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded font-medium">1</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">2</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">3</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">4</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">5</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">6</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">7</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">8</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">9</button>
                    <span className="px-2">10条/页</span>
                    <span>跳至</span>
                    <input type="text" defaultValue="5" className="w-10 px-2 py-1 border border-slate-300 rounded text-center" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '质量主管审核' ? (
            /* Quality Manager Audit Table Layout matching screenshot image_985182bf.png */
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveMenu('首页')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>质量主管审核</span>
                  <button onClick={() => setActiveMenu('首页')} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-slate-600">物料编码：</label>
                  <input
                    type="text"
                    placeholder="请输入物料编码"
                    value={qmMaterialCode}
                    onChange={(e) => setQmMaterialCode(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-500 w-48"
                  />
                </div>

                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    onClick={handleSearchQmAudit}
                    className="flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                  <button
                    onClick={handleResetQmAudit}
                    className="flex items-center space-x-1.5 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>质量主管审核任务列表 (时间降序排列)</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 text-center w-12">序号</th>
                        <th className="p-3 text-center w-24">操作</th>
                        <th className="p-3">物料编码</th>
                        <th className="p-3">物料名称</th>
                        <th className="p-3">供方简称</th>
                        <th className="p-3">批次 (降序)</th>
                        <th className="p-3">数量</th>
                        <th className="p-3 text-center">IQC主管结论</th>
                        <th className="p-3 text-center">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      {qmAuditList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-center font-medium">{idx + 1}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setCurrentInspectItem(item);
                                setShowIqcAuditDetail(true);
                              }}
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              审核
                            </button>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-800">{item.code}</td>
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="p-3">{item.supplierAbbr}</td>
                          <td className="p-3 font-mono font-bold text-indigo-600">{item.batch}</td>
                          <td className="p-3 font-bold">{item.qty}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${item.iqcConclusion === '退货' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                              {item.iqcConclusion}
                            </span>
                          </td>
                          <td className="p-3 text-center font-semibold text-indigo-600">{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 200 条记录 第 1 / 60 页</span>
                  <div className="flex items-center space-x-1">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded font-medium">1</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">2</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">3</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">4</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">5</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">6</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">7</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">8</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">9</button>
                    <span className="px-2">10条/页</span>
                    <span>跳至</span>
                    <input type="text" defaultValue="5" className="w-10 px-2 py-1 border border-slate-300 rounded text-center" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '综合查询' ? (
            /* Comprehensive Query Table Layout matching screenshots image_d1e58989.png & image_b7a3e44d.png */
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveMenu('首页')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>综合查询</span>
                  <button onClick={() => setActiveMenu('首页')} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Search Form Filter Grid matching image_d1e58989.png */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <label className="text-slate-600 font-semibold w-20 shrink-0 text-right">物料编码：</label>
                    <input
                      type="text"
                      placeholder="请输入物料编码"
                      value={compMaterialCode}
                      onChange={(e) => setCompMaterialCode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-slate-600 font-semibold w-20 shrink-0 text-right">物料名称：</label>
                    <input
                      type="text"
                      placeholder="请输入物料名称"
                      value={compMaterialName}
                      onChange={(e) => setCompMaterialName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-slate-600 font-semibold w-20 shrink-0 text-right">供方代码：</label>
                    <input
                      type="text"
                      placeholder="请输入供方代码"
                      value={compSupplierCode}
                      onChange={(e) => setCompSupplierCode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-slate-600 font-semibold w-20 shrink-0 text-right">供方简称：</label>
                    <input
                      type="text"
                      placeholder="请输入供方简称"
                      value={compSupplierAbbr}
                      onChange={(e) => setCompSupplierAbbr(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-slate-600 font-semibold w-20 shrink-0 text-right">公司：</label>
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500">
                      <option value="">全部公司</option>
                      <option value="总部工厂">总部工厂</option>
                      <option value="华东分厂">华东分厂</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-slate-600 font-semibold w-20 shrink-0 text-right">检验员：</label>
                    <input
                      type="text"
                      placeholder="请输入检验员"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-slate-600 font-semibold w-20 shrink-0 text-right">检验结论：</label>
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500">
                      <option value="">全部结论</option>
                      <option value="合格接收">合格接收</option>
                      <option value="让步接收">让步接收</option>
                      <option value="退货">退货</option>
                      <option value="评审">评审</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-slate-600 font-semibold w-20 shrink-0 text-right">进度节点：</label>
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500">
                      <option value="">全部节点</option>
                      <option value="待抽样">待抽样</option>
                      <option value="检验中">检验中</option>
                      <option value="IQC主管审核">IQC主管审核</option>
                      <option value="质量主管审核">质量主管审核</option>
                      <option value="已完结">已完结</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-slate-600 font-semibold w-20 shrink-0 text-right">检验类型：</label>
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500">
                      <option value="常规检验物料">常规检验物料</option>
                      <option value="首件检验">首件检验</option>
                      <option value="巡检">巡检</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-slate-600 font-semibold w-20 shrink-0 text-right">收货库位：</label>
                    <input
                      type="text"
                      placeholder="请输入库位"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center space-x-2 justify-end">
                    <button
                      onClick={handleSearchComp}
                      className="flex items-center space-x-1.5 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      onClick={handleResetComp}
                      className="flex items-center space-x-1.5 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Layout matching image_d1e58989.png & image_b7a3e44d.png */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>综合查询任务列表 (近几期数据降序排列)</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 text-center w-12">序号</th>
                        <th className="p-3 text-center w-36">操作1</th>
                        <th className="p-3 text-center w-32">操作2</th>
                        <th className="p-3 text-center">常规检</th>
                        <th className="p-3 text-center">化验室</th>
                        <th className="p-3 text-center">进度节点</th>
                        <th className="p-3">物料编码</th>
                        <th className="p-3">物料名称</th>
                        <th className="p-3">规格型号</th>
                        <th className="p-3">供方简称</th>
                        <th className="p-3">批次 (降序)</th>
                        <th className="p-3">数量</th>
                        <th className="p-3">预计使用时间</th>
                        <th className="p-3">派单时间</th>
                        <th className="p-3">收货库位</th>
                        <th className="p-3 text-center">检验员代号</th>
                        <th className="p-3">物料类型</th>
                        <th className="p-3 text-center">检验结论</th>
                        <th className="p-3 text-center">反馈编号</th>
                        <th className="p-3 text-center">检验报告</th>
                        <th className="p-3">备注</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      {compList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-center font-medium">{idx + 1}</td>
                          <td className="p-3 text-center space-x-1.5">
                            <button onClick={() => { setCurrentInspectItem(item); setShowCompUrgentModal(true); }} className="text-indigo-600 hover:underline font-semibold">加急</button>
                            <button onClick={() => { setCurrentInspectItem(item); setShowCompEdit(true); }} className="text-blue-600 hover:underline font-semibold">编辑</button>
                            <button onClick={() => { setCurrentInspectItem(item); setShowCompDeleteModal(true); }} className="text-rose-600 hover:underline font-semibold">删除</button>
                          </td>
                          <td className="p-3 text-center space-y-1">
                            <div><button onClick={() => { setCurrentInspectItem(item); setShowCompChangeStatusModal(true); }} className="text-blue-600 hover:underline font-semibold">变更待检</button></div>
                            <div><button onClick={() => { setCurrentInspectItem(item); setShowCompChangeInspectorModal(true); }} className="text-blue-600 hover:underline font-semibold">变更检验员</button></div>
                          </td>
                          <td className="p-3 text-center"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[11px] font-semibold">{item.routineCheck}</span></td>
                          <td className="p-3 text-center text-slate-400">{item.lab}</td>
                          <td className="p-3 text-center font-semibold text-indigo-600">{item.progress}</td>
                          <td className="p-3 font-mono font-bold text-slate-800">{item.code}</td>
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="p-3 font-mono">{item.spec}</td>
                          <td className="p-3">{item.supplierAbbr}</td>
                          <td className="p-3 font-mono font-bold text-indigo-600">{item.batch}</td>
                          <td className="p-3 font-bold">{item.qty}</td>
                          <td className="p-3 font-mono text-slate-500">{item.expectedTime}</td>
                          <td className="p-3 font-mono text-slate-500">{item.dispatchTime}</td>
                          <td className="p-3 font-mono">{item.location}</td>
                          <td className="p-3 text-center font-mono">{item.inspectorCode}</td>
                          <td className="p-3">{item.materialType}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              item.conclusion === '合格接收' ? 'bg-emerald-50 text-emerald-700' :
                              item.conclusion === '让步接收' ? 'bg-amber-50 text-amber-700' :
                              item.conclusion === '退货' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                              {item.conclusion}
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono text-slate-500">{item.feedbackNo}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => { setCurrentInspectItem(item); setShowCompDetail(true); }} className="text-blue-600 hover:underline font-semibold">
                              {item.report}
                            </button>
                          </td>
                          <td className="p-3 text-slate-400">—</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 200 条记录 第 1 / 60 页</span>
                  <div className="flex items-center space-x-1">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded font-medium">1</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">2</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">3</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">4</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">5</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">6</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">7</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">8</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">9</button>
                    <span className="px-2">10条/页</span>
                    <span>跳至</span>
                    <input type="text" defaultValue="5" className="w-10 px-2 py-1 border border-slate-300 rounded text-center" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '供应商清单' ? (
            /* Supplier List Page matching screenshot image_6099a5d6.png */
            <div className="space-y-6">
              {/* Tab Header */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveMenu('首页')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>供应商清单</span>
                  <button onClick={() => setActiveMenu('首页')} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Search Form Filter Grid matching image_6099a5d6.png */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <label className="font-semibold text-slate-600">供方代号：</label>
                  <input
                    type="text"
                    value={supplierCodeFilter}
                    onChange={(e) => setSupplierCodeFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 w-48 font-mono"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="font-semibold text-slate-600">供方简称：</label>
                  <input
                    type="text"
                    value={supplierAbbrFilter}
                    onChange={(e) => setSupplierAbbrFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 w-48"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSearchSupplier}
                    className="flex items-center space-x-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                  <button
                    onClick={handleResetSupplier}
                    className="flex items-center space-x-1 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-xl text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons Toolbar matching screenshot image_6099a5d6.png */}
              <div className="flex items-center space-x-3 text-xs">
                <button
                  onClick={() => {
                    setSuppFormCode(`101${Math.floor(Math.random() * 800 + 100)}`);
                    setSuppFormAbbr('');
                    setSuppFormFullName('');
                    setShowAddSupplierModal(true);
                  }}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增</span>
                </button>
                <button
                  onClick={() => alert('请选择要导入的供应商 Excel 数据表文件')}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow transition"
                >
                  <span>导入</span>
                </button>
                <button
                  onClick={() => alert('已成功导出全量供应商清单数据（.xlsx）')}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow transition"
                >
                  <span>导出</span>
                </button>
                <button
                  onClick={() => alert('正在下载供应商标准录入模板文件：Supplier_Import_Template.xlsx')}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition"
                >
                  <span>模板下载</span>
                </button>
              </div>

              {/* Supplier Data Table matching screenshot image_6099a5d6.png */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 text-center w-16">序号</th>
                        <th className="p-3 text-center w-32">供方代号</th>
                        <th className="p-3">供方简称</th>
                        <th className="p-3">供方全称</th>
                        <th className="p-3 text-center w-48">更新时间</th>
                        <th className="p-3 text-center w-28">更新人</th>
                        <th className="p-3 text-center w-32">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      {supplierList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-center font-medium">{idx + 1}</td>
                          <td className="p-3 text-center font-mono font-bold text-slate-800">{item.code}</td>
                          <td className="p-3 font-semibold text-slate-800">{item.abbr}</td>
                          <td className="p-3 font-medium text-slate-700">{item.fullName}</td>
                          <td className="p-3 text-center font-mono text-indigo-600 font-semibold">{item.updateTime}</td>
                          <td className="p-3 text-center font-medium">{item.updater}</td>
                          <td className="p-3 text-center space-x-3">
                            <button onClick={() => openEditSupplier(item)} className="text-blue-600 hover:underline font-semibold">编辑</button>
                            <button onClick={() => openDeleteSupplierModal(item)} className="text-blue-600 hover:underline font-semibold">删除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer matching screenshot image_6099a5d6.png */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 200 条记录 第 1 / 60 页</span>
                  <div className="flex items-center space-x-1">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded font-medium">1</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">2</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">3</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">4</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">5</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">6</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">7</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">8</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">9</button>
                    <span className="px-2">10条/页</span>
                    <span>跳至</span>
                    <input type="text" defaultValue="5" className="w-10 px-2 py-1 border border-slate-300 rounded text-center" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '定点物料' || activeMenu === '定点物料信息' || activeMenu === '定点信息' ? (
            /* Designated Material Page matching screenshot image_28034a68.png */
            <div className="space-y-6">
              {/* Tab Header */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveMenu('首页')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  首页
                </button>
                <div className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-indigo-600">
                  <span>定点物料信息</span>
                  <button onClick={() => setActiveMenu('首页')} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Search Form Filter Grid matching image_28034a68.png */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <label className="font-semibold text-slate-600">供方代码：</label>
                  <input
                    type="text"
                    value={spotSupplierCodeFilter}
                    onChange={(e) => setSpotSupplierCodeFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 w-36 font-mono"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="font-semibold text-slate-600">供方简称：</label>
                  <input
                    type="text"
                    value={spotSupplierAbbrFilter}
                    onChange={(e) => setSpotSupplierAbbrFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 w-36"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="font-semibold text-slate-600">物料代码：</label>
                  <input
                    type="text"
                    value={spotMaterialCodeFilter}
                    onChange={(e) => setSpotMaterialCodeFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 w-36 font-mono"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="font-semibold text-slate-600">物料名称：</label>
                  <input
                    type="text"
                    value={spotMaterialNameFilter}
                    onChange={(e) => setSpotMaterialNameFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 w-36"
                  />
                </div>

                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    onClick={handleSearchSpotMaterial}
                    className="flex items-center space-x-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                  <button
                    onClick={handleResetSpotMaterial}
                    className="flex items-center space-x-1 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-xl text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons Toolbar matching screenshot image_28034a68.png */}
              <div className="flex items-center space-x-3 text-xs">
                <button
                  onClick={openAddSpotModal}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增</span>
                </button>
                <button
                  onClick={() => alert('请选择要导入的定点物料 Excel 数据表文件')}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow transition"
                >
                  <span>导入</span>
                </button>
                <button
                  onClick={() => alert('已成功导出定点物料清单数据（.xlsx）')}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow transition"
                >
                  <span>导出</span>
                </button>
                <button
                  onClick={() => alert('正在下载定点物料标准录入模板文件：Spot_Material_Import_Template.xlsx')}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition"
                >
                  <span>模板下载</span>
                </button>
              </div>

              {/* Spot Material Data Table matching screenshot image_28034a68.png */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 text-center w-12">序号</th>
                        <th className="p-3 text-center">供方代码</th>
                        <th className="p-3">供方名称</th>
                        <th className="p-3">物料编码</th>
                        <th className="p-3">物料名称</th>
                        <th className="p-3 text-center">图号</th>
                        <th className="p-3">规格型号</th>
                        <th className="p-3 text-center">是否消耗物料</th>
                        <th className="p-3 text-center">消耗物料类型</th>
                        <th className="p-3 text-center">消耗数量</th>
                        <th className="p-3 text-center">消耗开始时间</th>
                        <th className="p-3 text-center">消耗结束时间</th>
                        <th className="p-3 text-center">更新时间</th>
                        <th className="p-3 text-center">维护人</th>
                        <th className="p-3 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      {spotMaterialList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-center font-medium">{idx + 1}</td>
                          <td className="p-3 text-center font-mono font-bold text-slate-800">{item.supplierCode}</td>
                          <td className="p-3 font-semibold text-slate-800">{item.supplierName}</td>
                          <td className="p-3 font-mono font-bold text-indigo-600">{item.materialCode}</td>
                          <td className="p-3 font-medium text-slate-800">{item.materialName}</td>
                          <td className="p-3 text-center font-mono text-slate-600">{item.drawingNo}</td>
                          <td className="p-3 font-mono text-slate-600">{item.spec}</td>
                          <td className="p-3 text-center font-medium">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${
                              item.isConsumable === '是' ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-slate-500'
                            }`}>
                              {item.isConsumable}
                            </span>
                          </td>
                          <td className="p-3 text-center font-medium">{item.consumableType}</td>
                          <td className="p-3 text-center font-mono">{item.consumableQty}</td>
                          <td className="p-3 text-center font-mono text-slate-500">{item.consumableStartTime}</td>
                          <td className="p-3 text-center font-mono text-slate-500">{item.consumableEndTime}</td>
                          <td className="p-3 text-center font-mono text-indigo-600 font-semibold">{item.updateTime}</td>
                          <td className="p-3 text-center font-medium">{item.maintainer}</td>
                          <td className="p-3 text-center space-x-3">
                            <button onClick={() => openEditSpotModal(item)} className="text-blue-600 hover:underline font-semibold">编辑</button>
                            <button onClick={() => openDeleteSpotModal(item)} className="text-blue-600 hover:underline font-semibold">删除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer matching screenshot image_28034a68.png */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 200 条记录 第 1 / 60 页</span>
                  <div className="flex items-center space-x-1">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded font-medium">1</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">2</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">3</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">4</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">5</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">6</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">7</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">8</button>
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">9</button>
                    <span className="px-2">10条/页</span>
                    <span>跳至</span>
                    <input type="text" defaultValue="5" className="w-10 px-2 py-1 border border-slate-300 rounded text-center" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '物料组' ? (
            /* Material Group Page matching screenshot image_956907a3.png */
            <div className="space-y-4">
              {/* Filter Search & Action Toolbar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>物料组代号:</span>
                    <input
                      type="text"
                      value={filterMgCode}
                      onChange={(e) => setFilterMgCode(e.target.value)}
                      className="w-48 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>物料组:</span>
                    <input
                      type="text"
                      value={filterMgName}
                      onChange={(e) => setFilterMgName(e.target.value)}
                      className="w-48 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSearchMg}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition shadow-2xs"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      onClick={handleResetMg}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={openAddMgModal}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                  <button
                    onClick={() => alert('请选择要导入的物料组 Excel 数据表文件')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 rotate-180" />
                    <span>导入</span>
                  </button>
                  <button
                    onClick={() => alert('正在下载物料组导入模板.xlsx...')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>模板下载</span>
                  </button>
                </div>
              </div>

              {/* Data Table Matching Screenshot image_956907a3.png */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                        <th className="p-2.5 text-center border-r border-slate-200 w-16">序号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 w-32">物料组代号</th>
                        <th className="p-2.5 border-r border-slate-200">物料组</th>
                        <th className="p-2.5 text-center border-r border-slate-200 w-28">抽样方案</th>
                        <th className="p-2.5 text-center border-r border-slate-200 w-44">维护时间</th>
                        <th className="p-2.5 text-center border-r border-slate-200 w-28">维护人</th>
                        <th className="p-2.5 text-center w-32">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {materialGroupList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 text-center border-r border-slate-200">{idx + 1}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.code}</td>
                          <td className="p-2.5 font-medium border-r border-slate-200">{item.name}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">{item.samplingPlan}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 text-slate-600">{item.updateTime}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.maintainer}</td>
                          <td className="p-2.5 text-center space-x-2">
                            <button onClick={() => openEditMgModal(item)} className="text-blue-600 hover:underline font-medium">编辑</button>
                            <button onClick={() => openDeleteMgModal(item)} className="text-blue-600 hover:underline font-medium">删除</button>
                          </td>
                        </tr>
                      ))}
                      {/* Grid Filler Rows matching screenshot style */}
                      {Array.from({ length: Math.max(0, 10 - materialGroupList.length) }).map((_, i) => (
                        <tr key={`empty-${i}`} className="h-9">
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-400">{materialGroupList.length + i + 1}</td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer matching screenshot image_956907a3.png */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 200 条记录 第 1 / 20 页</span>
                  <div className="flex items-center space-x-1">
                    <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-100">&lt;</button>
                    <button className="px-2.5 py-0.5 bg-blue-600 text-white rounded font-medium">1</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">2</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">3</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">4</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">5</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">6</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">7</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">8</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">9</button>
                    <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-100">&gt;</button>
                    <span className="px-2">10条/页</span>
                    <span>跳至</span>
                    <input type="text" defaultValue="5" className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '物料管理' ? (
            /* Material Management Page matching screenshot image_2fff1e9e.png */
            <div className="space-y-4">
              {/* Filter Search Bar & Action Toolbar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>物料组:</span>
                    <input
                      type="text"
                      value={mmGroupFilter}
                      onChange={(e) => setMmGroupFilter(e.target.value)}
                      className="w-36 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>物料编码:</span>
                    <input
                      type="text"
                      value={mmCodeFilter}
                      onChange={(e) => setMmCodeFilter(e.target.value)}
                      className="w-36 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>物料类型:</span>
                    <select
                      value={mmTypeFilter}
                      onChange={(e) => setMmTypeFilter(e.target.value)}
                      className="w-36 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="常规检验物料">常规检验物料</option>
                      <option value="加严检验物料">加严检验物料</option>
                      <option value="免检物料">免检物料</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>自动派单:</span>
                    <select
                      value={mmAutoDispatchFilter}
                      onChange={(e) => setMmAutoDispatchFilter(e.target.value)}
                      className="w-36 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="是">是</option>
                      <option value="否">否</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <button
                      onClick={handleSearchMm}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition shadow-2xs"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      onClick={handleResetMm}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={openAddMmModal}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                  <button
                    onClick={() => alert('请选择要导入的物料 Excel 数据表文件')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 rotate-180" />
                    <span>导入</span>
                  </button>
                  <button
                    onClick={() => alert('已成功导出物料管理清单数据（.xlsx）')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <span>导出</span>
                  </button>
                  <button
                    onClick={() => alert('正在下载物料信息标准录入模板.xlsx...')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>模板下载</span>
                  </button>
                </div>
              </div>

              {/* Data Table Matching Screenshot image_2fff1e9e.png */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                        <th className="p-2.5 text-center border-r border-slate-200 w-12">序号</th>
                        <th className="p-2.5 text-center border-r border-slate-200">物料组</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono">物料编码</th>
                        <th className="p-2.5 border-r border-slate-200">物料名称</th>
                        <th className="p-2.5 border-r border-slate-200">规格型号</th>
                        <th className="p-2.5 text-center border-r border-slate-200">图号</th>
                        <th className="p-2.5 text-center border-r border-slate-200">单位</th>
                        <th className="p-2.5 text-center border-r border-slate-200">加严检验周期/天</th>
                        <th className="p-2.5 text-center border-r border-slate-200">是否加严检验</th>
                        <th className="p-2.5 text-center border-r border-slate-200">标准工时/h</th>
                        <th className="p-2.5 text-center border-r border-slate-200">自动派单</th>
                        <th className="p-2.5 text-center border-r border-slate-200">物料类别</th>
                        <th className="p-2.5 text-center border-r border-slate-200">上次型式时间</th>
                        <th className="p-2.5 text-center border-r border-slate-200">型式间隔周期</th>
                        <th className="p-2.5 text-center border-r border-slate-200">下次型式时间</th>
                        <th className="p-2.5 text-center border-r border-slate-200">最新操作时间</th>
                        <th className="p-2.5 text-center border-r border-slate-200">维护人</th>
                        <th className="p-2.5 text-center w-28">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {materialManagementList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 text-center border-r border-slate-200">{idx + 1}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.group}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 font-bold text-slate-800">{item.code}</td>
                          <td className="p-2.5 font-medium border-r border-slate-200 text-slate-900">{item.name}</td>
                          <td className="p-2.5 font-mono border-r border-slate-200">{item.spec}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.drawingNo}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.unit}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.strictDays}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.isStrict}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.stdHours}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.autoDispatch}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.category}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 text-slate-500">{item.lastPatternTime}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.patternInterval}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 text-slate-500">{item.nextPatternTime}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 text-indigo-600 font-medium">{item.updateTime}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.maintainer}</td>
                          <td className="p-2.5 text-center space-x-2">
                            <button onClick={() => openEditMmModal(item)} className="text-blue-600 hover:underline font-medium">编辑</button>
                            <button onClick={() => openDeleteMmModal(item)} className="text-blue-600 hover:underline font-medium">删除</button>
                          </td>
                        </tr>
                      ))}
                      {/* Grid Filler Rows matching screenshot image_2fff1e9e.png */}
                      {Array.from({ length: Math.max(0, 10 - materialManagementList.length) }).map((_, i) => (
                        <tr key={`empty-mm-${i}`} className="h-9">
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-400">{materialManagementList.length + i + 1}</td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer matching screenshot image_2fff1e9e.png */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 200 条记录 第 1 / 60 页</span>
                  <div className="flex items-center space-x-1">
                    <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-100">&lt;</button>
                    <button className="px-2.5 py-0.5 bg-blue-600 text-white rounded font-medium">1</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">2</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">3</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">4</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">5</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">6</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">7</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">8</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">9</button>
                    <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-100">&gt;</button>
                    <span className="px-2">10条/页</span>
                    <span>跳至</span>
                    <input type="text" defaultValue="5" className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '项目标准' ? (
            /* Item Standards Page matching screenshot image_faca50c1.png */
            <div className="space-y-4">
              {/* Search Filter Bar & Action Toolbar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>物料组:</span>
                    <select
                      value={psGroupFilter}
                      onChange={(e) => setPsGroupFilter(e.target.value)}
                      className="w-40 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="电容物料组">电容物料组</option>
                      <option value="电阻物料组">电阻物料组</option>
                      <option value="芯片IC物料组">芯片IC物料组</option>
                      <option value="二极管/三极管物料组">二极管/三极管物料组</option>
                      <option value="结构连接器物料组">结构连接器物料组</option>
                      <option value="传感器组件物料组">传感器组件物料组</option>
                      <option value="光电耦合器件物料组">光电耦合器件物料组</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>项目代号:</span>
                    <input
                      type="text"
                      value={psCodeFilter}
                      onChange={(e) => setPsCodeFilter(e.target.value)}
                      className="w-36 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>检验检验项目:</span>
                    <select
                      value={psItemFilter}
                      onChange={(e) => setPsItemFilter(e.target.value)}
                      className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="电容器外观与极性标识检查">电容器外观与极性标识检查</option>
                      <option value="电容量与损耗角正切值测量">电容量与损耗角正切值测量</option>
                      <option value="绝缘电阻与介质耐压测试">绝缘电阻与介质耐压测试</option>
                      <option value="引脚可焊性及镀层测试">引脚可焊性及镀层测试</option>
                      <option value="精密电阻阻值偏差测量">精密电阻阻值偏差测量</option>
                      <option value="芯片静态电流与功耗测试">芯片静态电流与功耗测试</option>
                      <option value="连接器插拔力与接触电阻">连接器插拔力与接触电阻</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>项目类别:</span>
                    <select
                      value={psCategoryFilter}
                      onChange={(e) => setPsCategoryFilter(e.target.value)}
                      className="w-36 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="常规">常规</option>
                      <option value="关键">关键</option>
                      <option value="主要">主要</option>
                      <option value="次要">次要</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <button
                      onClick={handleSearchPs}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition shadow-2xs"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      onClick={handleResetPs}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={openAddPsModal}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                  <button
                    onClick={() => alert('请选择要导入的项目标准 Excel 数据文件')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 rotate-180" />
                    <span>导入</span>
                  </button>
                  <button
                    onClick={() => alert('已成功导出项目标准清单数据（.xlsx）')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <span>导出</span>
                  </button>
                  <button
                    onClick={() => alert('正在下载项目标准模板文件：Item_Standards_Template.xlsx...')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>模板下载</span>
                  </button>
                </div>
              </div>

              {/* Data Table Matching Screenshot image_faca50c1.png */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                        <th className="p-2.5 text-center border-r border-slate-200 w-12">序号</th>
                        <th className="p-2.5 text-center border-r border-slate-200">检验项目代号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 w-16">排序</th>
                        <th className="p-2.5 border-r border-slate-200">检验项目</th>
                        <th className="p-2.5 border-r border-slate-200">物料组</th>
                        <th className="p-2.5 text-center border-r border-slate-200">抽样数</th>
                        <th className="p-2.5 text-center border-r border-slate-200">抽样方案</th>
                        <th className="p-2.5 text-center border-r border-slate-200">项目类别</th>
                        <th className="p-2.5 text-center border-r border-slate-200">检验方式</th>
                        <th className="p-2.5 text-center border-r border-slate-200">检验类型</th>
                        <th className="p-2.5 text-center border-r border-slate-200">是否启用</th>
                        <th className="p-2.5 text-center border-r border-slate-200">维护时间</th>
                        <th className="p-2.5 text-center border-r border-slate-200">维护人</th>
                        <th className="p-2.5 text-center w-28">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {itemStandardsList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 text-center border-r border-slate-200">{idx + 1}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 font-medium text-slate-800">{item.code}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.sortOrder}</td>
                          <td className="p-2.5 font-medium border-r border-slate-200 text-slate-900">{item.itemName}</td>
                          <td className="p-2.5 border-r border-slate-200">{item.group}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.sampleQty}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.samplingPlan}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.category}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.method}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.testType}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            <span className={item.isEnabled === '启用' ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                              {item.isEnabled}
                            </span>
                          </td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 text-indigo-600 font-medium">{item.updateTime}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.maintainer}</td>
                          <td className="p-2.5 text-center space-x-2">
                            <button onClick={() => openEditPsModal(item)} className="text-blue-600 hover:underline font-medium">编辑</button>
                            <button onClick={() => openDeletePsModal(item)} className="text-blue-600 hover:underline font-medium">删除</button>
                          </td>
                        </tr>
                      ))}
                      {/* Grid Filler Rows matching screenshot style */}
                      {Array.from({ length: Math.max(0, 10 - itemStandardsList.length) }).map((_, i) => (
                        <tr key={`empty-ps-${i}`} className="h-9">
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-400">{itemStandardsList.length + i + 1}</td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer matching screenshot image_faca50c1.png */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 200 条记录 第 1 / 60 页</span>
                  <div className="flex items-center space-x-1">
                    <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-100">&lt;</button>
                    <button className="px-2.5 py-0.5 bg-blue-600 text-white rounded font-medium">1</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">2</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">3</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">4</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">5</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">6</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">7</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">8</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">9</button>
                    <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-100">&gt;</button>
                    <span className="px-2">10条/页</span>
                    <span>跳至</span>
                    <input type="text" defaultValue="5" className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '检验项目' ? (
            /* Inspection Item Page matching screenshot image_d73a8c08.png */
            <div className="space-y-4">
              {/* Search Filter Bar & Action Toolbar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>物料编码:</span>
                    <input
                      type="text"
                      value={iiMaterialCodeFilter}
                      onChange={(e) => setIiMaterialCodeFilter(e.target.value)}
                      className="w-36 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>检验项目:</span>
                    <select
                      value={iiItemFilter}
                      onChange={(e) => setIiItemFilter(e.target.value)}
                      className="w-40 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="外观与极性标识">外观与极性标识</option>
                      <option value="电容量与损耗角正切">电容量与损耗角正切</option>
                      <option value="绝缘电阻与介质耐压">绝缘电阻与介质耐压</option>
                      <option value="引脚可焊性与镀层">引脚可焊性与镀层</option>
                      <option value="精密电阻阻值偏差">精密电阻阻值偏差</option>
                      <option value="芯片静态电流与功耗">芯片静态电流与功耗</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>项目类别:</span>
                    <select
                      value={iiCategoryFilter}
                      onChange={(e) => setIiCategoryFilter(e.target.value)}
                      className="w-36 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="常规">常规</option>
                      <option value="关键">关键</option>
                      <option value="主要">主要</option>
                      <option value="次要">次要</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>供方简称:</span>
                    <select
                      value={iiSupplierFilter}
                      onChange={(e) => setIiSupplierFilter(e.target.value)}
                      className="w-40 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="苏州精工微电子">苏州精工微电子</option>
                      <option value="立讯精密工业">立讯精密工业</option>
                      <option value="长电科技股份">长电科技股份</option>
                      <option value="顺络电子">顺络电子</option>
                      <option value="泰科电子">泰科电子</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <button
                      onClick={handleSearchIi}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition shadow-2xs"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      onClick={handleResetIi}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={openAddIiModal}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                  <button
                    onClick={() => alert('请选择要导入的检验项目 Excel 数据表')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 rotate-180" />
                    <span>导入</span>
                  </button>
                  <button
                    onClick={() => alert('已成功导出检验项目清单数据（.xlsx）')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <span>导出</span>
                  </button>
                  <button
                    onClick={() => alert('正在下载检验项目模版文件.xlsx...')}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>模板下载</span>
                  </button>
                  <button
                    onClick={() => setShowIiChangeModal(true)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>检验项目变更</span>
                  </button>
                </div>
              </div>

              {/* Data Table Matching Screenshot image_d73a8c08.png */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                        <th className="p-2.5 text-center border-r border-slate-200 w-12">序号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono">供方代码</th>
                        <th className="p-2.5 border-r border-slate-200">供方简称</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono font-bold">物料编码</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono">检验项目代号</th>
                        <th className="p-2.5 border-r border-slate-200 font-medium">检验项目</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono">检验标准</th>
                        <th className="p-2.5 text-center border-r border-slate-200">项目类别</th>
                        <th className="p-2.5 text-center border-r border-slate-200">检验方式</th>
                        <th className="p-2.5 text-center border-r border-slate-200 text-indigo-600 font-medium">更新时间</th>
                        <th className="p-2.5 text-center border-r border-slate-200">维护人</th>
                        <th className="p-2.5 text-center w-28">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {inspectionItemList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 text-center border-r border-slate-200">{idx + 1}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.supplierCode}</td>
                          <td className="p-2.5 border-r border-slate-200 font-medium">{item.supplierName}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 font-bold text-slate-800">{item.materialCode}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 text-slate-600">{item.itemCode}</td>
                          <td className="p-2.5 font-medium border-r border-slate-200 text-slate-900">{item.itemName}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.standard}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.category}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.method}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 text-indigo-600 font-medium">{item.updateTime}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.maintainer}</td>
                          <td className="p-2.5 text-center space-x-2">
                            <button onClick={() => openEditIiModal(item)} className="text-blue-600 hover:underline font-medium">编辑</button>
                            <button onClick={() => openDeleteIiModal(item)} className="text-blue-600 hover:underline font-medium">删除</button>
                          </td>
                        </tr>
                      ))}
                      {/* Grid Filler Rows matching screenshot style */}
                      {Array.from({ length: Math.max(0, 10 - inspectionItemList.length) }).map((_, i) => (
                        <tr key={`empty-ii-${i}`} className="h-9">
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-400">{inspectionItemList.length + i + 1}</td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer matching screenshot image_d73a8c08.png */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 200 条记录 第 1 / 60 页</span>
                  <div className="flex items-center space-x-1">
                    <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-100">&lt;</button>
                    <button className="px-2.5 py-0.5 bg-blue-600 text-white rounded font-medium">1</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">2</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">3</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">4</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">5</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">6</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">7</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">8</button>
                    <button className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">9</button>
                    <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-100">&gt;</button>
                    <span className="px-2">10条/页</span>
                    <span>跳至</span>
                    <input type="text" defaultValue="5" className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '抽样方案' ? (
            /* Sampling Plan Page matching screenshot image_a2336d67.png */
            <div className="space-y-4">
              {/* Search Filter Bar & Action Toolbar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>检验方案:</span>
                    <select
                      value={spTestPlanFilter}
                      onChange={(e) => setSpTestPlanFilter(e.target.value)}
                      className="w-40 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="S-3">S-3</option>
                      <option value="S-2">S-2</option>
                      <option value="S-1">S-1</option>
                      <option value="S-4">S-4</option>
                      <option value="正常检验">正常检验</option>
                      <option value="加严检验">加严检验</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>AQL:</span>
                    <select
                      value={spAqlFilter}
                      onChange={(e) => setSpAqlFilter(e.target.value)}
                      className="w-40 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="0">0</option>
                      <option value="0.65">0.65</option>
                      <option value="1.0">1.0</option>
                      <option value="1.5">1.5</option>
                      <option value="2.5">2.5</option>
                      <option value="4.0">4.0</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <button
                      onClick={handleSearchSp}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 rounded font-medium transition shadow-2xs"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      onClick={handleResetSp}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={openAddSpModal}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium shadow-2xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                </div>
              </div>

              {/* Data Table Matching Screenshot image_a2336d67.png */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                        <th className="p-2.5 text-center border-r border-slate-200 w-12">序号</th>
                        <th className="p-2.5 text-center border-r border-slate-200">抽样方案</th>
                        <th className="p-2.5 text-center border-r border-slate-200">检验方案</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono">AQL</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono font-bold">来货数量上限</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono">来货数量下限</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono">抽样数量</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono">加严抽样数量</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono text-indigo-600 font-medium">维护时间</th>
                        <th className="p-2.5 text-center border-r border-slate-200">维护人</th>
                        <th className="p-2.5 text-center w-28">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {currentSpList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">{(spCurrentPage - 1) * spPageSize + idx + 1}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-medium">{item.samplingScheme}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-medium">{item.testPlan}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">{item.aql}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 font-bold text-slate-800">{item.qtyMax}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.qtyMin}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 font-medium">{item.sampleQty}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{item.strictSampleQty}</td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 text-indigo-600 font-medium">{item.updateTime}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.maintainer}</td>
                          <td className="p-2.5 text-center space-x-2">
                            <button onClick={() => openEditSpModal(item)} className="text-blue-600 hover:underline font-medium">编辑</button>
                            <button onClick={() => openDeleteSpModal(item)} className="text-blue-600 hover:underline font-medium">删除</button>
                          </td>
                        </tr>
                      ))}
                      {/* Grid Filler Rows up to 10 rows per page matching screenshot image_a2336d67.png */}
                      {Array.from({ length: Math.max(0, 10 - currentSpList.length) }).map((_, i) => (
                        <tr key={`empty-sp-${i}`} className="h-9">
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-400 font-mono">{(spCurrentPage - 1) * spPageSize + currentSpList.length + i + 1}</td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer matching screenshot image_a2336d67.png with exact 10 records per page */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 {totalSpCount} 条记录 第 {spCurrentPage} / {totalSpPages} 页</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setSpCurrentPage(p => Math.max(1, p - 1))}
                      disabled={spCurrentPage === 1}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        spCurrentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="上一页"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalSpPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = pageNum === spCurrentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setSpCurrentPage(pageNum)}
                          className={`px-2.5 py-0.5 rounded font-medium transition cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-600 text-white font-bold shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setSpCurrentPage(p => Math.min(totalSpPages, p + 1))}
                      disabled={spCurrentPage === totalSpPages}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        spCurrentPage === totalSpPages ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="下一页"
                    >
                      &gt;
                    </button>
                    <span className="px-2 font-medium text-slate-600">10条/页</span>
                    <span>跳至</span>
                    <input
                      type="number"
                      min={1}
                      max={totalSpPages}
                      value={spJumpPage}
                      onChange={(e) => setSpJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(spJumpPage, 10);
                          if (p >= 1 && p <= totalSpPages) {
                            setSpCurrentPage(p);
                          }
                        }
                      }}
                      className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center text-xs font-mono"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(spJumpPage, 10);
                        if (p >= 1 && p <= totalSpPages) {
                          setSpCurrentPage(p);
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 cursor-pointer text-xs ml-0.5 transition"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '数据字典' ? (
            /* Data Dictionary Page matching screenshot image_02518582.png */
            <div className="space-y-4">
              {/* Search Filter Bar & Action Toolbar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>字典名称:</span>
                    <input
                      type="text"
                      value={dictNameFilter}
                      onChange={(e) => setDictNameFilter(e.target.value)}
                      placeholder=""
                      className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>字典code:</span>
                    <input
                      type="text"
                      value={dictCodeFilter}
                      onChange={(e) => setDictCodeFilter(e.target.value)}
                      placeholder=""
                      className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSearchDd}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      onClick={handleResetDd}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={openAddDdModal}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium shadow-2xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                </div>
              </div>

              {/* Data Table Matching Screenshot image_02518582.png */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                        <th className="p-2.5 text-center border-r border-slate-200 w-14">序号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[120px]">字典名称</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono min-w-[130px]">字典code</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[280px]">字典值</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono text-indigo-600 font-medium min-w-[150px]">更新时间</th>
                        <th className="p-2.5 text-center border-r border-slate-200 w-24">维护人</th>
                        <th className="p-2.5 text-center w-28">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {currentDdList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">
                            {(ddCurrentPage - 1) * ddPageSize + idx + 1}
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-medium text-slate-800">
                            {item.dictName}
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono text-slate-700">
                            {item.dictCode}
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-700 max-w-md truncate" title={item.dictValue}>
                            {item.dictValue}
                          </td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200 text-indigo-600 font-medium">
                            {item.updateTime}
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            {item.maintainer}
                          </td>
                          <td className="p-2.5 text-center space-x-2">
                            <button
                              onClick={() => openEditDdModal(item)}
                              className="text-blue-600 hover:underline font-medium cursor-pointer"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => openDeleteDdModal(item)}
                              className="text-blue-600 hover:underline font-medium cursor-pointer"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))}
                      {/* Grid Filler Rows up to 10 rows per page matching screenshot image_02518582.png */}
                      {Array.from({ length: Math.max(0, 10 - currentDdList.length) }).map((_, i) => (
                        <tr key={`empty-dd-${i}`} className="h-9">
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-400 font-mono">
                            {(ddCurrentPage - 1) * ddPageSize + currentDdList.length + i + 1}
                          </td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer matching screenshot image_02518582.png with exact 10 records per page */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 {totalDdCount} 条记录 第 {ddCurrentPage} / {totalDdPages} 页</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setDdCurrentPage(p => Math.max(1, p - 1))}
                      disabled={ddCurrentPage === 1}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        ddCurrentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="上一页"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalDdPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = pageNum === ddCurrentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setDdCurrentPage(pageNum)}
                          className={`px-2.5 py-0.5 rounded font-medium transition cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-600 text-white font-bold shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setDdCurrentPage(p => Math.min(totalDdPages, p + 1))}
                      disabled={ddCurrentPage === totalDdPages}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        ddCurrentPage === totalDdPages ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="下一页"
                    >
                      &gt;
                    </button>
                    <span className="px-2 font-medium text-slate-600">10条/页</span>
                    <span>跳至</span>
                    <input
                      type="number"
                      min={1}
                      max={totalDdPages}
                      value={ddJumpPage}
                      onChange={(e) => setDdJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(ddJumpPage, 10);
                          if (p >= 1 && p <= totalDdPages) {
                            setDdCurrentPage(p);
                          }
                        }
                      }}
                      className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center text-xs font-mono"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(ddJumpPage, 10);
                        if (p >= 1 && p <= totalDdPages) {
                          setDdCurrentPage(p);
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 cursor-pointer text-xs ml-0.5 transition"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '设备管理' || activeMenu === '检验设备管理' ? (
            /* Equipment Management Page matching screenshot image_5d52405f.png */
            <div className="space-y-4">
              {/* Search Filter Bar & Action Toolbar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-700">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <span>设备编码:</span>
                      <input
                        type="text"
                        value={eqCodeFilter}
                        onChange={(e) => setEqCodeFilter(e.target.value)}
                        placeholder=""
                        className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>设备名称:</span>
                      <input
                        type="text"
                        value={eqNameFilter}
                        onChange={(e) => setEqNameFilter(e.target.value)}
                        placeholder=""
                        className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>设备型号:</span>
                      <input
                        type="text"
                        value={eqModelFilter}
                        onChange={(e) => setEqModelFilter(e.target.value)}
                        placeholder=""
                        className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSearchEq}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      onClick={handleResetEq}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons Toolbar: + 新增, 导入, 导出 */}
                <div className="flex items-center space-x-2.5 pt-1">
                  <button
                    onClick={openAddEqModal}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium shadow-2xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                  <button
                    onClick={handleImportEq}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium shadow-2xs transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导入</span>
                  </button>
                  <button
                    onClick={handleExportEq}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium shadow-2xs transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>导出</span>
                  </button>
                </div>
              </div>

              {/* Equipment Table Card */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                        <th className="py-2.5 px-3 text-center border-r border-slate-200 w-12">序号</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">设备类别</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">设备编码</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">设备名称</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">设备型号</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">使用单位</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">摆放位置</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">入厂时间</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">状态</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">归属人</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">校对时间</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">校对周期/天</th>
                        <th className="py-2.5 px-3 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {currentEqList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition text-center">
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-medium">
                            {(eqCurrentPage - 1) * eqPageSize + idx + 1}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200">
                            {item.category}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 font-mono text-slate-800">
                            {item.code}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-800 font-medium">
                            {item.name}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600">
                            {item.model}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600">
                            {item.department}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600">
                            {item.location}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-mono">
                            {item.enterDate}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200">
                            <span className={item.status === '报废' ? 'text-rose-600 font-medium' : 'text-slate-700'}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600">
                            {item.owner}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-mono">
                            {item.calibrateDate}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-mono">
                            {item.calibratePeriod}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap text-center space-x-3">
                            <button
                              onClick={() => openEditEqModal(item)}
                              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => openDeleteEqModal(item)}
                              className="text-blue-600 hover:text-rose-600 font-medium cursor-pointer"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* Pad empty rows if fewer than 10 rows on current page */}
                      {Array.from({ length: Math.max(0, eqPageSize - currentEqList.length) }).map((_, padIdx) => (
                        <tr key={`pad-${padIdx}`} className="text-center text-transparent select-none">
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3 border-r border-slate-200">-</td>
                          <td className="py-2 px-3">-</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer with Pagination matching screenshot */}
                <div className="py-3 px-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
                  <div>
                    共 {totalEqCount} 条记录 第 {eqCurrentPage} / {totalEqPages} 页
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setEqCurrentPage(p => Math.max(1, p - 1))}
                      disabled={eqCurrentPage === 1}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        eqCurrentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="上一页"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: Math.min(9, totalEqPages) }).map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = pageNum === eqCurrentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setEqCurrentPage(pageNum)}
                          className={`px-2.5 py-0.5 rounded font-medium transition cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-600 text-white font-bold shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalEqPages > 9 && <span className="px-1 text-slate-400">...</span>}
                    <button
                      onClick={() => setEqCurrentPage(p => Math.min(totalEqPages, p + 1))}
                      disabled={eqCurrentPage === totalEqPages}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        eqCurrentPage === totalEqPages ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="下一页"
                    >
                      &gt;
                    </button>
                    <span className="px-2 font-medium text-slate-600">10条/页</span>
                    <span>跳至</span>
                    <input
                      type="number"
                      min={1}
                      max={totalEqPages}
                      value={eqJumpPage}
                      onChange={(e) => setEqJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(eqJumpPage, 10);
                          if (p >= 1 && p <= totalEqPages) {
                            setEqCurrentPage(p);
                          }
                        }
                      }}
                      className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center text-xs font-mono"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(eqJumpPage, 10);
                        if (p >= 1 && p <= totalEqPages) {
                          setEqCurrentPage(p);
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 cursor-pointer text-xs ml-0.5 transition"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '物料组分析' || activeMenu === '物料组合格率分析' ? (
            /* Material Group Analysis Page matching screenshot image_dd3e37eb.png */
            <div className="space-y-4">
              {/* Notification Toast for Export */}
              {mgExportNotification && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{mgExportNotification}</span>
                  </div>
                  <button onClick={() => setMgExportNotification(null)} className="text-emerald-500 hover:text-emerald-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Search Filter Bar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-700">
                  <div className="flex flex-wrap items-center gap-6">
                    {/* Time Range Filter (recent dates) */}
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-700 font-medium">时间:</span>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="date"
                          value={mgStartDate}
                          onChange={(e) => setMgStartDate(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700 font-sans"
                        />
                        <span className="text-slate-400">~</span>
                        <input
                          type="date"
                          value={mgEndDate}
                          onChange={(e) => setMgEndDate(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700 font-sans"
                        />
                      </div>
                    </div>

                    {/* Material Group Dropdown */}
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-700 font-medium">物料组:</span>
                      <select
                        value={mgSelectedGroup}
                        onChange={(e) => setMgSelectedGroup(e.target.value)}
                        className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700 cursor-pointer"
                      >
                        <option value="">全部物料组</option>
                        <option value="物料组21">物料组21</option>
                        <option value="物料组13">物料组13</option>
                        <option value="物料组23">物料组23</option>
                        <option value="物料组7">物料组7</option>
                        <option value="物料组18">物料组18</option>
                        <option value="物料组5">物料组5</option>
                        <option value="物料组12">物料组12</option>
                        <option value="物料组3">物料组3</option>
                        <option value="物料组16">物料组16</option>
                        <option value="物料组9">物料组9</option>
                        <option value="物料组2">物料组2</option>
                        <option value="物料组11">物料组11</option>
                        <option value="物料组1">物料组1</option>
                        <option value="物料组4">物料组4</option>
                        <option value="物料组8">物料组8</option>
                        <option value="物料组10">物料组10</option>
                        <option value="物料组14">物料组14</option>
                        <option value="物料组15">物料组15</option>
                        <option value="物料组17">物料组17</option>
                        <option value="物料组19">物料组19</option>
                        <option value="物料组20">物料组20</option>
                        <option value="物料组6">物料组6</option>
                        <option value="物料组22">物料组22</option>
                      </select>
                    </div>

                    {/* Query & Reset Buttons matching screenshot */}
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={handleSearchMgReport}
                        className="px-4 py-1.5 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>查询</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResetMgReport}
                        className="px-4 py-1.5 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded text-xs font-medium flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>重置</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={handleExportMgReport}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出</span>
                </button>
              </div>

              {/* Data Table matching screenshot */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold h-10">
                        <th className="py-2.5 px-3 border-r border-slate-200 w-16">序号</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">物料组</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">合格</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">让步接收</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">退货</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">评审</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">总批数</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">合格率</th>
                        <th className="py-2.5 px-4">退货率</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {materialGroupReportList.map((item, idx) => (
                        <tr
                          key={item.id}
                          className="hover:bg-blue-50/50 transition-colors h-9 text-slate-700"
                        >
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-500 font-medium">{idx + 1}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-slate-800">{item.group}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.passed}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.concession}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.rejected}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.review}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-slate-900">{item.totalBatches}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-emerald-600">{item.passRate}</td>
                          <td className="py-2 px-4 text-slate-600">{item.rejectRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overview Chart Card: 物料组合格率总览 */}
              <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-2xs space-y-4">
                {/* Header with Title and Legend */}
                <div className="relative flex items-center justify-center">
                  <h3 className="text-sm font-bold text-slate-800 text-center tracking-wide">
                    物料组合格率总览
                  </h3>
                  <div className="absolute right-0 flex items-center space-x-6 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 bg-[#0284c7] inline-block rounded-2xs"></span>
                      <span>来料批数</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 bg-[#0d9488] inline-block rounded-2xs"></span>
                      <span>合格批数</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-4 h-0.5 bg-[#f97316] inline-block relative after:content-[''] after:w-1.5 after:h-1.5 after:bg-[#f97316] after:rounded-full after:absolute after:-top-0.5 after:left-1/2 after:-translate-x-1/2"></span>
                      <span>合格率</span>
                    </div>
                  </div>
                </div>

                {/* Composed Chart */}
                <div className="w-full h-80 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={MATERIAL_GROUP_CHART_DATA}
                      margin={{ top: 15, right: 20, left: 0, bottom: 45 }}
                    >
                      <defs>
                        <linearGradient id="colorPassedMg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorTotalMg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={45}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        domain={[0, 500]}
                        ticks={[0, 100, 200, 300, 400, 500]}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 100]}
                        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 border border-slate-700">
                                <p className="font-bold border-b border-slate-700 pb-1">{label}</p>
                                <p className="text-sky-400 flex items-center justify-between space-x-4">
                                  <span>来料批数:</span>
                                  <span className="font-mono font-bold">{data.totalBatches} 批</span>
                                </p>
                                <p className="text-teal-400 flex items-center justify-between space-x-4">
                                  <span>合格批数:</span>
                                  <span className="font-mono font-bold">{data.passedBatches} 批</span>
                                </p>
                                <p className="text-amber-400 flex items-center justify-between space-x-4">
                                  <span>合格率:</span>
                                  <span className="font-mono font-bold">{data.passRateNum}%</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="totalBatches"
                        name="来料批数"
                        stroke="#0284c7"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTotalMg)"
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="passedBatches"
                        name="合格批数"
                        stroke="#0d9488"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPassedMg)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="passRateNum"
                        name="合格率"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        dot={{ r: 2, fill: '#f97316' }}
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : activeMenu === '合格率分析' ? (
            /* Pass Rate Analysis Page with distinct data */
            <div className="space-y-4">
              {/* Notification Toast for Export */}
              {prExportNotification && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{prExportNotification}</span>
                  </div>
                  <button onClick={() => setPrExportNotification(null)} className="text-emerald-500 hover:text-emerald-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Search Filter Bar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-700">
                  <div className="flex flex-wrap items-center gap-6">
                    {/* Time Range Filter */}
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-700 font-medium">时间:</span>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="date"
                          value={prStartDate}
                          onChange={(e) => setPrStartDate(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700 font-sans"
                        />
                        <span className="text-slate-400">~</span>
                        <input
                          type="date"
                          value={prEndDate}
                          onChange={(e) => setPrEndDate(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700 font-sans"
                        />
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-700 font-medium">检验项目类别:</span>
                      <input
                        type="text"
                        value={prSelectedCategory}
                        onChange={(e) => setPrSelectedCategory(e.target.value)}
                        placeholder="请输入检验项目类别..."
                        className="w-48 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700"
                      />
                    </div>

                    {/* Query & Reset Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={handleSearchPrReport}
                        className="px-4 py-1.5 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>查询</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResetPrReport}
                        className="px-4 py-1.5 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded text-xs font-medium flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>重置</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={handleExportPrReport}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold h-10">
                        <th className="py-2.5 px-3 border-r border-slate-200 w-16">序号</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">检验项目类别</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">合格</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">让步接收</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">退货</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">评审</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">总批数</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">合格率</th>
                        <th className="py-2.5 px-4">退货率</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {passRateReportList.map((item, idx) => (
                        <tr
                          key={item.id}
                          className="hover:bg-blue-50/50 transition-colors h-9 text-slate-700"
                        >
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-500 font-medium">{idx + 1}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-slate-800">{item.category}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.passed}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.concession}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.rejected}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.review}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-slate-900">{item.totalBatches}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-emerald-600">{item.passRate}</td>
                          <td className="py-2 px-4 text-slate-600">{item.rejectRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overview Chart Card: 检验项目合格率总览 */}
              <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-2xs space-y-4">
                <div className="relative flex items-center justify-center">
                  <h3 className="text-sm font-bold text-slate-800 text-center tracking-wide">
                    检验项目合格率总览
                  </h3>
                  <div className="absolute right-0 flex items-center space-x-6 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 bg-[#0284c7] inline-block rounded-2xs"></span>
                      <span>来料批数</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 bg-[#0d9488] inline-block rounded-2xs"></span>
                      <span>合格批数</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-4 h-0.5 bg-[#f97316] inline-block relative after:content-[''] after:w-1.5 after:h-1.5 after:bg-[#f97316] after:rounded-full after:absolute after:-top-0.5 after:left-1/2 after:-translate-x-1/2"></span>
                      <span>合格率</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-80 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={PASS_RATE_CHART_DATA}
                      margin={{ top: 15, right: 20, left: 0, bottom: 45 }}
                    >
                      <defs>
                        <linearGradient id="colorPassedPr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorTotalPr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={45}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        domain={[0, 700]}
                        ticks={[0, 150, 300, 450, 600, 750]}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 100]}
                        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 border border-slate-700">
                                <p className="font-bold border-b border-slate-700 pb-1">{label}</p>
                                <p className="text-sky-400 flex items-center justify-between space-x-4">
                                  <span>来料批数:</span>
                                  <span className="font-mono font-bold">{data.totalBatches} 批</span>
                                </p>
                                <p className="text-teal-400 flex items-center justify-between space-x-4">
                                  <span>合格批数:</span>
                                  <span className="font-mono font-bold">{data.passedBatches} 批</span>
                                </p>
                                <p className="text-amber-400 flex items-center justify-between space-x-4">
                                  <span>合格率:</span>
                                  <span className="font-mono font-bold">{data.passRateNum}%</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="totalBatches"
                        name="来料批数"
                        stroke="#0284c7"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTotalPr)"
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="passedBatches"
                        name="合格批数"
                        stroke="#0d9488"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPassedPr)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="passRateNum"
                        name="合格率"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        dot={{ r: 2, fill: '#f97316' }}
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : activeMenu === '供应商分析' ? (
            /* Supplier Analysis Page matching screenshot image_2b105fe3.png */
            <div className="space-y-4">
              {/* Notification Toast for Export */}
              {supExportNotification && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{supExportNotification}</span>
                  </div>
                  <button onClick={() => setSupExportNotification(null)} className="text-emerald-500 hover:text-emerald-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Search Filter Bar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-700">
                  <div className="flex flex-wrap items-center gap-6">
                    {/* Time Range Filter */}
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-700 font-medium">时间:</span>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="date"
                          value={supStartDate}
                          onChange={(e) => setSupStartDate(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700 font-sans"
                        />
                        <span className="text-slate-400">~</span>
                        <input
                          type="date"
                          value={supEndDate}
                          onChange={(e) => setSupEndDate(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700 font-sans"
                        />
                      </div>
                    </div>

                    {/* Supplier Abbr Input */}
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-700 font-medium">供应商简称:</span>
                      <input
                        type="text"
                        value={supSelectedAbbr}
                        onChange={(e) => setSupSelectedAbbr(e.target.value)}
                        placeholder="请输入供应商简称..."
                        className="w-48 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700"
                      />
                    </div>

                    {/* Query & Reset Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={handleSearchSupReport}
                        className="px-4 py-1.5 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>查询</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResetSupReport}
                        className="px-4 py-1.5 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded text-xs font-medium flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>重置</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={handleExportSupReport}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出</span>
                </button>
              </div>

              {/* Data Table matching screenshot */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold h-10">
                        <th className="py-2.5 px-3 border-r border-slate-200 w-16">序号</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">供应商代号</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">供应商</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">合格</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">让步接收</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">退货</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">评审</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">总批数</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">合格率</th>
                        <th className="py-2.5 px-4">退货率</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {supplierReportList.map((item, idx) => (
                        <tr
                          key={item.id}
                          className="hover:bg-blue-50/50 transition-colors h-9 text-slate-700"
                        >
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-500 font-medium">{idx + 1}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-mono text-slate-600">{item.code}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-slate-800">{item.supplier}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.passed}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.concession}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.rejected}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.review}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-slate-900">{item.totalBatches}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-emerald-600">{item.passRate}</td>
                          <td className="py-2 px-4 text-slate-600">{item.rejectRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overview Chart Card: 供应商合格率总览 */}
              <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-2xs space-y-4">
                <div className="relative flex items-center justify-center">
                  <h3 className="text-sm font-bold text-slate-800 text-center tracking-wide">
                    供应商合格率总览
                  </h3>
                  <div className="absolute right-0 flex items-center space-x-6 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 bg-[#0284c7] inline-block rounded-2xs"></span>
                      <span>来料批数</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 bg-[#0d9488] inline-block rounded-2xs"></span>
                      <span>合格批数</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-4 h-0.5 bg-[#f97316] inline-block relative after:content-[''] after:w-1.5 after:h-1.5 after:bg-[#f97316] after:rounded-full after:absolute after:-top-0.5 after:left-1/2 after:-translate-x-1/2"></span>
                      <span>合格率</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-80 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={SUPPLIER_CHART_DATA}
                      margin={{ top: 15, right: 20, left: 0, bottom: 45 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={45}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        domain={[0, 600]}
                        ticks={[0, 150, 300, 450, 600]}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 100]}
                        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 border border-slate-700">
                                <p className="font-bold border-b border-slate-700 pb-1">{label}</p>
                                <p className="text-sky-400 flex items-center justify-between space-x-4">
                                  <span>来料批数:</span>
                                  <span className="font-mono font-bold">{data.totalBatches} 批</span>
                                </p>
                                <p className="text-teal-400 flex items-center justify-between space-x-4">
                                  <span>合格批数:</span>
                                  <span className="font-mono font-bold">{data.passedBatches} 批</span>
                                </p>
                                <p className="text-amber-400 flex items-center justify-between space-x-4">
                                  <span>合格率:</span>
                                  <span className="font-mono font-bold">{data.passRateNum}%</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="passedBatches"
                        stackId="batches"
                        name="合格批数"
                        fill="#0d9488"
                        barSize={20}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="unpassedBatches"
                        stackId="batches"
                        name="来料批数"
                        fill="#0284c7"
                        barSize={20}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="passRateNum"
                        name="合格率"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        dot={{ r: 2, fill: '#f97316' }}
                        activeDot={{ r: 5 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : activeMenu === '检验员及时性' ? (
            /* Inspector Timeliness / Completion Rate Page matching screenshot image_5c37b460.png */
            <div className="space-y-4">
              {/* Notification Toast for Export */}
              {itExportNotification && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{itExportNotification}</span>
                  </div>
                  <button onClick={() => setItExportNotification(null)} className="text-emerald-500 hover:text-emerald-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Search Filter Bar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-700">
                  <div className="flex flex-wrap items-center gap-6">
                    {/* Time Range Filter */}
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-700 font-medium">时间:</span>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="date"
                          value={itStartDate}
                          onChange={(e) => setItStartDate(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700 font-sans"
                        />
                        <span className="text-slate-400">~</span>
                        <input
                          type="date"
                          value={itEndDate}
                          onChange={(e) => setItEndDate(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700 font-sans"
                        />
                      </div>
                    </div>

                    {/* Inspector Name Filter */}
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-700 font-medium">姓名:</span>
                      <input
                        type="text"
                        value={itInspectorName}
                        onChange={(e) => setItInspectorName(e.target.value)}
                        placeholder="请输入检验员姓名..."
                        className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white text-slate-700"
                      />
                    </div>

                    {/* Query & Reset Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={handleSearchItReport}
                        className="px-4 py-1.5 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>查询</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResetItReport}
                        className="px-4 py-1.5 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded text-xs font-medium flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>重置</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={handleExportItReport}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出</span>
                </button>
              </div>

              {/* Data Table matching screenshot image_5c37b460.png */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold h-10">
                        <th className="py-2.5 px-3 border-r border-slate-200 w-16">序号</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">姓名</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">检验总批数</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">完成批数</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">完成率</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">按时完成批数</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">按时率</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">合格</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">让步接收</th>
                        <th className="py-2.5 px-4 border-r border-slate-200">退货</th>
                        <th className="py-2.5 px-4">评审</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentItList.map((item, idx) => (
                        <tr
                          key={item.id}
                          className="hover:bg-blue-50/50 transition-colors h-9 text-slate-700"
                        >
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-500 font-medium">{(itCurrentPage - 1) * itPageSize + idx + 1}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-slate-800">{item.name}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.totalBatches}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.completedBatches}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-emerald-600">{item.completionRate}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.timelyBatches}</td>
                          <td className="py-2 px-4 border-r border-slate-200 font-medium text-blue-600">{item.timelyRate}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.passed}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.concession}</td>
                          <td className="py-2 px-4 border-r border-slate-200 text-slate-700">{item.rejected}</td>
                          <td className="py-2 px-4 text-slate-600">{item.review}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer matching screenshot */}
                <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
                  <div className="font-medium">
                    共 {totalItCount} 条记录 第 {itCurrentPage} / {totalItPages} 页
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setItCurrentPage(p => Math.max(1, p - 1))}
                      disabled={itCurrentPage === 1}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        itCurrentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-slate-100' : 'text-slate-600 hover:bg-slate-200 cursor-pointer'
                      }`}
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalItPages }, (_, i) => i + 1).map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setItCurrentPage(p)}
                        className={`w-6 h-6 flex items-center justify-center rounded text-xs font-medium cursor-pointer ${
                          itCurrentPage === p ? 'bg-blue-600 text-white shadow-2xs' : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setItCurrentPage(p => Math.min(totalItPages, p + 1))}
                      disabled={itCurrentPage === totalItPages}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        itCurrentPage === totalItPages ? 'text-slate-300 cursor-not-allowed bg-slate-100' : 'text-slate-600 hover:bg-slate-200 cursor-pointer'
                      }`}
                    >
                      &gt;
                    </button>
                    <span className="px-2 font-medium text-slate-600">10条/页</span>
                    <span>跳至</span>
                    <input
                      type="number"
                      min={1}
                      max={totalItPages}
                      value={itJumpPage}
                      onChange={(e) => setItJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(itJumpPage, 10);
                          if (p >= 1 && p <= totalItPages) {
                            setItCurrentPage(p);
                          }
                        }
                      }}
                      className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center text-xs font-mono bg-white"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(itJumpPage, 10);
                        if (p >= 1 && p <= totalItPages) {
                          setItCurrentPage(p);
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 cursor-pointer text-xs ml-0.5 transition"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '角色管理' ? (
            /* Role Management Page */
            <div className="space-y-4">
              {/* Search Filter Bar & Action Toolbar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>角色名称:</span>
                    <input
                      type="text"
                      value={roleNameFilter}
                      onChange={(e) => setRoleNameFilter(e.target.value)}
                      placeholder="请输入角色名称或编码"
                      className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleSearchRole}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetRole}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleOpenAddRole}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium shadow-2xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                </div>
              </div>

              {/* Role Management Table Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                        <th className="p-2.5 text-center border-r border-slate-200 w-14">序号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[100px]">操作</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[90px]">启动状态</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono min-w-[140px]">角色编码</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[140px]">角色名称</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[220px]">描述说明</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[180px]">权限范围</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[90px]">操作人</th>
                        <th className="p-2.5 text-center font-mono text-indigo-600 font-medium min-w-[150px]">维护时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {currentRoleList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">
                            {(roleCurrentPage - 1) * rolePageSize + idx + 1}
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 space-x-2">
                            <button type="button" onClick={() => handleOpenEditRole(item)} className="text-blue-600 hover:underline font-medium cursor-pointer">编辑</button>
                            <button type="button" onClick={() => handleOpenDeleteRole(item)} className="text-rose-600 hover:underline font-medium cursor-pointer">删除</button>
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            <label className="inline-flex items-center cursor-pointer">
                              <span className="mr-1 text-[11px] text-slate-600">{item.enabled ? '启用' : '停用'}</span>
                              <input
                                type="checkbox"
                                checked={item.enabled}
                                onChange={() => {
                                  setRoleManagementList(roleManagementList.map(r => r.id === item.id ? { ...r, enabled: !r.enabled } : r));
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600 relative"></div>
                            </label>
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">{item.roleCode}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-medium text-slate-800">{item.roleName}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-600 truncate max-w-[220px]" title={item.roleDesc}>{item.roleDesc}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-600">{item.permissions}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.operator}</td>
                          <td className="p-2.5 text-center font-mono text-indigo-600">{item.updateTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 {totalRoleCount} 条记录 第 {roleCurrentPage} / {totalRolePages} 页</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setRoleCurrentPage(p => Math.max(1, p - 1))}
                      disabled={roleCurrentPage === 1}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        roleCurrentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="上一页"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalRolePages }, (_, i) => i + 1).map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setRoleCurrentPage(p)}
                        className={`w-6 h-6 flex items-center justify-center rounded text-xs font-medium cursor-pointer ${
                          roleCurrentPage === p ? 'bg-blue-600 text-white shadow-2xs' : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setRoleCurrentPage(p => Math.min(totalRolePages, p + 1))}
                      disabled={roleCurrentPage === totalRolePages}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        roleCurrentPage === totalRolePages ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="下一页"
                    >
                      &gt;
                    </button>
                    <span className="px-2 font-medium text-slate-600">10条/页</span>
                    <span>跳至</span>
                    <input
                      type="number"
                      min={1}
                      max={totalRolePages}
                      value={roleJumpPage}
                      onChange={(e) => setRoleJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(roleJumpPage, 10);
                          if (p >= 1 && p <= totalRolePages) {
                            setRoleCurrentPage(p);
                          }
                        }
                      }}
                      className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center text-xs font-mono bg-white"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(roleJumpPage, 10);
                        if (p >= 1 && p <= totalRolePages) {
                          setRoleCurrentPage(p);
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 cursor-pointer text-xs ml-0.5 transition"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '邮件组管理' ? (
            /* Email Group Management Page matching screenshot image_23c18fea.png */
            <div className="space-y-4">
              {/* Search Filter Bar & Action Toolbar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>邮件组代号:</span>
                    <input
                      type="text"
                      value={emailGroupCodeFilter}
                      onChange={(e) => setEmailGroupCodeFilter(e.target.value)}
                      placeholder=""
                      className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>邮件组名称:</span>
                    <input
                      type="text"
                      value={emailGroupNameFilter}
                      onChange={(e) => setEmailGroupNameFilter(e.target.value)}
                      placeholder=""
                      className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleSearchEmailGroup}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetEmailGroup}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleOpenAddEmailGroup}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium shadow-2xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                </div>
              </div>

              {/* Email Group Table Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                        <th className="p-2.5 text-center border-r border-slate-200 w-16">序号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono min-w-[120px]">邮件组代号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[160px]">邮件组名称</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[285px]">邮件组说明</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[100px]">操作人</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono min-w-[160px]">更新时间</th>
                        <th className="p-2.5 text-center min-w-[100px]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {currentEmailGroupList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">
                            {(emailGroupCurrentPage - 1) * emailGroupPageSize + idx + 1}
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">{item.groupCode}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-medium text-slate-800">{item.groupName}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-600 truncate max-w-[285px]" title={item.groupDesc}>{item.groupDesc}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.operator}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono text-indigo-600">{item.updateTime}</td>
                          <td className="p-2.5 text-center space-x-2">
                            <button type="button" onClick={() => handleOpenEditEmailGroup(item)} className="text-blue-600 hover:underline font-medium cursor-pointer">编辑</button>
                            <button type="button" onClick={() => handleOpenDeleteEmailGroup(item)} className="text-rose-600 hover:underline font-medium cursor-pointer">删除</button>
                          </td>
                        </tr>
                      ))}
                      {/* Filler rows up to 10 */}
                      {Array.from({ length: Math.max(0, 10 - currentEmailGroupList.length) }).map((_, i) => (
                        <tr key={`empty-eg-${i}`} className="h-9">
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-400 font-mono">
                            {(emailGroupCurrentPage - 1) * emailGroupPageSize + currentEmailGroupList.length + i + 1}
                          </td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 {totalEmailGroupCount} 条记录 第 {emailGroupCurrentPage} / {totalEmailGroupPages} 页</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setEmailGroupCurrentPage(p => Math.max(1, p - 1))}
                      disabled={emailGroupCurrentPage === 1}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        emailGroupCurrentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="上一页"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalEmailGroupPages }, (_, i) => i + 1).map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setEmailGroupCurrentPage(p)}
                        className={`w-6 h-6 flex items-center justify-center rounded text-xs font-medium cursor-pointer ${
                          emailGroupCurrentPage === p ? 'bg-blue-600 text-white shadow-2xs' : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setEmailGroupCurrentPage(p => Math.min(totalEmailGroupPages, p + 1))}
                      disabled={emailGroupCurrentPage === totalEmailGroupPages}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        emailGroupCurrentPage === totalEmailGroupPages ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="下一页"
                    >
                      &gt;
                    </button>
                    <span className="px-2 font-medium text-slate-600">10条/页</span>
                    <span>跳至</span>
                    <input
                      type="number"
                      min={1}
                      max={totalEmailGroupPages}
                      value={emailGroupJumpPage}
                      onChange={(e) => setEmailGroupJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(emailGroupJumpPage, 10);
                          if (p >= 1 && p <= totalEmailGroupPages) {
                            setEmailGroupCurrentPage(p);
                          }
                        }
                      }}
                      className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center text-xs font-mono bg-white"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(emailGroupJumpPage, 10);
                        if (p >= 1 && p <= totalEmailGroupPages) {
                          setEmailGroupCurrentPage(p);
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 cursor-pointer text-xs ml-0.5 transition"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '自动派单设置' ? (
            /* Auto Dispatch Settings Page matching screenshot image_9bf6461b.png */
            <div className="space-y-4">
              {/* Search Filter Bar & Action Toolbar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>物料组:</span>
                    <select
                      value={autoDispatchMaterialFilter}
                      onChange={(e) => setAutoDispatchMaterialFilter(e.target.value)}
                      className="w-48 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="物料组1">物料组1</option>
                      <option value="物料组2">物料组2</option>
                      <option value="物料组3">物料组3</option>
                      <option value="物料组4">物料组4</option>
                      <option value="物料组5">物料组5</option>
                      <option value="主控MCU与微处理器">主控MCU与微处理器</option>
                      <option value="SMT车规贴片电容">SMT车规贴片电容</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleSearchAutoDispatch}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetAutoDispatch}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={handleBatchEnableAutoDispatch}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium shadow-2xs transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>批量启用</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBatchDisableAutoDispatch}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium shadow-2xs transition cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>批量关闭</span>
                  </button>
                </div>
              </div>

              {/* Auto Dispatch Table Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                        <th className="p-2.5 text-center border-r border-slate-200 w-12">
                          <input
                            type="checkbox"
                            checked={currentAutoDispatchList.length > 0 && currentAutoDispatchList.every(item => autoDispatchSelectedIds.includes(item.id))}
                            onChange={handleSelectAllAutoDispatch}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="p-2.5 text-center border-r border-slate-200 w-16">序号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[200px]">物料组</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[140px]">启用状态</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[100px]">操作人</th>
                        <th className="p-2.5 text-center font-mono min-w-[160px]">更新时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {currentAutoDispatchList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 text-center border-r border-slate-200">
                            <input
                              type="checkbox"
                              checked={autoDispatchSelectedIds.includes(item.id)}
                              onChange={() => handleToggleSelectAutoDispatch(item.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">
                            {(autoDispatchCurrentPage - 1) * autoDispatchPageSize + idx + 1}
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-medium text-slate-800">{item.materialGroup}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            <div className="flex items-center justify-center space-x-2">
                              <span className={`text-xs ${item.enabled ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                                {item.enabled ? '启用' : '关闭'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleToggleAutoDispatchItem(item.id)}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                                  item.enabled ? 'bg-blue-600' : 'bg-slate-300'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                                  item.enabled ? 'translate-x-4' : 'translate-x-0'
                                }`} />
                              </button>
                            </div>
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.operator}</td>
                          <td className="p-2.5 text-center font-mono text-indigo-600">{item.updateTime}</td>
                        </tr>
                      ))}
                      {/* Filler rows up to 10 */}
                      {Array.from({ length: Math.max(0, 10 - currentAutoDispatchList.length) }).map((_, i) => (
                        <tr key={`empty-ad-${i}`} className="h-9">
                          <td className="border-r border-slate-200"></td>
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-400 font-mono">
                            {(autoDispatchCurrentPage - 1) * autoDispatchPageSize + currentAutoDispatchList.length + i + 1}
                          </td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 {totalAutoDispatchCount} 条记录 第 {autoDispatchCurrentPage} / {totalAutoDispatchPages} 页</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setAutoDispatchCurrentPage(p => Math.max(1, p - 1))}
                      disabled={autoDispatchCurrentPage === 1}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        autoDispatchCurrentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="上一页"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalAutoDispatchPages }, (_, i) => i + 1).map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setAutoDispatchCurrentPage(p)}
                        className={`w-6 h-6 flex items-center justify-center rounded text-xs font-medium cursor-pointer ${
                          autoDispatchCurrentPage === p ? 'bg-blue-600 text-white shadow-2xs' : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAutoDispatchCurrentPage(p => Math.min(totalAutoDispatchPages, p + 1))}
                      disabled={autoDispatchCurrentPage === totalAutoDispatchPages}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        autoDispatchCurrentPage === totalAutoDispatchPages ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="下一页"
                    >
                      &gt;
                    </button>
                    <span className="px-2 font-medium text-slate-600">10条/页</span>
                    <span>跳至</span>
                    <input
                      type="number"
                      min={1}
                      max={totalAutoDispatchPages}
                      value={autoDispatchJumpPage}
                      onChange={(e) => setAutoDispatchJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(autoDispatchJumpPage, 10);
                          if (p >= 1 && p <= totalAutoDispatchPages) {
                            setAutoDispatchCurrentPage(p);
                          }
                        }
                      }}
                      className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center text-xs font-mono bg-white"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(autoDispatchJumpPage, 10);
                        if (p >= 1 && p <= totalAutoDispatchPages) {
                          setAutoDispatchCurrentPage(p);
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 cursor-pointer text-xs ml-0.5 transition"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '帮助中心' ? (
            /* Help Center Main Page */
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-md space-y-3">
                <h2 className="text-xl font-bold">欢迎来到 IQC数字化质量管理系统帮助中心</h2>
                <p className="text-xs text-indigo-100 max-w-2xl leading-relaxed">
                  在这里您可以查阅系统使用指南、各模块操作手册、常见问题解答（FAQ）以及联系技术支持团队。如遇系统故障，欢迎随时前往「意见反馈」提交工单。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">物料派单与检验指南</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">详细介绍零星物料派单、WMS待派单对接流程、我的检验执行标准及判定规范。</p>
                  <button onClick={() => setActiveMenu('零星物料派单')} className="text-xs text-blue-600 hover:underline font-medium cursor-pointer pt-1 inline-block">立即查阅 &gt;</button>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">质检审核流程规范</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">包含IQC主管审核、质量主管审核判定标准及异常批次处理闭环流程。</p>
                  <button onClick={() => setActiveMenu('IQC主管审核')} className="text-xs text-emerald-600 hover:underline font-medium cursor-pointer pt-1 inline-block">立即查阅 &gt;</button>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">权限与基础数据配置</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">角色权限管理、用户账号维护、邮件组通知绑定及物料组自动派单规则配置说明。</p>
                  <button onClick={() => setActiveMenu('角色管理')} className="text-xs text-amber-600 hover:underline font-medium cursor-pointer pt-1 inline-block">立即查阅 &gt;</button>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">常见问题 (FAQ)</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-800">Q1: 派单后在 WMS 系统中无法同步看到数据怎么办？</p>
                    <p className="text-slate-600 mt-1">A: 请检查网络连接或前往「综合查询」查看WMS同步状态。若显示异常，可点击异常恢复按钮重新推送或联系IT运维支持。</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-800">Q2: 检验员如何修改本人负责的物料组和检验角色？</p>
                    <p className="text-slate-600 mt-1">A: 请联系系统管理员（具有角色管理和用户管理权限的账号）在「权限管理 -&gt; 用户管理」中进行相应调整。</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-800">Q3: 遇到系统故障或急需新增功能建议如何反馈？</p>
                    <p className="text-slate-600 mt-1">A: 您可点击左侧菜单栏「帮助中心 -&gt; 意见反馈」，提交您的具体需求或Bug截图，系统将会自动生成工单并由专人跟进处理。</p>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '意见反馈' ? (
            /* Feedback Page */
            <div className="space-y-4">
              {/* Search & Action Bar */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>反馈分类:</span>
                    <select
                      value={feedbackTypeFilter}
                      onChange={(e) => setFeedbackTypeFilter(e.target.value)}
                      className="w-40 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    >
                      <option value="">全部</option>
                      <option value="功能建议">功能建议</option>
                      <option value="界面优化">界面优化</option>
                      <option value="缺陷报错">缺陷报错</option>
                      <option value="性能体验">性能体验</option>
                      <option value="其它">其它</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>关键字:</span>
                    <input
                      type="text"
                      placeholder="标题或内容关键词"
                      value={feedbackKeyword}
                      onChange={(e) => setFeedbackKeyword(e.target.value)}
                      className="w-48 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleSearchFeedback}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetFeedback}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleOpenAddFeedback}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium shadow-2xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>提交意见反馈</span>
                  </button>
                </div>
              </div>

              {/* Feedback Table Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                        <th className="p-2.5 text-center border-r border-slate-200 w-16">序号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[100px]">反馈分类</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[220px]">反馈标题</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[300px]">详细描述</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[90px]">提交人</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[90px]">状态</th>
                        <th className="p-2.5 text-center font-mono min-w-[150px]">提交时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {currentFeedbackList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">
                            {(feedbackCurrentPage - 1) * feedbackPageSize + idx + 1}
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              item.type === '功能建议' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                              item.type === '缺陷报错' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                              item.type === '界面优化' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                              'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-medium text-slate-800">{item.title}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-600 truncate max-w-[300px]" title={item.content}>{item.content}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.operator}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              item.status === '已处理' ? 'bg-emerald-50 text-emerald-600' :
                              item.status === '处理中' ? 'bg-blue-50 text-blue-600' :
                              'bg-amber-50 text-amber-600'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-2.5 text-center font-mono text-indigo-600">{item.updateTime}</td>
                        </tr>
                      ))}
                      {/* Filler rows up to 10 */}
                      {Array.from({ length: Math.max(0, 10 - currentFeedbackList.length) }).map((_, i) => (
                        <tr key={`empty-fb-${i}`} className="h-9">
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-400 font-mono">
                            {(feedbackCurrentPage - 1) * feedbackPageSize + currentFeedbackList.length + i + 1}
                          </td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 {totalFeedbackCount} 条记录 第 {feedbackCurrentPage} / {totalFeedbackPages} 页</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setFeedbackCurrentPage(p => Math.max(1, p - 1))}
                      disabled={feedbackCurrentPage === 1}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        feedbackCurrentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="上一页"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalFeedbackPages }, (_, i) => i + 1).map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setFeedbackCurrentPage(p)}
                        className={`w-6 h-6 flex items-center justify-center rounded text-xs font-medium cursor-pointer ${
                          feedbackCurrentPage === p ? 'bg-blue-600 text-white shadow-2xs' : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFeedbackCurrentPage(p => Math.min(totalFeedbackPages, p + 1))}
                      disabled={feedbackCurrentPage === totalFeedbackPages}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        feedbackCurrentPage === totalFeedbackPages ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="下一页"
                    >
                      &gt;
                    </button>
                    <span className="px-2 font-medium text-slate-600">10条/页</span>
                    <span>跳至</span>
                    <input
                      type="number"
                      min={1}
                      max={totalFeedbackPages}
                      value={feedbackJumpPage}
                      onChange={(e) => setFeedbackJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(feedbackJumpPage, 10);
                          if (p >= 1 && p <= totalFeedbackPages) {
                            setFeedbackCurrentPage(p);
                          }
                        }
                      }}
                      className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center text-xs font-mono bg-white"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(feedbackJumpPage, 10);
                        if (p >= 1 && p <= totalFeedbackPages) {
                          setFeedbackCurrentPage(p);
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 cursor-pointer text-xs ml-0.5 transition"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === '用户管理' ? (
            /* User Management Page matching screenshot image_c70620ca.png */
            <div className="space-y-4">
              {/* Search Filter Bar & Action Toolbar Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>角色名称:</span>
                    <input
                      type="text"
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      placeholder=""
                      className="w-44 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleSearchUser}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>查询</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetUser}
                      className="flex items-center space-x-1 px-4 py-1.5 bg-white border border-amber-400 text-amber-500 hover:bg-amber-50 rounded font-medium transition shadow-2xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleOpenAddUser}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium shadow-2xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                </div>
              </div>

              {/* User Management Table Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                        <th className="p-2.5 text-center border-r border-slate-200 w-14">序号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[100px]">操作</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[90px]">启动状态</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono min-w-[100px]">用户账号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[100px]">用户名称</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[110px]">所属部门</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono min-w-[110px]">自动派单顺序</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[100px]">签审角色</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[100px]">用户角色</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono min-w-[100px]">检验员代号</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[100px]">参与自动派单</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[110px]">检验物料组</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono min-w-[100px]">IP</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[140px]">邮箱</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono min-w-[110px]">请假开始</th>
                        <th className="p-2.5 text-center border-r border-slate-200 font-mono min-w-[110px]">请假结束</th>
                        <th className="p-2.5 text-center border-r border-slate-200 min-w-[90px]">操作人</th>
                        <th className="p-2.5 text-center font-mono text-indigo-600 font-medium min-w-[150px]">维护时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {currentUserList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">
                            {(userCurrentPage - 1) * userPageSize + idx + 1}
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 space-x-2">
                            <button type="button" onClick={() => handleOpenEditUser(item)} className="text-blue-600 hover:underline font-medium cursor-pointer">编辑</button>
                            <button type="button" onClick={() => handleOpenDeleteUser(item)} className="text-rose-600 hover:underline font-medium cursor-pointer">删除</button>
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            <label className="inline-flex items-center cursor-pointer">
                              <span className="mr-1 text-[11px] text-slate-600">{item.enabled ? '启用' : '停用'}</span>
                              <input
                                type="checkbox"
                                checked={item.enabled}
                                onChange={() => {
                                  setUserManagementList(userManagementList.map(u => u.id === item.id ? { ...u, enabled: !u.enabled } : u));
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600 relative"></div>
                            </label>
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">{item.account}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-medium text-slate-800">{item.name}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.department}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">{item.dispatchOrder}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.signRole}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.userRole}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">{item.inspectorCode}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.autoDispatch}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.materialGroup}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">{item.ip}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.email}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">{item.leaveStart}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono">{item.leaveEnd}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">{item.operator}</td>
                          <td className="p-2.5 text-center font-mono text-indigo-600 font-medium">{item.updateTime}</td>
                        </tr>
                      ))}
                      {/* Grid Filler Rows up to 10 rows per page */}
                      {Array.from({ length: Math.max(0, 10 - currentUserList.length) }).map((_, i) => (
                        <tr key={`empty-user-${i}`} className="h-9">
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-400 font-mono">
                            {(userCurrentPage - 1) * userPageSize + currentUserList.length + i + 1}
                          </td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td className="border-r border-slate-200"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500">
                  <span>共 200 条记录 第 {userCurrentPage} / 60 页</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setUserCurrentPage(p => Math.max(1, p - 1))}
                      disabled={userCurrentPage === 1}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        userCurrentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="上一页"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalUserPages }, (_, i) => i + 1).map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setUserCurrentPage(p)}
                        className={`w-6 h-6 flex items-center justify-center rounded text-xs font-medium cursor-pointer ${
                          userCurrentPage === p ? 'bg-blue-600 text-white shadow-2xs' : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setUserCurrentPage(p => Math.min(totalUserPages, p + 1))}
                      disabled={userCurrentPage === totalUserPages}
                      className={`w-6 h-6 flex items-center justify-center rounded border border-slate-200 ${
                        userCurrentPage === totalUserPages ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                      title="下一页"
                    >
                      &gt;
                    </button>
                    <span className="px-2 font-medium text-slate-600">10条/页</span>
                    <span>跳至</span>
                    <input
                      type="number"
                      min={1}
                      max={totalUserPages}
                      value={userJumpPage}
                      onChange={(e) => setUserJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(userJumpPage, 10);
                          if (p >= 1 && p <= totalUserPages) {
                            setUserCurrentPage(p);
                          }
                        }
                      }}
                      className="w-10 px-1 py-0.5 border border-slate-300 rounded text-center text-xs font-mono bg-white"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(userJumpPage, 10);
                        if (p >= 1 && p <= totalUserPages) {
                          setUserCurrentPage(p);
                        }
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 cursor-pointer text-xs ml-0.5 transition"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-2">{activeMenu}模块</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                当前正在查看 {activeMenu} 功能区。
              </p>
              <button
                onClick={() => setActiveMenu('首页')}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition"
              >
                返回首页看板
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Add Dispatch Modal matching screenshot */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">零星物料派单新增</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDispatch} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">物料编码 :</label>
                  <input
                    type="text"
                    required
                    value={addCode}
                    onChange={(e) => setAddCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    placeholder="请输入物料编码"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">物料名称 :</label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    placeholder="请输入物料名称"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">厂家MLOT :</label>
                  <input
                    type="text"
                    value={addMlot}
                    onChange={(e) => setAddMlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    placeholder="请输入厂家MLOT"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">物料LPN :</label>
                  <input
                    type="text"
                    value={addLpn}
                    onChange={(e) => setAddLpn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    placeholder="请输入物料LPN"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">供方代码 :</label>
                  <input
                    type="text"
                    required
                    value={addSupplierCode}
                    onChange={(e) => setAddSupplierCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    placeholder="请输入供方代码"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">供方简称 :</label>
                  <input
                    type="text"
                    required
                    value={addSupplierAbbr}
                    onChange={(e) => setAddSupplierAbbr(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    placeholder="请输入供方简称"
                  />
                </div>
                <div className="flex items-center space-x-4 py-1">
                  <label className="font-semibold text-slate-600 w-24">定点物料 :</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="addSpot" checked={addSpot === '是'} onChange={() => setAddSpot('是')} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="addSpot" checked={addSpot === '否'} onChange={() => setAddSpot('否')} />
                      <span>否</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center space-x-4 py-1">
                  <label className="font-semibold text-slate-600 w-24">WMS物料 :</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="addWms" checked={addWms === '是'} onChange={() => setAddWms('是')} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="addWms" checked={addWms === '否'} onChange={() => setAddWms('否')} />
                      <span>否</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">订单号 :</label>
                  <input
                    type="text"
                    required
                    value={addOrderNo}
                    onChange={(e) => setAddOrderNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    placeholder="请输入订单号"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">收货单号 :</label>
                  <input
                    type="text"
                    required
                    value={addGoodsNo}
                    onChange={(e) => setAddGoodsNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    placeholder="请输入收货单号"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">批次 :</label>
                  <input
                    type="text"
                    required
                    value={addBatch}
                    onChange={(e) => setAddBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    placeholder="请输入批次号 (如 20261020)"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">数量 :</label>
                  <input
                    type="number"
                    required
                    value={addQty}
                    onChange={(e) => setAddQty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    placeholder="请输入数量"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">检验员 :</label>
                  <select
                    value={addInspector}
                    onChange={(e) => setAddInspector(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="李明">李明</option>
                    <option value="张伟">张伟</option>
                    <option value="王芳">王芳</option>
                    <option value="刘洋">刘洋</option>
                    <option value="陈静">陈静</option>
                    <option value="周浩">周浩</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4 py-1">
                  <label className="font-semibold text-slate-600 w-24">无纸化派单 :</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="addPaperless" checked={addPaperless === '是'} onChange={() => setAddPaperless('是')} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="addPaperless" checked={addPaperless === '否'} onChange={() => setAddPaperless('否')} />
                      <span>否</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="font-semibold text-slate-600 block mb-1">备注 :</label>
                <textarea
                  rows={3}
                  value={addRemark}
                  onChange={(e) => setAddRemark(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs resize-none"
                  placeholder="请输入备注说明..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md transition"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dispatch Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Edit className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">修改零星物料派单</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">物料编码 :</label>
                  <input
                    type="text"
                    required
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">物料名称 :</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">厂家MLOT :</label>
                  <input
                    type="text"
                    value={editMlot}
                    onChange={(e) => setEditMlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">物料LPN :</label>
                  <input
                    type="text"
                    value={editLpn}
                    onChange={(e) => setEditLpn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">供方代码 :</label>
                  <input
                    type="text"
                    required
                    value={editSupplierCode}
                    onChange={(e) => setEditSupplierCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">供方简称 :</label>
                  <input
                    type="text"
                    required
                    value={editSupplierAbbr}
                    onChange={(e) => setEditSupplierAbbr(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div className="flex items-center space-x-4 py-1">
                  <label className="font-semibold text-slate-600 w-24">定点物料 :</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="editSpot" checked={editSpot === '是'} onChange={() => setEditSpot('是')} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="editSpot" checked={editSpot === '否'} onChange={() => setEditSpot('否')} />
                      <span>否</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center space-x-4 py-1">
                  <label className="font-semibold text-slate-600 w-24">WMS物料 :</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="editWms" checked={editWms === '是'} onChange={() => setEditWms('是')} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="editWms" checked={editWms === '否'} onChange={() => setEditWms('否')} />
                      <span>否</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">订单号 :</label>
                  <input
                    type="text"
                    required
                    value={editOrderNo}
                    onChange={(e) => setEditOrderNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">收货单号 :</label>
                  <input
                    type="text"
                    required
                    value={editGoodsNo}
                    onChange={(e) => setEditGoodsNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">批次 :</label>
                  <input
                    type="text"
                    required
                    value={editBatch}
                    onChange={(e) => setEditBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">数量 :</label>
                  <input
                    type="number"
                    required
                    value={editQty}
                    onChange={(e) => setEditQty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">检验员 :</label>
                  <select
                    value={editInspector}
                    onChange={(e) => setEditInspector(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="李明">李明</option>
                    <option value="张伟">张伟</option>
                    <option value="王芳">王芳</option>
                    <option value="刘洋">刘洋</option>
                    <option value="陈静">陈静</option>
                    <option value="周浩">周浩</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4 py-1">
                  <label className="font-semibold text-slate-600 w-24">无纸化派单 :</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="editPaperless" checked={editPaperless === '是'} onChange={() => setEditPaperless('是')} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="editPaperless" checked={editPaperless === '否'} onChange={() => setEditPaperless('否')} />
                      <span>否</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="font-semibold text-slate-600 block mb-1">备注 :</label>
                <textarea
                  rows={3}
                  value={editRemark}
                  onChange={(e) => setEditRemark(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 text-xs resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md transition"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">删除派单确认</h3>
                <p className="text-xs text-slate-400">此操作无法撤销，请谨慎确认</p>
              </div>
            </div>

            <div className="py-5 text-xs text-slate-600 space-y-2">
              <p>您确定要删除以下零星物料派单记录吗？</p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 font-medium">
                <div><span className="text-slate-400">物料代码：</span><span className="text-slate-800">{deletingItem.code}</span></div>
                <div><span className="text-slate-400">物料名称：</span><span className="text-slate-800">{deletingItem.name}</span></div>
                <div><span className="text-slate-400">批次号：</span><span className="text-slate-800">{deletingItem.batch}</span></div>
                <div><span className="text-slate-400">供方简称：</span><span className="text-slate-800">{deletingItem.supplierAbbr}</span></div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-xs shadow-md transition"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white rounded-xl shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Gemini 智能质检专家</h3>
                  <p className="text-xs text-slate-400">实时分析当前派单指标与异常</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600">向 AI 提问或点击一键深度诊断：</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="例如：分析当前派单异常原因..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 border border-transparent focus:border-indigo-500 rounded-xl text-sm outline-none transition"
                  />
                  <button
                    onClick={handleAiAnalyze}
                    disabled={isAnalyzing}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm shadow-md transition disabled:opacity-50 flex items-center space-x-1"
                  >
                    {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>分析</span>}
                  </button>
                </div>
              </div>

              {aiResponse && (
                <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-sm text-slate-700 leading-relaxed whitespace-pre-line animate-in fade-in">
                  <div className="flex items-center space-x-1.5 font-bold text-indigo-900 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>AI 诊断报告：</span>
                  </div>
                  {aiResponse}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WMS Dispatch Modal matching screenshot image_33140863.png */}
      {showWmsDispatchModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">WMS待派单</h3>
              <button
                onClick={() => setShowWmsDispatchModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmWmsDispatch} className="py-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">物料编码：</label>
                  <input
                    type="text"
                    value={wmsDispatchForm.code}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, code: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">物料名称：</label>
                  <input
                    type="text"
                    value={wmsDispatchForm.name}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, name: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">厂家MLOT：</label>
                  <input
                    type="text"
                    value={wmsDispatchForm.mlot}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, mlot: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">物料LPN：</label>
                  <input
                    type="text"
                    value={wmsDispatchForm.lpn}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, lpn: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">供方代号：</label>
                  <input
                    type="text"
                    value={wmsDispatchForm.supplierCode}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, supplierCode: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">供方简称：</label>
                  <input
                    type="text"
                    value={wmsDispatchForm.supplierName}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, supplierName: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="w-28 text-right font-medium text-slate-600">定点物料：</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="spotModal" checked={wmsDispatchForm.spot === '是'} onChange={() => setWmsDispatchForm({ ...wmsDispatchForm, spot: '是' })} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="spotModal" checked={wmsDispatchForm.spot === '否'} onChange={() => setWmsDispatchForm({ ...wmsDispatchForm, spot: '否' })} />
                      <span>否</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="w-28 text-right font-medium text-slate-600">无纸化派单：</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="paperlessModal" checked={wmsDispatchForm.paperless === '是'} onChange={() => setWmsDispatchForm({ ...wmsDispatchForm, paperless: '是' })} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="paperlessModal" checked={wmsDispatchForm.paperless === '否'} onChange={() => setWmsDispatchForm({ ...wmsDispatchForm, paperless: '否' })} />
                      <span>否</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">订单号：</label>
                  <input
                    type="text"
                    value={wmsDispatchForm.orderNo}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, orderNo: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">收货单号：</label>
                  <input
                    type="text"
                    value={wmsDispatchForm.goodsNo}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, goodsNo: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">批次：</label>
                  <input
                    type="text"
                    value={wmsDispatchForm.batch}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, batch: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">数量：</label>
                  <input
                    type="text"
                    value={wmsDispatchForm.qty}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, qty: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">检验员：</label>
                  <select
                    value={wmsDispatchForm.inspector}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, inspector: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  >
                    <option value="李明">李明</option>
                    <option value="张伟">张伟</option>
                    <option value="王芳">王芳</option>
                    <option value="刘洋">刘洋</option>
                    <option value="陈静">陈静</option>
                    <option value="周浩">周浩</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="w-28 text-right font-medium text-slate-600">暂停供货：</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="pauseModal" checked={wmsDispatchForm.pauseSupply === '是'} onChange={() => setWmsDispatchForm({ ...wmsDispatchForm, pauseSupply: '是' })} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="pauseModal" checked={wmsDispatchForm.pauseSupply === '否'} onChange={() => setWmsDispatchForm({ ...wmsDispatchForm, pauseSupply: '否' })} />
                      <span>否</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-4 col-span-2">
                  <label className="w-44 text-right font-medium text-slate-600">当天是否有相同物料到货已派单：</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="sameDayModal" checked={wmsDispatchForm.sameDayDispatched === '是'} onChange={() => setWmsDispatchForm({ ...wmsDispatchForm, sameDayDispatched: '是' })} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" name="sameDayModal" checked={wmsDispatchForm.sameDayDispatched === '否'} onChange={() => setWmsDispatchForm({ ...wmsDispatchForm, sameDayDispatched: '否' })} />
                      <span>否</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">涉及化工项目：</label>
                  <select
                    value={wmsDispatchForm.chemicalProject}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, chemicalProject: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  >
                    <option value="否">否</option>
                    <option value="是">是</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="w-28 text-right font-medium text-slate-600">是否首批：</label>
                  <select
                    value={wmsDispatchForm.firstBatch}
                    onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, firstBatch: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  >
                    <option value="否">否</option>
                    <option value="是">是</option>
                  </select>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <label className="w-28 text-right font-medium text-slate-600 pt-2">备注：</label>
                <textarea
                  rows={3}
                  value={wmsDispatchForm.remark}
                  onChange={(e) => setWmsDispatchForm({ ...wmsDispatchForm, remark: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 resize-none"
                  placeholder="请输入备注说明..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWmsDispatchModal(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Paperless Configuration Modal */}
      {showPaperlessModal && paperlessItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">无纸化派单设置</h3>
              <button
                onClick={() => setShowPaperlessModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 font-medium">
                <div><span className="text-slate-400">物料编码：</span><span className="text-slate-800">{paperlessItem.code}</span></div>
                <div><span className="text-slate-400">物料描述：</span><span className="text-slate-800">{paperlessItem.desc}</span></div>
                <div><span className="text-slate-400">供方名称：</span><span className="text-slate-800">{paperlessItem.supplierName}</span></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-slate-700">启用无纸化电子检验：</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input type="radio" name="paperlessToggle" checked={paperlessEnabled === '是'} onChange={() => setPaperlessEnabled('是')} />
                    <span>是</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input type="radio" name="paperlessToggle" checked={paperlessEnabled === '否'} onChange={() => setPaperlessEnabled('否')} />
                    <span>否</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowPaperlessModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition"
              >
                取消
              </button>
              <button
                onClick={handleConfirmPaperless}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs shadow-md transition"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">新增供应商</h3>
              <button
                onClick={() => setShowAddSupplierModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="py-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">供方代号：</label>
                <input
                  type="text"
                  required
                  placeholder="请输入供方代号 (如 101016)"
                  value={suppFormCode}
                  onChange={(e) => setSuppFormCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">供方简称：</label>
                <input
                  type="text"
                  required
                  placeholder="请输入供方简称 (如 电子科技)"
                  value={suppFormAbbr}
                  onChange={(e) => setSuppFormAbbr(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">供方全称：</label>
                <input
                  type="text"
                  required
                  placeholder="请输入供方公司全称"
                  value={suppFormFullName}
                  onChange={(e) => setSuppFormFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition"
                >
                  确认新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {showEditSupplierModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">编辑供应商信息</h3>
              <button
                onClick={() => setShowEditSupplierModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSupplier} className="py-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">供方代号：</label>
                <input
                  type="text"
                  required
                  value={suppFormCode}
                  onChange={(e) => setSuppFormCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">供方简称：</label>
                <input
                  type="text"
                  required
                  value={suppFormAbbr}
                  onChange={(e) => setSuppFormAbbr(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">供方全称：</label>
                <input
                  type="text"
                  required
                  value={suppFormFullName}
                  onChange={(e) => setSuppFormFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditSupplierModal(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Supplier Modal */}
      {showDeleteSupplierModal && deletingSupplier && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">作废删除供应商</h3>
                  <p className="text-xs text-slate-400">供应商档案管理 / 删除确认</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteSupplierModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs">
              <div className="p-4 bg-rose-50/80 border border-rose-200/60 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>您确定要删除以下供应商记录吗？</span>
                </div>
                <p className="text-rose-700/80 text-xs pl-6">
                  删除后该供应商信息将无法恢复，且影响关联定点物料档案，请谨慎操作！
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">供方代号：</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{deletingSupplier.code}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">供方简称：</span>
                  <span className="font-bold text-indigo-600">{deletingSupplier.abbr}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">供方全称：</span>
                  <span className="font-semibold text-slate-700">{deletingSupplier.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">最近更新时间：</span>
                  <span className="font-mono text-slate-500">{deletingSupplier.updateTime}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDeleteSupplierModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition text-xs"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteSupplier}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-md transition text-xs flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>确认作废删除</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Spot Material Modal matching screenshot image_0240e16c.png */}
      {showAddSpotModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-6 animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">新增物料清单</h3>
              <button
                type="button"
                onClick={() => setShowAddSpotModal(false)}
                className="text-slate-400 hover:text-slate-600 transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSpotMaterial} className="py-6 space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 items-center">
                {/* Row 1 */}
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">物料编码：</label>
                  <input
                    type="text"
                    value={spotFormMaterialCode}
                    onChange={(e) => setSpotFormMaterialCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 font-mono text-slate-800"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">物料名称：</label>
                  <input
                    type="text"
                    value={spotFormMaterialName}
                    onChange={(e) => setSpotFormMaterialName(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                {/* Row 2 */}
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">供方代号：</label>
                  <input
                    type="text"
                    value={spotFormSupplierCode}
                    onChange={(e) => setSpotFormSupplierCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 font-mono text-slate-800"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">供方名称：</label>
                  <input
                    type="text"
                    value={spotFormSupplierName}
                    onChange={(e) => setSpotFormSupplierName(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                {/* Row 3 */}
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">规格型号：</label>
                  <input
                    type="text"
                    value={spotFormSpec}
                    onChange={(e) => setSpotFormSpec(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">图号：</label>
                  <input
                    type="text"
                    value={spotFormDrawingNo}
                    onChange={(e) => setSpotFormDrawingNo(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 font-mono text-slate-800"
                  />
                </div>

                {/* Row 4 */}
                <div className="flex items-center justify-start space-x-2 col-span-2 my-1 pl-12">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right mr-2">消耗物料：</label>
                  <div className="flex items-center space-x-6">
                    <label className="inline-flex items-center space-x-1.5 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="addConsumableRadio"
                        value="是"
                        checked={spotFormIsConsumable === '是'}
                        onChange={(e) => setSpotFormIsConsumable(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span>是</span>
                    </label>
                    <label className="inline-flex items-center space-x-1.5 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="addConsumableRadio"
                        value="否"
                        checked={spotFormIsConsumable === '否'}
                        onChange={(e) => setSpotFormIsConsumable(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span>否</span>
                    </label>
                  </div>
                </div>

                {/* Row 5 */}
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">消耗物料类型：</label>
                  <select
                    value={spotFormConsumableType}
                    onChange={(e) => setSpotFormConsumableType(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  >
                    <option value="">请选择</option>
                    <option value="辅助用料">辅助用料</option>
                    <option value="耗损物料">耗损物料</option>
                    <option value="工装夹具">工装夹具</option>
                    <option value="包装物料">包装物料</option>
                    <option value="试验耗材">试验耗材</option>
                    <option value="电子主料">电子主料</option>
                    <option value="常规物料">常规物料</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">消耗数量：</label>
                  <input
                    type="text"
                    value={spotFormConsumableQty}
                    onChange={(e) => setSpotFormConsumableQty(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                {/* Row 6 */}
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">消耗物料开始时间：</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={spotFormConsumableStartTime}
                    onChange={(e) => setSpotFormConsumableStartTime(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">消耗物料结束时间：</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={spotFormConsumableEndTime}
                    onChange={(e) => setSpotFormConsumableEndTime(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddSpotModal(false)}
                  className="px-6 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded transition text-xs font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition text-xs font-medium shadow-sm"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Spot Material Modal matching screenshot image_0240e16c.png */}
      {showEditSpotModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-6 animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">编辑物料清单</h3>
              <button
                type="button"
                onClick={() => setShowEditSpotModal(false)}
                className="text-slate-400 hover:text-slate-600 transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSpotMaterial} className="py-6 space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 items-center">
                {/* Row 1 */}
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">物料编码：</label>
                  <input
                    type="text"
                    value={spotFormMaterialCode}
                    onChange={(e) => setSpotFormMaterialCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 font-mono text-slate-800"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">物料名称：</label>
                  <input
                    type="text"
                    value={spotFormMaterialName}
                    onChange={(e) => setSpotFormMaterialName(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                {/* Row 2 */}
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">供方代号：</label>
                  <input
                    type="text"
                    value={spotFormSupplierCode}
                    onChange={(e) => setSpotFormSupplierCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 font-mono text-slate-800"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">供方名称：</label>
                  <input
                    type="text"
                    value={spotFormSupplierName}
                    onChange={(e) => setSpotFormSupplierName(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                {/* Row 3 */}
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">规格型号：</label>
                  <input
                    type="text"
                    value={spotFormSpec}
                    onChange={(e) => setSpotFormSpec(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">图号：</label>
                  <input
                    type="text"
                    value={spotFormDrawingNo}
                    onChange={(e) => setSpotFormDrawingNo(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 font-mono text-slate-800"
                  />
                </div>

                {/* Row 4 */}
                <div className="flex items-center justify-start space-x-2 col-span-2 my-1 pl-12">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right mr-2">消耗物料：</label>
                  <div className="flex items-center space-x-6">
                    <label className="inline-flex items-center space-x-1.5 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="editConsumableRadio"
                        value="是"
                        checked={spotFormIsConsumable === '是'}
                        onChange={(e) => setSpotFormIsConsumable(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span>是</span>
                    </label>
                    <label className="inline-flex items-center space-x-1.5 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="editConsumableRadio"
                        value="否"
                        checked={spotFormIsConsumable === '否'}
                        onChange={(e) => setSpotFormIsConsumable(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span>否</span>
                    </label>
                  </div>
                </div>

                {/* Row 5 */}
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">消耗物料类型：</label>
                  <select
                    value={spotFormConsumableType}
                    onChange={(e) => setSpotFormConsumableType(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  >
                    <option value="">请选择</option>
                    <option value="辅助用料">辅助用料</option>
                    <option value="耗损物料">耗损物料</option>
                    <option value="工装夹具">工装夹具</option>
                    <option value="包装物料">包装物料</option>
                    <option value="试验耗材">试验耗材</option>
                    <option value="电子主料">电子主料</option>
                    <option value="常规物料">常规物料</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">消耗数量：</label>
                  <input
                    type="text"
                    value={spotFormConsumableQty}
                    onChange={(e) => setSpotFormConsumableQty(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                {/* Row 6 */}
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">消耗物料开始时间：</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={spotFormConsumableStartTime}
                    onChange={(e) => setSpotFormConsumableStartTime(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap w-28 text-right">消耗物料结束时间：</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={spotFormConsumableEndTime}
                    onChange={(e) => setSpotFormConsumableEndTime(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEditSpotModal(false)}
                  className="px-6 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded transition text-xs font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition text-xs font-medium shadow-sm"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Spot Material Modal */}
      {showDeleteSpotModal && deletingSpotMaterial && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">作废删除定点物料</h3>
                  <p className="text-xs text-slate-400">定点物料信息 / 删除确认</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteSpotModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs">
              <div className="p-4 bg-rose-50/80 border border-rose-200/60 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>您确定要作废该定点物料绑定记录吗？</span>
                </div>
                <p className="text-rose-700/80 text-xs pl-6">
                  删除后该物料与供应商的定点关联将被作废，派单环节将可能无法自动匹配该供应商！
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">物料编码：</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{deletingSpotMaterial.materialCode}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">物料名称：</span>
                  <span className="font-bold text-indigo-600">{deletingSpotMaterial.materialName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">供方名称：</span>
                  <span className="font-semibold text-slate-700">{deletingSpotMaterial.supplierName} ({deletingSpotMaterial.supplierCode})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">图号 / 规格：</span>
                  <span className="font-mono text-slate-600">{deletingSpotMaterial.drawingNo} | {deletingSpotMaterial.spec}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDeleteSpotModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition text-xs"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteSpotMaterial}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-md transition text-xs flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>确认作废删除</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exception Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">物料异常恢复管理</h3>
                  <p className="text-xs text-slate-400">处理自动派单失败或存在异常的物料批次</p>
                </div>
              </div>
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-96 overflow-y-auto text-xs">
              {wmsList.filter(i => i.failReason).length === 0 ? (
                <div className="text-center py-8 text-slate-400">当前没有处于异常状态的待派单物料。</div>
              ) : (
                wmsList.filter(i => i.failReason).map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-800">{item.code}</span>
                        <span className="font-medium text-slate-600">{item.desc}</span>
                      </div>
                      <div className="text-rose-600 font-medium">异常原因: {item.failReason}</div>
                      <div className="text-[10px] text-slate-400">供方: {item.supplierName} | 批次: {item.batch}</div>
                    </div>
                    <button
                      onClick={() => handleExecuteRecovery(item)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
                    >
                      立即恢复
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Material Group Modal */}
      {showAddMgModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">新增物料组</h3>
              <button onClick={() => setShowAddMgModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMg} className="py-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">物料组代号 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={mgFormCode}
                  onChange={(e) => setMgFormCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  placeholder="例如: G011"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">物料组名称 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={mgFormName}
                  onChange={(e) => setMgFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  placeholder="例如: 智能传感器物料组"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">抽样方案 <span className="text-rose-500">*</span></label>
                <select
                  value={mgFormSamplingPlan}
                  onChange={(e) => setMgFormSamplingPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                >
                  <option value="I">I 级抽样方案</option>
                  <option value="II">II 级抽样方案</option>
                  <option value="S-3">S-3 特殊抽样方案</option>
                  <option value="S-4">S-4 特殊抽样方案</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMgModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-2xs"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Material Group Modal */}
      {showEditMgModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">编辑物料组</h3>
              <button onClick={() => setShowEditMgModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditMg} className="py-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">物料组代号 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={mgFormCode}
                  onChange={(e) => setMgFormCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">物料组名称 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={mgFormName}
                  onChange={(e) => setMgFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">抽样方案 <span className="text-rose-500">*</span></label>
                <select
                  value={mgFormSamplingPlan}
                  onChange={(e) => setMgFormSamplingPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                >
                  <option value="I">I 级抽样方案</option>
                  <option value="II">II 级抽样方案</option>
                  <option value="S-3">S-3 特殊抽样方案</option>
                  <option value="S-4">S-4 特殊抽样方案</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditMgModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-2xs"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Material Group Modal */}
      {showDeleteMgModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">删除物料组确认</h3>
                <p className="text-xs text-slate-500">此操作不可撤销，请谨慎确认</p>
              </div>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>您确定要删除以下物料组记录吗？</p>
              {deletingMgItem && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                  <p><span className="text-slate-500 font-sans">物料组代号：</span><span className="font-bold text-slate-800">{deletingMgItem.code}</span></p>
                  <p><span className="text-slate-500 font-sans">物料组名称：</span><span className="font-bold text-slate-800">{deletingMgItem.name}</span></p>
                  <p><span className="text-slate-500 font-sans">抽样方案：</span><span>{deletingMgItem.samplingPlan}</span></p>
                </div>
              )}
            </div>
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowDeleteMgModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteMg}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Material Management Modal */}
      {showAddMmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">新增物料信息</h3>
              <button onClick={() => setShowAddMmModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMm} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">物料组 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={mmGroupForm}
                    onChange={(e) => setMmGroupForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                    placeholder="例如: 物料组1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">物料编码 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={mmCodeForm}
                    onChange={(e) => setMmCodeForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                    placeholder="例如: 900000000012"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">物料名称 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={mmNameForm}
                    onChange={(e) => setMmNameForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                    placeholder="例如: 车规级片式电感"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">规格型号</label>
                  <input
                    type="text"
                    value={mmSpecForm}
                    onChange={(e) => setMmSpecForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                    placeholder="例如: IND-0805-10uH"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">图号</label>
                  <input
                    type="text"
                    value={mmDrawingNoForm}
                    onChange={(e) => setMmDrawingNoForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">单位</label>
                  <input
                    type="text"
                    value={mmUnitForm}
                    onChange={(e) => setMmUnitForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">加严检验周期/天</label>
                  <input
                    type="number"
                    value={mmStrictDaysForm}
                    onChange={(e) => setMmStrictDaysForm(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">是否加严检验</label>
                  <select
                    value={mmIsStrictForm}
                    onChange={(e) => setMmIsStrictForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="否">否</option>
                    <option value="是">是</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">标准工时/h</label>
                  <input
                    type="number"
                    step="0.5"
                    value={mmStdHoursForm}
                    onChange={(e) => setMmStdHoursForm(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">自动派单</label>
                  <select
                    value={mmAutoDispatchForm}
                    onChange={(e) => setMmAutoDispatchForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">物料类别</label>
                  <select
                    value={mmCategoryForm}
                    onChange={(e) => setMmCategoryForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="常规检验物料">常规检验物料</option>
                    <option value="加严检验物料">加严检验物料</option>
                    <option value="免检物料">免检物料</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">上次型式时间</label>
                  <input
                    type="text"
                    value={mmLastPatternTimeForm}
                    onChange={(e) => setMmLastPatternTimeForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">型式间隔周期/天</label>
                  <input
                    type="number"
                    value={mmPatternIntervalForm}
                    onChange={(e) => setMmPatternIntervalForm(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">下次型式时间</label>
                  <input
                    type="text"
                    value={mmNextPatternTimeForm}
                    onChange={(e) => setMmNextPatternTimeForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMmModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-2xs"
                >
                  提交保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Material Management Modal */}
      {showEditMmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">编辑物料信息</h3>
              <button onClick={() => setShowEditMmModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditMm} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">物料组 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={mmGroupForm}
                    onChange={(e) => setMmGroupForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">物料编码 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={mmCodeForm}
                    onChange={(e) => setMmCodeForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">物料名称 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={mmNameForm}
                    onChange={(e) => setMmNameForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">规格型号</label>
                  <input
                    type="text"
                    value={mmSpecForm}
                    onChange={(e) => setMmSpecForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">图号</label>
                  <input
                    type="text"
                    value={mmDrawingNoForm}
                    onChange={(e) => setMmDrawingNoForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">单位</label>
                  <input
                    type="text"
                    value={mmUnitForm}
                    onChange={(e) => setMmUnitForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">加严检验周期/天</label>
                  <input
                    type="number"
                    value={mmStrictDaysForm}
                    onChange={(e) => setMmStrictDaysForm(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">是否加严检验</label>
                  <select
                    value={mmIsStrictForm}
                    onChange={(e) => setMmIsStrictForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="否">否</option>
                    <option value="是">是</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">标准工时/h</label>
                  <input
                    type="number"
                    step="0.5"
                    value={mmStdHoursForm}
                    onChange={(e) => setMmStdHoursForm(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">自动派单</label>
                  <select
                    value={mmAutoDispatchForm}
                    onChange={(e) => setMmAutoDispatchForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">物料类别</label>
                  <select
                    value={mmCategoryForm}
                    onChange={(e) => setMmCategoryForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="常规检验物料">常规检验物料</option>
                    <option value="加严检验物料">加严检验物料</option>
                    <option value="免检物料">免检物料</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">上次型式时间</label>
                  <input
                    type="text"
                    value={mmLastPatternTimeForm}
                    onChange={(e) => setMmLastPatternTimeForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">型式间隔周期/天</label>
                  <input
                    type="number"
                    value={mmPatternIntervalForm}
                    onChange={(e) => setMmPatternIntervalForm(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">下次型式时间</label>
                  <input
                    type="text"
                    value={mmNextPatternTimeForm}
                    onChange={(e) => setMmNextPatternTimeForm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditMmModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-2xs"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Material Management Modal */}
      {showDeleteMmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">删除物料确认</h3>
                <p className="text-xs text-slate-500">此操作不可撤销，请谨慎确认</p>
              </div>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>您确定要删除以下物料记录吗？</p>
              {deletingMmItem && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                  <p><span className="text-slate-500 font-sans">物料编码：</span><span className="font-bold text-slate-800">{deletingMmItem.code}</span></p>
                  <p><span className="text-slate-500 font-sans">物料名称：</span><span className="font-bold text-slate-800">{deletingMmItem.name}</span></p>
                  <p><span className="text-slate-500 font-sans">物料组：</span><span>{deletingMmItem.group}</span></p>
                  <p><span className="text-slate-500 font-sans">规格型号：</span><span>{deletingMmItem.spec}</span></p>
                </div>
              )}
            </div>
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowDeleteMmModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteMm}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Item Standards Modal matching screenshot image_e850dd70.png */}
      {showAddPsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-5 animate-in fade-in zoom-in-95 duration-150 my-6 border border-slate-200">
            {/* Modal Title matching screenshot image_e850dd70.png */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">物料标准新增</h3>
              <button onClick={() => setShowAddPsModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPs} className="py-4 space-y-4 text-xs">
              {/* Top Form Field: 物料组 */}
              <div className="flex items-center space-x-3">
                <label className="font-medium text-slate-700 whitespace-nowrap">物料组 :</label>
                <select
                  value={psGroupForm}
                  onChange={(e) => setPsGroupForm(e.target.value)}
                  className="w-52 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-medium text-slate-800 text-xs shadow-2xs"
                >
                  <option value="分液器部件">分液器部件</option>
                  <option value="电容物料组">电容物料组</option>
                  <option value="电阻物料组">电阻物料组</option>
                  <option value="芯片IC物料组">芯片IC物料组</option>
                  <option value="二极管/三极管物料组">二极管/三极管物料组</option>
                  <option value="结构连接器物料组">结构连接器物料组</option>
                  <option value="传感器组件物料组">传感器组件物料组</option>
                  <option value="光电耦合器件物料组">光电耦合器件物料组</option>
                </select>
              </div>

              {/* Section Divider: 检验规范 */}
              <div className="border-b border-slate-300 pb-1.5 pt-2">
                <span className="font-bold text-slate-800 text-xs tracking-wide">检验规范</span>
              </div>

              {/* Interactive Table matching image_e850dd70.png */}
              <div className="overflow-x-auto border border-slate-200 rounded shadow-2xs max-h-[380px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold z-10">
                    <tr>
                      <th className="p-2 text-center w-10 border-r border-slate-200">操作</th>
                      <th className="p-2 text-center border-r border-slate-200">检验项目代号</th>
                      <th className="p-2 text-center border-r border-slate-200 w-16">顺序</th>
                      <th className="p-2 border-r border-slate-200 min-w-[120px]">检验项目</th>
                      <th className="p-2 text-center border-r border-slate-200 w-20">项目类别</th>
                      <th className="p-2 text-center border-r border-slate-200 w-20">抽样数</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">抽样方案</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">检验类型</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">检验方式</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">是否启用</th>
                      <th className="p-2 text-center w-16">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {psTableRows.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-8 text-center text-slate-400 bg-slate-50/50">
                          <p className="mb-2 font-medium">暂无检验规范数据，请点击上方“+ 行”或下方按钮新增项目规范</p>
                          <button
                            type="button"
                            onClick={addNewPsRow}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium text-xs transition inline-flex items-center space-x-1 shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>添加检验规范项目</span>
                          </button>
                        </td>
                      </tr>
                    ) : (
                      psTableRows.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-blue-50/20 transition">
                        <td className="p-2 text-center border-r border-slate-200">
                          <button
                            type="button"
                            onClick={addNewPsRow}
                            className="text-emerald-500 hover:text-emerald-600 p-0.5 rounded transition inline-flex items-center justify-center font-bold"
                            title="新增一行"
                          >
                            <Plus className="w-4 h-4 stroke-[3]" />
                          </button>
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="text"
                            value={row.code}
                            onChange={(e) => updatePsRow(idx, 'code', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <input
                            type="number"
                            value={row.sortOrder}
                            onChange={(e) => updatePsRow(idx, 'sortOrder', Number(e.target.value))}
                            className="w-12 text-center px-1 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="text"
                            value={row.itemName}
                            onChange={(e) => updatePsRow(idx, 'itemName', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-medium text-slate-800"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.category}
                            onChange={(e) => updatePsRow(idx, 'category', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white"
                          >
                            <option value="常规">常规</option>
                            <option value="关键">关键</option>
                            <option value="主要">主要</option>
                            <option value="次要">次要</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <input
                            type="text"
                            value={row.sampleQty}
                            onChange={(e) => updatePsRow(idx, 'sampleQty', e.target.value)}
                            className="w-12 text-center px-1 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.samplingPlan}
                            onChange={(e) => updatePsRow(idx, 'samplingPlan', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                          >
                            <option value="-">-</option>
                            <option value="S-1">S-1</option>
                            <option value="S-2">S-2</option>
                            <option value="S-3">S-3</option>
                            <option value="S-4">S-4</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.testType}
                            onChange={(e) => updatePsRow(idx, 'testType', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white"
                          >
                            <option value="入厂检验">入厂检验</option>
                            <option value="型式试验">型式试验</option>
                            <option value="首件检验">首件检验</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.method}
                            onChange={(e) => updatePsRow(idx, 'method', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white"
                          >
                            <option value="手动输入">手动输入</option>
                            <option value="卡尺输入">卡尺输入</option>
                            <option value="手动计量">手动计量</option>
                            <option value="仪器检测">仪器检测</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <div className="flex items-center justify-center space-x-1">
                            <span className={row.isEnabled ? 'text-blue-600 font-medium' : 'text-slate-400'}>
                              {row.isEnabled ? '启用' : '关闭'}
                            </span>
                            <button
                              type="button"
                              onClick={() => updatePsRow(idx, 'isEnabled', !row.isEnabled)}
                              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                                row.isEnabled ? 'bg-blue-500 justify-end' : 'bg-slate-300 justify-start'
                              }`}
                            >
                              <div className="w-4 h-4 bg-white rounded-full shadow-xs"></div>
                            </button>
                          </div>
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => deletePsRow(idx)}
                            className="text-rose-500 hover:text-rose-700 hover:underline font-medium text-xs"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Buttons matching screenshot image_e850dd70.png */}
              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddPsModal(false)}
                  className="px-6 py-1.5 bg-blue-50 border border-blue-500 text-blue-600 hover:bg-blue-100 rounded font-medium transition text-xs shadow-2xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition text-xs shadow-2xs"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Standards Modal matching screenshot image_e850dd70.png style */}
      {showEditPsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-5 animate-in fade-in zoom-in-95 duration-150 my-6 border border-slate-200">
            {/* Modal Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">物料标准编辑</h3>
              <button onClick={() => setShowEditPsModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPs} className="py-4 space-y-4 text-xs">
              {/* Top Form Field: 物料组 */}
              <div className="flex items-center space-x-3">
                <label className="font-medium text-slate-700 whitespace-nowrap">物料组 :</label>
                <select
                  value={psGroupForm}
                  onChange={(e) => setPsGroupForm(e.target.value)}
                  className="w-52 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-medium text-slate-800 text-xs shadow-2xs"
                >
                  <option value="分液器部件">分液器部件</option>
                  <option value="电容物料组">电容物料组</option>
                  <option value="电阻物料组">电阻物料组</option>
                  <option value="芯片IC物料组">芯片IC物料组</option>
                  <option value="二极管/三极管物料组">二极管/三极管物料组</option>
                  <option value="结构连接器物料组">结构连接器物料组</option>
                  <option value="传感器组件物料组">传感器组件物料组</option>
                  <option value="光电耦合器件物料组">光电耦合器件物料组</option>
                </select>
              </div>

              {/* Section Divider: 检验规范 */}
              <div className="border-b border-slate-300 pb-1.5 pt-2">
                <span className="font-bold text-slate-800 text-xs tracking-wide">检验规范</span>
              </div>

              {/* Interactive Table matching showAddPsModal style */}
              <div className="overflow-x-auto border border-slate-200 rounded shadow-2xs max-h-[380px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold z-10">
                    <tr>
                      <th className="p-2 text-center w-10 border-r border-slate-200">操作</th>
                      <th className="p-2 text-center border-r border-slate-200">检验项目代号</th>
                      <th className="p-2 text-center border-r border-slate-200 w-16">顺序</th>
                      <th className="p-2 border-r border-slate-200 min-w-[120px]">检验项目</th>
                      <th className="p-2 text-center border-r border-slate-200 w-20">项目类别</th>
                      <th className="p-2 text-center border-r border-slate-200 w-20">抽样数</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">抽样方案</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">检验类型</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">检验方式</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">是否启用</th>
                      <th className="p-2 text-center w-16">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {psEditTableRows.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-blue-50/20 transition">
                        <td className="p-2 text-center border-r border-slate-200">
                          <button
                            type="button"
                            onClick={addNewPsEditRow}
                            className="text-emerald-500 hover:text-emerald-600 p-0.5 rounded transition inline-flex items-center justify-center font-bold"
                            title="新增一行"
                          >
                            <Plus className="w-4 h-4 stroke-[3]" />
                          </button>
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="text"
                            value={row.code}
                            onChange={(e) => updatePsEditRow(idx, 'code', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <input
                            type="number"
                            value={row.sortOrder}
                            onChange={(e) => updatePsEditRow(idx, 'sortOrder', Number(e.target.value))}
                            className="w-12 text-center px-1 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="text"
                            value={row.itemName}
                            onChange={(e) => updatePsEditRow(idx, 'itemName', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-medium text-slate-800"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.category}
                            onChange={(e) => updatePsEditRow(idx, 'category', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white"
                          >
                            <option value="常规">常规</option>
                            <option value="关键">关键</option>
                            <option value="主要">主要</option>
                            <option value="次要">次要</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <input
                            type="text"
                            value={row.sampleQty}
                            onChange={(e) => updatePsEditRow(idx, 'sampleQty', e.target.value)}
                            className="w-12 text-center px-1 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.samplingPlan}
                            onChange={(e) => updatePsEditRow(idx, 'samplingPlan', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                          >
                            <option value="-">-</option>
                            <option value="S-1">S-1</option>
                            <option value="S-2">S-2</option>
                            <option value="S-3">S-3</option>
                            <option value="S-4">S-4</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.testType}
                            onChange={(e) => updatePsEditRow(idx, 'testType', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white"
                          >
                            <option value="入厂检验">入厂检验</option>
                            <option value="型式试验">型式试验</option>
                            <option value="首件检验">首件检验</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.method}
                            onChange={(e) => updatePsEditRow(idx, 'method', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white"
                          >
                            <option value="手动输入">手动输入</option>
                            <option value="卡尺输入">卡尺输入</option>
                            <option value="手动计量">手动计量</option>
                            <option value="仪器检测">仪器检测</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <div className="flex items-center justify-center space-x-1">
                            <span className={row.isEnabled ? 'text-blue-600 font-medium' : 'text-slate-400'}>
                              {row.isEnabled ? '启用' : '关闭'}
                            </span>
                            <button
                              type="button"
                              onClick={() => updatePsEditRow(idx, 'isEnabled', !row.isEnabled)}
                              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                                row.isEnabled ? 'bg-blue-500 justify-end' : 'bg-slate-300 justify-start'
                              }`}
                            >
                              <div className="w-4 h-4 bg-white rounded-full shadow-xs"></div>
                            </button>
                          </div>
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => deletePsEditRow(idx)}
                            className="text-rose-500 hover:text-rose-700 hover:underline font-medium text-xs"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditPsModal(false)}
                  className="px-6 py-1.5 bg-blue-50 border border-blue-500 text-blue-600 hover:bg-blue-100 rounded font-medium transition text-xs shadow-2xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition text-xs shadow-2xs"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Standards Modal */}
      {showDeletePsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">删除项目标准确认</h3>
                <p className="text-xs text-slate-500">此操作不可撤销，请谨慎确认</p>
              </div>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>您确定要删除以下项目标准记录吗？</p>
              {deletingPsItem && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                  <p><span className="text-slate-500 font-sans">检验项目代号：</span><span className="font-bold text-slate-800">{deletingPsItem.code}</span></p>
                  <p><span className="text-slate-500 font-sans">检验项目名称：</span><span className="font-bold text-slate-800">{deletingPsItem.itemName}</span></p>
                  <p><span className="text-slate-500 font-sans">物料组：</span><span>{deletingPsItem.group}</span></p>
                  <p><span className="text-slate-500 font-sans">检验方式 / 类型：</span><span>{deletingPsItem.method} | {deletingPsItem.testType}</span></p>
                </div>
              )}
            </div>
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowDeletePsModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeletePs}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Inspection Item Modal matching screenshot image_761ab4c0.png */}
      {showAddIiModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-5 animate-in fade-in zoom-in-95 duration-150 my-6 border border-slate-200">
            {/* Modal Title matching screenshot image_761ab4c0.png */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">检验项目新增</h3>
              <button onClick={() => setShowAddIiModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddIi} className="py-3 space-y-3 text-xs">
              {/* Row 1: 物料组 + 查询1 */}
              <div className="flex items-center space-x-3">
                <label className="font-medium text-slate-700 whitespace-nowrap">物料组 :</label>
                <select
                  value={iiGroupForm}
                  onChange={(e) => setIiGroupForm(e.target.value)}
                  className="w-48 px-2.5 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-medium text-slate-800 text-xs"
                >
                  <option value="分液器部件">分液器部件</option>
                  <option value="电容物料组">电容物料组</option>
                  <option value="电阻物料组">电阻物料组</option>
                  <option value="芯片IC物料组">芯片IC物料组</option>
                  <option value="二极管/三极管物料组">二极管/三极管物料组</option>
                  <option value="结构连接器物料组">结构连接器物料组</option>
                  <option value="传感器组件物料组">传感器组件物料组</option>
                  <option value="光电耦合器件物料组">光电耦合器件物料组</option>
                </select>
                <button
                  type="button"
                  onClick={handleQuery1}
                  className="flex items-center space-x-1 px-3 py-1 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 rounded font-medium transition text-xs shadow-2xs ml-2"
                >
                  <Search className="w-3.5 h-3.5 text-blue-500" />
                  <span>查询1</span>
                </button>
              </div>

              {/* Row 2: 相似编码 | 相似供方代码 | 相似供方名称 + 查询2 */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3 flex items-center space-x-1.5">
                  <label className="font-medium text-slate-700 whitespace-nowrap">相似编码 :</label>
                  <input
                    type="text"
                    value={iiSimilarCodeForm}
                    onChange={(e) => setIiSimilarCodeForm(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                  />
                </div>
                <div className="col-span-4 flex items-center space-x-1.5">
                  <label className="font-medium text-slate-700 whitespace-nowrap">相似供方代码 :</label>
                  <input
                    type="text"
                    value={iiSimilarSupplierCodeForm}
                    onChange={(e) => setIiSimilarSupplierCodeForm(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                  />
                </div>
                <div className="col-span-5 flex items-center space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap">相似供方名称 :</label>
                  <input
                    type="text"
                    value={iiSimilarSupplierNameForm}
                    onChange={(e) => setIiSimilarSupplierNameForm(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleQuery2}
                    className="flex items-center space-x-1 px-3 py-1 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 rounded font-medium transition text-xs shadow-2xs whitespace-nowrap shrink-0"
                  >
                    <Search className="w-3.5 h-3.5 text-blue-500" />
                    <span>查询2</span>
                  </button>
                </div>
              </div>

              {/* Row 3: 物料编码 | 供方代码 | 供方名称 */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3 flex items-center space-x-1.5">
                  <label className="font-medium text-slate-700 whitespace-nowrap">物料编码 :</label>
                  <input
                    type="text"
                    value={iiMaterialCodeForm}
                    onChange={(e) => setIiMaterialCodeForm(e.target.value)}
                    placeholder="如: 900000000002"
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono font-bold"
                  />
                </div>
                <div className="col-span-4 flex items-center space-x-1.5">
                  <label className="font-medium text-slate-700 whitespace-nowrap">供方代码 :</label>
                  <input
                    type="text"
                    value={iiSupplierCodeForm}
                    onChange={(e) => setIiSupplierCodeForm(e.target.value)}
                    placeholder="如: 101001"
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                  />
                </div>
                <div className="col-span-5 flex items-center space-x-1.5">
                  <label className="font-medium text-slate-700 whitespace-nowrap">供方名称 :</label>
                  <input
                    type="text"
                    value={iiSupplierNameForm}
                    onChange={(e) => setIiSupplierNameForm(e.target.value)}
                    placeholder="如: 苏州精工微电子"
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
              </div>

              {/* Section Divider: 新增项目标准 */}
              <div className="border-b border-slate-300 pb-1 pt-2">
                <span className="font-bold text-slate-800 text-xs tracking-wide">新增项目标准</span>
              </div>

              {/* Interactive Table matching image_761ab4c0.png */}
              <div className="overflow-x-auto border border-slate-200 rounded shadow-2xs max-h-[340px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold z-10">
                    <tr>
                      <th className="p-2 text-center w-10 border-r border-slate-200">
                        <input
                          type="checkbox"
                          checked={iiTableRows.length > 0 && iiTableRows.every(r => r.selected)}
                          onChange={(e) => toggleSelectAllIiRows(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="p-2 text-center border-r border-slate-200 min-w-[120px]">检验项目代号</th>
                      <th className="p-2 text-center border-r border-slate-200 w-16">顺序</th>
                      <th className="p-2 text-center border-r border-slate-200 min-w-[120px]">检验项目</th>
                      <th className="p-2 text-center border-r border-slate-200 min-w-[100px]">检验标准</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">项目类别</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">检验方式</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">是否启用</th>
                      <th className="p-2 text-center w-16">
                        <button
                          type="button"
                          onClick={addNewIiTableRow}
                          className="text-blue-600 hover:text-blue-800 font-bold p-0.5"
                          title="新增一行"
                        >
                          + 行
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {iiTableRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400 bg-slate-50/50">
                          <p className="mb-2 font-medium">暂无检验项目数据，可使用上方【查询1】/【查询2】自动检索，或点击下方按钮添加</p>
                          <button
                            type="button"
                            onClick={addNewIiTableRow}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium text-xs transition inline-flex items-center space-x-1 shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>添加检验项目</span>
                          </button>
                        </td>
                      </tr>
                    ) : (
                      iiTableRows.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-blue-50/20 transition">
                        <td className="p-2 text-center border-r border-slate-200">
                          <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={(e) => updateIiTableRow(idx, 'selected', e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="text"
                            value={row.itemCode}
                            onChange={(e) => updateIiTableRow(idx, 'itemCode', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <input
                            type="number"
                            value={row.sortOrder}
                            onChange={(e) => updateIiTableRow(idx, 'sortOrder', Number(e.target.value))}
                            className="w-12 text-center px-1 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="text"
                            value={row.itemName}
                            onChange={(e) => updateIiTableRow(idx, 'itemName', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-medium text-slate-800"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="text"
                            value={row.standard}
                            onChange={(e) => updateIiTableRow(idx, 'standard', e.target.value)}
                            placeholder="如: 23.1-23.5"
                            className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.category}
                            onChange={(e) => updateIiTableRow(idx, 'category', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white"
                          >
                            <option value="常规">常规</option>
                            <option value="化工">化工</option>
                            <option value="关键">关键</option>
                            <option value="主要">主要</option>
                            <option value="次要">次要</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.method}
                            onChange={(e) => updateIiTableRow(idx, 'method', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white"
                          >
                            <option value="手动输入">手动输入</option>
                            <option value="手动计量">手动计量</option>
                            <option value="卡尺输入">卡尺输入</option>
                            <option value="仪器检测">仪器检测</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <div className="flex items-center justify-center space-x-1">
                            <span className={row.isEnabled ? 'text-blue-600 font-medium' : 'text-slate-400'}>
                              {row.isEnabled ? '启用' : '关闭'}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateIiTableRow(idx, 'isEnabled', !row.isEnabled)}
                              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                                row.isEnabled ? 'bg-blue-500 justify-end' : 'bg-slate-300 justify-start'
                              }`}
                            >
                              <div className="w-4 h-4 bg-white rounded-full shadow-xs"></div>
                            </button>
                          </div>
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => deleteIiTableRow(idx)}
                            className="text-rose-500 hover:text-rose-700 hover:underline font-medium text-xs"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddIiModal(false)}
                  className="px-6 py-1.5 bg-blue-50 border border-blue-500 text-blue-600 hover:bg-blue-100 rounded font-medium transition text-xs shadow-2xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition text-xs shadow-2xs"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Inspection Item Modal matching screenshot image_761ab4c0.png */}
      {showEditIiModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-5 animate-in fade-in zoom-in-95 duration-150 my-6 border border-slate-200">
            {/* Modal Title matching screenshot image_761ab4c0.png */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">检验项目编辑</h3>
              <button onClick={() => setShowEditIiModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditIi} className="py-3 space-y-3 text-xs">
              {/* Row 1: 物料组 + 查询1 */}
              <div className="flex items-center space-x-3">
                <label className="font-medium text-slate-700 whitespace-nowrap">物料组 :</label>
                <select
                  value={iiGroupForm}
                  onChange={(e) => setIiGroupForm(e.target.value)}
                  className="w-48 px-2.5 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white font-medium text-slate-800 text-xs"
                >
                  <option value="分液器部件">分液器部件</option>
                  <option value="电容物料组">电容物料组</option>
                  <option value="电阻物料组">电阻物料组</option>
                  <option value="芯片IC物料组">芯片IC物料组</option>
                  <option value="二极管/三极管物料组">二极管/三极管物料组</option>
                  <option value="结构连接器物料组">结构连接器物料组</option>
                  <option value="传感器组件物料组">传感器组件物料组</option>
                  <option value="光电耦合器件物料组">光电耦合器件物料组</option>
                </select>
                <button
                  type="button"
                  onClick={handleQuery1}
                  className="flex items-center space-x-1 px-3 py-1 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 rounded font-medium transition text-xs shadow-2xs ml-2"
                >
                  <Search className="w-3.5 h-3.5 text-blue-500" />
                  <span>查询1</span>
                </button>
              </div>

              {/* Row 2: 相似编码 | 相似供方代码 | 相似供方名称 + 查询2 */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3 flex items-center space-x-1.5">
                  <label className="font-medium text-slate-700 whitespace-nowrap">相似编码 :</label>
                  <input
                    type="text"
                    value={iiSimilarCodeForm}
                    onChange={(e) => setIiSimilarCodeForm(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                  />
                </div>
                <div className="col-span-4 flex items-center space-x-1.5">
                  <label className="font-medium text-slate-700 whitespace-nowrap">相似供方代码 :</label>
                  <input
                    type="text"
                    value={iiSimilarSupplierCodeForm}
                    onChange={(e) => setIiSimilarSupplierCodeForm(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                  />
                </div>
                <div className="col-span-5 flex items-center space-x-2">
                  <label className="font-medium text-slate-700 whitespace-nowrap">相似供方名称 :</label>
                  <input
                    type="text"
                    value={iiSimilarSupplierNameForm}
                    onChange={(e) => setIiSimilarSupplierNameForm(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleQuery2}
                    className="flex items-center space-x-1 px-3 py-1 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 rounded font-medium transition text-xs shadow-2xs whitespace-nowrap shrink-0"
                  >
                    <Search className="w-3.5 h-3.5 text-blue-500" />
                    <span>查询2</span>
                  </button>
                </div>
              </div>

              {/* Row 3: 物料编码 | 供方代码 | 供方名称 */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3 flex items-center space-x-1.5">
                  <label className="font-medium text-slate-700 whitespace-nowrap">物料编码 :</label>
                  <input
                    type="text"
                    value={iiMaterialCodeForm}
                    onChange={(e) => setIiMaterialCodeForm(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono font-bold"
                  />
                </div>
                <div className="col-span-4 flex items-center space-x-1.5">
                  <label className="font-medium text-slate-700 whitespace-nowrap">供方代码 :</label>
                  <input
                    type="text"
                    value={iiSupplierCodeForm}
                    onChange={(e) => setIiSupplierCodeForm(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                  />
                </div>
                <div className="col-span-5 flex items-center space-x-1.5">
                  <label className="font-medium text-slate-700 whitespace-nowrap">供方名称 :</label>
                  <input
                    type="text"
                    value={iiSupplierNameForm}
                    onChange={(e) => setIiSupplierNameForm(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
              </div>

              {/* Section Divider: 编辑项目标准 */}
              <div className="border-b border-slate-300 pb-1 pt-2">
                <span className="font-bold text-slate-800 text-xs tracking-wide">编辑项目标准</span>
              </div>

              {/* Interactive Table matching image_761ab4c0.png */}
              <div className="overflow-x-auto border border-slate-200 rounded shadow-2xs max-h-[340px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold z-10">
                    <tr>
                      <th className="p-2 text-center w-10 border-r border-slate-200">
                        <input
                          type="checkbox"
                          checked={iiTableRows.length > 0 && iiTableRows.every(r => r.selected)}
                          onChange={(e) => toggleSelectAllIiRows(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="p-2 text-center border-r border-slate-200 min-w-[120px]">检验项目代号</th>
                      <th className="p-2 text-center border-r border-slate-200 w-16">顺序</th>
                      <th className="p-2 text-center border-r border-slate-200 min-w-[120px]">检验项目</th>
                      <th className="p-2 text-center border-r border-slate-200 min-w-[100px]">检验标准</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">项目类别</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">检验方式</th>
                      <th className="p-2 text-center border-r border-slate-200 w-24">是否启用</th>
                      <th className="p-2 text-center w-16">
                        <button
                          type="button"
                          onClick={addNewIiTableRow}
                          className="text-blue-600 hover:text-blue-800 font-bold p-0.5"
                          title="新增一行"
                        >
                          + 行
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {iiTableRows.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-blue-50/20 transition">
                        <td className="p-2 text-center border-r border-slate-200">
                          <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={(e) => updateIiTableRow(idx, 'selected', e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="text"
                            value={row.itemCode}
                            onChange={(e) => updateIiTableRow(idx, 'itemCode', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <input
                            type="number"
                            value={row.sortOrder}
                            onChange={(e) => updateIiTableRow(idx, 'sortOrder', Number(e.target.value))}
                            className="w-12 text-center px-1 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="text"
                            value={row.itemName}
                            onChange={(e) => updateIiTableRow(idx, 'itemName', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-medium text-slate-800"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="text"
                            value={row.standard}
                            onChange={(e) => updateIiTableRow(idx, 'standard', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.category}
                            onChange={(e) => updateIiTableRow(idx, 'category', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white"
                          >
                            <option value="常规">常规</option>
                            <option value="化工">化工</option>
                            <option value="关键">关键</option>
                            <option value="主要">主要</option>
                            <option value="次要">次要</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <select
                            value={row.method}
                            onChange={(e) => updateIiTableRow(idx, 'method', e.target.value)}
                            className="px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-xs bg-white"
                          >
                            <option value="手动输入">手动输入</option>
                            <option value="手动计量">手动计量</option>
                            <option value="卡尺输入">卡尺输入</option>
                            <option value="仪器检测">仪器检测</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-200">
                          <div className="flex items-center justify-center space-x-1">
                            <span className={row.isEnabled ? 'text-blue-600 font-medium' : 'text-slate-400'}>
                              {row.isEnabled ? '启用' : '关闭'}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateIiTableRow(idx, 'isEnabled', !row.isEnabled)}
                              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                                row.isEnabled ? 'bg-blue-500 justify-end' : 'bg-slate-300 justify-start'
                              }`}
                            >
                              <div className="w-4 h-4 bg-white rounded-full shadow-xs"></div>
                            </button>
                          </div>
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => deleteIiTableRow(idx)}
                            className="text-rose-500 hover:text-rose-700 hover:underline font-medium text-xs"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditIiModal(false)}
                  className="px-6 py-1.5 bg-blue-50 border border-blue-500 text-blue-600 hover:bg-blue-100 rounded font-medium transition text-xs shadow-2xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition text-xs shadow-2xs"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Inspection Item Modal */}
      {showDeleteIiModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">删除检验项目确认</h3>
                <p className="text-xs text-slate-500">此操作不可撤销，请谨慎确认</p>
              </div>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>您确定要删除以下检验项目记录吗？</p>
              {deletingIiItem && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                  <p><span className="text-slate-500 font-sans">供方：</span><span className="font-bold text-slate-800">{deletingIiItem.supplierName} ({deletingIiItem.supplierCode})</span></p>
                  <p><span className="text-slate-500 font-sans">物料编码：</span><span className="font-bold text-slate-800">{deletingIiItem.materialCode}</span></p>
                  <p><span className="text-slate-500 font-sans">检验项目：</span><span>{deletingIiItem.itemCode} - {deletingIiItem.itemName}</span></p>
                  <p><span className="text-slate-500 font-sans">检验标准：</span><span>{deletingIiItem.standard}</span></p>
                </div>
              )}
            </div>
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowDeleteIiModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteIi}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Item Change Modal */}
      {showIiChangeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">检验项目变更</h3>
              </div>
              <button onClick={() => setShowIiChangeModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleApplyIiChange} className="py-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">原检验项目或代号 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={changeOldItem}
                  onChange={(e) => setChangeOldItem(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  placeholder="例如: 外观与极性标识 或 ITEM-001"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">变更后检验项目名称 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={changeNewItem}
                  onChange={(e) => setChangeNewItem(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  placeholder="例如: 外观与极性标识 (加严标准)"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">变更后检验标准</label>
                <input
                  type="text"
                  value={changeNewStandard}
                  onChange={(e) => setChangeNewStandard(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                  placeholder="例如: 23.1-23.8 或 Q/QC-2026-008"
                />
              </div>
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIiChangeModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-2xs"
                >
                  确认变更
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Sampling Plan Modal */}
      {showAddSpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 animate-in fade-in zoom-in-95 duration-150 my-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">新增抽样方案</h3>
              <button onClick={() => setShowAddSpModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSp} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">抽样方案 <span className="text-rose-500">*</span></label>
                  <select
                    value={spSamplingSchemeForm}
                    onChange={(e) => setSpSamplingSchemeForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white text-xs"
                  >
                    <option value="">-- 请选择抽样方案 --</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="S-1">S-1</option>
                    <option value="S-2">S-2</option>
                    <option value="S-3">S-3</option>
                    <option value="S-4">S-4</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">检验方案 <span className="text-rose-500">*</span></label>
                  <select
                    value={spTestPlanForm}
                    onChange={(e) => setSpTestPlanForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white text-xs"
                  >
                    <option value="">-- 请选择检验方案 --</option>
                    <option value="S-3">S-3</option>
                    <option value="S-2">S-2</option>
                    <option value="S-1">S-1</option>
                    <option value="S-4">S-4</option>
                    <option value="正常检验">正常检验</option>
                    <option value="加严检验">加严检验</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">AQL <span className="text-rose-500">*</span></label>
                  <select
                    value={spAqlForm}
                    onChange={(e) => setSpAqlForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white text-xs font-mono"
                  >
                    <option value="">-- 请选择AQL --</option>
                    <option value="0">0</option>
                    <option value="0.65">0.65</option>
                    <option value="1.0">1.0</option>
                    <option value="1.5">1.5</option>
                    <option value="2.5">2.5</option>
                    <option value="4.0">4.0</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">来货数量下限 <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={spQtyMinForm}
                    onChange={(e) => setSpQtyMinForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                    placeholder="例如: 1"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">来货数量上限 <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={spQtyMaxForm}
                    onChange={(e) => setSpQtyMaxForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                    placeholder="例如: 1200"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">抽样数量 <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={spSampleQtyForm}
                    onChange={(e) => setSpSampleQtyForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                    placeholder="例如: 5"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">加严抽样数量 <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={spStrictSampleQtyForm}
                    onChange={(e) => setSpStrictSampleQtyForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                    placeholder="例如: 8"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSpModal(false)}
                  className="px-5 py-1.5 bg-blue-50 border border-blue-500 text-blue-600 hover:bg-blue-100 rounded font-medium transition text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition text-xs shadow-2xs"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sampling Plan Modal */}
      {showEditSpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 animate-in fade-in zoom-in-95 duration-150 my-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">编辑抽样方案</h3>
              <button onClick={() => setShowEditSpModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditSp} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">抽样方案 <span className="text-rose-500">*</span></label>
                  <select
                    value={spSamplingSchemeForm}
                    onChange={(e) => setSpSamplingSchemeForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white text-xs"
                  >
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="S-1">S-1</option>
                    <option value="S-2">S-2</option>
                    <option value="S-3">S-3</option>
                    <option value="S-4">S-4</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">检验方案 <span className="text-rose-500">*</span></label>
                  <select
                    value={spTestPlanForm}
                    onChange={(e) => setSpTestPlanForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white text-xs"
                  >
                    <option value="S-3">S-3</option>
                    <option value="S-2">S-2</option>
                    <option value="S-1">S-1</option>
                    <option value="S-4">S-4</option>
                    <option value="正常检验">正常检验</option>
                    <option value="加严检验">加严检验</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">AQL <span className="text-rose-500">*</span></label>
                  <select
                    value={spAqlForm}
                    onChange={(e) => setSpAqlForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none bg-white text-xs font-mono"
                  >
                    <option value="0">0</option>
                    <option value="0.65">0.65</option>
                    <option value="1.0">1.0</option>
                    <option value="1.5">1.5</option>
                    <option value="2.5">2.5</option>
                    <option value="4.0">4.0</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">来货数量下限 <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={spQtyMinForm}
                    onChange={(e) => setSpQtyMinForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">来货数量上限 <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={spQtyMaxForm}
                    onChange={(e) => setSpQtyMaxForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">抽样数量 <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={spSampleQtyForm}
                    onChange={(e) => setSpSampleQtyForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">加严抽样数量 <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={spStrictSampleQtyForm}
                    onChange={(e) => setSpStrictSampleQtyForm(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditSpModal(false)}
                  className="px-5 py-1.5 bg-blue-50 border border-blue-500 text-blue-600 hover:bg-blue-100 rounded font-medium transition text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition text-xs shadow-2xs"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Sampling Plan Modal */}
      {showDeleteSpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">删除抽样方案确认</h3>
                <p className="text-xs text-slate-500">此操作不可撤销，请谨慎确认</p>
              </div>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>您确定要删除以下抽样方案记录吗？</p>
              {deletingSpItem && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                  <p><span className="text-slate-500 font-sans">抽样方案：</span><span className="font-bold text-slate-800">{deletingSpItem.samplingScheme}</span></p>
                  <p><span className="text-slate-500 font-sans">检验方案：</span><span className="font-bold text-slate-800">{deletingSpItem.testPlan}</span></p>
                  <p><span className="text-slate-500 font-sans">AQL：</span><span>{deletingSpItem.aql}</span></p>
                  <p><span className="text-slate-500 font-sans">数量区间：</span><span>{deletingSpItem.qtyMin} ~ {deletingSpItem.qtyMax}</span></p>
                  <p><span className="text-slate-500 font-sans">抽样数 / 加严数：</span><span>{deletingSpItem.sampleQty} / {deletingSpItem.strictSampleQty}</span></p>
                </div>
              )}
            </div>
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowDeleteSpModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteSp}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Data Dictionary Modal matching screenshot image_346263e6.png */}
      {showAddDdModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 my-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">数据字典新增</h3>
              <button onClick={() => setShowAddDdModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddDd} className="py-4 space-y-4 text-xs">
              {/* Top Form Fields matching screenshot image_346263e6.png */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <span className="font-medium whitespace-nowrap">字典名称:</span>
                  <input
                    type="text"
                    required
                    value={ddNameForm}
                    onChange={(e) => setDdNameForm(e.target.value)}
                    className="w-52 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium whitespace-nowrap">字典code:</span>
                  <input
                    type="text"
                    required
                    value={ddCodeForm}
                    onChange={(e) => setDdCodeForm(e.target.value)}
                    className="w-52 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                  />
                </div>
              </div>

              {/* Section Divider: 检验规范 matching screenshot image_346263e6.png */}
              <div className="border-b border-slate-300 pb-1 pt-1">
                <span className="font-medium text-slate-800 text-xs">检验规范</span>
              </div>

              {/* Sub-table matching screenshot image_346263e6.png */}
              <div className="overflow-x-auto border border-slate-300 max-h-[320px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-white text-slate-800 font-semibold border-b border-slate-300">
                      <th className="p-2.5 text-center border-r border-slate-300 w-16">操作</th>
                      <th className="p-2.5 text-center border-r border-slate-300 min-w-[200px]">字典值</th>
                      <th className="p-2.5 text-center border-r border-slate-300 w-44">排序号 (dict.order)</th>
                      <th className="p-2.5 text-center w-20">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 text-slate-700">
                    {ddSubRows.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-blue-50/20">
                        <td className="p-2 text-center border-r border-slate-300">
                          <button
                            type="button"
                            onClick={() => addDdSubRow(idx)}
                            className="text-blue-500 font-bold text-base hover:text-blue-700 leading-none cursor-pointer p-0.5"
                            title="在下方新增一行"
                          >
                            +
                          </button>
                        </td>
                        <td className="p-1.5 border-r border-slate-300">
                          <input
                            type="text"
                            value={row.value}
                            onChange={(e) => updateDdSubRow(idx, 'value', e.target.value)}
                            className="w-full px-2 py-1 border border-transparent focus:border-blue-500 focus:bg-white rounded outline-none text-xs bg-transparent"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-300 font-mono">
                          <input
                            type="number"
                            value={row.order}
                            onChange={(e) => updateDdSubRow(idx, 'order', Number(e.target.value))}
                            className="w-16 text-center px-1 py-1 border border-transparent focus:border-blue-500 focus:bg-white rounded outline-none text-xs font-mono bg-transparent mx-auto block"
                          />
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => deleteDdSubRow(idx)}
                            className="text-red-500 hover:text-red-700 hover:underline cursor-pointer text-xs"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Buttons matching screenshot image_346263e6.png */}
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddDdModal(false)}
                  className="px-6 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded font-medium transition text-xs shadow-2xs cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 bg-[#1677ff] hover:bg-blue-700 text-white rounded font-medium transition text-xs shadow-2xs cursor-pointer"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Data Dictionary Modal matching screenshot image_346263e6.png */}
      {showEditDdModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 my-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">数据字典编辑</h3>
              <button onClick={() => setShowEditDdModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditDd} className="py-4 space-y-4 text-xs">
              {/* Top Form Fields matching screenshot image_346263e6.png */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <span className="font-medium whitespace-nowrap">字典名称:</span>
                  <input
                    type="text"
                    required
                    value={ddNameForm}
                    onChange={(e) => setDdNameForm(e.target.value)}
                    className="w-52 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium whitespace-nowrap">字典code:</span>
                  <input
                    type="text"
                    required
                    value={ddCodeForm}
                    onChange={(e) => setDdCodeForm(e.target.value)}
                    className="w-52 px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                  />
                </div>
              </div>

              {/* Section Divider: 检验规范 matching screenshot image_346263e6.png */}
              <div className="border-b border-slate-300 pb-1 pt-1">
                <span className="font-medium text-slate-800 text-xs">检验规范</span>
              </div>

              {/* Sub-table matching screenshot image_346263e6.png */}
              <div className="overflow-x-auto border border-slate-300 max-h-[320px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-white text-slate-800 font-semibold border-b border-slate-300">
                      <th className="p-2.5 text-center border-r border-slate-300 w-16">操作</th>
                      <th className="p-2.5 text-center border-r border-slate-300 min-w-[200px]">字典值</th>
                      <th className="p-2.5 text-center border-r border-slate-300 w-44">排序号 (dict.order)</th>
                      <th className="p-2.5 text-center w-20">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 text-slate-700">
                    {ddSubRows.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-blue-50/20">
                        <td className="p-2 text-center border-r border-slate-300">
                          <button
                            type="button"
                            onClick={() => addDdSubRow(idx)}
                            className="text-blue-500 font-bold text-base hover:text-blue-700 leading-none cursor-pointer p-0.5"
                            title="在下方新增一行"
                          >
                            +
                          </button>
                        </td>
                        <td className="p-1.5 border-r border-slate-300">
                          <input
                            type="text"
                            value={row.value}
                            onChange={(e) => updateDdSubRow(idx, 'value', e.target.value)}
                            className="w-full px-2 py-1 border border-transparent focus:border-blue-500 focus:bg-white rounded outline-none text-xs bg-transparent"
                          />
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-300 font-mono">
                          <input
                            type="number"
                            value={row.order}
                            onChange={(e) => updateDdSubRow(idx, 'order', Number(e.target.value))}
                            className="w-16 text-center px-1 py-1 border border-transparent focus:border-blue-500 focus:bg-white rounded outline-none text-xs font-mono bg-transparent mx-auto block"
                          />
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => deleteDdSubRow(idx)}
                            className="text-red-500 hover:text-red-700 hover:underline cursor-pointer text-xs"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Buttons matching screenshot image_346263e6.png */}
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditDdModal(false)}
                  className="px-6 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded font-medium transition text-xs shadow-2xs cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 bg-[#1677ff] hover:bg-blue-700 text-white rounded font-medium transition text-xs shadow-2xs cursor-pointer"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Data Dictionary Modal */}
      {showDeleteDdModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">删除数据字典确认</h3>
                <p className="text-xs text-slate-500">此操作不可撤销，请谨慎确认</p>
              </div>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>您确定要删除以下数据字典记录吗？</p>
              {deletingDdItem && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <p><span className="text-slate-500">字典名称：</span><span className="font-bold text-slate-800">{deletingDdItem.dictName}</span></p>
                  <p><span className="text-slate-500">字典code：</span><span className="font-mono text-slate-800">{deletingDdItem.dictCode}</span></p>
                  <p><span className="text-slate-500">字典值：</span><span className="text-slate-700">{deletingDdItem.dictValue}</span></p>
                </div>
              )}
            </div>
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowDeleteDdModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteDd}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddEqModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 my-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">新增检验设备</h3>
              <button onClick={() => setShowAddEqModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddEq} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">设备类别 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqCategoryForm}
                    onChange={(e) => setEqCategoryForm(e.target.value)}
                    placeholder="如：粗糙度计、三坐标测量机"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">设备编码 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqCodeForm}
                    onChange={(e) => setEqCodeForm(e.target.value)}
                    placeholder="如：00008831"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">设备名称 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqNameForm}
                    onChange={(e) => setEqNameForm(e.target.value)}
                    placeholder="如：高精度便携式表面粗糙度仪"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">设备型号 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqModelForm}
                    onChange={(e) => setEqModelForm(e.target.value)}
                    placeholder="如：SJ-210"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">使用单位 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqDepartmentForm}
                    onChange={(e) => setEqDepartmentForm(e.target.value)}
                    placeholder="如：质检部、计量室"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">摆放位置 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqLocationForm}
                    onChange={(e) => setEqLocationForm(e.target.value)}
                    placeholder="如：1-1"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">入厂时间 <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={eqEnterDateForm}
                    onChange={(e) => setEqEnterDateForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">设备状态 <span className="text-rose-500">*</span></label>
                  <select
                    value={eqStatusForm}
                    onChange={(e) => setEqStatusForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="在用">在用</option>
                    <option value="备用">备用</option>
                    <option value="检定中">检定中</option>
                    <option value="维修中">维修中</option>
                    <option value="报废">报废</option>
                    <option value="封存">封存</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">归属人 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqOwnerForm}
                    onChange={(e) => setEqOwnerForm(e.target.value)}
                    placeholder="如：枫叶"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">校对时间 <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={eqCalibrateDateForm}
                    onChange={(e) => setEqCalibrateDateForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">校对周期/天 <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={eqCalibratePeriodForm}
                    onChange={(e) => setEqCalibratePeriodForm(e.target.value)}
                    placeholder="如：180"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddEqModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-2xs cursor-pointer"
                >
                  确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {showEditEqModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 my-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">编辑检验设备</h3>
              <button onClick={() => setShowEditEqModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditEq} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">设备类别 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqCategoryForm}
                    onChange={(e) => setEqCategoryForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">设备编码 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqCodeForm}
                    onChange={(e) => setEqCodeForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">设备名称 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqNameForm}
                    onChange={(e) => setEqNameForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">设备型号 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqModelForm}
                    onChange={(e) => setEqModelForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">使用单位 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqDepartmentForm}
                    onChange={(e) => setEqDepartmentForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">摆放位置 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqLocationForm}
                    onChange={(e) => setEqLocationForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">入厂时间 <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={eqEnterDateForm}
                    onChange={(e) => setEqEnterDateForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">设备状态 <span className="text-rose-500">*</span></label>
                  <select
                    value={eqStatusForm}
                    onChange={(e) => setEqStatusForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="在用">在用</option>
                    <option value="备用">备用</option>
                    <option value="检定中">检定中</option>
                    <option value="维修中">维修中</option>
                    <option value="报废">报废</option>
                    <option value="封存">封存</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">归属人 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={eqOwnerForm}
                    onChange={(e) => setEqOwnerForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">校对时间 <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={eqCalibrateDateForm}
                    onChange={(e) => setEqCalibrateDateForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">校对周期/天 <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={eqCalibratePeriodForm}
                    onChange={(e) => setEqCalibratePeriodForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditEqModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-2xs cursor-pointer"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Equipment Modal */}
      {showDeleteEqModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center space-x-3 text-rose-600 pb-3 border-b border-slate-100">
              <div className="p-2 bg-rose-50 rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">删除检验设备确认</h3>
                <p className="text-xs text-slate-500">此操作不可撤销，请谨慎确认</p>
              </div>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>您确定要删除以下设备记录吗？</p>
              {deletingEqItem && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <p><span className="text-slate-500">设备名称：</span><span className="font-bold text-slate-800">{deletingEqItem.name}</span></p>
                  <p><span className="text-slate-500">设备编码：</span><span className="font-mono text-slate-800">{deletingEqItem.code}</span></p>
                  <p><span className="text-slate-500">设备型号：</span><span className="text-slate-700">{deletingEqItem.model}</span></p>
                  <p><span className="text-slate-500">使用单位：</span><span className="text-slate-700">{deletingEqItem.department}</span></p>
                </div>
              )}
            </div>
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowDeleteEqModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteEq}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Equipment Modal */}
      {showImportEqModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">批量导入设备数据</h3>
              <button onClick={() => setShowImportEqModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-4 text-xs">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition bg-slate-50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-medium text-slate-700 mb-1">点击上传或将 Excel/CSV 文件拖拽至此处</p>
                <p className="text-slate-400 text-[11px]">支持 .xlsx, .xls, .csv 格式文件，单次最大支持 5000 条记录</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg text-blue-700 text-xs">
                <span>标准导入模板下载：</span>
                <button
                  type="button"
                  onClick={handleExportEq}
                  className="font-medium text-blue-600 hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>设备导入模板.xlsx</span>
                </button>
              </div>
            </div>
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowImportEqModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowImportEqModal(false);
                  alert('导入任务已提交！解析成功，已导入更新设备台账。');
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-2xs cursor-pointer"
              >
                开始导入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">新增用户</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAddUser} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-slate-600 block mb-1">用户账号：</label>
                  <input
                    type="text"
                    required
                    value={uAccount}
                    onChange={(e) => setUAccount(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    placeholder="请输入账号"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">姓名：</label>
                  <input
                    type="text"
                    required
                    value={uName}
                    onChange={(e) => setUName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">部门：</label>
                  <select
                    value={uDepartment}
                    onChange={(e) => setUDepartment(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="质检部">质检部</option>
                    <option value="计量室">计量室</option>
                    <option value="实验室">实验室</option>
                    <option value="生产部">生产部</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">签审角色：</label>
                  <select
                    value={uSignRole}
                    onChange={(e) => setUSignRole(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="外检组长">外检组长</option>
                    <option value="质检经理">质检经理</option>
                    <option value="质量总监">质量总监</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">用户角色：</label>
                  <select
                    value={uUserRole}
                    onChange={(e) => setUUserRole(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="IQC检验员">IQC检验员</option>
                    <option value="IPQC检验员">IPQC检验员</option>
                    <option value="FQC检验员">FQC检验员</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">检验员代号：</label>
                  <input
                    type="text"
                    value={uInspectorCode}
                    onChange={(e) => setUInspectorCode(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    placeholder="例如 QC001"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">检验类别：</label>
                  <select
                    value={uInspectionCategory}
                    onChange={(e) => setUInspectionCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="IQC">IQC</option>
                    <option value="IPQC">IPQC</option>
                    <option value="FQC">FQC</option>
                    <option value="OQC">OQC</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">自动派单顺序：</label>
                  <input
                    type="number"
                    value={uDispatchOrder}
                    onChange={(e) => setUDispatchOrder(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">IP地址：</label>
                  <input
                    type="text"
                    value={uIp}
                    onChange={(e) => setUIp(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                    placeholder="192.168.1.101"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">邮箱：</label>
                  <input
                    type="email"
                    value={uEmail}
                    onChange={(e) => setUEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    placeholder="user@company.com"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">密码：</label>
                  <input
                    type="password"
                    required
                    value={uPassword}
                    onChange={(e) => setUPassword(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    placeholder="请输入密码"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">检验物料组：</label>
                  <select
                    value={uMaterialGroup}
                    onChange={(e) => setUMaterialGroup(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="电子元器件组">电子元器件组</option>
                    <option value="SMT车规贴片电容">SMT车规贴片电容</option>
                    <option value="结构件组">结构件组</option>
                    <option value="包装材料组">包装材料组</option>
                  </select>
                </div>
                <div className="col-span-2 flex items-center space-x-6 py-1">
                  <span className="font-medium text-slate-600 w-24">参与自动派单：</span>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="radio" name="uAutoDispatchAdd" checked={uAutoDispatch === '是'} onChange={() => setUAutoDispatch('是')} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="radio" name="uAutoDispatchAdd" checked={uAutoDispatch === '否'} onChange={() => setUAutoDispatch('否')} />
                      <span>否</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">在岗状态：</label>
                  <select
                    value={uWorkStatus}
                    onChange={(e) => setUWorkStatus(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="在岗">在岗</option>
                    <option value="请假">请假</option>
                    <option value="离职">离职</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="font-medium text-slate-600 block mb-1">请假时间：</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      value={uLeaveStart}
                      onChange={(e) => setULeaveStart(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                    />
                    <span className="text-slate-400">~</span>
                    <input
                      type="date"
                      value={uLeaveEnd}
                      onChange={(e) => setULeaveEnd(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium shadow-2xs cursor-pointer"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">编辑用户</h3>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmEditUser} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-slate-600 block mb-1">用户账号：</label>
                  <input
                    type="text"
                    required
                    value={uAccount}
                    onChange={(e) => setUAccount(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">姓名：</label>
                  <input
                    type="text"
                    required
                    value={uName}
                    onChange={(e) => setUName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">部门：</label>
                  <select
                    value={uDepartment}
                    onChange={(e) => setUDepartment(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="质检部">质检部</option>
                    <option value="计量室">计量室</option>
                    <option value="实验室">实验室</option>
                    <option value="生产部">生产部</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">签审角色：</label>
                  <select
                    value={uSignRole}
                    onChange={(e) => setUSignRole(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="外检组长">外检组长</option>
                    <option value="质检经理">质检经理</option>
                    <option value="质量总监">质量总监</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">用户角色：</label>
                  <select
                    value={uUserRole}
                    onChange={(e) => setUUserRole(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="IQC检验员">IQC检验员</option>
                    <option value="IPQC检验员">IPQC检验员</option>
                    <option value="FQC检验员">FQC检验员</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">检验员代号：</label>
                  <input
                    type="text"
                    value={uInspectorCode}
                    onChange={(e) => setUInspectorCode(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">检验类别：</label>
                  <select
                    value={uInspectionCategory}
                    onChange={(e) => setUInspectionCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="IQC">IQC</option>
                    <option value="IPQC">IPQC</option>
                    <option value="FQC">FQC</option>
                    <option value="OQC">OQC</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">自动派单顺序：</label>
                  <input
                    type="number"
                    value={uDispatchOrder}
                    onChange={(e) => setUDispatchOrder(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">IP地址：</label>
                  <input
                    type="text"
                    value={uIp}
                    onChange={(e) => setUIp(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">邮箱：</label>
                  <input
                    type="email"
                    value={uEmail}
                    onChange={(e) => setUEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">密码：</label>
                  <input
                    type="password"
                    value={uPassword}
                    onChange={(e) => setUPassword(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                    placeholder="留空则不修改密码"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">检验物料组：</label>
                  <select
                    value={uMaterialGroup}
                    onChange={(e) => setUMaterialGroup(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="电子元器件组">电子元器件组</option>
                    <option value="SMT车规贴片电容">SMT车规贴片电容</option>
                    <option value="结构件组">结构件组</option>
                    <option value="包装材料组">包装材料组</option>
                  </select>
                </div>
                <div className="col-span-2 flex items-center space-x-6 py-1">
                  <span className="font-medium text-slate-600 w-24">参与自动派单：</span>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="radio" name="uAutoDispatchEdit" checked={uAutoDispatch === '是'} onChange={() => setUAutoDispatch('是')} />
                      <span>是</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="radio" name="uAutoDispatchEdit" checked={uAutoDispatch === '否'} onChange={() => setUAutoDispatch('否')} />
                      <span>否</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">在岗状态：</label>
                  <select
                    value={uWorkStatus}
                    onChange={(e) => setUWorkStatus(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  >
                    <option value="在岗">在岗</option>
                    <option value="请假">请假</option>
                    <option value="离职">离职</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="font-medium text-slate-600 block mb-1">请假时间：</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      value={uLeaveStart}
                      onChange={(e) => setULeaveStart(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                    />
                    <span className="text-slate-400">~</span>
                    <input
                      type="date"
                      value={uLeaveEnd}
                      onChange={(e) => setULeaveEnd(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium shadow-2xs cursor-pointer"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteUserModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center space-x-3 text-rose-600 pb-3 border-b border-slate-100">
              <div className="p-2 bg-rose-50 rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">删除用户确认</h3>
                <p className="text-xs text-slate-500">此操作不可撤销，请谨慎确认</p>
              </div>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>您确定要删除以下系统用户吗？</p>
              {deletingUserItem && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <p><span className="text-slate-500">用户姓名：</span><span className="font-bold text-slate-800">{deletingUserItem.name}</span></p>
                  <p><span className="text-slate-500">用户账号：</span><span className="font-mono text-slate-800">{deletingUserItem.account}</span></p>
                  <p><span className="text-slate-500">所属部门：</span><span className="text-slate-700">{deletingUserItem.department}</span></p>
                  <p><span className="text-slate-500">用户角色：</span><span className="text-slate-700">{deletingUserItem.userRole}</span></p>
                </div>
              )}
            </div>
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setShowDeleteUserModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">新增业务角色</h3>
              </div>
              <button
                onClick={() => setShowAddRoleModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleConfirmAddRole} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-600 block mb-1">角色编码 :</label>
                <input
                  type="text"
                  required
                  value={rCode}
                  onChange={(e) => setRCode(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                  placeholder="例如 ROLE_CUSTOM"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">角色名称 :</label>
                <input
                  type="text"
                  required
                  value={rName}
                  onChange={(e) => setRName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  placeholder="例如 高级质量主管"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">权限范围 :</label>
                <input
                  type="text"
                  value={rPermissions}
                  onChange={(e) => setRPermissions(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                  placeholder="例如 检验 / 审核 / 报表"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">描述说明 :</label>
                <textarea
                  value={rDesc}
                  onChange={(e) => setRDesc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white h-20 resize-none"
                  placeholder="请输入角色职责与权限说明"
                ></textarea>
              </div>
              <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-4 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium shadow-2xs cursor-pointer"
                >
                  确定保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRoleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Edit className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">编辑业务角色</h3>
              </div>
              <button
                onClick={() => setShowEditRoleModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleConfirmEditRole} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-600 block mb-1">角色编码 :</label>
                <input
                  type="text"
                  required
                  value={rCode}
                  onChange={(e) => setRCode(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs font-mono bg-white"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">角色名称 :</label>
                <input
                  type="text"
                  required
                  value={rName}
                  onChange={(e) => setRName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">权限范围 :</label>
                <input
                  type="text"
                  value={rPermissions}
                  onChange={(e) => setRPermissions(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">描述说明 :</label>
                <textarea
                  value={rDesc}
                  onChange={(e) => setRDesc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white h-20 resize-none"
                ></textarea>
              </div>
              <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditRoleModal(false)}
                  className="px-4 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium shadow-2xs cursor-pointer"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Role Modal */}
      {showDeleteRoleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center space-x-3 text-rose-600 pb-3 border-b border-slate-100">
              <div className="p-2 bg-rose-50 rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">删除角色确认</h3>
                <p className="text-xs text-slate-500">此操作不可撤销，请谨慎确认</p>
              </div>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>您确定要删除以下系统业务角色吗？</p>
              {deletingRoleItem && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <p><span className="text-slate-500">角色名称：</span><span className="font-bold text-slate-800">{deletingRoleItem.roleName}</span></p>
                  <p><span className="text-slate-500">角色编码：</span><span className="font-mono text-slate-800">{deletingRoleItem.roleCode}</span></p>
                  <p><span className="text-slate-500">权限范围：</span><span className="text-slate-700">{deletingRoleItem.permissions}</span></p>
                </div>
              )}
              <p className="text-xs text-rose-500 font-medium pt-1">删除后，关联此角色的用户将失去相应权限！</p>
            </div>
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setShowDeleteRoleModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteRole}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-md cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Email Group Modal */}
      {showAddEmailGroupModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">新增邮件组</h3>
              <button onClick={() => setShowAddEmailGroupModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <form onSubmit={handleConfirmAddEmailGroup} className="py-4 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">邮件组代号 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={egCode}
                  onChange={(e) => setEgCode(e.target.value)}
                  placeholder="请输入邮件组代号，例如 A011"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">邮件组名称 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={egName}
                  onChange={(e) => setEgName(e.target.value)}
                  placeholder="请输入邮件组名称"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">邮件组说明</label>
                <textarea
                  value={egDesc}
                  onChange={(e) => setEgDesc(e.target.value)}
                  placeholder="请输入详细邮件组说明信息"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white h-20 resize-none"
                ></textarea>
              </div>
              <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEmailGroupModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-2xs cursor-pointer"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Email Group Modal */}
      {showEditEmailGroupModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">编辑邮件组</h3>
              <button onClick={() => setShowEditEmailGroupModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <form onSubmit={handleConfirmEditEmailGroup} className="py-4 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">邮件组代号 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={egCode}
                  onChange={(e) => setEgCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">邮件组名称 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={egName}
                  onChange={(e) => setEgName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">邮件组说明</label>
                <textarea
                  value={egDesc}
                  onChange={(e) => setEgDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white h-20 resize-none"
                ></textarea>
              </div>
              <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditEmailGroupModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium shadow-2xs cursor-pointer"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Email Group Modal */}
      {showDeleteEmailGroupModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center space-x-3 text-rose-600 pb-3 border-b border-slate-100">
              <div className="p-2 bg-rose-50 rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">删除邮件组确认</h3>
                <p className="text-xs text-slate-500">此操作不可撤销，请谨慎确认</p>
              </div>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2">
              <p>您确定要删除以下邮件组吗？</p>
              {deletingEmailGroupItem && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <p><span className="text-slate-500">邮件组名称：</span><span className="font-bold text-slate-800">{deletingEmailGroupItem.groupName}</span></p>
                  <p><span className="text-slate-500">邮件组代号：</span><span className="font-mono text-slate-800">{deletingEmailGroupItem.groupCode}</span></p>
                  <p><span className="text-slate-500">邮件组说明：</span><span className="text-slate-700">{deletingEmailGroupItem.groupDesc}</span></p>
                </div>
              )}
              <p className="text-xs text-rose-500 font-medium pt-1">删除后，相关通知将无法发送至该邮件组！</p>
            </div>
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setShowDeleteEmailGroupModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteEmailGroup}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-md cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Add Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">提交意见反馈</h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <form onSubmit={handleSubmitFeedback} className="py-4 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">反馈分类 <span className="text-rose-500">*</span></label>
                <select
                  value={newFeedbackType}
                  onChange={(e) => setNewFeedbackType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                >
                  <option value="功能建议">功能建议</option>
                  <option value="界面优化">界面优化</option>
                  <option value="缺陷报错">缺陷报错</option>
                  <option value="性能体验">性能体验</option>
                  <option value="其它">其它</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">反馈标题 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="请简要概括您的意见或建议"
                  value={newFeedbackTitle}
                  onChange={(e) => setNewFeedbackTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">详细描述 <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  placeholder="请详细描述您遇到的问题、使用场景或改进期望..."
                  value={newFeedbackContent}
                  onChange={(e) => setNewFeedbackContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white resize-none"
                ></textarea>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">联系方式</label>
                <input
                  type="text"
                  placeholder="姓名 / 手机号或邮箱 (选填)"
                  value={newFeedbackContact}
                  onChange={(e) => setNewFeedbackContact(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-xs bg-white"
                />
              </div>
              <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-2xs cursor-pointer"
                >
                  提交反馈
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Dropdown Modal */}

      {showNotificationModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={() => setShowNotificationModal(false)}>
          <div
            className="absolute right-20 top-16 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                <span>系统通知</span>
              </h4>
              <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">2条未读</span>
            </div>
            <div className="py-3 space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 hover:bg-indigo-50/50 rounded-xl transition cursor-pointer">
                <p className="font-semibold text-slate-800">零星物料派单同步成功</p>
                <p className="text-slate-500 mt-0.5">批次 20261020 已成功推送到 WMS 系统。</p>
                <span className="text-[10px] text-slate-400 mt-1 block">10分钟前</span>
              </div>
              <div className="p-2.5 bg-slate-50 hover:bg-indigo-50/50 rounded-xl transition cursor-pointer">
                <p className="font-semibold text-slate-800">WMS 接口告警</p>
                <p className="text-slate-500 mt-0.5">订单 W01110010 派单超时，请检查网络。</p>
                <span className="text-[10px] text-slate-400 mt-1 block">30分钟前</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
