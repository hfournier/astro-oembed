import type { AstroConfig, AstroIntegration } from 'astro';
import createEmbedPlugin from './remark-plugin';

export default function oembed(): AstroIntegration[] {
  return [
    {
      name: 'astro-oembed-integration',
      hooks: {
        'astro:config:setup': ({ config, updateConfig }) => {
          checkIntegrationsOrder(config);
          updateConfig({
            markdown: {
              remarkPlugins: [createEmbedPlugin()],
            },
          });
        },
      },
    },
  ];
}

function checkIntegrationsOrder({ integrations }: AstroConfig) {
  const indexOf = (name: string) => integrations.findIndex((i) => i.name === name);
  const mdxIndex = indexOf('@astrojs/mdx');
  const embedIndex = indexOf('astro-oembed-integration');
  if (mdxIndex > -1 && mdxIndex < embedIndex) {
    throw new Error(
      'MDX integration configured before astro-oembed-integration.\n' +
        'Please move `mdx()` after `oembed()` in the `integrations` array in astro.config.mjs.'
    );
  }
}
