/* Apex Pro design tokens -> Tailwind.
   Single canonical config. The four Stitch exports each shipped their own
   near-identical copy; this is the reconciled version they all now share. */
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* surfaces */
        'surface':                  '#111318',
        'surface-dim':              '#111318',
        'surface-bright':           '#37393f',
        'surface-container-lowest': '#0c0e13',
        'surface-container-low':    '#1a1b21',
        'surface-container':        '#1e1f25',
        'surface-container-high':   '#282a2f',
        'surface-container-highest':'#33353a',
        'surface-variant':          '#33353a',
        'surface-charcoal':         '#161922',
        'surface-glass':            'rgba(22, 25, 34, 0.6)',
        'background':               '#111318',
        'void':                     '#0B0D12',

        /* text */
        'on-surface':          '#e2e2e9',
        'on-surface-variant':  '#cdc3d0',
        'on-background':       '#e2e2e9',
        'inverse-surface':     '#e2e2e9',
        'inverse-on-surface':  '#2e3036',
        'outline':             '#968e99',
        'outline-variant':     '#4b444f',

        /* primary — electric purple */
        'primary':                  '#f0daff',
        'on-primary':               '#40215e',
        'primary-container':        '#ddb7ff',
        'on-primary-container':     '#644483',
        'inverse-primary':          '#715090',
        'primary-fixed':            '#f0dbff',
        'primary-fixed-dim':        '#ddb7ff',
        'on-primary-fixed':         '#2a0848',
        'on-primary-fixed-variant': '#583876',
        'surface-tint':             '#ddb7ff',
        'electric':                 '#a855f7',

        /* secondary — vivid orange, reserved for LIVE */
        'secondary':                  '#ffb690',
        'on-secondary':               '#542100',
        'secondary-container':        '#ec6a06',
        'on-secondary-container':     '#4a1c00',
        'secondary-fixed':            '#ffdbca',
        'secondary-fixed-dim':        '#ffb690',
        'on-secondary-fixed':         '#331100',
        'on-secondary-fixed-variant': '#783200',
        'live':                       '#ff6b00',

        /* tertiary */
        'tertiary':                  '#ffddaa',
        'on-tertiary':               '#432c00',
        'tertiary-container':        '#f9bb4d',
        'on-tertiary-container':     '#6e4b00',
        'tertiary-fixed':            '#ffdeac',
        'tertiary-fixed-dim':        '#fabc4e',
        'on-tertiary-fixed':         '#281900',
        'on-tertiary-fixed-variant': '#604100',

        /* error */
        'error':              '#ffb4ab',
        'on-error':           '#690005',
        'error-container':    '#93000a',
        'on-error-container': '#ffdad6',

        /* effects */
        'electric-glow':   'rgba(168, 85, 247, 0.4)',
        'border-subtle':   'rgba(255, 255, 255, 0.1)',
        'glass-highlight': 'rgba(255, 255, 255, 0.05)'
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm:  '0.25rem',
        md:  '0.75rem',
        lg:  '0.5rem',
        xl:  '0.75rem',
        '2xl': '1rem',
        chip: '1rem',
        full: '9999px'
      },
      spacing: {
        'unit':          '4px',
        'gutter':        '32px',
        'margin-desktop':'80px',
        'margin-max':    '120px',
        'section-gap':   '160px',
        'container-max': '1440px'
      },
      maxWidth: {
        'container-max': '1440px'
      },
      /* Anton and Hanken Grotesk are Latin-only. Oswald and Inter sit behind
         them in the stack so Cyrillic keeps the same condensed-display /
         grotesque-body character instead of dropping to a system font.
         JetBrains Mono already ships Cyrillic. */
      fontFamily: {
        'display-hero':       ['Anton', 'Oswald', 'sans-serif'],
        'display-xl':         ['Anton', 'Oswald', 'sans-serif'],
        'headline-lg':        ['Anton', 'Oswald', 'sans-serif'],
        'headline-md':        ['Anton', 'Oswald', 'sans-serif'],
        'headline-lg-mobile': ['Anton', 'Oswald', 'sans-serif'],
        'body-lg':            ['Hanken Grotesk', 'Inter', 'sans-serif'],
        'body-md':            ['Hanken Grotesk', 'Inter', 'sans-serif'],
        'label-caps':         ['JetBrains Mono', 'monospace'],
        'stat-value':         ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'display-hero':       ['96px', { lineHeight: '96px', letterSpacing: '0.02em', fontWeight: '400' }],
        'display-xl':         ['72px', { lineHeight: '72px', letterSpacing: '0.02em', fontWeight: '400' }],
        'headline-lg':        ['48px', { lineHeight: '52px', letterSpacing: '0.03em', fontWeight: '400' }],
        'headline-md':        ['32px', { lineHeight: '36px', letterSpacing: '0.03em', fontWeight: '400' }],
        'headline-lg-mobile': ['32px', { lineHeight: '36px', fontWeight: '400' }],
        'body-lg':            ['20px', { lineHeight: '32px', fontWeight: '400' }],
        'body-md':            ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-caps':         ['14px', { lineHeight: '16px', letterSpacing: '0.12em', fontWeight: '600' }],
        'stat-value':         ['24px', { lineHeight: '28px', fontWeight: '700' }]
      }
    }
  }
};
