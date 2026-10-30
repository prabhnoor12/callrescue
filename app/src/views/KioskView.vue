<template>
  <div class="min-h-[85vh] flex items-center justify-center p-4">
    <!-- PIN LOCK SCREEN -->
    <div
      v-if="isLocked"
      class="glass-panel w-full max-w-sm p-8 rounded-3xl border border-slate-800 text-center space-y-6 shadow-2xl animate-fade-in"
    >
      <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
        <Lock class="w-8 h-8" />
      </div>

      <div>
        <h2 class="text-xl font-bold text-white tracking-tight">Front-Desk Kiosk Lock</h2>
        <p class="text-xs text-slate-400 mt-1">Enter 4-digit staff PIN to unlock receptionist speed-to-lead queue</p>
      </div>

      <div class="space-y-4">
        <div class="flex justify-center space-x-3">
          <input
            v-for="(_, index) in 4"
            :key="index"
            :ref="el => pinInputs[index] = el"
            v-model="pinDigits[index]"
            type="password"
            maxlength="1"
            class="w-12 h-14 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono text-2xl text-white focus:outline-none focus:border-amber-500 shadow-inner"
            @input="handlePinInput(index, $event)"
            @keydown.backspace="handlePinBackspace(index, $event)"
          />
        </div>

        <p v-if="pinError" class="text-xs font-bold text-rose-400 animate-shake">
          Incorrect PIN. (Default demo PIN is 1234)
        </p>

        <button
          @click="unlockWithDemoPin"
          class="text-[11px] text-slate-400 hover:text-amber-400 underline font-mono"
        >
          Quick Unlock (Demo: 1234)
        </button>
      </div>
    </div>

    <!-- UNLOCKED FRONT-DESK RECEPTION KIOSK -->
    <div
      v-else
      class="w-full max-w-3xl glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl animate-fade-in"
    >
      <!-- Kiosk Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div class="flex items-center space-x-3">
          <div
            class="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-950 font-bold shadow-md"
            :style="{ backgroundColor: store.agency.brand_color || '#f59e0b' }"
          >
            <PhoneCall class="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 class="text-lg font-bold text-white">{{ store.selectedClient.business_name }}</h1>
            <p class="text-xs text-amber-400 font-medium">Front-Desk Lead Recovery & SMS Dispatch Terminal</p>
          </div>
        </div>

        <button
          @click="lockKiosk"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700 self-start sm:self-auto"
        >
          <Lock class="w-3.5 h-3.5" />
          <span>Lock Kiosk</span>
        </button>
      </div>

      <!-- RAPID MANUAL TEXT PUNCH -->
      <div class="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <span class="font-bold text-white uppercase tracking-wider text-[11px]">Dispatch Immediate SMS to Caller</span>
          <span class="text-[10px] text-emerald-400 font-mono">⚡ 1-Tap Send</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold uppercase tracking-wider text-slate-400 mb-1 text-[10px]">Caller First & Last Name</label>
            <input
              v-model="kioskForm.name"
              type="text"
              placeholder="e.g. David Vance"
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label class="block font-bold uppercase tracking-wider text-slate-400 mb-1 text-[10px]">Mobile Phone Number (SMS)</label>
            <input
              v-model="kioskForm.phone"
              type="tel"
              placeholder="+1 (415) 555-0192"
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label class="block font-bold uppercase tracking-wider text-slate-400 mb-1 text-[10px]">Message Template</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              v-for="t in [
                { id: 'missed', label: '⚡ Missed Call Followup', text: 'Hey there! We saw you called our desk. How can we help you right now?' },
                { id: 'booking', label: '📅 Direct Booking Link', text: 'Hey! Here is our direct booking calendar to reserve your slot: https://book.apexleadgrowth.com/studio' },
                { id: 'directions', label: '📍 Office Directions', text: 'We are located at 450 Sutter St, Suite 800 with validated parking.' }
              ]"
              :key="t.id"
              @click="selectedTemplate = t.text"
              class="p-2 rounded-xl text-left border transition-all text-xs"
              :class="selectedTemplate === t.text ? 'bg-amber-500/10 border-amber-500/40 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'"
            >
              <p class="font-bold">{{ t.label }}</p>
            </button>
          </div>
        </div>

        <button
          @click="dispatchKioskSms"
          class="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-98 flex items-center justify-center space-x-2"
        >
          <Send class="w-4 h-4 text-slate-950" />
          <span>Dispatch Instant SMS</span>
        </button>

        <p v-if="smsSentToast" class="text-xs text-emerald-400 text-center font-bold animate-fade-in">
          ✓ Text message dispatched! Logged to the Speed-to-Lead feed.
        </p>
      </div>

      <!-- RECENT CALL FEED -->
      <div class="space-y-3 pt-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-white uppercase tracking-wider text-[10px]">Recent Unanswered Calls Queue</span>
          <span class="text-slate-400 font-mono text-[10px]">Last 2 Hours</span>
        </div>

        <div class="space-y-2">
          <div
            v-for="call in store.calls.slice(0, 3)"
            :key="call.id"
            class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
          >
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-bold text-white">{{ call.caller_name }}</span>
                <span class="font-mono text-slate-400 text-[11px]">{{ call.caller_phone }}</span>
                <span class="text-[10px] text-amber-400 font-mono">({{ call.latency_sec }}s auto-text)</span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ call.customer_reply || 'Awaiting customer response...' }}</p>
            </div>
            <div class="shrink-0 text-right">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Rescued
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useCallRescueStore } from '../stores/callrescue'
import {
  Lock,
  PhoneCall,
  Send
} from 'lucide-vue-next'

