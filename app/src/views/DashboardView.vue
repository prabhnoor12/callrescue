<template>
  <div class="space-y-8 pb-16">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2 text-xs text-slate-400 mb-1">
          <span class="text-amber-400 font-medium">Call Radar & Recovery Feed</span>
          <span>/</span>
          <span>Live Inbound Intercept</span>
        </div>
        <div class="flex items-center space-x-3">
          <h1 class="text-3xl font-extrabold text-white tracking-tight font-display">Speed-to-Lead Call Radar</h1>
          <!-- Client Selector Dropdown -->
          <select
            v-if="!store.clientPortalViewMode"
            v-model="store.selectedClientId"
            class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option v-for="c in store.clients" :key="c.id" :value="c.id">
              {{ c.business_name }} ({{ c.industry }})
            </option>
          </select>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          Detects unanswered phone calls and fires personalized 2-way SMS in under 4 seconds to capture leads before they call competitors.
        </p>
      </div>

      <!-- Live Sync Status Pill -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-slate-300">Carrier Bridge:</span>
          <span class="font-bold text-white font-mono">{{ store.selectedClient.carrier_forwarding_number }}</span>
        </div>
      </div>
    </div>

    <!-- 4 KPI SCORECARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Calls Rescued -->
      <div class="glass-panel p-5 rounded-2xl border border-slate-800">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">Missed Calls Rescued</span>
          <PhoneCall class="w-4 h-4 text-amber-400" />
        </div>
        <div class="flex items-baseline space-x-2">
          <span class="text-3xl font-black text-white font-display">{{ store.selectedClient.calls_rescued_month }}</span>
          <span class="text-xs text-slate-400">/ {{ store.selectedClient.total_missed_calls }}</span>
        </div>
        <p class="text-[11px] text-emerald-400 font-semibold mt-2">
          {{ store.selectedClient.rescue_rate }}% rescue conversion rate
        </p>
      </div>

      <!-- Revenue Saved -->
      <div class="glass-panel p-5 rounded-2xl border border-slate-800">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">Estimated Revenue Preserved</span>
          <DollarSign class="w-4 h-4 text-emerald-400" />
        </div>
        <div class="flex items-baseline space-x-2">
          <span class="text-3xl font-black text-emerald-400 font-display">${{ store.selectedClient.revenue_saved_month.toLocaleString() }}</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">
          Calculated at avg ${{ Math.round(store.selectedClient.revenue_saved_month / store.selectedClient.calls_rescued_month) }} client LTV
        </p>
      </div>

      <!-- Average Speed-to-Lead Latency -->
      <div class="glass-panel p-5 rounded-2xl border border-slate-800">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">Speed-to-Lead Latency</span>
          <Zap class="w-4 h-4 text-amber-400" />
        </div>
        <div class="flex items-baseline space-x-2">
          <span class="text-3xl font-black text-white font-display">{{ store.selectedClient.avg_latency_sec }}s</span>
          <span class="text-xs text-emerald-400 font-bold">Lightning</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">
          SMS auto-dispatched within 4-second SLA
        </p>
      </div>

      <!-- Monthly Retainer -->
      <div class="glass-panel p-5 rounded-2xl border border-slate-800">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">Monthly Retainer</span>
          <ShieldCheck class="w-4 h-4 text-orange-400" />
        </div>
        <div class="flex items-baseline space-x-2">
          <span class="text-3xl font-black text-white font-display">${{ store.selectedClient.monthly_retainer }}</span>
          <span class="text-xs text-slate-400">/mo</span>
        </div>
        <p class="text-[11px] text-amber-400 mt-2 font-medium">
          Auto-charges on {{ store.selectedClient.next_billing }}
        </p>
      </div>
    </div>

    <!-- LIVE RADAR SWEEP INTERACTIVE CALLOUT -->
    <div class="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-slate-900/60 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center space-x-5">
        <div class="relative w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <Radio class="w-8 h-8 animate-pulse text-amber-400" />
          <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
          </span>
        </div>
        <div>
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <span>24/7 Missed-Call Intercept Engine Active</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live & Monitoring
            </span>
          </h3>
          <p class="text-xs text-slate-300 mt-1 max-w-xl">
            When <strong class="text-white">{{ store.selectedClient.business_name }}</strong> line is busy or unanswered, telecom forwarding automatically routes the caller ID here, immediately triggering the personalized speed-to-lead text.
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3 shrink-0">
        <router-link
          to="/automations"
          class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
        >
          Tune SMS Prompt
        </router-link>
        <button
          @click="quickSimulate"
          class="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition-all active:scale-95"
        >
          <Zap class="w-4 h-4 text-slate-950" />
          <span>Test Live Call Rescue</span>
        </button>
      </div>
    </div>

    <!-- LIVE INBOUND CALL FEED TABLE -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <span>Live Intercepted Call Activity Stream</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Real-Time
            </span>
          </h3>
          <p class="text-xs text-slate-400">
            Real-time feed of missed calls intercepted and automated SMS conversations.
          </p>
        </div>

        <router-link
          to="/inbox"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <MessageSquare class="w-3.5 h-3.5 text-amber-400" />
          <span>Open Full SMS Inbox</span>
        </router-link>
      </div>

      <!-- Feed Table -->
      <div class="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-slate-950/60">
                <th class="py-3 px-4">Caller / Time</th>
                <th class="py-3 px-4">Speed-to-Lead SLA</th>
                <th class="py-3 px-4">Instant SMS Dispatched</th>
                <th class="py-3 px-4">Customer Response</th>
                <th class="py-3 px-4">Recovery Status</th>
                <th class="py-3 px-4 text-right">Est. Value</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr
                v-for="call in store.calls"
                :key="call.id"
                class="hover:bg-slate-900/40 transition-colors"
              >
                <!-- Caller & Time -->
                <td class="py-3.5 px-4">
                  <div class="font-bold text-white">{{ call.caller_name }}</div>
                  <div class="text-[11px] font-mono text-slate-400">{{ call.caller_phone }}</div>
                  <div class="text-[10px] text-slate-400">{{ call.time_ago }}</div>
                </td>

                <!-- SLA Latency -->
                <td class="py-3.5 px-4">
                  <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                    <Zap class="w-3 h-3 text-amber-400" />
                    <span>{{ call.latency_sec }}s auto-reply</span>
                  </span>
                </td>

                <!-- Instant SMS Sent -->
                <td class="py-3.5 px-4 max-w-xs">
                  <p class="text-[11px] text-slate-300 line-clamp-2 font-mono">
                    "{{ call.auto_sms }}"
                  </p>
                </td>

                <!-- Customer Response -->
                <td class="py-3.5 px-4 max-w-xs">
                  <p v-if="call.customer_reply" class="text-[11px] text-emerald-300 font-medium line-clamp-2">
                    "{{ call.customer_reply }}"
                  </p>
                  <span v-else class="text-slate-400 text-[10px]">Awaiting customer reply...</span>
                </td>

                <!-- Status -->
                <td class="py-3.5 px-4">
                  <span
                    v-if="call.status === 'booked'"
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center space-x-1"
                  >
                    <span>✓ Appointment Booked</span>
                  </span>
                  <span
                    v-else-if="call.status === 'rescued'"
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 inline-flex items-center space-x-1"
                  >
                    <span>✓ Lead Rescued</span>
                  </span>
                  <span
                    v-else
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center space-x-1 animate-pulse"
                  >
                    <span>💬 In Conversation</span>
                  </span>
                </td>

                <!-- Estimated Value -->
                <td class="py-3.5 px-4 font-mono font-bold text-emerald-400 text-right">
                  +${{ call.estimated_value }}
                </td>

                <!-- Action -->
                <td class="py-3.5 px-4 text-right">
                  <router-link
                    to="/inbox"
                    class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors border border-slate-700"
                  >
                    Reply SMS
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCallRescueStore } from '../stores/callrescue'
import {
  PhoneCall,
  DollarSign,
  Zap,
  ShieldCheck,
  Radio,
  MessageSquare
} from 'lucide-vue-next'

const store = useCallRescueStore()

function quickSimulate() {
  const result = store.simulateIncomingMissedCall()
  alert(`⚡ MISSED CALL RESCUED IN ${result.latency_sec} SECONDS!\n\nCaller: ${result.caller_name}\nPhone: ${result.caller_phone}\n\nAutomated SMS Sent:\n"${result.auto_sms}"\n\nCustomer Replied:\n"${result.customer_reply}"\n\nValue Preserved: +$${result.estimated_value}`)
}
</script>
