import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  upload: {
    enabled: true,
    config: {
      sizeLimit: 256 * 1024 * 1024, // 256MB
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
      // Disable image optimization to fix Windows file lock issue
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
});

export default config;
