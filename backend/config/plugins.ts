import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  // const isProduction = env('NODE_ENV') === 'production';

  // 暂时统一使用本地存储（开发环境）
  // TODO: 正式部署时启用阿里云 OSS
  return {
    upload: {
      enabled: true,
      config: {
        sizeLimit: 256 * 1024 * 1024,
        security: {
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
        },
        imageOptimization: {
          sharp: {
            jpeg: null,
            png: null,
            webp: null,
            gif: null,
          },
        },
      },
    },
  };

  // 生产环境：阿里云 OSS（暂时注释）
  /*
  if (isProduction) {
    return {
      upload: {
        enabled: true,
        config: {
          sizeLimit: 256 * 1024 * 1024,
          provider: 'strapi-provider-upload-oss',
          providerOptions: {
            accessKeyId: env('OSS_ACCESS_KEY_ID'),
            accessKeySecret: env('OSS_ACCESS_KEY_SECRET'),
            region: env('OSS_REGION'),
            bucket: env('OSS_BUCKET'),
            secure: true,
            endpoint: env('OSS_ENDPOINT'),
            baseUrl: env('OSS_BASE_URL'),
          },
          security: {
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
          },
          imageOptimization: {
            sharp: {
              jpeg: null,
              png: null,
              webp: null,
              gif: null,
            },
          },
        },
      },
    };
  }
  */
};

export default config;