<template>
  <div class="ww-time-picker" :style="rootStyle">
    <select :value="displayHour" @change="onHourChange" :style="selectStyle">
      <option v-for="h in hourOptions" :key="h.value" :value="h.value">
        {{ h.label }}
      </option>
    </select>

    <span class="separator" :style="separatorStyle">:</span>

    <select :value="displayMinute" @change="onMinuteChange" :style="selectStyle">
      <option v-for="m in minuteOptions" :key="m" :value="m">
        {{ m }}
      </option>
    </select>

    <select v-if="is12h" :value="period" @change="onPeriodChange" :style="selectStyle">
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
</template>

<script>
import { computed, watch } from 'vue'

export default {
  name: 'CustomTimePicker',

  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },

  emits: ['trigger-event'],

  setup(props, { emit }) {
    // — Internal variable exposed to NoCode users
    const { value: internalValue, setValue: setInternalValue } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: 'value',
        type: 'string',
        defaultValue: props.content?.initialValue || '09:00',
      })

    // Sync when initialValue binding changes
    watch(
      () => props.content?.initialValue,
      (newVal) => {
        if (newVal !== undefined) setInternalValue(newVal)
      },
      { immediate: true }
    )

    // — Helpers
    const is12h = computed(() => {
      const locale = (props.content?.locale || 'fr').toLowerCase()
      return locale.startsWith('en-us') || locale === 'en'
    })

    const parsed = computed(() => {
      const [h, m] = (internalValue.value || '09:00').split(':')
      return {
        hours24: parseInt(h, 10) || 0,
        minutes: parseInt(m, 10) || 0,
      }
    })

    const period = computed(() =>
      parsed.value.hours24 >= 12 ? 'PM' : 'AM'
    )

    const displayHour = computed(() => {
      if (!is12h.value) return String(parsed.value.hours24).padStart(2, '0')
      const h = parsed.value.hours24 % 12
      return String(h === 0 ? 12 : h).padStart(2, '0')
    })

    const displayMinute = computed(() =>
      String(parsed.value.minutes).padStart(2, '0')
    )

    const hourOptions = computed(() => {
      if (is12h.value) {
        return Array.from({ length: 12 }, (_, i) => {
          const v = String(i + 1).padStart(2, '0')
          return { value: v, label: v }
        })
      }
      return Array.from({ length: 24 }, (_, i) => {
        const v = String(i).padStart(2, '0')
        return { value: v, label: v }
      })
    })

    // Steps of 5 minutes
    const minuteOptions = computed(() =>
      Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))
    )

    // — Emit helper
    const emitChange = (hours24, minutes) => {
      const value = `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      setInternalValue(value)
      emit('trigger-event', { name: 'change', event: { value } })
    }

    const onHourChange = (e) => {
      let h = parseInt(e.target.value, 10)
      if (is12h.value) {
        if (period.value === 'PM' && h !== 12) h += 12
        if (period.value === 'AM' && h === 12) h = 0
      }
      emitChange(h, parsed.value.minutes)
    }

    const onMinuteChange = (e) => {
      emitChange(parsed.value.hours24, parseInt(e.target.value, 10))
    }

    const onPeriodChange = (e) => {
      let h = parsed.value.hours24
      if (e.target.value === 'PM' && h < 12) h += 12
      if (e.target.value === 'AM' && h >= 12) h -= 12
      emitChange(h, parsed.value.minutes)
    }

    // — Styles
    const rootStyle = computed(() => ({
      gap: props.content?.gap || '6px',
    }))

    const selectStyle = computed(() => ({
      fontFamily: props.content?.fontFamily || 'inherit',
      fontSize: props.content?.fontSize || '14px',
      fontWeight: props.content?.fontWeight || '400',
      color: props.content?.textColor || '#1a1a1a',
      backgroundColor: props.content?.backgroundColor || '#ffffff',
      border: `${props.content?.borderWidth || '1px'} solid ${props.content?.borderColor || '#d1d5db'}`,
      borderRadius: props.content?.borderRadius || '6px',
      padding: props.content?.padding || '6px 10px',
    }))

    const separatorStyle = computed(() => ({
      color: props.content?.separatorColor || '#1a1a1a',
      fontWeight: props.content?.fontWeight || '400',
      fontSize: props.content?.fontSize || '14px',
      fontFamily: props.content?.fontFamily || 'inherit',
    }))

    return {
      is12h,
      period,
      displayHour,
      displayMinute,
      hourOptions,
      minuteOptions,
      onHourChange,
      onMinuteChange,
      onPeriodChange,
      rootStyle,
      selectStyle,
      separatorStyle,
    }
  },
}
</script>

<style scoped>
.ww-time-picker {
  display: inline-flex;
  align-items: center;
}

.ww-time-picker select {
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.ww-time-picker select:focus {
  outline: none;
  box-shadow: none;
}

.separator {
  font-weight: bold;
  user-select: none;
}
</style>
