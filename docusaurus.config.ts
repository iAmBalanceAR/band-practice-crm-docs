import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Add the GitHub theme import
import GithubTheme from 'docusaurus-theme-github-codeblock';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Band Practice CRM',
  tagline: 'Do Music, Not Paperworkk',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.bandpracticecrm.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Serve the docs at the site's root
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        //       editUrl:
        //         'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
      },
        blog: false,
        //  {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          // onInlineTags: 'warn',
          // onInlineAuthors: 'warn',
          // onUntruncatedBlogPosts: 'warn',
        },
       // theme: {
          // customCss: './src/css/custom.css',
          // },
     //   } satisfies Preset.Options,
    ],
  ],

  // Add themes array after presets
  themes: [GithubTheme],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '',
      logo: {
        alt: 'Band Practice CRM',
        src: 'img/logo-top-nav.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          label: 'Documents',
        },
       //{to: '/blog', label: 'Blog', position: 'left'},
        {
         href: 'https://bandpracticecrm.com/',
          label: 'Dashboard',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Band Practice CRM',
          items: [
            {
              label: 'Dashboard',
              href: 'https://bandpracticecrm.com/',
            },
            {
              label: 'Account Home',
              href: 'https://bandpracticecrm.com/account',
            },
            {
              label: 'Pricing',
              href: 'https://bandpracticecrm.com/pricing',
            },
          ],
        }, 
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy Policy',
              href: 'https://bandpracticecrm.com/privacy',
            },
            {
              label: 'Terms of Service',
              href: 'https://bandpracticecrm.com/terms',
            },
            {
              label: 'Cookie Policy',
              href: 'https://bandpracticecrm.com/cookie-policy',
            },
          ],
        },       
          {
          title: 'Follow Us',
          items: [
            {
              label: 'Facebok',
              href: 'https://www.facebook.com/bandpracticecrm',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/bandpracticecrm/',
            },
            {
              label: 'X',
              href: 'https://x.com/bandpracticecrm',
            },
            {
              label: 'Email',
              href: 'mailto:support@bandpracticecrm.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Band Practice CRM..`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.github,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
