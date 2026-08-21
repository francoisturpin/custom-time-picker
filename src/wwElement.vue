<template>
  <div ref="pickerRef" class="ww-time-picker" :class="stateClasses">

    <!-- Hour -->
    <div class="tp-select" :class="{ 'is-open': openDropdown === 'hour', 'is-disabled': content?.readonly }">
      <button
        class="tp-select__btn"
        :disabled="content?.readonly"
        type="button"
        @click.stop="toggleDropdown('hour')"
      >
        {{ isEmpty ? '--' : displayHour }}
        <svg class="tp-select__arrow" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
          <path d="M0 0l5 6 5-6z" fill="currentColor" />
        </svg>
      </button>
      <ul
        v-if="openDropdown === 'hour'"
        ref="hourListRef"
        class="tp-select__list"
        role="listbox"
      >
        <li
          v-for="h in hourOptions"
          :key="h.value"
          class="tp-select__item"
          :class="{ 'is-active': !isEmpty && h.value === displayHour }"
          role="option"
          :aria-selected="!isEmpty && h.value === displayHour"
          @click.stop="selectHour(h.value)"
        >{{ h.label }}</li>
      </ul>
    </div>

    <span class="separator">:</span>

    <!-- Minute -->
    <div class="tp-select" :class="{ 'is-open': openDropdown === 'minute', 'is-disabled': content?.readonly }">
      <button
        class="tp-select__btn"
        :disabled="content?.readonly"
        type="button"
        @click.stop="toggleDropdown('minute')"
      >
        {{ isEmpty ? '--' : displayMinute }}
        <svg class="tp-select__arrow" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
          <path d="M0 0l5 6 5-6z" fill="currentColor" />
        </svg>
      </button>
      <ul
        v-if="openDropdown === 'minute'"
        ref="minuteListRef"
        class="tp-select__list"
        role="listbox"
      >
        <li
          v-for="m in minuteOptions"
          :key="m"
          class="tp-select__item"
          :class="{ 'is-active': !isEmpty && m === displayMinute }"
          role="option"
          :aria-selected="!isEmpty && m === displayMinute"
          @click.stop="selectMinute(m)"
        >{{ m }}</li>
      </ul>
    </div>

    <!-- Period AM/PM — 12h locale only -->
    <div
      v-if="is12h"
      class="tp-select"
      :class="{ 'is-open': openDropdown === 'period', 'is-disabled': content?.readonly }"
    >
      <button
        class="tp-select__btn"
        :disabled="content?.readonly"
        type="button"
        @click.stop="toggleDropdown('period')"
      >
        {{ isEmpty ? '--' : period }}
        <svg class="tp-select__arrow" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
          <path d="M0 0l5 6 5-6z" fill="currentColor" />
        </svg>
      </button>
      <ul
        v-if="openDropdown === 'period'"
        class="tp-select__list"
        role="listbox"
      >
        <li
          v-for="p in ['AM', 'PM']"
          :key="p"
          class="tp-select__item"
          :class="{ 'is-active': !isEmpty && p === period }"
          role="option"
          :aria-selected="!isEmpty && p === period"
          @click.stop="selectPeriod(p)"
        >{{ p }}</li>
      </ul>
    </div>

  </div>
</template>