const store = useCallRescueStore()

const isLocked = ref(true)
const pinDigits = reactive(['', '', '', ''])
const pinInputs = reactive([])
const pinError = ref(false)
const smsSentToast = ref(false)

const kioskForm = reactive({
  name: '',
  phone: ''
})

const selectedTemplate = ref('Hey there! We saw you called our desk. How can we help you right now?')

function handlePinInput(index, event) {
  const val = event.target.value
  pinDigits[index] = val ? val.slice(-1) : ''
  pinError.value = false

  if (val && index < 3) {
    nextTick(() => {
      const nextInput = pinInputs[index + 1]
      if (nextInput) nextInput.focus()
    })
  }

  if (pinDigits.every(d => d !== '')) {
    checkPin()
  }
}

function handlePinBackspace(index, event) {
  if (!pinDigits[index] && index > 0) {
    nextTick(() => {
      const prevInput = pinInputs[index - 1]
      if (prevInput) prevInput.focus()
    })
  }
}

function checkPin() {
  const entered = pinDigits.join('')
  if (entered === '1234') {
    isLocked.value = false
    pinError.value = false
  } else {
    pinError.value = true
    pinDigits[0] = ''
    pinDigits[1] = ''
    pinDigits[2] = ''
    pinDigits[3] = ''
    nextTick(() => {
      if (pinInputs[0]) pinInputs[0].focus()
    })
  }
}

function unlockWithDemoPin() {
  pinDigits[0] = '1'
  pinDigits[1] = '2'
  pinDigits[2] = '3'
  pinDigits[3] = '4'
  checkPin()
}

function lockKiosk() {
  isLocked.value = true
  pinDigits[0] = ''
  pinDigits[1] = ''
  pinDigits[2] = ''
  pinDigits[3] = ''
}

function dispatchKioskSms() {
  if (!kioskForm.name || !kioskForm.phone) {
    alert('Please enter caller name and phone number.')
    return
  }
  store.simulateIncomingMissedCall(kioskForm.name, kioskForm.phone)
  smsSentToast.value = true
  kioskForm.name = ''
  kioskForm.phone = ''
  setTimeout(() => {
    smsSentToast.value = false
  }, 3000)
}
</script>
