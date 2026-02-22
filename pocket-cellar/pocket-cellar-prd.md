# 口袋酒窖 / Pocket Cellar

## 产品需求文档 (PRD)

**版本**: 1.0  
**日期**: 2026-02-21  
**平台**: Expo (React Native) - iOS + Android

---

## 1. 产品概述

### 1.1 产品简介
口袋酒窖（Pocket Cellar）是一款帮助家庭葡萄酒收藏者管理酒柜库存的移动应用。用户可以通过虚拟酒柜的网格形式直观地管理自己的葡萄酒收藏。

### 1.2 品牌信息
- **App 名称**: 口袋酒窖 / Pocket Cellar
- **Slogan**: 你的酒，尽在掌握 / Your cellar, in your pocket
- **主色调**: 勃艮第红 #722F37

### 1.3 目标用户
- 家中有葡萄酒柜或酒架的收藏者
- 需要管理个人葡萄酒库存的爱好者

---

## 2. 功能需求

### 2.1 酒柜管理

#### 2.1.1 创建酒柜
- 用户可创建多个酒柜
- 每个酒柜可自定义：
  - 名称
  - 备注
  - 行数（1-20）
  - 列数（1-20）
- **酒柜布局一旦确定不可更改**，创建时需提示用户
- 提供预设模板快速创建：

| 模板名称 | 规格 | 容量 |
|---------|------|------|
| 迷你酒架 | 2×6 | 12瓶 |
| 小型酒柜 | 3×6 | 18瓶 |
| 中型酒柜 | 4×6 | 24瓶 |
| 标准酒柜 | 6×6 | 36瓶 |
| 大型酒柜 | 6×9 | 54瓶 |
| 专业酒柜 | 8×10 | 80瓶 |
| 自定义 | 用户输入 | - |

#### 2.1.2 酒柜操作
- 重命名酒柜
- 编辑酒柜备注
- 删除酒柜（删除时询问用户是否将酒移入档案）
- 多酒柜切换：使用下拉菜单

#### 2.1.3 网格视图
- 以网格形式模拟实体酒柜
- 每个格子代表一个酒瓶位置
- **空格子**: 白色显示
- **有酒格子**: 圆形显示，根据酒款类型显示不同颜色
- 每个位置只能存放一瓶酒
- 支持长按拖拽调整酒瓶位置

#### 2.1.4 酒款类型颜色

| 酒款类型 | 颜色 | 色值 |
|---------|------|------|
| 红葡萄酒 | 深红 | #722F37 |
| 白葡萄酒 | 淡金 | #F4E6B0 |
| 桃红葡萄酒 | 粉色 | #E8A0A0 |
| 起泡酒 | 香槟金 | #F5DEB3 |
| 甜酒 | 琥珀色 | #FFBF00 |
| 加强酒 | 深棕 | #8B4513 |
| 清酒 | 淡青 | #E8F4F8 |

### 2.2 葡萄酒管理

#### 2.2.1 葡萄酒信息字段

**基本信息**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 照片 | 图片数组 | 否 | 最多5张，支持拍照+相册选择 |
| 酒名 | 文本 | **是** | 唯一必填字段 |
| 酒庄/生产商 | 文本 | 否 | - |
| 年份 | 数字 | 否 | Vintage |
| 国家 | 选择/自定义 | 否 | 预设常用+可自定义 |
| 产区 | 选择/自定义 | 否 | 预设常用+可自定义 |
| 葡萄品种 | 多选/自定义 | 否 | 可多选，预设+可自定义 |
| 酒款类型 | 选择 | 否 | 红/白/桃红/起泡/甜酒/加强酒/清酒 |
| 容量 | 选择 | 否 | 750ml / 1.5L 等 |

**价格与评分**
| 字段 | 类型 | 说明 |
|------|------|------|
| 买入价格 | 数字 | 支持小数（小数点后两位） |
| 当前估值 | 数字 | 支持小数（小数点后两位） |
| 货币单位 | 选择 | 默认 AUD，可更改 |
| 购买日期 | 日期 | - |
| 购买渠道 | 文本 | - |
| 专业评分 | 文本 | WS / RP / JR 等，可选填 |

**其他**
| 字段 | 类型 | 说明 |
|------|------|------|
| 备注 | 文本 | 自由输入 |

