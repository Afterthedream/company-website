import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io', 'https://cangjiexing.oss-cn-chengdu.aliyuncs.com'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io', 'https://cangjiexing.oss-cn-chengdu.aliyuncs.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io', 'https://cangjiexing.oss-cn-chengdu.aliyuncs.com'],
          'default-src': ["'self'", "'unsafe-inline'"],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '256mb',
      jsonLimit: '256mb',
      textLimit: '256mb',
      formidable: {
        maxFileSize: 256 * 1024 * 1024, // 256MB
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
