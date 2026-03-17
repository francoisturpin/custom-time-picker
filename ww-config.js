export default {
  editor: {
    label: {
      en: 'Time Picker',
    },
    icon: 'clock',
  },
  properties: {
    locale: {
      label: { en: 'Locale' },
      type: 'Text',
      defaultValue: 'fr',
      bindable: true,
    },
    value: {
      label: { en: 'Value (HH:mm)' },
      type: 'Text',
      defaultValue: '09:00',
      bindable: true,
    },
  },
}
