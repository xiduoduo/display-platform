/**
 * 用于:引入单个页面组件 - 实现懒加载
 */
// -------------------------- 展示平台
// 布局
export const Layout = () => import('@/components/layout/display/index');
// 页面
export const Index = () => import('@/project/display/index');
export const PartOne = () => import('@/project/display/index/part-one');
export const PartTwo = () => import('@/project/display/index/part-two');
export const PartThree = () => import('@/project/display/index/part-three');
export const Trial = () => import('@/project/display/trial');
export const Product = () => import('@/project/display/product');
export const Logistics = () => import('@/project/display/logistics');
export const Operative = () => import('@/project/display/operative');
export const Service = () => import('@/project/display/service');
// ------------------------- 康明斯
// 布局
export const KmsLayout = () => import('@/components/layout/kms/index');
// 页面
export const KmsLogin = () => import('@/project/kms/login');
export const KmsIndex = () => import('@/project/kms/index');
export const KmsMileage = () => import('@/project/kms/mileage');
// ------------------------- 新能源
// 布局
export const EnergyLayout = () => import('@/components/layout/energy/index');
// 页面
export const EnergyIndex = () => import('@/project/energy/index');
export const EnergyPartOne = () => import('@/project/energy/index/part-one');
export const EnergyPartTwo = () => import('@/project/energy/index/part-two');
export const EnergyPartThree = () => import('@/project/energy/index/part-three');
export const EnergyProduct = () => import('@/project/energy/product');
export const EnergyLogistics = () => import('@/project/energy/logistics');
export const EnergyOperative = () => import('@/project/energy/operative');
export const EnergyService = () => import('@/project/energy/service');
// ------------------------- 自动驾驶平台
// 布局
export const AutoLayout = () => import('@/components/layout/autopilot/index');
// 页面
export const AutoIndex = () => import('@/project/autopilot/index');
export const AutoMonitoring = () => import('@/project/autopilot/car-monitoring');
export const AutoHistory = () => import('@/project/autopilot/car-history');
