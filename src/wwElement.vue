<template>
  <div class="ww-time-picker" :style="rootStyle">
    <!-- Placeholder display when no value is set -->
    <template v-if="isEmpty">
      <span class="ww-time-picker__placeholder" :style="placeholderStyle">
        {{ content?.placeholder || '--:--' }}
      </span>
      <!-- Hidden selects to allow interaction and break out of placeholder state -->
      <select
        class="ww-time-picker__ghost"
        :disabled="content?.readonly"
        @change="onHourChange"
        :required="content?.required"
      >
        <option value="" disabled selected />
        <option v-for="h in hourOptions" :key="h.value" :value="h.value">
          {{ h.label }}
        </option>
      </select>
    </template>

    <!-- Normal display when a value is set -->
    <template v-else>
      <select
        :value="displayHour"
        :disabled="content?.readonly"
        :required="content?.required"
        :style="selectStyle"
        @change="onHourChange"
      >
        <option v-for="h in hourOptions" :key="h.value" :value="h.value">
          {{ h.label }}
        </option>
      </select>

      <span class="separator" :style="separatorStyle">:</span>

      <select
        :value="displayMinute"
        :disabled="content?.readonly"
        :style="selectStyle"
        @change="onMinuteChange"
      >
        <option v-for="m in minuteOptions" :key="m" :value="m">
          {{ m }}
        </option>
      </select>

      <select
        v-if="is12h"
        :value="period"
        :disabled="content?.readonly"
        :style="selectStyle"
        @change="onPeriodChange"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </template>
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
        defaultValue: props.content?.initialValue || '',
      })

    // Sync when initialValue binding changes
    watch(
      () => props.content?.initialValue,
      (newVal) => {
        if (newVal !== undefined) setInternalValue(newVal)
      },
      { immediate: true }
    )

    // — State: is the field empty (placeholder mode)?
    const isEmpty = computed(() => !internalValue.value)

    // — Helpers
    const is12h = computed(() => {
      const locale = (props.content?.locale || 'fr').toLowerCase()
      return locale.startsWith('en-us') || locale === 'en'
    })

    const parsed = computed(() => {
      const raw = internalValue.value || '00:00'
      const [h, m] = raw.split(':')
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
      if (props.content?.readonly) return
      let h = parseInt(e.target.value, 10)
      if (is12h.value) {
        if (period.value === 'PM' && h !== 12) h += 12
        if (period.value === 'AM' && h === 12) h = 0
      }
      emitChange(h, parsed.value.minutes)
    }

    const onMinuteChange = (e) => {
      if (props.content?.readonly) return
      emitChange(parsed.value.hours24, parseInt(e.target.value, 10))
    }

    const onPeriodChange = (e) => {
      if (props.content?.readonly) return
      let h = parsed.value.hours24
      if (e.target.value === 'PM' && h < 12) h += 12
      if (e.target.value === 'AM' && h >= 12) h -= 12
      emitChange(h, parsed.value.minutes)
    }

    // — Typography: merge WeWeb typography binding with fallback colors/border
    const fontStyle = computed(() => {
      const typo = props.content?.typography
      if (typo) return typo
      return {}
    })

    // — Styles
    const rootStyle = computed(() => ({
      gap: props.content?.gap || '6px',
      opacity: props.content?.readonly ? 0.6 : 1,
    }))

    const selectStyle = computed(() => ({
      ...fontStyle.value,
      color: props.content?.textColor || '#1a1a1a',
      backgroundColor: props.content?.backgroundColor || '#ffffff',
      border: `${props.content?.borderWidth || '1px'} solid ${props.content?.borderColor || '#d1d5db'}`,
      borderRadius: props.content?.borderRadius || '6px',
      padding: props.content?.padding || '6px 10px',
    }))

    const separatorStyle = computed(() => ({
      color: props.content?.separatorColor || '#1a1a1a',
      ...(fontStyle.value.fontSize ? { fontSize: fontStyle.value.fontSize } : {}),
      ...(fontStyle.value.fontWeight ? { fontWeight: fontStyle.value.fontWeight } : {}),
      ...(fontStyle.value.fontFamily ? { fontFamily: fontStyle.value.fontFamily } : {}),
    }))

    const placeholderStyle = computed(() => ({
      ...fontStyle.value,
      color: props.content?.placeholderColor || '#9ca3af',
    }))

    return {
      isEmpty,
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
      placeholderStyle,
    }
  },
}
</script>

<style scoped>
.ww-time-picker {
  display: inline-flex;
  align-items: center;
  position: relative;
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

.ww-time-picker select:disabled {
  cursor: not-allowed;
}

.separator {
  font-weight: bold;
  user-select: none;
}

/* Placeholder: visible text overlaid, ghost select invisible but interactive */
.ww-time-picker__placeholder {
  pointer-events: none;
}

.ww-time-picker__ghost {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  border: none;
  background: transparent;
}
</style>
