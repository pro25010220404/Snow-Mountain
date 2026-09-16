// 一次性脚本：从原 H5 的 Icon.vue 提取 stroke 路径，渲染为多色 PNG
// 运行：node scripts/gen-icons.mjs（在 mp/ 目录下）
import { readFileSync } from 'fs'
import { mkdirSync } from 'fs'
import path from 'path'
import sharp from 'sharp'

const src = readFileSync(path.resolve('../src/components/Icon.vue'), 'utf8')

// 提取 ICONS map 中的 name: 'path'
const icons = {}
const re = /'?([a-zA-Z0-9-]+)'?\s*:\s*'([^']*)'/g
let m
while ((m = re.exec(src))) icons[m[1]] = m[2]

const COLORS = {
  ink: '#16302E',
  inkSoft: '#3D5451',
  inkFaint: '#6E807E',
  white: '#FFFFFF',
  brand600: '#2F6D68',
  brand700: '#274C4A',
  brand500: '#2F5D5A',
  brand400: '#4A8B84',
  forest: '#3E7C59',
  amber: '#D98A3D',
  rose500: '#F43F5E',
}

const OUT = 'src/static/icons'

async function main() {
  for (const [name, d] of Object.entries(icons)) {
    for (const [key, color] of Object.entries(COLORS)) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`
      mkdirSync(path.join(OUT, key), { recursive: true })
      await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, key, `${name}.png`))
    }
  }
  console.log(`generated ${Object.keys(icons).length} icons x ${Object.keys(COLORS).length} colors`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
