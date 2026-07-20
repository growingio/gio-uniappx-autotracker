import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { gioUniappxAutoTrack } from './uni_modules/gio-uniappx-autotracker/build/vite-plugin.mjs'

export default defineConfig({
  plugins: [
    gioUniappxAutoTrack(),
    uni(),
  ],
})
