export default {
  editor: {
    label: {
      en: 'Time Picker',
    },
    icon: 'clock',
  },
  triggerEvents: [
    {
      name: 'change',
      label: { en: 'On change' },
      event: { value: '' },
      default: true,
    },
  ],
  properties: {
    // — Data
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
      defaultValue: '09:00',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Time string in HH:mm format, e.g. "09:00"',
      },
      /* wwEditor:end */
    },

    // — Typography
    fontFamily: {
      label: { en: 'Font family' },
      type: 'Text',
      section: 'style',
      defaultValue: 'inherit',
      bindable: true,
    },
    fontSize: {
      label: { en: 'Font size' },
      type: 'Length',
      section: 'style',
      defaultValue: '14px',
      bindable: true,
    },
    fontWeight: {
      label: { en: 'Font weight' },
      type: 'TextSelect',
      section: 'style',
      options: {
        options: [
          { value: '300', label: 'Light' },
          { value: '400', label: 'Regular' },
          { value: '500', label: 'Medium' },
          { value: '600', label: 'Semi-bold' },
          { value: '700', label: 'Bold' },
        ],
      },
      defaultValue: '400',
      bindable: true,
    },

    // — Colors
    textColor: {
      label: { en: 'Text color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#1a1a1a',
      bindable: true,
    },
    backgroundColor: {
      label: { en: 'Background color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
    },
    separatorColor: {
      label: { en: 'Separator color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#1a1a1a',
      bindable: true,
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
