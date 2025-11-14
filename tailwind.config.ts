import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/app/**/*.{ts,tsx}',
        './src/components/**/*.{ts,tsx}'
    ],
    theme: {
        extend: {
            fontFamily: {
                pixel: ['"Press Start 2P"', 'monospace']
            }
        }
    },
    plugins: []
}
export default config
