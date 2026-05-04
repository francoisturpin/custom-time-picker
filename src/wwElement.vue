<template>
  <div ref="pickerRef" class="ww-time-picker" :class="stateClasses" :style="rootStyle">

    <!-- ─── Placeholder state ─────────────────────────────────────── -->
    <template v-if="isEmpty">
      <span class="ww-time-picker__placeholder" :style="placeholderStyle">
        {{ content?.placeholder || '--:--' }}
      </span>
      <button
        class="ww-time-picker__ghost-btn"
        :disabled="content?.readonly"
        type="button"
        aria-label="Select time"
        @click="activateFromPlaceholder"
      />
    </template>

    <!-- ─── Filled state ──────────────────────────────────────────── -->
    <template v-else>

      <!-- Hour -->
      <div class="tp-select" :class="{ 'is-open': openDropdown === 'hour', 'is-disabled': content?.readonly }">
        <button
          class="tp-select__btn"
          :style="selectStyle"
          :disabled="content?.readonly"
          type="button"
          @click.stop="toggleDropdown('hour')"
        >
          {{ displayHour }}
          <svg class="tp-select__arrow" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
            <path d="M0 0l5 6 5-6z" fill="currentColor" />
          </svg>
        </button>
        <ul
          v-if="openDropdown === 'hour'"
          ref="hourListRef"
          class="tp-select__list"
          :style="listStyle"
          role="listbox"
        >
          <li
            v-for="h in hourOptions"
            :key="h.value"
            class="tp-select__item"
            :class="{ 'is-active': h.value === displayHour }"
            :style="h.value === displayHour ? activeItemStyle : {}"
            role="option"
            :aria-selected="h.value === displayHour"
            @click.stop="selectHour(h.value)"
          >{{ h.label }}</li>
        </ul>
      </div>

      <span class="separator" :style="separatorStyle">:</span>

      <!-- Minute -->
      <div class="tp-select" :class="{ 'is-open': openDropdown === 'minute', 'is-disabled': content?.readonly }">
        <button
          class="tp-select__btn"
          :style="selectStyle"
          :disabled="content?.readonly"
          type="button"
          @click.stop="toggleDropdown('minute')"
        >
          {{ displayMinute }}
          <svg class="tp-select__arrow" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
            <path d="M0 0l5 6 5-6z" fill="currentColor" />
          </svg>
        </button>
        <ul
          v-if="openDropdown === 'minute'"
          ref="minuteListRef"
          class="tp-select__list"
          :style="listStyle"
          role="listbox"
        >
          <li
            v-for="m in minuteOptions"
            :key="m"
            class="tp-select__item"
            :class="{ 'is-active': m === displayMinute }"
            :style="m === displayMinute ? activeItemStyle : {}"
            role="option"
            :aria-selected="m === displayMinute"
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
          :style="selectStyle"
          :disabled="content?.readonly"
          type="button"
          @click.stop="toggleDropdown('period')"
        >
          {{ period }}
          <svg class="tp-select__arrow" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
            <path d="M0 0l5 6 5-6z" fill="currentColor" />
          </svg>
        </button>
        <ul
          v-if="openDropdown === 'period'"
          class="tp-select__list"
          :style="listStyle"
          role="listbox"
        >
          <li
            v-for="p in ['AM', 'PM']"
            :key="p"
            class="tp-select__item"
            :class="{ 'is-active': p === period }"
            :style="p === period ? activeItemStyle : {}"
            role="option"
            :aria-selected="p === period"
            @click.stop="selectPeriod(p)"
          >{{ p }}</li>
        </ul>
      </div>

    </template>
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
    const pickerRef = ref(null)
    const openDropdown = ref(null)
    const hourListRef = ref(null)
    const minuteListRef = ref(null)

    // — Derived state
    const isEmpty = computed(() => !internalValue.value)

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

    const closeDropdown = () => {
      openDropdown.value = null
    }

    const activateFromPlaceholder = () => {
      if (props.content?.readonly) return
      emitChange(0, 0)
      nextTick(() => { openDropdown.value = 'hour' })
    }

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
      if (pickerRef.value && !pickerRef.value.contains(e.target)) {
        closeDropdown()
      }
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

    // — Typography: extract only valid CSS properties from WeWeb typography object
    const fontStyle = computed(() => {
      const typo = props.content?.typography
      if (!typo) return {}
      const css = {}
      if (typo.fontFamily)     css.fontFamily    = typo.fontFamily
      if (typo.fontSize)       css.fontSize      = typo.fontSize
      if (typo.fontWeight)     css.fontWeight    = typo.fontWeight
      if (typo.fontStyle)      css.fontStyle     = typo.fontStyle
      if (typo.lineHeight)     css.lineHeight    = typo.lineHeight
      if (typo.letterSpacing)  css.letterSpacing = typo.letterSpacing
      if (typo.textTransform)  css.textTransform = typo.textTransform
      if (typo.textDecoration) css.textDecoration = typo.textDecoration
      return css
    })

    // — State classes (expose state to WeWeb wrapper + CSS)
    const stateClasses = computed(() => ({
      filled: !isEmpty.value,
      readonly: !!props.content?.readonly,
    }))

    // — Styles
    const rootStyle = computed(() => ({
      gap: props.content?.gap || '6px',
      opacity: props.content?.readonly ? 0.6 : 1,
    }))

    const selectStyle = computed(() => {
      const filled = !isEmpty.value
      const borderColor = (filled && props.content?.filledBorderColor) || props.content?.borderColor || '#d1d5db'
      const textColor   = (filled && props.content?.filledTextColor)   || props.content?.textColor   || '#1a1a1a'
      return {
        ...fontStyle.value,
        color:           textColor,
        backgroundColor: props.content?.backgroundColor || '#ffffff',
        border:          `${props.content?.borderWidth || '1px'} solid ${borderColor}`,
        borderRadius:    props.content?.borderRadius || '6px',
        padding:         props.content?.padding || '6px 10px',
      }
    })

    const separatorStyle = computed(() => ({
      color: props.content?.separatorColor || '#1a1a1a',
      ...(fontStyle.value.fontSize   ? { fontSize:   fontStyle.value.fontSize }   : {}),
      ...(fontStyle.value.fontWeight ? { fontWeight: fontStyle.value.fontWeight } : {}),
      ...(fontStyle.value.fontFamily ? { fontFamily: fontStyle.value.fontFamily } : {}),
    }))

    const placeholderStyle = computed(() => ({
      ...fontStyle.value,
      color: props.content?.placeholderColor || '#9ca3af',
    }))

    const listStyle = computed(() => ({
      ...fontStyle.value,
      color: props.content?.textColor || '#1a1a1a',
      backgroundColor: props.content?.backgroundColor || '#ffffff',
      border: `${props.content?.borderWidth || '1px'} solid ${props.content?.borderColor || '#d1d5db'}`,
      borderRadius: props.content?.borderRadius || '6px',
    }))

    const activeItemStyle = computed(() => {
      const accent = props.content?.accentColor || '#3b82f6'
      return {
        color: accent,
        backgroundColor: `${accent}1a`,
        fontWeight: '600',
      }
    })

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
      activateFromPlaceholder,
      selectHour,
      selectMinute,
      selectPeriod,
      rootStyle,
      selectStyle,
      separatorStyle,
      placeholderStyle,
      listStyle,
      activeItemStyle,
    }
  },
}
</script>

