export default {
  editor: {
    label: {
      en: 'Time Picker',
    },
    icon: 'clock',
  },

  states: ['filled', 'readonly'],

  triggerEvents: [
    {
      name: 'change',
      label: { en: 'On change' },
      event: { value: '' },
      default: true,
    },
  ],

  properties: {
    // — Settings
    locale: {
      label: { en: 'Locale' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'fr',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Locale string, e.g. "fr", "en", "en-US"',
      },
      /* wwEditor:end */
    },
    initialValue: {
      label: { en: 'Initial value (HH:mm)' },
      type: 'Text',
      section: 'settings',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Time string in HH:mm format, e.g. "09:00". Leave empty to show placeholder.',
      },
      /* wwEditor:end */
    },
    placeholder: {
      label: { en: 'Placeholder' },
      type: 'Text',
      section: 'settings',
      defaultValue: '--:--',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text shown when no time is selected',
      },
      /* wwEditor:end */
    },
    required: {
      label: { en: 'Required' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Mark field as required in a form container',
      },
      /* wwEditor:end */
    },
    readonly: {
      label: { en: 'Read only' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Prevent the user from changing the value',
      },
      /* wwEditor:end */
    },

    // — Typography
    typography: {
      label: { en: 'Typography' },
      type: 'Typography',
      section: 'style',
      bindable: true,
    },

    // — Colors (default state)
    textColor: {
      label: { en: 'Text color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#1a1a1a',
      bindable: true,
    },
    backgroundColor: {
      label: { en: 'Background' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
    },
    placeholderColor: {
      label: { en: 'Placeholder color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#9ca3af',
      bindable: true,
    },
    separatorColor: {
      label: { en: 'Separator color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#1a1a1a',
      bindable: true,
    },
    accentColor: {
      label: { en: 'Accent color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#3b82f6',
      bindable: true,
    },

    // — Colors (filled state)
    filledBorderColor: {
      label: { en: 'Border color — filled' },
      type: 'Color',
      section: 'style',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Border color when a time value is selected. Leave empty to use the default border color.',
      },
      /* wwEditor:end */
    },
    filledTextColor: {
      label: { en: 'Text color — filled' },
      type: 'Color',
      section: 'style',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text color when a time value is selected. Leave empty to use the default text color.',
      },
      /* wwEditor:end */
    },

    // — Border
    borderColor: {
      label: { en: 'Border color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#d1d5db',
      bindable: true,
    },
    borderWidth: {
      label: { en: 'Border width' },
      type: 'Length',
      section: 'style',
      defaultValue: '1px',
      bindable: true,
    },
    borderRadius: {
      label: { en: 'Border radius' },
      type: 'Length',
      section: 'style',
      defaultValue: '6px',
      bindable: true,
    },

    // — Spacing
    padding: {
      label: { en: 'Padding' },
      type: 'Length',
      section: 'style',
      defaultValue: '6px 10px',
      bindable: true,
    },
    gap: {
      label: { en: 'Gap' },
      type: 'Length',
      section: 'style',
      defaultValue: '6px',
      bindable: true,
    },
  },
}