<script>
import { computed, watch, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

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

    watch(
      () => props.content?.initialValue,
      (newVal) => {
        if (newVal !== undefined) setInternalValue(newVal)
      },
      { immediate: true }
    )

    // — Dropdown state
    const pickerRef     = ref(null)
    const openDropdown  = ref(null)
    const hourListRef   = ref(null)
    const minuteListRef = ref(null)

    // — Derived state
    const isEmpty = computed(() => !internalValue.value)

    const is12h = computed(() => {
      const locale = (props.content?.locale || 'fr').toLowerCase()
      return locale.startsWith('en-us') || locale === 'en'
    })

    const parsed = computed(() => {
      const [h, m] = (internalValue.value || '00:00').split(':')
      return { hours24: parseInt(h, 10) || 0, minutes: parseInt(m, 10) || 0 }
    })

    const period = computed(() => (parsed.value.hours24 >= 12 ? 'PM' : 'AM'))

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

    const minuteOptions = computed(() =>
      Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))
    )

    // — Emit helper
    const emitChange = (hours24, minutes) => {
      const value = `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      setInternalValue(value)
      emit('trigger-event', { name: 'change', event: { value } })
    }

    // — Dropdown controls
    const toggleDropdown = (name) => {
      if (props.content?.readonly) return
      openDropdown.value = openDropdown.value === name ? null : name
    }

    const closeDropdown = () => { openDropdown.value = null }

    // Scroll active item into view when dropdown opens
    watch(openDropdown, async (val) => {
      if (!val) return
      await nextTick()
      const listRef = val === 'hour' ? hourListRef.value : val === 'minute' ? minuteListRef.value : null
      if (listRef) {
        const active = listRef.querySelector('.is-active')
        if (active) active.scrollIntoView({ block: 'nearest' })
      }
    })

    // Close on outside click
    const handleOutsideClick = (e) => {
      if (pickerRef.value && !pickerRef.value.contains(e.target)) closeDropdown()
    }

    onMounted(() => {
      wwLib.getFrontDocument().addEventListener('click', handleOutsideClick)
    })
    onBeforeUnmount(() => {
      wwLib.getFrontDocument().removeEventListener('click', handleOutsideClick)
    })

    // — Selection handlers
    const selectHour = (val) => {
      if (props.content?.readonly) return
      let h = parseInt(val, 10)
      if (is12h.value) {
        if (period.value === 'PM' && h !== 12) h += 12
        if (period.value === 'AM' && h === 12) h = 0
      }
      emitChange(h, parsed.value.minutes)
      closeDropdown()
    }

    const selectMinute = (val) => {
      if (props.content?.readonly) return
      emitChange(parsed.value.hours24, parseInt(val, 10))
      closeDropdown()
    }

    const selectPeriod = (val) => {
      if (props.content?.readonly) return
      let h = parsed.value.hours24
      if (val === 'PM' && h < 12) h += 12
      if (val === 'AM' && h >= 12) h -= 12
      emitChange(h, parsed.value.minutes)
      closeDropdown()
    }

    // — Root state classes.
    // They back the selector-based WeWeb states declared in ww-config.js and gate the
    // optional "filled" overrides: the CSS custom property is only consumed when the
    // matching property is actually set, so an empty value can never produce an
    // invalid declaration.
    const stateClasses = computed(() => ({
      filled:              !isEmpty.value,
      readonly:            !!props.content?.readonly,
      open:                openDropdown.value !== null,
      'has-filled-text':   !!props.content?.filledTextColor,
      'has-filled-border': !!props.content?.filledBorderColor,
    }))

    return {
      isEmpty,
      is12h,
      period,
      displayHour,
      displayMinute,
      hourOptions,
      minuteOptions,
      stateClasses,
      openDropdown,
      pickerRef,
      hourListRef,
      minuteListRef,
      toggleDropdown,
      selectHour,
      selectMinute,
      selectPeriod,
    }
  },
}
</script>

<style scoped>
/* All visual values come from the ww-config.js css() hook as CSS custom properties.
   Every var() carries the same fallback as its property defaultValue. */

.ww-time-picker {
  display: inline-flex;
  align-items: center;
  gap: var(--tp-gap, 6px);
  font-size: var(--tp-font-size, 14px);
}

.ww-time-picker.readonly {
  opacity: 0.6;
}

/* ─── Custom dropdown ─────────────────────────────── */
.tp-select {
  position: relative;
  display: inline-flex;
}

.tp-select__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  font: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  color: var(--tp-placeholder-color, #9ca3af);
  background-color: var(--tp-bg-color, #ffffff);
  border-style: solid;
  border-width: var(--tp-border-width, 1px);
  border-color: var(--tp-border-color, #d1d5db);
  border-radius: var(--tp-border-radius, 6px);
  padding: var(--tp-padding, 6px 10px);
}

.ww-time-picker.filled .tp-select__btn {
  color: var(--tp-text-color, #1a1a1a);
}

.ww-time-picker.filled.has-filled-text .tp-select__btn {
  color: var(--tp-filled-text-color, #1a1a1a);
}

.ww-time-picker.filled.has-filled-border .tp-select__btn {
  border-color: var(--tp-filled-border-color, #d1d5db);
}

.tp-select__btn:focus { outline: none; }
.tp-select__btn:disabled { cursor: not-allowed; }

.tp-select__arrow {
  flex-shrink: 0;
  opacity: 0.45;
  transition: transform 0.15s ease;
}

.tp-select.is-open .tp-select__arrow {
  transform: rotate(180deg);
}

.tp-select__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  list-style: none;
  margin: 0;
  padding: 4px 0;
  min-width: 100%;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  font: inherit;
  letter-spacing: inherit;
  color: var(--tp-text-color, #1a1a1a);
  background-color: var(--tp-bg-color, #ffffff);
  border-style: solid;
  border-width: var(--tp-border-width, 1px);
  border-color: var(--tp-border-color, #d1d5db);
  border-radius: var(--tp-border-radius, 6px);
  scrollbar-width: thin;
  scrollbar-color: var(--tp-accent-color, #3b82f6) transparent;
}

.tp-select__list::-webkit-scrollbar { width: 4px; }
.tp-select__list::-webkit-scrollbar-track { background: transparent; }
.tp-select__list::-webkit-scrollbar-thumb {
  background: var(--tp-accent-color, #3b82f6);
  border-radius: 4px;
}

.tp-select__item {
  padding: 6px 14px;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  font: inherit;
  letter-spacing: inherit;
  transition: background 0.1s;
}

.tp-select__item:hover:not(.is-active) {
  background: rgba(0, 0, 0, 0.05);
}

.tp-select__item.is-active {
  color: var(--tp-accent-color, #3b82f6);
  /* Fallback first, then the accent-derived tint. color-mix() handles any colour
     format, unlike the previous hex + "1a" concatenation which broke on rgba(). */
  background-color: rgba(59, 130, 246, 0.1);
  background-color: color-mix(in srgb, var(--tp-accent-color, #3b82f6) 10%, transparent);
  font-weight: 600;
}

/* ─── Separator ───────────────────────────────────── */
.separator {
  font: inherit;
  letter-spacing: inherit;
  font-weight: bold;
  user-select: none;
  color: var(--tp-separator-color, #1a1a1a);
}
</style>