<style scoped>
.ww-time-picker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
  border: none;
  background: none;
  font: inherit;
  line-height: inherit;
  /* visual styling comes from :style binding */
}

.tp-select__btn:focus {
  outline: none;
}

.tp-select__btn:disabled {
  cursor: not-allowed;
}

.tp-select__arrow {
  flex-shrink: 0;
  opacity: 0.45;
  transition: transform 0.15s ease;
}

.is-open .tp-select__arrow {
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
  scrollbar-width: thin;
  scrollbar-color: #096B70 transparent;
}

.tp-select__list::-webkit-scrollbar {
  width: 4px;
}

.tp-select__list::-webkit-scrollbar-track {
  background: transparent;
}

.tp-select__list::-webkit-scrollbar-thumb {
  background: #096B70;
  border-radius: 4px;
}

.tp-select__item {
  padding: 6px 14px;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  transition: background 0.1s;
}

.tp-select__item:hover:not(.is-active) {
  background: rgba(0, 0, 0, 0.05);
}

/* ─── Separator ───────────────────────────────────── */
.separator {
  font-weight: bold;
  user-select: none;
}

/* ─── Placeholder ─────────────────────────────────── */
.ww-time-picker__placeholder {
  pointer-events: none;
}

.ww-time-picker__ghost-btn {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  border: none;
  background: transparent;
}

.ww-time-picker__ghost-btn:disabled {
  cursor: not-allowed;
}
</style>
