/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      opacity: {
        8: '0.08',
        15: '0.15',
        85: '0.85',
      },
      colors: {
        // 品牌色 —— 雪山蓝 · 森林绿 主题
        ink: {
          DEFAULT: '#16302E',
          soft: '#3D5451',
          faint: '#6E807E',
        },
        brand: {
          50: '#EEF5F3',
          100: '#D8E8E4',
          200: '#B2D0CA',
          300: '#7FB0A8',
          400: '#4A8B84',
          500: '#2F6D68',
          600: '#2F5D5A',
          700: '#274C4A',
          800: '#1E3A39',
        },
        snow: {
          50: '#F5F9FB',
          100: '#EAF3F6',
          200: '#D6E6EC',
        },
        forest: '#3E7C59',
        // 四季强调色
        season: {
          spring: '#6FA55A',
          summer: '#3E8BA0',
          autumn: '#C97B3D',
          winter: '#6E93B8',
        },
        amber: '#D98A3D',
        paper: '#F7FAF9',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Microsoft YaHei',
          'Segoe UI',
          'sans-serif',
        ],
        num: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,48,46,.05), 0 8px 24px -12px rgba(22,48,46,.18)',
        lift: '0 2px 4px rgba(22,48,46,.06), 0 16px 40px -16px rgba(22,48,46,.28)',
        glow: '0 0 0 1px rgba(74,139,132,.18), 0 8px 30px -8px rgba(47,93,90,.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'medal-pop': {
          '0%': { transform: 'scale(.5) rotate(-8deg)', opacity: '0' },
          '60%': { transform: 'scale(1.08) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translateY(-120px)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-slide': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ring-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(74,139,132,.35)' },
          '50%': { boxShadow: '0 0 0 10px rgba(74,139,132,0)' },
        },
        'tab-pop': {
          '0%': { transform: 'scale(.6)' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        'count-pop': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'medal-pop': 'medal-pop .6s cubic-bezier(.2,1.4,.4,1) both',
        'float-up': 'float-up 1.6s ease-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        'fade-slide': 'fade-slide .35s ease-out both',
        'ring-pulse': 'ring-pulse 1.8s ease-out infinite',
        'tab-pop': 'tab-pop .32s cubic-bezier(.2,1.4,.4,1) both',
        'count-pop': 'count-pop .4s ease-out both',
      },
    },
  },
  plugins: [],
}
