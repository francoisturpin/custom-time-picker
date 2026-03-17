<template>
  <div class="ww-time-picker">
    <select :value="displayHour" @change="onHourChange">
      <option v-for="h in hourOptions" :key="h.value" :value="h.value">
        {{ h.label }}
      </option>
    </select>

    <span class="separator">:</span>

    <select :value="displayMinute" @change="onMinuteChange">
      <option v-for="m in minuteOptions" :key="m" :value="m">
        {{ m }}
      </option>
    </select>

    <select v-if="is12h" :value="period" @change="onPeriodChange">
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'CustomTimePicker',

  props: {
    content: { type: Object, required: true },
  },

  emits: ['trigger-event', 'update:content.value'],

  computed: {
    is12h() {
      const locale = (this.content.locale || 'fr').toLowerCase()
      return locale.startsWith('en-us') || locale === 'en'
    },

    // Parse HH:mm → { hours24, minutes }
    parsed() {
      const [h, m] = (this.content.value || '09:00').split(':')
      return {
        hours24: parseInt(h, 10) || 0,
        minutes: parseInt(m, 10) || 0,
      }
    },

    period() {
      return this.parsed.hours24 >= 12 ? 'PM' : 'AM'
    },

    displayHour() {
      if (!this.is12h) return String(this.parsed.hours24).padStart(2, '0')
      const h = this.parsed.hours24 % 12
      return String(h === 0 ? 12 : h).padStart(2, '0')
    },

    displayMinute() {
      return String(this.parsed.minutes).padStart(2, '0')
    },

    hourOptions() {
      if (this.is12h) {
        return Array.from({ length: 12 }, (_, i) => {
          const v = i + 1
          return { value: String(v).padStart(2, '0'), label: String(v).padStart(2, '0') }
        })
      }
      return Array.from({ length: 24 }, (_, i) => {
        const v = String(i).padStart(2, '0')
        return { value: v, label: v }
      })
    },

    minuteOptions() {
      return Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
    },
  },

  methods: {
    emit(hours24, minutes) {
      const value = `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      this.$emit('trigger-event', {
        name: 'change',
        event: { value },
      })
    },

    onHourChange(e) {
      let h = parseInt(e.target.value, 10)
      if (this.is12h) {
        if (this.period === 'PM' && h !== 12) h += 12
        if (this.period === 'AM' && h === 12) h = 0
      }
      this.emit(h, this.parsed.minutes)
    },

    onMinuteChange(e) {
      this.emit(this.parsed.hours24, parseInt(e.target.value, 10))
    },

    onPeriodChange(e) {
      let h = this.parsed.hours24
      if (e.target.value === 'PM' && h < 12) h += 12
      if (e.target.value === 'AM' && h >= 12) h -= 12
      this.emit(h, this.parsed.minutes)
    },
  },
}
</script>

<style scoped>
.ww-time-picker {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.separator {
  font-weight: bold;
}
</style>