#### 2.2.2 预设选项管理
- 国家、产区、葡萄品种等字段提供预设常用选项
- 用户可自定义添加新选项
- 用户添加的选项会保存，下次出现在选择列表中

#### 2.2.3 添加葡萄酒
- 点击空格子进入添加流程
- 手动输入信息
- 支持拍照或从相册选择照片

#### 2.2.4 查看葡萄酒
- 点击有酒的格子 → 弹出预览弹窗（基本信息）
- 点击弹窗 → 进入完整详情页

#### 2.2.5 编辑葡萄酒
- 在详情页可编辑所有信息

#### 2.2.6 快速复制
- 如果有多瓶同款酒，可复制信息快速添加到其他格子

#### 2.2.7 移入档案
- 详情页有「移入档案」按钮
- 长按格子出现「移入档案」选项
- 列表视图支持多选批量移入档案

### 2.3 列表视图

#### 2.3.1 功能
- 以列表形式浏览所有库存
- 从列表点击某瓶酒可跳转到它在酒柜中的位置并高亮显示

#### 2.3.2 筛选
- 产区
- 年份
- 国家
- 类型
- 价格区间

#### 2.3.3 排序
- 默认按酒名排序
- 可选：添加时间、年份、价格

#### 2.3.4 搜索
- 关键词搜索（酒名、酒庄）

#### 2.3.5 批量操作
- 支持多选批量移入档案

### 2.4 酒窖档案 (Cellar Archive)

#### 2.4.1 功能
- 存放已移出酒柜的葡萄酒记录
- 保留完整的酒款信息

#### 2.4.2 恢复功能
- 档案中的酒可以恢复到酒柜
- 恢复时弹出选择框，让用户选择放入哪个酒柜的哪个位置

### 2.5 设置

#### 2.5.1 语言设置
- 支持中文 / English
- 用户可在 App 内切换

#### 2.5.2 外观设置
- 浅色模式
- 深色模式
- 跟随系统

#### 2.5.3 主题配色
- 用户可选择 App 主题颜色
- 8 种配色方案：

| 名称 | 色值 |
|------|------|
| 勃艮第红（默认） | #722F37 |
| 玫瑰酒红 | #A83254 |
| 宝石红 | #9B1B30 |
| 梅洛紫红 | #8E4585 |
| 香槟金 | #C9A962 |
| 橡木棕 | #6B4423 |
| 深海藏青 | #2C3E50 |
| 经典黑 | #1A1A1A |

#### 2.5.4 货币设置
- 默认 AUD
- 可更改货币单位

### 2.6 菜单

菜单按钮点击后显示：
- 列表视图
- 酒窖档案
- 设置

---

## 3. 用户流程

### 3.1 首次使用流程
1. 启动页（Splash）：显示 Logo + Slogan
2. Onboarding 引导页（介绍 App 核心功能）
3. 引导用户创建第一个酒柜
4. 进入主界面（酒柜网格视图）

### 3.2 主界面结构
- 顶部：当前酒柜名称（下拉可切换）+ 菜单按钮
- 中部：酒柜网格视图
- 点击格子进行操作

### 3.3 添加葡萄酒流程
1. 点击空格子
2. 进入添加页面
3. 填写信息（仅酒名必填）
4. 可选：拍照或从相册添加照片
5. 保存

### 3.4 查看/编辑葡萄酒流程
1. 点击有酒的格子
2. 弹出预览弹窗（显示基本信息）
3. 点击弹窗进入完整详情页
4. 可编辑或移入档案

### 3.5 恢复葡萄酒流程
1. 进入酒窖档案
2. 选择要恢复的酒
3. 点击恢复
4. 弹出选择框：选择目标酒柜和位置
5. 确认恢复

---

## 4. 技术规格

### 4.1 技术栈

| 类别 | 技术方案 |
|------|---------|
| 框架 | Expo (React Native) |
| 状态管理 | Zustand |
| 本地存储 | expo-secure-store / MMKV |
| 导航 | Expo Router |
| 多语言 | i18next + react-i18next |
| UI 组件 | 自建组件（配合主题系统） |
| 图片选择 | expo-image-picker |
| 相机 | expo-camera |
| 文件系统 | expo-file-system |
| 图标 | @expo/vector-icons |

### 4.2 数据存储
- V1：纯本地存储
- 数据结构建议：

