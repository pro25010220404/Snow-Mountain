import type { ExploreRoute } from '@/types'

// 4 条内置四季路线，解锁顺序：冬 → 春 → 夏 → 秋
export const ROUTES: ExploreRoute[] = [
  {
    id: 'winter',
    season: 'winter',
    name: '冰雪挑战者',
    subtitle: '滑雪进阶 · 初级到野雪区',
    difficulty: 4,
    duration: '约 4 小时',
    distanceKm: 12,
    cover: { from: '#5C84AC', to: '#EAF3F6' },
    intro:
      '从初级雪道起步，一路进阶至野雪区。在海拔 2000 米以上的雪原上，感受速度与雪粒擦过脸颊的清爽。',
    wellness:
      '低温环境下的有氧运动能提升心肺耐力；雪地反光与开阔视野，是都市里难得的"眼睛深呼吸"。',
    points: [
      {
        id: 'w1',
        name: '初级雪道口',
        desc: '领取护具，热身 10 分钟',
        code: 'XLS-001',
        nav: {
          from: '游客中心',
          meters: 300,
          minutes: 5,
          steps: ['出游客中心，沿雪具大厅右侧步道下行', '约 300 米到达初级雪道口，凭手环领取护具'],
        },
      },
      {
        id: 'w2',
        name: '中级缆车站',
        desc: '乘缆车上行，俯瞰林海雪原',
        code: 'XLS-002',
        nav: {
          from: '初级雪道口',
          meters: 450,
          minutes: 8,
          steps: ['沿初级道旁的上行步道向东南走', '经过儿童滑雪区后，抬头可见缆车站标志'],
        },
      },
      {
        id: 'w3',
        name: '高级雪道顶',
        desc: '挑战 32° 陡坡，勇敢者的试炼',
        code: 'XLS-003',
        nav: {
          from: '中级缆车站',
          meters: 0,
          minutes: 12,
          steps: ['在中级缆车站刷手环进站', '乘缆车上行约 12 分钟，出站即达雪道顶'],
        },
      },
      {
        id: 'w4',
        name: '野雪区入口',
        desc: '粉雪秘境，需专业向导陪同',
        code: 'XLS-004',
        nav: {
          from: '高级雪道顶',
          meters: 800,
          minutes: 15,
          steps: ['出雪道顶，沿左侧「野雪区」指示牌方向走', '穿行山脊约 800 米，野雪区入口需向导陪同'],
        },
      },
    ],
    requires: [],
  },
  {
    id: 'spring',
    season: 'spring',
    name: '杜鹃探险家',
    subtitle: '高山杜鹃徒步 · 低海拔到高海拔',
    difficulty: 3,
    duration: '约 3 小时',
    distanceKm: 8,
    cover: { from: '#6FA55A', to: '#E3EFDB' },
    intro:
      '沿着海拔攀升的步道，穿行在成片高山杜鹃之间。每到一处观景台，云雾散去，雪峰忽现。',
    wellness:
      '森林负氧离子浓度极高，深呼吸间完成一次"肺部清洗"；缓坡徒步是温和而有效的下肢锻炼。',
    points: [
      {
        id: 's1',
        name: '杜鹃林入口',
        desc: '海拔 1600m，起点签到',
        code: 'XLS-101',
        nav: {
          from: '游客中心',
          meters: 200,
          minutes: 4,
          steps: ['从游客中心沿木栈道向山上走', '约 200 米见「杜鹃林」指示牌，入口签到'],
        },
      },
      {
        id: 's2',
        name: '云海观景台',
        desc: '日出云海最佳机位',
        code: 'XLS-102',
        nav: {
          from: '杜鹃林入口',
          meters: 600,
          minutes: 12,
          steps: ['沿杜鹃步道继续上行，岔路口靠右', '连续爬升后到观景台，日出时段云海最佳'],
        },
      },
      {
        id: 's3',
        name: '高山草甸',
        desc: '开阔草甸，可短暂休整',
        code: 'XLS-103',
        nav: {
          from: '云海观景台',
          meters: 700,
          minutes: 15,
          steps: ['从观景台沿山脊步道向北', '翻过小坡就是开阔草甸，可在此休整'],
        },
      },
      {
        id: 's4',
        name: '杜鹃花海',
        desc: '海拔 2400m，花期末班车',
        code: 'XLS-104',
        nav: {
          from: '高山草甸',
          meters: 500,
          minutes: 10,
          steps: ['穿过草甸，沿右侧花海步道前行', '海拔 2400m 处成片杜鹃，注意花期'],
        },
      },
    ],
    requires: ['winter'],
  },
  {
    id: 'summer',
    season: 'summer',
    name: '森林疗愈师',
    subtitle: '负氧离子徒步 + 露营体验',
    difficulty: 2,
    duration: '约 2.5 小时',
    distanceKm: 6,
    cover: { from: '#3E8BA0', to: '#D8E9EE' },
    intro:
      '夏季平均 22℃ 的天然空调。沿溪流而上，在瀑布下感受水雾，最后在草坪搭起帐篷看星空。',
    wellness:
      '森林浴（Shinrin-yoku）被证实可降低压力激素；瀑布水雾带来的负离子让人睡得更沉。',
    points: [
      {
        id: 'u1',
        name: '森林步道口',
        desc: '入口测温，领取徒步手环',
        code: 'XLS-201',
        nav: {
          from: '游客中心',
          meters: 150,
          minutes: 3,
          steps: ['游客中心出发，沿溪流方向走 150 米', '在步道口测温并领取徒步手环'],
        },
      },
      {
        id: 'u2',
        name: '瀑布氧吧',
        desc: '负离子浓度峰值区',
        code: 'XLS-202',
        nav: {
          from: '森林步道口',
          meters: 800,
          minutes: 18,
          steps: ['沿溪流步道深入，一路缓坡', '听到水声后沿栈道绕行，即到瀑布下'],
        },
      },
      {
        id: 'u3',
        name: '露营草坪',
        desc: '可预约帐篷与餐食',
        code: 'XLS-203',
        nav: {
          from: '瀑布氧吧',
          meters: 600,
          minutes: 12,
          steps: ['离开瀑布，沿林间小径向西南', '穿过松林即达草坪，可预约帐篷'],
        },
      },
      {
        id: 'u4',
        name: '星空观测点',
        desc: '光污染极低，银河肉眼可见',
        code: 'XLS-204',
        nav: {
          from: '露营草坪',
          meters: 400,
          minutes: 8,
          steps: ['从草坪沿碎石路缓坡上行', '到山脊开阔处，远离光源适合观星'],
        },
      },
    ],
    requires: ['spring'],
  },
  {
    id: 'autumn',
    season: 'autumn',
    name: '彩林摄影师',
    subtitle: '红叶观赏 · 摄影打卡',
    difficulty: 2,
    duration: '约 2 小时',
    distanceKm: 5,
    cover: { from: '#C97B3D', to: '#F3E0CC' },
    intro:
      '秋霜染过，山体像打翻的调色盘。沿着栈道寻找最佳机位，把彩林、云海与雪峰一次拍全。',
    wellness:
      '专注于取景与构图，是一种天然的"心流"状态，能有效缓解焦虑、提升专注力。',
    points: [
      {
        id: 'a1',
        name: '红叶步道',
        desc: '入口打卡，领取摄影地图',
        code: 'XLS-301',
        nav: {
          from: '游客中心',
          meters: 100,
          minutes: 2,
          steps: ['游客中心出门左转即到红叶步道入口', '在入口打卡并领取摄影地图'],
        },
      },
      {
        id: 'a2',
        name: '摄影观景台',
        desc: '经典机位，建议清晨前往',
        code: 'XLS-302',
        nav: {
          from: '红叶步道',
          meters: 500,
          minutes: 10,
          steps: ['沿红叶步道向上，连续栈道爬升', '到观景台，清晨光线最适合拍摄'],
        },
      },
      {
        id: 'a3',
        name: '彩林谷',
        desc: '层林尽染的纵深山谷',
        code: 'XLS-303',
        nav: {
          from: '摄影观景台',
          meters: 700,
          minutes: 14,
          steps: ['观景台沿山腰步道向谷地方向', '下行一段后进入彩林谷，层林尽染'],
        },
      },
      {
        id: 'a4',
        name: '云海栈道',
        desc: '栈道尽头可眺望主峰',
        code: 'XLS-304',
        nav: {
          from: '彩林谷',
          meters: 600,
          minutes: 12,
          steps: ['穿过彩林谷，沿云海栈道继续走', '栈道尽头可眺望主峰与云海'],
        },
      },
    ],
    requires: ['summer'],
  },
]

export const SEASON_LABEL: Record<string, string> = {
  winter: '冬季',
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
}
