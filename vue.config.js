const { defineConfig } = require("@vue/cli-service");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const backendProxyConfig = {
  target: 'http://127.0.0.1:8000',
  changeOrigin: true,
  ws: false,
  secure: true
};

const analyticsProxyConfig = {
  target: 'http://127.0.0.1:3000',
  changeOrigin: true,
  ws: false,
  secure: true
};

// Конфигурация Telegram ботов 
const telegramConfig = {
  dev: '7190707372',  // ID бота для разработки
  prod: '8091205117'  // ID бота для продакшена
};

// Определяем текущую команду по аргументам запуска
const isServe = process.argv.some(arg => arg.includes('serve'));
const isBuild = process.argv.some(arg => arg.includes('build'));

// Выбираем ID бота в зависимости от выполняемой команды
const telegramBotId = isServe ? telegramConfig.dev : telegramConfig.prod;

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    host: 'localhost.local',
    port: 80,
    proxy: {
      '^/admin/stats': { ...analyticsProxyConfig, pathRewrite: { '^/admin/stats': '/api/analytics/teams' } },
      '^/api/analytics': { ...analyticsProxyConfig, pathRewrite: { '^/api/analytics': '/api/analytics' } },
      '^/admin/database': { ...backendProxyConfig, pathRewrite: { '^/admin/database': '/admin/database' } },
      '^/api': backendProxyConfig,
      '^/static': backendProxyConfig,
      '^/admin(?!/stats)(?!/database)': { ...backendProxyConfig, pathRewrite: { '^/admin': '/admin' } },
    },
  },
  chainWebpack: config => {
    // Определяем переменные, доступные в коде приложения
    config.plugin('define').tap(args => {
      args[0]['process.env'].VUE_APP_TELEGRAM_BOT_ID = JSON.stringify(telegramBotId);
      return args;
    });
    
    // Добавляем анализатор бандла только для команды build
    if (process.env.NODE_ENV === 'production') {
      config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [{
        analyzerMode: 'static', // Генерировать HTML-отчет
        openAnalyzer: false, // Не открывать отчет автоматически
        reportFilename: '../bundle-report.html' // Имя файла отчета в корне проекта
      }]);
    }
    
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true,
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        },
        webp: {
          quality: 75
        }
      });
    
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    });
  },
  pwa: {
    name: 'HSE RUN',
    themeColor: '#4a90e2',
    msTileColor: '#4a90e2',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      exclude: [/\.map$/, /_redirects/]
    }
  }
});