```typescript
interface WineCellar {
  id: string;
  name: string;
  note?: string;
  rows: number;
  columns: number;
  createdAt: Date;
}

interface Wine {
  id: string;
  cellarId: string;
  position: { row: number; column: number };
  name: string; // 必填
  photos?: string[];
  winery?: string;
  vintage?: number;
  country?: string;
  region?: string;
  grapeVarieties?: string[];
  type?: 'red' | 'white' | 'rose' | 'sparkling' | 'sweet' | 'fortified' | 'sake';
  capacity?: string;
  purchasePrice?: number;
  currentValue?: number;
  currency: string; // 默认 'AUD'
  purchaseDate?: Date;
  purchaseChannel?: string;
  rating?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ArchivedWine extends Omit<Wine, 'cellarId' | 'position'> {
  archivedAt: Date;
  originalCellarId: string;
  originalPosition: { row: number; column: number };
}

interface UserPreferences {
  language: 'zh' | 'en';
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  currency: string;
  customCountries: string[];
  customRegions: string[];
  customGrapeVarieties: string[];
}
```

### 4.3 系统权限
- 相机权限（拍照）
- 相册权限（选择照片）
- 首次使用相关功能时请求

### 4.4 动画效果
- 页面切换过渡动画
- 弹窗出现/消失动画
- 拖拽酒瓶时的视觉反馈
- 保持流畅自然的用户体验

---

## 5. 设计规格

### 5.1 设计风格
- 简约现代（Apple 原生风格）
- 干净利落的界面
- 适当的留白

### 5.2 Logo
- 主 Logo：V3 单行文字 + 装饰线 + 酒窖拱门
- App Icon：勃艮第红渐变背景 + 白色酒窖拱门图标

### 5.3 颜色系统

**主色**
- 勃艮第红：#722F37（默认主题色）

**酒款类型颜色**
- 红葡萄酒：#722F37
- 白葡萄酒：#F4E6B0
- 桃红葡萄酒：#E8A0A0
- 起泡酒：#F5DEB3
- 甜酒：#FFBF00
- 加强酒：#8B4513
- 清酒：#E8F4F8

**中性色**
- 背景（浅色模式）：#FFFFFF
- 背景（深色模式）：#1A1A1A
- 空格子：#FFFFFF（浅色）/ #2A2A2A（深色）
- 文字主色：#1A1A1A（浅色）/ #FFFFFF（深色）
- 文字次要：#666666（浅色）/ #999999（深色）

### 5.4 字体
- 系统默认字体
- iOS：SF Pro
- Android：Roboto

---

## 6. 后续版本规划

### 6.1 V1.x 可考虑
- iPad 适配
- iOS 桌面小组件
- 分享功能

### 6.2 V2.0 规划
- iCloud 同步
- 手动备份/导出
- 拍照识别酒标自动填充
- CSV 导入/导出

### 6.3 未来版本
- 饮用相关信息（适饮窗口、醒酒建议、配餐建议）
- 品酒区（品鉴笔记）
- 统计仪表盘（库存总数、总价值、产区/国家分布图）
- 适饮期提醒
- 菱形格/层架型布局
- 收藏标记

---

## 7. 预设数据

### 7.1 常用国家
```
法国, 意大利, 西班牙, 美国, 澳大利亚, 智利, 阿根廷, 德国, 葡萄牙, 新西兰, 南非, 奥地利, 日本, 中国
```

### 7.2 常用产区
```
波尔多, 勃艮第, 香槟, 罗纳河谷, 卢瓦尔河谷, 阿尔萨斯,
托斯卡纳, 皮埃蒙特, 威尼托,
里奥哈, 普里奥拉托,
纳帕谷, 索诺玛, 俄勒冈,
巴罗萨谷, 猎人谷, 玛格丽特河,
中央山谷, 门多萨,
摩泽尔, 莱茵高,
杜罗河, 波特,
马尔堡
```

### 7.3 常用葡萄品种
```
赤霞珠, 梅洛, 黑皮诺, 西拉/设拉子, 桑娇维塞, 内比奥罗, 丹魄, 马尔贝克, 仙粉黛, 佳美,
霞多丽, 长相思, 雷司令, 灰皮诺, 维欧尼, 琼瑶浆, 赛美蓉, 白诗南, 阿尔巴利诺, 绿维特利纳
```

