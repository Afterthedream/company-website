import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  upload: {
    enabled: true,
    config: {
      sizeLimit: 256 * 1024 * 1024, // 256MB
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
