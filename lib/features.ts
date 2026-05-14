export type FeatureKey =
  | 'ARTICLES'
  | 'MUSIC'
  | 'COURSES'
  | 'WEBAPPS'
  | 'GAMES'
  | 'TOOLS'
  | 'PRICING'
  | 'MEMBERS';

export interface FeatureConfig {
  key: FeatureKey;
  label: string;
  labelZh: string;
  route: string;
  enabled: boolean;
  icon: string;
}

const FEATURES: FeatureConfig[] = [
  { key: 'ARTICLES', label: 'Articles', labelZh: '壹·深度文章', route: '/articles', enabled: true, icon: '壹' },
  { key: 'MUSIC', label: 'Music', labelZh: '贰·原创音乐', route: '/music', enabled: false, icon: '贰' },
  { key: 'COURSES', label: 'Courses', labelZh: '叁·视频课程', route: '/courses', enabled: false, icon: '叁' },
  { key: 'WEBAPPS', label: 'Web Apps', labelZh: '肆·网页应用', route: '/webapps', enabled: false, icon: '肆' },
  { key: 'GAMES', label: 'Games', labelZh: '伍·创意游戏', route: '/games', enabled: false, icon: '伍' },
];

export function isFeatureEnabled(key: FeatureKey): boolean {
  if (key === 'ARTICLES') return true;
  return process.env[`NEXT_PUBLIC_FEATURE_${key}`] === 'true';
}

export function getEnabledFeatures(): FeatureConfig[] {
  return FEATURES.filter(f => isFeatureEnabled(f.key));
}

export function getAllFeatures(): FeatureConfig[] {
  return FEATURES;
}
