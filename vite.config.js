import { defineConfig } from 'vite'
import plainTextPlugin from 'vite-plugin-plain-text'

export default defineConfig({
	base: '/newton-fractal/',
	plugins: [
		plainTextPlugin(/\.(frag|vert)$/),
	],
});