### 7.4 容量选项
```
375ml (半瓶)
750ml (标准瓶)
1.5L (Magnum)
3L (Double Magnum)
```

---

## 8. 资源文件

### 8.1 Logo 文件
- `logos/burgundy.png` - 勃艮第红（主 Logo）
- `logos/rose-wine.png` - 玫瑰酒红
- `logos/ruby-red.png` - 宝石红
- `logos/merlot-purple.png` - 梅洛紫红
- `logos/champagne-gold.png` - 香槟金
- `logos/oak-brown.png` - 橡木棕
- `logos/navy-blue.png` - 深海藏青
- `logos/classic-black.png` - 经典黑

### 8.2 App Icon
- `app-icon/app-icon-1024.png` - App Store
- `app-icon/app-icon-512.png`
- `app-icon/app-icon-256.png`
- `app-icon/app-icon-180.png` - iPhone @3x
- `app-icon/app-icon-120.png` - iPhone @2x
- `app-icon/app-icon-60.png`

---

## 9. 多语言支持

App 需支持中英双语，以下为关键文案：

| Key | 中文 | English |
|-----|------|---------|
| app_name | 口袋酒窖 | Pocket Cellar |
| slogan | 你的酒，尽在掌握 | Your cellar, in your pocket |
| cellar | 酒柜 | Cellar |
| archive | 酒窖档案 | Cellar Archive |
| settings | 设置 | Settings |
| list_view | 列表视图 | List View |
| add_wine | 添加葡萄酒 | Add Wine |
| edit_wine | 编辑 | Edit |
| move_to_archive | 移入档案 | Move to Archive |
| restore | 恢复 | Restore |
| delete | 删除 | Delete |
| save | 保存 | Save |
| cancel | 取消 | Cancel |
| wine_name | 酒名 | Wine Name |
| winery | 酒庄 | Winery |
| vintage | 年份 | Vintage |
| country | 国家 | Country |
| region | 产区 | Region |
| grape_variety | 葡萄品种 | Grape Variety |
| wine_type | 酒款类型 | Wine Type |
| capacity | 容量 | Capacity |
| purchase_price | 买入价格 | Purchase Price |
| current_value | 当前估值 | Current Value |
| purchase_date | 购买日期 | Purchase Date |
| purchase_channel | 购买渠道 | Purchase Channel |
| rating | 评分 | Rating |
| notes | 备注 | Notes |
| red_wine | 红葡萄酒 | Red Wine |
| white_wine | 白葡萄酒 | White Wine |
| rose_wine | 桃红葡萄酒 | Rosé Wine |
| sparkling_wine | 起泡酒 | Sparkling Wine |
| sweet_wine | 甜酒 | Sweet Wine |
| fortified_wine | 加强酒 | Fortified Wine |
| sake | 清酒 | Sake |
| language | 语言 | Language |
| appearance | 外观 | Appearance |
| theme_color | 主题颜色 | Theme Color |
| light_mode | 浅色模式 | Light Mode |
| dark_mode | 深色模式 | Dark Mode |
| follow_system | 跟随系统 | Follow System |
| create_cellar | 创建酒柜 | Create Cellar |
| cellar_name | 酒柜名称 | Cellar Name |
| rows | 行数 | Rows |
| columns | 列数 | Columns |
| template | 模板 | Template |
| custom | 自定义 | Custom |
| layout_warning | 酒柜布局一旦创建无法更改 | Cellar layout cannot be changed once created |
| delete_cellar_confirm | 是否将酒柜中的酒移入档案？ | Move wines to archive before deleting? |
| select_position | 选择位置 | Select Position |
| position_occupied | 该位置已有酒 | Position occupied |
| no_wines | 暂无葡萄酒 | No wines yet |
| search | 搜索 | Search |
| filter | 筛选 | Filter |
| sort | 排序 | Sort |
| all | 全部 | All |
| price_range | 价格区间 | Price Range |

---

## 10. 附录

### 10.1 竞品参考
- CellarTracker
- VinoCell
- Vivino

### 10.2 差异化优势
- 简洁直观的网格交互
- 轻量化设计，聚焦核心需求
- 现代 UI 设计
- 原生中英双语支持
- 灵活的酒柜行列自定义
