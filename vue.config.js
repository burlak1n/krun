const { defineConfig } = require("@vue/cli-service");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

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
  prod: '7817626564'  // ID бота для продакшена
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

      // Добавляем сжатие gzip для снижения размера файлов
      config.plugin('compression').use(CompressionPlugin, [{
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240, // Сжимать файлы больше 10KB
        minRatio: 0.8
      }]);
    }
    
    // Оптимизация изображений
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true,
        mozjpeg: {
          progressive: true,
          quality: 60 // Снижаем качество для уменьшения размера
        },
        optipng: {
          enabled: true, // Включаем оптимизацию PNG
          optimizationLevel: 7
        },
        pngquant: {
          quality: [0.60, 0.80], // Снижаем качество
          speed: 4
        },
        gifsicle: {
          interlaced: false,
          optimizationLevel: 3
        },
        webp: {
          quality: 70 // Снижаем качество WebP
        },
        svgo: {
          plugins: [
            { removeViewBox: false },
            { removeEmptyAttrs: true },
            { removeEmptyText: true }
          ]
        }
      });

    // Улучшенная оптимизация бандлов для снижения дублирования
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
          maxSize: 500000 // Ограничиваем размер вендорных бандлов
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
          maxSize: 300000
        },
        // Отдельный бандл для PrimeVue компонентов
        primevue: {
          name: 'chunk-primevue',
          test: /[\\/]node_modules[\\/]primevue[\\/]/,
          priority: -5,
          chunks: 'all'
        }
      }
    });

    // Оптимизация для снижения размера CSS
    config.optimization.minimize(true);
    
    // Кэширование для ускорения сборки
    config.cache({
      type: 'filesystem',
      buildDependencies: {
        config: [__filename]
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
      exclude: [/\.map$/, /_redirects/],
      // Кэшируем только статику и справочники
      runtimeCaching: [
        {
          urlPattern: /\/static\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-files',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 дней
            }
          }
        },
        {
          urlPattern: /\/reference\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'reference-files',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60 // 1 день
            }
          }
        },
        {
          urlPattern: /\/config\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'config-files',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 12 * 60 * 60 // 12 часов
            }
          }
        },
        {
          urlPattern: /\/img\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 дней
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-all',
            expiration: {
              maxEntries: 300,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 дней
            }
          }
        },
        {
          urlPattern: /\.(?:css)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'css-files',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 7 * 24 * 60 * 60 // 7 дней
            }
          }
        },
        {
          urlPattern: /\.(?:js)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'js-files',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 7 * 24 * 60 * 60 // 7 дней
            }
          }
        },
        {
          urlPattern: /^https:\/\/technoquestcroc\.ru\/.*\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'external-images',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 дней
            }
          }
        },
        {
          urlPattern: /^https:\/\/technoquestcroc\.ru\/.*\.(?:css)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'external-css',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 7 * 24 * 60 * 60 // 7 дней
            }
          }
        },
        {
          urlPattern: /^https:\/\/technoquestcroc\.ru\/.*\.(?:js)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'external-js',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 7 * 24 * 60 * 60 // 7 дней
            }
          }
        }
      ]
    }
  }
});
