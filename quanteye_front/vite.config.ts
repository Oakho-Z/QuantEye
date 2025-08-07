import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: false,
      proxy: {
        // 代理所有 /run_pipeline 路径，保持路径不变，转发到后端
        '/run_pipeline': {
          target: 'http://127.0.0.1:5053',
          changeOrigin: true,
        },
        // 如果你还有其他接口需要代理，比如 /chart_data
        '/performance_tab_chart_data': {
          target: 'http://127.0.0.1:5053',
          changeOrigin: true,
        },
        '/performance_data': {
          target: 'http://127.0.0.1:5053',
          changeOrigin: true,
        },
        '/drawdown_data': {
          target: 'http://127.0.0.1:5053',
          changeOrigin: true,
        },
        '/weekly_market_mood_gauge_data': {
          target: 'http://127.0.0.1:5053',
          changeOrigin: true,
        },
      }
    }
  };
});
