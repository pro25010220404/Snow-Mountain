# 西岭雪山 · 轻康养探索者（前端）

游戏化体旅融合 H5 应用 —— 面向年轻群体的轻康养体验服务。基于西岭雪山四季体旅资源，用「成就系统 + AR 打卡 + 好友 PK + 虚拟勋章」把运动康养变成一场探索游戏。

> 参赛项目 demo：赛道 6「数智文旅 + 康养体育」。本仓库为**纯前端**实现（Vue 3 + TypeScript + Vite + Tailwind CSS），内置 mock 数据层，零后端依赖即可运行。

## 技术栈

| 层 | 选型 |
|----|------|
| 框架 | Vue 3（Composition API + `<script setup>`） |
| 语言 | TypeScript |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3 |
| 路由 | Vue Router 4（Hash 模式，便于静态部署） |
| 状态 | Pinia（内置 localStorage 持久化模拟后端） |

## 快速开始

```bash
npm install
npm run dev        # 本地开发，http://localhost:5173
npm run build      # 类型检查 + 生产构建（输出 dist/）
npm run preview    # 预览生产构建
```

入口为「一键进入探索」，本地数据无需注册。演示完成后可在「我的 → 重置演示数据」还原初始状态。

## 页面清单（P0 + P1 + P2，共 13 屏）

| 页面 | 路由 | 优先级 |
|------|------|--------|
| 登录/注册 | `/login` | P0 |
| 探索·路线列表 | `/explore` | P0 |
| 路线详情 | `/explore/route/:id` | P0 |
| 打卡·运动记录 | `/checkin` | P0 |
| 打卡详情/轨迹 | `/checkin/:id` | P0 |
| 成就·勋章墙 | `/achievement` | P0 |
| 我的·个人中心 | `/profile` | P0 |
| AI 路线推荐 | `/explore/ai` | P1 |
| AR 扫码打卡 | `/checkin/ar` | P1 |
| 排行榜 / PK | `/rank` | P1 |
| 服务预订 | `/profile/booking` | P2 |
| 积分商城 | `/profile/mall` | P2 |
| 数据看板 | `/profile/dashboard` | P2 |

## 核心设计

- **路线解锁状态机**：四季路线「冬 → 春 → 夏 → 秋」依次解锁，完成前序才可挑战进阶，路线卡片三态（未解锁 / 可挑战 / 已完成）。
- **成就规则引擎**：`src/mock/achievements.ts` 声明规则（指标 + 阈值 + 奖励），`src/stores/achievements.ts` 统一求值；新增成就只改数据不改代码。达成时跨页面弹「成就弹窗」。
- **弱网打卡不丢**：打卡/运动记录离线时写入本地待同步队列（localStorage），网络恢复后批量上报（打卡页右上角「弱网」开关可演示）。
- **AR 打卡降级方案**：按技术评估文档 D3，采用「二维码 + 动画」，扫码取景框 + 手动输入点位码双路径。

## 目录结构

```
src/
├── mock/            # 内置数据：4 条四季路线、成就定义、运动记录、排行榜、持久化
├── stores/          # Pinia：user / routes / records / achievements / ui
├── components/      # Icon、TabBar、RouteCard、MedalBadge、成就弹窗、分享卡、Toast
├── views/           # 13 个页面
├── utils/           # 轨迹生成、日期等工具
├── router/          # 路由 + 登录守卫
└── types.ts         # 全局类型（对齐后端"核心数据模型"）
```

## 合规红线（已落实）

- 界面与文案全程不含校名 / 校徽 / 师生姓名。
- 健康表述统一为「运动记录 / 睡眠记录 / 健康生活方式」，无任何医疗暗示。
- 心率等敏感数据默认关闭，需用户手动开启。
