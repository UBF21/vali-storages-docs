import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  plugins: [
    // Fix: webpack-dev-server v5 injects webpack/hot/dev-server as an entry,
    // but module.hot is not available in Docusaurus's webpack 5 setup, causing
    // an uncaught error. NormalModuleReplacementPlugin intercepts the module
    // at resolution time and replaces it with a safe shim.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (() => ({
      name: 'webpack-hmr-shim',
      configureWebpack(_config: unknown, isServer: boolean) {
        if (isServer) return undefined;
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const webpack = require('webpack');
        return {
          plugins: [
            new webpack.NormalModuleReplacementPlugin(
              /webpack[/\\]hot[/\\]dev-server/,
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              require.resolve('./src/webpack-hmr-shim.js'),
            ),
          ],
        };
      },
    })) as any,
  ],

  title: 'Vali-Storages',
  tagline: '// browser storage, encrypted and typed.',
  favicon: 'img/favicon.ico',

  url: 'https://ubf21.github.io',
  baseUrl: '/',

  organizationName: 'UBF21',
  projectName: 'vali-storages',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  trailingSlash: false,

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap',
      type: 'text/css',
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeConfigs: {
      en: { label: 'English', direction: 'ltr', htmlLang: 'en' },
      es: { label: 'Español', direction: 'ltr', htmlLang: 'es' },
    },
  },

  markdown: { format: 'mdx' },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: 'https://github.com/UBF21/vali-storages/tree/main/',
          showLastUpdateTime: false,
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo.png',
    metadata: [
      { name: 'robots', content: 'index, follow' },
      { name: 'theme-color', content: '#2563EB' },
      { name: 'keywords', content: 'TypeScript, npm, browser storage, localStorage, sessionStorage, AES encryption, TTL, typed storage, vali-storages' },
      { name: 'author', content: 'Felipe Montenegro' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Vali-Storages' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@vali_storages' },
    ],
    colorMode: { defaultMode: 'dark', respectPrefersColorScheme: true },
    navbar: {
      title: 'Vali-Storages',
      logo: {
        alt: 'Vali-Storages',
        src: 'img/logo.png',
        srcDark: 'img/logo-dark.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        { type: 'localeDropdown', position: 'right' },
        {
          href: 'https://www.npmjs.com/package/vali-storages',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/UBF21/vali-storages',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Introduction', to: '/docs/intro' },
            { label: 'Getting Started', to: '/docs/getting-started' },
            { label: 'API Reference', to: '/docs/api-reference' },
            { label: 'Migration', to: '/docs/migration' },
            { label: 'Changelog', to: '/docs/changelog' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'npm', href: 'https://www.npmjs.com/package/vali-storages' },
            { label: 'GitHub', href: 'https://github.com/UBF21/vali-storages' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Vali-Valid', href: 'https://github.com/UBF21/vali-valid' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Vali-Storages Contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
