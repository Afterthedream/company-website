/**
 * 默认数据 — 当 Strapi 不可用时的回退内容
 * SVG 图标保留在各组件文件中（JSX 无法序列化为纯模块导出）
 */

export const defaultArticles = [
  {
    id: 1,
    title: '公司成功完成某大型湖泊生态修复项目',
    excerpt: '该项目是我司迄今为止承接的最大的湖泊生态修复工程，标志着公司技术实力达到行业领先水平。',
    category: 'company',
    publishedAt: '2025-03-15',
  },
  {
    id: 2,
    title: '公司荣获"水处理行业十大品牌"称号',
    excerpt: '在第十届中国水处理行业峰会上，凭借卓越的技术实力和优质的服务荣获该殊荣。',
    category: 'company',
    publishedAt: '2025-03-10',
  },
  {
    id: 3,
    title: '2025年水处理行业发展趋势分析',
    excerpt: '随着环保政策的日益严格和技术的不断进步，水处理行业正迎来新的发展机遇。',
    category: 'industry',
    publishedAt: '2025-03-05',
  },
]

export const defaultArticlesFull = [
  ...defaultArticles,
  {
    id: 4,
    title: '智慧水务系统助力城市水管理数字化转型',
    excerpt: '公司最新研发的智慧水务系统在某市成功上线，实现了水务管理的智能化和精细化。',
    category: 'company',
    publishedAt: '2025-02-28',
  },
  {
    id: 5,
    title: '新环保政策解读：水处理行业迎来新机遇',
    excerpt: '国家最新发布的环保政策为水处理行业带来了哪些发展机遇？本文将为您详细解读。',
    category: 'industry',
    publishedAt: '2025-02-20',
  },
  {
    id: 6,
    title: '公司技术团队参加国际水处理技术交流会',
    excerpt: '公司技术团队受邀参加在荷兰举办的国际水处理技术交流会，与全球专家共同探讨行业前沿技术。',
    category: 'company',
    publishedAt: '2025-02-15',
  },
]

export const defaultCases = [
  {
    id: 1,
    title: '某市黑臭水体综合治理项目',
    client: '某市水务局',
    industry: '城市水环境',
    description: '针对城区 12 条黑臭河道，采用"截污纳管 + 生态修复 + 智慧监管"三位一体治理方案，历时 18 个月完成治理，水质从劣Ⅴ类提升至Ⅳ类。',
    results: '治理河道 36 公里，消除黑臭水体 12 处，受益人口 80 万',
    date: '2025-08-15',
  },
  {
    id: 2,
    title: '某工业园区废水零排放项目',
    client: '某化工集团',
    industry: '工业废水',
    description: '为化工园区设计零排放处理系统，集成膜浓缩、蒸发结晶等先进技术，实现废水 100% 回用，年节约用水 200 万吨。',
    results: '废水回用率 100%，年节水 200 万吨，减排 COD 500 吨',
    date: '2025-06-20',
  },
  {
    id: 3,
    title: '某县农村污水连片治理项目',
    client: '某县生态环境局',
    industry: '农村污水',
    description: '覆盖 15 个行政村、2.3 万户农户的分散式污水处理项目，采用"一体化设备 + 人工湿地"组合工艺，出水稳定达到一级 A 标准。',
    results: '覆盖 15 个村庄，日处理能力 5000 吨，受益农户 2.3 万户',
    date: '2025-04-10',
  },
  {
    id: 4,
    title: '某水厂提标改造工程',
    client: '某市自来水公司',
    industry: '饮用水安全',
    description: '对日供水 20 万吨的自来水厂进行提标改造，新增臭氧-活性炭深度处理工艺，出厂水达到直饮标准。',
    results: '供水能力提升至 25 万吨/日，水质达标率 100%',
    date: '2025-02-28',
  },
  {
    id: 5,
    title: '某市智慧水务综合管理平台',
    client: '某市水利局',
    industry: '智慧水务',
    description: '建设覆盖全市的智慧水务平台，整合 200+ 监测站点数据，实现水源、水厂、管网全流程智能化管控。',
    results: '接入监测站点 200+ 个，漏损率降低 15%，应急响应提速 60%',
    date: '2024-12-15',
  },
  {
    id: 6,
    title: '某河流域生态修复项目',
    client: '某市生态环境局',
    industry: '生态修复',
    description: '对受损河岸带进行系统性生态修复，重建滨水湿地 50 公顷，恢复生物多样性，打造城市生态廊道。',
    results: '修复河岸 18 公里，新建湿地 50 公顷，鸟类种类增加 30%',
    date: '2024-10-20',
  },
]

export const defaultProducts = [
  {
    id: 'treatment',
    title: '水处理技术',
    description: '先进的水处理工艺，提供从源头到终端的全流程水净化解决方案',
    features: ['物理处理技术', '化学处理技术', '生物处理技术', '膜分离技术'],
  },
  {
    id: 'ecology',
    title: '水生态修复',
    description: '运用生态工程方法，恢复水体自净能力，构建健康的水生态系统',
    features: ['湿地生态修复', '河流生态修复', '湖泊生态修复', '水源地保护'],
  },
  {
    id: 'smart',
    title: '智慧水务',
    description: '融合物联网、大数据技术，实现水务系统的智能化监控与管理',
    features: ['智能监控系统', '数据分析平台', '远程控制系统', '预警预报系统'],
  },
  {
    id: 'monitoring',
    title: '水环境监测',
    description: '建立完善的水环境监测体系，实时掌握水质动态变化',
    features: ['水质在线监测', '水文监测', '污染源监测', '应急监测'],
  },
]

export const defaultSolutions = [
  {
    title: '城市水环境治理',
    description: '为城市黑臭水体、污染河道提供系统性治理方案',
    features: ['黑臭水体治理', '河道生态修复', '雨污分流改造', '初期雨水处理'],
  },
  {
    title: '工业废水处理',
    description: '针对各类工业废水提供定制化处理解决方案',
    features: ['化工废水处理', '电镀废水处理', '印染废水处理', '零排放系统'],
  },
  {
    title: '农村污水治理',
    description: '为农村地区提供分散式、生态化污水处理方案',
    features: ['一体化处理设备', '人工湿地系统', '资源化利用', '智能运维'],
  },
  {
    title: '饮用水安全保障',
    description: '从水源地到水龙头的全流程饮用水安全保障',
    features: ['水源地保护', '水厂提标改造', '管网水质保障', '二次供水改造'],
  },
  {
    title: '智慧水务建设',
    description: '运用物联网、大数据技术实现水务智能化',
    features: ['在线监测系统', '智能调度系统', '应急指挥系统', '移动应用平台'],
  },
]

export const defaultCompany = {
  name: '四川沧杰荇科技有限公司',
  description: '四川沧杰荇科技有限公司是专业的水利水务数字化解决方案服务商，以先进的水利信息化技术为驱动，为客户提供专业、高效的解决方案，助力实现水资源的科学管理与可持续利用。',
  vision: '以水为脉，以智为器，以服为桥 —— 让每一滴水都被精准守护，每一项水治理都可持续',
  mission: '致力于水利信息化领域的科技创新，为水利行业提供智能化、数字化的服务，推动水资源管理迈向新高度。',
  values: '团结 共建 努力 共赢',
  phone: '028-86045168',
  email: '742035754@qq.com',
  address: '成都市双流区新通大道777号2栋1单元1203号',
  mapLongitude: 104.098072,
  mapLatitude: 30.524227,
  mapAddress: '成都市双流区新通大道777号2栋1单元1203号',
  establishedYear: '2025',
  projectCount: 10,
}
