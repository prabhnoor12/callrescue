<template>
  <div class="space-y-8 pb-16 max-w-5xl">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2 text-xs text-slate-400 mb-1">
          <router-link to="/" class="hover:text-white">← Call Radar</router-link>
          <span>/</span>
          <span class="text-amber-400 font-medium">Speed-to-Lead Rules</span>
        </div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight font-display">Speed-to-Lead & Trigger Rules</h1>
        <p class="text-xs text-slate-400">
          Configure automated missed-call auto-responders, human typing delays, and website chat-to-SMS bridges.
        </p>
      </div>

      <button
        @click="saveRules"
        class="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition-all self-start sm:self-auto active:scale-95"
      >
        <Save class="w-4 h-4" />
        <span>{{ savedToast ? '✓ Rules Saved!' : 'Save Automation Rules' }}</span>
      </button>
    </div>

    <!-- RULE 1: 4-SECOND MISSED-CALL SMS AUTO-RESPONDER -->
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <Zap class="w-4 h-4 text-amber-400" />
            <span>Rule #1: 4-Second Instant Missed-Call SMS Engine</span>
          </h3>
          <p class="text-xs text-slate-400">Fires when telecom detects unanswered or busy line</p>
        </div>

        <!-- Human Delay Selector -->
        <div class="flex items-center space-x-2 text-xs">
          <span class="text-slate-400">Typing Delay:</span>
          <div class="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              v-for="d in [0, 3, 5]"
              :key="d"
              @click="rules.instant_missed_call.delay_seconds = d"
              class="px-2.5 py-1 rounded-lg font-mono font-bold transition-all text-xs"
              :class="rules.instant_missed_call.delay_seconds === d ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'"
            >
              {{ d === 0 ? 'Instant (0s)' : `${d}s Delay` }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left: Template Editors -->
        <div class="space-y-4 text-xs">
          <!-- Business Hours Template -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="font-bold uppercase tracking-wider text-slate-300 text-[10px]">Business Hours SMS Copy</label>
              <span class="text-[10px] text-emerald-400 font-mono">Active (08:00 - 18:00)</span>
            </div>
            <textarea
              v-model="rules.instant_missed_call.business_hours_template"
              rows="3"
              class="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
            ></textarea>
            <!-- Token Insert Buttons -->
            <div class="flex items-center gap-1.5 flex-wrap text-[10px]">
              <span class="text-slate-400">Tokens:</span>
              <button
                v-for="token in ['{caller_name}', '{staff_name}', '{business_name}', '{booking_link}']"
                :key="token"
                @click="rules.instant_missed_call.business_hours_template += ` ${token}`"
                class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-mono hover:border-slate-700"
              >
                {{ token }}
              </button>
            </div>
          </div>

          <!-- After-Hours Template -->
          <div class="space-y-1.5 pt-2">
            <div class="flex items-center justify-between">
              <label class="font-bold uppercase tracking-wider text-slate-300 text-[10px]">After-Hours & Weekend SMS Copy</label>
              <span class="text-[10px] text-indigo-400 font-mono">Active (Nights & Sun)</span>
            </div>
            <textarea
              v-model="rules.instant_missed_call.after_hours_template"
              rows="3"
              class="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Right: Real-Time Phone Preview -->
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Simulated Caller Screen</span>
              <span class="text-[10px] text-emerald-400 font-mono font-bold">● SMS Delivered</span>
            </div>

            <!-- Phone SMS Bubble -->
            <div class="space-y-2 pt-2">
              <div class="text-[10px] text-center text-slate-400 font-mono">Today 12:41 PM</div>
              <div class="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed shadow-lg">
                {{ renderedPreview }}
              </div>
            </div>
          </div>

          <div class="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span class="flex items-center space-x-1 text-emerald-400">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>Stops 85% of callers from calling competitors</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- RULE 2: WEBSITE CHAT-TO-SMS WIDGET -->
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <MessageSquare class="w-4 h-4 text-cyan-400" />
            <span>Rule #2: Website Chat-to-SMS Floating Lead Bubble</span>
          </h3>
          <p class="text-xs text-slate-400">Converts website visitors into mobile text conversations with your front desk</p>
        </div>

        <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Widget Active
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div class="space-y-3">
          <div>
            <label class="block font-medium text-slate-300 mb-1">Widget Headline</label>
            <input
              v-model="rules.webchat_widget.headline"
              type="text"
              class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label class="block font-medium text-slate-300 mb-1">Lead Capture Fields</label>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label class="flex items-center space-x-2 text-slate-300">
                <input type="checkbox" checked disabled class="rounded text-amber-500" />
                <span>Customer Mobile Phone (Mandatory SMS Destination)</span>
              </label>
              <label class="flex items-center space-x-2 text-slate-300">
                <input type="checkbox" checked disabled class="rounded text-amber-500" />
                <span>Customer First & Last Name</span>
              </label>
              <label class="flex items-center space-x-2 text-slate-300">
                <input type="checkbox" checked disabled class="rounded text-amber-500" />
                <span>Inquiry / Appointment Message</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Live Widget Mockup -->
        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-center items-end space-y-3">
          <div class="w-full max-w-xs p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-3">
            <div class="flex items-center space-x-2 pb-2 border-b border-slate-800">
              <div class="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <div>
                <p class="font-bold text-white text-xs">{{ rules.webchat_widget.headline }}</p>
                <p class="text-[10px] text-emerald-400">Replies typically in 2 mins</p>
              </div>
            </div>
            <div class="space-y-2">
              <input type="text" placeholder="Your Name" disabled class="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400" />
              <input type="tel" placeholder="Mobile Phone (for SMS reply)" disabled class="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400" />
              <button disabled class="w-full py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs">Text Me An Answer</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RULE 3: URGENT KEYWORD PRIORITY ESCALATION -->
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <AlertCircle class="w-4 h-4 text-rose-400" />
            <span>Rule #3: Urgent Keyword Emergency Escalation</span>
          </h3>
          <p class="text-xs text-slate-400">When incoming SMS contains high-stakes keywords, immediately alert on-call doctor or lead technician</p>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <span
          v-for="kw in rules.urgent_keywords"
          :key="kw.word"
          class="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold flex items-center space-x-2"
        >
          <span class="text-rose-400">"{{ kw.word }}"</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold" :class="kw.priority === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'">
            {{ kw.priority }}
          </span>
        </span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useCallRescueStore } from '../stores/callrescue'
import {
  Zap,
  Save,
  CheckCircle2,
  MessageSquare,
  AlertCircle
} from 'lucide-vue-next'

const store = useCallRescueStore()
const savedToast = ref(false)

const rules = reactive({
  instant_missed_call: { ...store.automationRules.instant_missed_call },
  webchat_widget: { ...store.automationRules.webchat_widget },
  urgent_keywords: [...store.automationRules.urgent_keywords]
})

const renderedPreview = computed(() => {
  return rules.instant_missed_call.business_hours_template
    .replace('{caller_name}', 'David')
    .replace('{staff_name}', 'Sarah')
    .replace('{business_name}', store.selectedClient.business_name)
    .replace('{booking_link}', 'https://book.apexleadgrowth.com/studio')
})

function saveRules() {
  store.updateRules({ ...rules })
  savedToast.value = true
  setTimeout(() => {
    savedToast.value = false
  }, 2500)
}
</script>
