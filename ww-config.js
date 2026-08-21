export default {
  editor: {
    label: {
      en: 'Time Picker',
    },
    icon: 'clock',
  },

  options: {
    // The root is an inline flex row of selects. Never let the compiler fall back to a
    // block-level display: it would stack the hour / minute / period controls.
    displayAllowedValues: ['inline-flex', 'flex'],
    // The dropdown lists are absolutely positioned and intentionally overflow the root.
    // A root overflow would clip them.
    ignoredStyleProperties: ['overflow'],
  },

  // Selector-based states: CSS matching only, anchored on the component root with `&`.
  // The component owns the classes; no add-state / remove-state runtime events are needed.
  states: [
    { label: 'filled', selector: '&.filled' },
    { label: 'readonly', selector: '&.readonly' },
    { label: 'open', selector: '&.open' },
    { label: 'focus', selector: '&:focus-within' },
  ],

  // CSS renderer hook: runs for every compiled state x breakpoint slot.
  // Values are passed straight through so formulas stay reactive.
  css({ content }) {
    return [
      { property: '--tp-font-size', value: content.fontSize },
      { property: '--tp-gap', value: content.gap },
      { property: '--tp-padding', value: content.padding },
      { property: '--tp-text-color', value: content.textColor },
      { property: '--tp-bg-color', value: content.backgroundColor },
      { property: '--tp-placeholder-color', value: content.placeholderColor },
      { property: '--tp-separator-color', value: content.separatorColor },
      { property: '--tp-accent-color', value: content.accentColor },
      { property: '--tp-filled-border-color', value: content.filledBorderColor },
      { property: '--tp-filled-text-color', value: content.filledTextColor },
      { property: '--tp-border-color', value: content.borderColor },
      { property: '--tp-border-width', value: content.borderWidth },
      { property: '--tp-border-radius', value: content.borderRadius },
    ]
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
    fontSize: {
      label: { en: 'Font size' },
      type: 'Length',
      section: 'style',
      options: {
        unitChoices: [
          { value: 'px', label: 'px', min: 8, max: 72 },
          { value: 'em', label: 'em', min: 0.5, max: 4, step: 0.05 },
          { value: 'rem', label: 'rem', min: 0.5, max: 4, step: 0.05 },
        ],
      },
      responsive: true,
      states: true,
      defaultValue: '14px',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'CSS font-size value, e.g. "14px", "1rem"',
      },
      /* wwEditor:end */
    },

    // — Colors (default state)
    textColor: {
      label: { en: 'Text color' },
      type: 'Color',
      section: 'style',
      responsive: true,
      states: true,
      defaultValue: '#1a1a1a',
      bindable: true,
    },
    backgroundColor: {
      label: { en: 'Background' },
      type: 'Color',
      section: 'style',
      responsive: true,
      states: true,
      defaultValue: '#ffffff',
      bindable: true,
    },
    placeholderColor: {
      label: { en: 'Empty state color' },
      type: 'Color',
      section: 'style',
      responsive: true,
      states: true,
      defaultValue: '#9ca3af',
      bindable: true,
    },
    separatorColor: {
      label: { en: 'Separator color' },
      type: 'Color',
      section: 'style',
      responsive: true,
      states: true,
      defaultValue: '#1a1a1a',
      bindable: true,
    },
    accentColor: {
      label: { en: 'Accent color' },
      type: 'Color',
      section: 'style',
      responsive: true,
      states: true,
      defaultValue: '#3b82f6',
      bindable: true,
    },

    // — Colors (filled state)
    filledBorderColor: {
      label: { en: 'Border color — filled' },
      type: 'Color',
      section: 'style',
      responsive: true,
      states: true,
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
      responsive: true,
      states: true,
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
      responsive: true,
      states: true,
      defaultValue: '#d1d5db',
      bindable: true,
    },
    borderWidth: {
      label: { en: 'Border width' },
      type: 'Length',
      section: 'style',
      responsive: true,
      states: true,
      defaultValue: '1px',
      bindable: true,
    },
    borderRadius: {
      label: { en: 'Border radius' },
      type: 'Length',
      section: 'style',
      responsive: true,
      states: true,
      defaultValue: '6px',
      bindable: true,
    },

    // — Spacing
    // Text rather than Length: the Length control holds a single value + unit and
    // rejects a shorthand such as "6px 10px" with "Value not in the list".
    padding: {
      label: { en: 'Padding' },
      type: 'Text',
      section: 'style',
      responsive: true,
      states: true,
      defaultValue: '6px 10px',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'CSS padding shorthand, e.g. "6px 10px", "8px" or "4px 8px 4px 8px"',
      },
      /* wwEditor:end */
    },
    gap: {
      label: { en: 'Gap' },
      type: 'Length',
      section: 'style',
      responsive: true,
      states: true,
      defaultValue: '6px',
      bindable: true,
    },
  },
}
