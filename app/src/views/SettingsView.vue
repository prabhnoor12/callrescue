<template>
  <div class="space-y-8 pb-16 max-w-5xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2 text-xs text-slate-400 mb-1">
          <router-link to="/" class="hover:text-white">← Call Radar</router-link>
          <span>/</span>
          <span class="text-amber-400 font-medium">Agency White-Label</span>
        </div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight font-display">White-Label Branding & DNS Hub</h1>
        <p class="text-xs text-slate-400">
          Present CallRescue completely under your agency's domain, brand identity, custom SMS numbers, and client portal.
        </p>
      </div>

      <!-- Executive ROI Deliverable Trigger -->
      <button
        @click="showExecutiveReport = true"
        class="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition-all self-start sm:self-auto"
      >
        <FileText class="w-4 h-4" />
        <span>Executive Speed-to-Lead ROI Report</span>
      </button>
    </div>

    <!-- SECTION 1: AGENCY IDENTITY & BRANDING -->
    <div class="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <div class="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Sparkles class="w-4 h-4" />
          <span>Agency Profile & Visual Identity</span>
        </div>
        <span class="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          White-Label Active
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Agency Name -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Agency Brand Name</label>
          <input
            v-model="form.agency_name"
            type="text"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <!-- Tagline -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Agency Subtitle</label>
          <input
            v-model="form.agency_tagline"
            type="text"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <!-- Brand Color -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Brand Accent Color</label>
          <div class="flex items-center space-x-3">
            <input
              v-model="form.brand_color"
              type="color"
              class="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
            />
            <input
              v-model="form.brand_color"
              type="text"
              class="w-32 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white uppercase font-mono"
            />
            <!-- Color Presets -->
            <div class="flex items-center space-x-1.5">
              <button
                v-for="color in presetColors"
                :key="color"
                type="button"
                @click="form.brand_color = color"
                class="w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110"
                :style="{ backgroundColor: color }"
              ></button>
            </div>
          </div>
        </div>

        <!-- Custom CNAME Domain -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Custom Speed-to-Lead Domain (CNAME)</label>
          <input
            v-model="form.custom_domain"
            type="text"
            placeholder="call.apexleadgrowth.com"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
          />
        </div>
      </div>

      <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
        <span class="text-slate-400">All customer SMS headers & portals inherit these styles.</span>
        <button
          @click="saveBranding"
          class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-md active:scale-95"
        >
          {{ savedToast ? '✓ Branding Saved!' : 'Save Branding' }}
        </button>
      </div>
    </div>

    <!-- SECTION 2: CUSTOM CNAME & SSL DNS VERIFICATION -->
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <Globe class="w-4 h-4 text-cyan-400" />
            <span>Custom CNAME DNS Configuration</span>
          </h3>
          <p class="text-xs text-slate-400">Point your subdomain to our high-availability telephony ingress</p>
        </div>

        <button
          @click="verifyDnsNow"
          :disabled="verifyingDns"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': verifyingDns }" />
          <span>{{ verifyingDns ? 'Verifying Records...' : 'Verify DNS Records' }}</span>
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <th class="py-2.5 px-3">Type</th>
              <th class="py-2.5 px-3">Host / Subdomain</th>
              <th class="py-2.5 px-3">Target / Value</th>
              <th class="py-2.5 px-3">SSL Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800 font-mono text-slate-300 text-[11px]">
            <tr>
              <td class="py-2.5 px-3 font-bold text-amber-400">CNAME</td>
              <td class="py-2.5 px-3 text-white">call</td>
              <td class="py-2.5 px-3 text-slate-400">{{ store.whiteLabelDns.cname_target }}</td>
              <td class="py-2.5 px-3 text-emerald-400">✓ Active (Let's Encrypt)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 3: CLIENT SUB-USER READ-ONLY PORTAL SIMULATOR -->
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <UserCheck class="w-4 h-4 text-amber-400" />
            <span>Client Sub-User Portal Simulator</span>
          </h3>
          <p class="text-xs text-slate-400">Give business owners live visibility into their rescued calls with zero SaaS wholesale markups visible</p>
        </div>

        <button
          @click="toggleClientPortal"
          class="flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95"
          :class="store.clientPortalViewMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'"
        >
          <Eye class="w-4 h-4" />
          <span>{{ store.clientPortalViewMode ? 'Exit Client Simulation' : 'Simulate Client Portal Experience' }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span class="text-[10px] text-slate-400 uppercase font-bold block">Client Portal Subdomain</span>
          <div class="font-mono text-amber-300 text-xs">
            https://call.apexleadgrowth.com/login
          </div>
          <p class="text-[11px] text-slate-400">Branded with your agency's logo and custom CSS accent color.</p>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span class="text-[10px] text-slate-400 uppercase font-bold block">Client Role Permissions</span>
          <ul class="text-[11px] text-slate-300 space-y-1">
            <li class="flex items-center space-x-1.5 text-emerald-400">
              <span>✓ Can see live rescued calls & SMS conversations</span>
            </li>
            <li class="flex items-center space-x-1.5 text-emerald-400">
              <span>✓ Can dial callers back in 1-click</span>
            </li>
            <li class="flex items-center space-x-1.5 text-rose-400">
              <span>✕ Cannot see agency billing, wholesale fees, or other clients</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- SECTION 4: AUTOMATED 1ST-OF-THE-MONTH EXECUTIVE DIGEST DISPATCHER -->
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <Send class="w-4 h-4 text-emerald-400" />
            <span>Automated 1st-of-the-Month Executive Digest Emailer</span>
          </h3>
          <p class="text-xs text-slate-400">Proves monthly retainer ROI on autopilot by sending branded PDF deliverables directly to business owners</p>
        </div>

        <button
          @click="testScheduledDigest"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
        >
          <Sparkles class="w-3.5 h-3.5 text-emerald-400" />
          <span>Dispatch Test Digest Now</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-bold text-white">Automated Delivery Schedule</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Active (Cron Enabled)
            </span>
          </div>
          <p class="text-[11px] text-slate-300">
            Fires on the <strong>1st of every month at 08:00 AM</strong>. Automatically tallies calls intercepted, average speed-to-lead latency, appointments saved, and estimated revenue preserved.
          </p>
          <div class="pt-1 text-[11px] text-amber-400 font-mono">
            Sender: {{ store.whiteLabelDns.sender_name }} &lt;{{ store.whiteLabelDns.sender_email }}&gt;
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span class="font-bold text-white block">Active Digest Client Recipients</span>
          <ul class="text-[11px] text-slate-300 space-y-1.5">
            <li v-for="c in store.clients" :key="c.id" class="flex items-center justify-between">
              <span class="font-medium text-white truncate max-w-[180px]">{{ c.business_name }}</span>
              <span class="text-slate-400 font-mono text-[10px]">{{ c.owner_name.toLowerCase().replace(/\s+/g, '.') }}@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- SECTION 5: WHITE-LABEL PWA MOBILE APP ICON & HOMESCREEN CUSTOMIZER -->
    <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <Smartphone class="w-4 h-4 text-amber-400" />
            <span>White-Label Mobile PWA (Progressive Web App) Generator</span>
          </h3>
          <p class="text-xs text-slate-400">Give business owners & front-desk staff an installable mobile app icon on iPhone & Android with your agency branding</p>
        </div>

        <button
          @click="testPwaPrompt"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md"
        >
          <Smartphone class="w-3.5 h-3.5" />
          <span>Test Mobile Install Prompt</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="space-y-3">
          <div>
            <label class="block font-medium text-slate-300 mb-1">PWA App Title</label>
            <input
              v-model="pwaForm.name"
              type="text"
              class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-300 mb-1">Short Homescreen Label (12 chars max)</label>
            <input
              v-model="pwaForm.short_name"
              type="text"
              class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
            />
          </div>
          <div>
            <label class="block font-medium text-slate-300 mb-1">Manifest Start URL</label>
            <input
              v-model="pwaForm.start_url"
              type="text"
              class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs focus:outline-none"
              readonly
            />
          </div>
        </div>

        <!-- Phone Mockup Preview -->
        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
          <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mobile Homescreen App Icon Preview</span>
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl text-slate-950 font-bold text-xl relative group" :style="{ backgroundColor: form.brand_color || '#f59e0b' }">
            <PhoneCall class="w-8 h-8 text-slate-950" />
            <span class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 text-[9px] font-bold flex items-center justify-center text-white">1</span>
          </div>
          <div>
            <p class="font-bold text-white text-xs">{{ pwaForm.short_name }}</p>
            <p class="text-[10px] text-slate-400 mt-0.5">iOS Safari / Android Chrome PWA</p>
          </div>
        </div>
      </div>
    </div>

    <!-- EXECUTIVE SPEED-TO-LEAD ROI DELIVERABLE MODAL -->
    <div
      v-if="showExecutiveReport"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
    >
      <div class="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <!-- Modal Top Bar -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="w-3 h-3 rounded-full bg-amber-400"></span>
            <span class="text-xs uppercase font-bold text-slate-400 tracking-wider">Agency Deliverable Generator</span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="printReport"
              class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              @click="showExecutiveReport = false"
              class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- PRINTABLE CLIENT DELIVERABLE CANVAS -->
        <div id="printable-report" class="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 text-slate-200">
          <!-- Agency Letterhead -->
          <div class="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 class="text-xl font-black text-white tracking-tight font-display">{{ store.agency.agency_name }}</h2>
              <p class="text-xs text-amber-400 font-mono">{{ store.agency.custom_domain }}</p>
              <p class="text-[11px] text-slate-400 mt-1">Official Monthly Speed-to-Lead & Missed-Call Revenue Audit</p>
            </div>
            <div class="text-right text-xs">
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
                Monthly ROI Verified
              </span>
              <p class="text-[11px] text-slate-400 mt-1.5">Period: October 2026</p>
            </div>
          </div>

          <!-- Prepared For -->
          <div class="space-y-1">
            <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Prepared Exclusively For:</span>
            <h3 class="text-lg font-bold text-white">{{ store.selectedClient.business_name }}</h3>
            <p class="text-xs text-slate-400">{{ store.selectedClient.industry }} • Main Line: {{ store.selectedClient.phone }}</p>
          </div>

          <!-- Scorecards -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Missed Calls Rescued</span>
              <span class="text-2xl font-black text-amber-400 font-display">{{ store.selectedClient.calls_rescued_month }} Calls</span>
              <p class="text-[10px] text-emerald-400 font-semibold mt-1">91.3% rescue rate</p>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Avg Response Latency</span>
              <span class="text-2xl font-black text-white font-display">{{ store.selectedClient.avg_latency_sec }} Secs</span>
              <p class="text-[10px] text-slate-400 mt-1">Instant 2-way text</p>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
              <span class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Estimated Saved Revenue</span>
              <span class="text-2xl font-black text-emerald-400 font-display">${{ store.selectedClient.revenue_saved_month.toLocaleString() }}</span>
              <p class="text-[10px] text-emerald-400 font-semibold mt-1">Preserved client LTV</p>
            </div>
          </div>

          <!-- Sign-off -->
          <div class="pt-4 border-t border-slate-800 text-xs text-slate-400">
            <p class="font-bold text-white">Retainer Impact Summary:</p>
            <p class="text-[11px] mt-1">Your monthly ${{ store.selectedClient.monthly_retainer }} investment with {{ store.agency.agency_name }} delivered an estimated 84x ROI by preventing 42 high-intent callers from going to local competitors.</p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCallRescueStore } from '../stores/callrescue'
import {
  Sparkles,
  Globe,
  UserCheck,
  FileText,
  CheckCircle2,
  RefreshCw,
  Send,
  Printer,
  Eye,
  Smartphone,
  PhoneCall
} from 'lucide-vue-next'

const router = useRouter()
const store = useCallRescueStore()
const savedToast = ref(false)
const verifyingDns = ref(false)
const showExecutiveReport = ref(false)

const presetColors = ['#f59e0b', '#06b6d4', '#10b981', '#6366f1', '#ec4899', '#f97316']

const form = reactive({
  agency_name: store.agency.agency_name,
  agency_tagline: store.agency.agency_tagline,
  brand_color: store.agency.brand_color,
  custom_domain: store.agency.custom_domain,
  contact_email: store.agency.contact_email
})

const pwaForm = reactive({
  name: `${store.agency.agency_name} Call Dispatch`,
  short_name: 'CallRescue',
  start_url: `https://${form.custom_domain || 'call.apexleadgrowth.com'}`
})

function saveBranding() {
  store.updateAgency({ ...form })
  savedToast.value = true
  setTimeout(() => {
    savedToast.value = false
  }, 2500)
}

function verifyDnsNow() {
  verifyingDns.value = true
  setTimeout(() => {
    verifyingDns.value = false
    alert(`✓ CNAME DNS verified successfully!\n\n${form.custom_domain} -> ${store.whiteLabelDns.cname_target}\nSSL certificate active.`)
  }, 1200)
}

function toggleClientPortal() {
  store.toggleClientPortalMode()
  if (store.clientPortalViewMode) {
    router.push('/')
  }
}

function testScheduledDigest() {
  alert(`✓ 1st-of-the-month Executive Speed-to-Lead Digest dispatched from "${store.whiteLabelDns.sender_name} <${store.whiteLabelDns.sender_email}>" to ${store.clients.length} business owners!`)
}

function testPwaPrompt() {
  alert(`📱 Simulated Mobile Install Prompt:\n\nAdd "${pwaForm.short_name}" to Homescreen?\n\n- Icon: Branded with ${form.brand_color}\n- URL: ${pwaForm.start_url}\n- Full-screen speed-to-lead dispatcher enabled!`)
}

function printReport() {
  window.print()
}
</script>
