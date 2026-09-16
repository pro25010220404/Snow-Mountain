import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind'
// @ts-ignore
import nested from 'tailwindcss/nesting'
import tailwindcss from 'tailwindcss'
import tailwindcssConfig from './tailwind.config.js'
import postcssPresetEnv from 'postcss-preset-env'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        nested(),
        tailwindcss({ config: tailwindcssConfig }),
        postcssPresetEnv({
          stage: 3,
          features: { 'nesting-rules': false },
        }),
      ],
    },
  },
  plugins: [uni(), uniTailwind()],
})
