<template>
  <div class="space-y-8 pb-16">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2 text-xs text-slate-400 mb-1">
          <router-link to="/" class="hover:text-white">← Call Radar</router-link>
          <span>/</span>
          <span class="text-amber-400 font-medium">Agency Retainers & Billing</span>
        </div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight font-display">Client Retainer & Billing Hub</h1>
        <p class="text-xs text-slate-400">
          Track recurring speed-to-lead software retainers collected from client businesses and manage your agency wholesale license.
        </p>
      </div>

      <!-- Stripe Connect Status Pill -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-slate-300">Stripe Connect:</span>
          <span class="font-bold text-white font-mono">Active (Charges Enabled)</span>
        </div>
      </div>
    </div>

    <!-- Revenue & Profit Margin KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Client Retainers MRR -->
      <div class="glass-panel p-5 rounded-2xl border border-slate-800">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">Agency Client MRR</span>
          <DollarSign class="w-4 h-4 text-emerald-400" />
        </div>
        <div class="flex items-baseline space-x-2">
          <span class="text-3xl font-black text-white font-display">${{ store.totalMonthlyRetainers }}</span>
          <span class="text-xs text-emerald-400 font-bold">/mo</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">
          Collected across {{ store.clients.length }} client business retainers
        </p>
      </div>

      <!-- Net Monthly Profit -->
      <div class="glass-panel p-5 rounded-2xl border border-slate-800">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">Agency Net Profit</span>
          <TrendingUp class="w-4 h-4 text-amber-400" />
        </div>
        <div class="flex items-baseline space-x-2">
          <span class="text-3xl font-black text-amber-400 font-display">+${{ Math.max(0, store.totalMonthlyRetainers - store.billing.agencySubscription.price) }}</span>
          <span class="text-xs text-slate-400">/mo</span>
        </div>
        <p class="text-[11px] text-emerald-400 font-semibold mt-2">
          +90% net margin after wholesale license
        </p>
      </div>

      <!-- Stripe Payout Balance -->
      <div class="glass-panel p-5 rounded-2xl border border-slate-800">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">Stripe Balance Ready</span>
          <CreditCard class="w-4 h-4 text-orange-400" />
        </div>
        <div class="flex items-baseline space-x-2">
          <span class="text-3xl font-black text-white font-display">${{ store.billing.stripeConnect.balance_available.toLocaleString() }}</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">
          Next automatic bank transfer: Tomorrow
        </p>
      </div>

      <!-- Agency SaaS License -->
      <div class="glass-panel p-5 rounded-2xl border border-slate-800">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider">CallRescue License</span>
          <CheckCircle2 class="w-4 h-4 text-amber-400" />
        </div>
        <div class="flex items-baseline space-x-2">
          <span class="text-3xl font-black text-white font-display">${{ store.billing.agencySubscription.price }}</span>
          <span class="text-xs text-slate-400">/mo</span>
        </div>
        <p class="text-[11px] text-amber-400 mt-2 font-medium">
          {{ store.billing.agencySubscription.locations_used }} / {{ store.billing.agencySubscription.locations_included }} Locations Used
        </p>
      </div>
    </div>

    <!-- MILESTONE EXPANSION TRIGGER NOTIFICATION -->
    <div class="glass-panel p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-start space-x-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <TrendingUp class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
            <span>Retainer Milestone Expansion Trigger</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
              Action Recommended
            </span>
          </p>
          <p class="text-slate-300 text-[11px] mt-0.5">
            <strong class="text-white">Dr. Robert Dental Studio</strong> rescued 42 missed calls this month ($16,800 in preserved patient revenue). Ready for 24/7 AI Emergency After-Hours Voice Bot Retainer Upgrade (+$100/mo MRR).
          </p>
        </div>
      </div>
      <button
        @click="triggerMilestoneUpgrade"
        class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 self-start sm:self-auto"
      >
        Send 1-Click Upgrade Proposal
      </button>
    </div>

    <!-- SECTION 1: CLIENT RETENTION SUBSCRIPTIONS (Clients -> Agency) -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <span>Client Monthly Retainers (Stripe Connect)</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Auto-Charge Active
            </span>
          </h3>
          <p class="text-xs text-slate-400">
            Clients pay your agency automatically via credit card every month for missed-call protection & two-way SMS.
          </p>
        </div>

        <button
          @click="showPaymentLinkModal = true"
          class="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md self-start sm:self-auto"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Generate Client Checkout Link</span>
        </button>
      </div>

      <!-- Retainers Table -->
      <div class="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-slate-950/60">
                <th class="py-3 px-4">Business / Client</th>
                <th class="py-3 px-4">Industry Niche</th>
                <th class="py-3 px-4">Monthly Fee</th>
                <th class="py-3 px-4">Payment Method</th>
                <th class="py-3 px-4">Subscription Status</th>
                <th class="py-3 px-4">Next Renewal</th>
                <th class="py-3 px-4 text-right">Actions / Dunning</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr
                v-for="sub in store.billing.clientRetainers"
                :key="sub.client_id"
                class="hover:bg-slate-900/40 transition-colors"
              >
                <!-- Client Name -->
                <td class="py-3.5 px-4 font-bold text-white">
                  {{ sub.client_name }}
                </td>

                <!-- Industry -->
                <td class="py-3.5 px-4 text-slate-300">
                  <span class="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px]">
                    {{ store.clients.find(c => c.id === sub.client_id)?.industry || 'Professional Services' }}
                  </span>
                </td>

                <!-- Monthly Fee -->
                <td class="py-3.5 px-4 font-mono font-bold text-white text-sm">
                  ${{ sub.monthly_fee.toFixed(2) }}
                  <span class="text-[10px] text-slate-400 font-normal">/mo</span>
                </td>

                <!-- Card -->
                <td class="py-3.5 px-4 font-mono text-slate-300">
                  <span class="text-slate-400">{{ sub.card_brand }}</span> •••• {{ sub.card_last4 }}
                </td>

                <!-- Status -->
                <td class="py-3.5 px-4">
                  <span
                    v-if="sub.status === 'paid'"
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center space-x-1"
                  >
                    <span>✓ Current (Paid)</span>
                  </span>
                  <span
                    v-else-if="sub.status === 'expiring_soon'"
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center space-x-1 animate-pulse"
                  >
                    <span>⚠️ Card Expiring Soon</span>
                  </span>
                </td>

                <!-- Next Charge -->
                <td class="py-3.5 px-4 font-mono text-slate-400">
                  {{ sub.next_charge_date }}
                </td>

                <!-- Action / Dunning -->
                <td class="py-3.5 px-4 text-right">
                  <button
                    v-if="sub.status === 'expiring_soon'"
                    @click="handleDunningNotice(sub.client_id)"
                    class="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold text-[11px] transition-colors"
                  >
                    Send Dunning Recovery Bot
                  </button>
                  <span v-else class="text-slate-400 text-[11px]">Auto-Renews</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SECTION 2: AGENCY SAAS LICENSE (Agency -> CallRescue) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div class="pb-3 border-b border-slate-800">
          <h4 class="text-sm font-bold text-white">Your CallRescue License</h4>
          <p class="text-xs text-slate-400">Wholesale platform license paid to CallRescue</p>
        </div>

        <div class="space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Active Tier:</span>
            <span class="font-bold text-white">{{ store.billing.agencySubscription.plan_name }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Monthly Wholesale Cost:</span>
            <span class="font-mono font-bold text-white">${{ store.billing.agencySubscription.price }} / mo</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Capacity:</span>
            <span class="font-bold text-emerald-400">21 client locations available</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Payment Source:</span>
            <span class="font-mono text-slate-300">{{ store.billing.agencySubscription.payment_method }}</span>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span class="text-slate-400 font-semibold">100% Tax Deductible SaaS</span>
        </div>
      </div>
    </div>

    <!-- SELF-HEALING 1-CLICK RETAINER DUNNING MODAL -->
    <div
      v-if="selectedDunningClient"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div class="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center space-x-2">
            <CreditCard class="w-5 h-5 text-amber-400" />
            <h3 class="text-base font-bold text-white">Self-Healing Retainer Recovery Bot</h3>
          </div>
          <button @click="selectedDunningClient = null" class="text-slate-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <h4 class="font-bold text-white text-sm">{{ selectedDunningClient.client_name }}</h4>
            <p class="text-[11px] text-slate-400">Card: {{ selectedDunningClient.card_brand }} •••• {{ selectedDunningClient.card_last4 }} • Retainer: ${{ selectedDunningClient.monthly_fee }}/mo</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Card Expiring
          </span>
        </div>

        <!-- Dynamic Value-Grounding Pitch -->
        <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-xs">
          <div class="flex items-center space-x-1.5 text-amber-400 font-bold uppercase text-[10px] tracking-wider">
            <TrendingUp class="w-3.5 h-3.5" />
            <span>Automated Speed-to-Lead Value-Grounding Pitch</span>
          </div>
          <p class="text-slate-200 leading-relaxed text-[11px]">
            "This month, CallRescue intercepted <strong class="text-white">19 high-stakes injury intake calls</strong> for your firm in under 3 seconds, preserving an estimated <strong class="text-emerald-400">$45,000 in potential case settlement revenue</strong>."
          </p>
        </div>

        <!-- 1-Click SMS Copy -->
        <div class="space-y-1.5 text-xs">
          <label class="font-bold text-slate-300 uppercase tracking-wider text-[10px] block">1-Click Frictionless SMS Copy</label>
          <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed">
            "Hey Marcus, your firm's CallRescue speed-to-lead auto-responder is paused due to card ending in {{ selectedDunningClient.card_last4 }}. Tap here to renew with Apple Pay/Google Pay in 5 seconds: <span class="text-amber-400 underline">https://pay.apexleadgrowth.com/update/card_1004</span>"
          </div>
        </div>

        <div class="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800 text-xs">
          <button
            @click="selectedDunningClient = null"
            class="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="dispatchSelfHealingDunning"
            class="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all active:scale-95 flex items-center space-x-1.5"
          >
            <span>Dispatch 1-Click Recovery SMS</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create Payment Link Modal -->
    <div v-if="showPaymentLinkModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div class="glass-panel w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 class="text-sm font-bold text-white">Generate Client Stripe Link</h4>
          <button @click="showPaymentLinkModal = false" class="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
        <p class="text-xs text-slate-300">
          Send this link to a new local clinic or contractor. When they enter their card, their monthly speed-to-lead retainer is deposited directly into your connected Stripe account:
        </p>
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-400 break-all">
          https://buy.stripe.com/live_apex_callrescue_199mo
        </div>
        <div class="flex justify-end space-x-2 pt-2">
          <button
            @click="copyPaymentLink"
            class="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300"
          >
            {{ linkCopied ? '✓ Link Copied!' : 'Copy Payment Link' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCallRescueStore } from '../stores/callrescue'
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Plus
} from 'lucide-vue-next'

const store = useCallRescueStore()
const showPaymentLinkModal = ref(false)
const linkCopied = ref(false)
const selectedDunningClient = ref(null)

function triggerMilestoneUpgrade() {
  alert('🚀 1-Click Retainer Expansion Proposal emailed to Dr. Robert Dental Studio for $299/mo (+$100/mo MRR)!')
}

function handleDunningNotice(clientId) {
  const match = store.billing.clientRetainers.find(c => c.client_id === clientId)
  if (match) {
    selectedDunningClient.value = match
  }
}

function dispatchSelfHealingDunning() {
  if (selectedDunningClient.value) {
    store.sendDunningNotice(selectedDunningClient.value.client_id)
    alert(`⚡ 1-Click SMS Recovery Link dispatched to ${selectedDunningClient.value.client_name}! Renewal automated via Apple Pay.`)
    selectedDunningClient.value = null
  }
}

function copyPaymentLink() {
  navigator.clipboard.writeText('https://buy.stripe.com/live_apex_callrescue_199mo')
  linkCopied.value = true
  setTimeout(() => {
    linkCopied.value = false
    showPaymentLinkModal.value = false
  }, 1500)
}
</script>
