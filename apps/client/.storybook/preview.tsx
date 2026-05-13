import '../src/index.css';
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: 'todo' },
  },
  globalTypes: {
    direction: {
      name: 'Direction',
      description: 'Text direction',
      defaultValue: 'rtl',
      toolbar: {
        icon: 'transfer',
        items: [
          { value: 'rtl', title: 'RTL (فارسی)' },
          { value: 'ltr', title: 'LTR (English)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const dir = (context.globals.direction as 'rtl' | 'ltr') ?? 'rtl';
      return (
        <div dir={dir} lang={dir === 'rtl' ? 'fa' : 'en'}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
