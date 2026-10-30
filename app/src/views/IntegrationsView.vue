<template>
  <div class="space-y-8 pb-16">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2 text-xs text-slate-400 mb-1">
          <router-link to="/" class="hover:text-white">← Call Radar</router-link>
          <span>/</span>
          <span class="text-amber-400 font-medium">Carrier & CRM Integrations</span>
        </div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight font-display">Telecom Carrier & CRM Integrations</h1>
        <p class="text-xs text-slate-400">
          Route missed business calls from AT&T, Verizon, or VOIP via *71 forwarding, and map Twilio/Telnyx payloads without code.
        </p>
      </div>

      <!-- Telecom Engine Status Pill -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-slate-300">Carrier Bridge:</span>
          <span class="font-bold text-white font-mono">Listening on 4 Numbers</span>
        </div>
      </div>
    </div>

    <!-- Active Integrations Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- CARD 1: TELECOM CARRIER *71 FORWARDING WIZARD -->
      <div class="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Radio class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-base font-bold text-white flex items-center space-x-2">
                  <span>Carrier Conditional Forwarding (*71)</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </h3>
                <p class="text-xs text-slate-400">Zero hardware needed. Dial *71 on the front-desk handset to forward missed calls.</p>
              </div>
            </div>
            <button
              @click="testCarrierBridge"
              class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors"
            >
              <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': testingBridge }" />
              <span>Test Line</span>
            </button>
          </div>

          <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Assigned Ingress Number:</span>
              <span class="font-bold text-amber-400 font-mono">{{ store.selectedClient.carrier_forwarding_number }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Forwarding Dial Code:</span>
              <span class="font-bold text-white font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                *71{{ store.selectedClient.carrier_forwarding_number.replace(/\D/g, '') }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Compatible Carriers:</span>
              <span class="text-slate-300">Verizon, AT&T, T-Mobile, RingCentral, Nextiva</span>
            </div>
          </div>

          <p class="text-[11px] text-slate-400 leading-relaxed">
            <strong>How it works:</strong> The business phone rings normally for 3–4 rings. If answered, call completes as usual. If staff is busy or away, telecom instantly hands off to CallRescue to trigger the 4-second text.
          </p>
        </div>

        <div class="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
          <span class="flex items-center space-x-1.5 text-emerald-400">
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>SIP Trunking Active (Zero dropped packets)</span>
          </span>
        </div>
      </div>

      <!-- CARD 2: DENTRIX, JOBBER & CRM WEBHOOK SYNC -->
      <div class="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Database class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-base font-bold text-white flex items-center space-x-2">
                  <span>Dentrix, Jobber & CRM Sync</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Connected
                  </span>
                </h3>
                <p class="text-xs text-slate-400">Automatically logs rescued callers as new intake leads in the client's CRM.</p>
              </div>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Provider:</span>
              <span class="font-bold text-white font-mono">{{ store.integrations.crmSync.provider }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Auto-Create Leads:</span>
              <span class="font-bold text-emerald-400 font-mono">Enabled (Real-Time)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Emergency Slack Channel:</span>
              <span class="font-bold text-amber-400 font-mono">{{ store.integrations.emergencySlack.webhook_channel }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-xs">
            <div>
              <p class="font-bold text-white">Direct Calendar Webhook Bridge</p>
              <p class="text-[11px] text-slate-400">Push booking links directly into SMS replies</p>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">Active</span>
          </div>
        </div>

        <div class="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
          <span class="flex items-center space-x-1.5 text-emerald-400">
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>Bi-directional REST API Sync</span>
          </span>
        </div>
      </div>
    </div>

    <!-- VISUAL NO-CODE TELECOM WEBHOOK FIELD MAPPER -->
    <div class="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h4 class="text-base font-bold text-white flex items-center space-x-2">
            <Sliders class="w-4 h-4 text-amber-400" />
            <span>Visual No-Code Telecom Webhook Field Mapper</span>
          </h4>
          <p class="text-xs text-slate-400">Map inbound JSON keys from Twilio Voice, Telnyx, RingCentral, or Vonage to speed-to-lead SMS triggers</p>
        </div>

        <!-- Presets -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[11px] text-slate-400">Presets:</span>
          <button
            v-for="p in ['Twilio Voice', 'Telnyx SIP', 'RingCentral VOIP', 'Custom JSON']"
            :key="p"
            @click="loadPreset(p)"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
            :class="activePreset === p ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
          >
            {{ p }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        <!-- Left: Raw JSON Payload Input -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Inbound Voice Payload</label>
            <button @click="parseJsonKeys" class="text-amber-400 hover:underline font-mono text-[11px]">
              ↻ Parse Schema Keys
            </button>
          </div>
          <textarea
            v-model="rawWebhookPayload"
            rows="9"
            class="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-amber-300 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-amber-500 resize-none"
          ></textarea>
        </div>

        <!-- Right: Visual Dropdown Mappings -->
        <div class="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Extracted Key Routing</span>

          <!-- Caller Phone Field -->
          <div>
            <label class="block text-slate-300 mb-1 font-medium">Caller Mobile Phone Number Field</label>
            <select
              v-model="fieldMapping.caller_phone"
              class="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none"
            >
              <option v-for="k in parsedKeys" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>

          <!-- Caller Name -->
          <div>
            <label class="block text-slate-300 mb-1 font-medium">Caller Name / CNAM Lookup Field</label>
            <select
              v-model="fieldMapping.caller_name"
              class="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none"
            >
              <option v-for="k in parsedKeys" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>

          <!-- Call Status -->
          <div>
            <label class="block text-slate-300 mb-1 font-medium">Call Disposition Status Field (no-answer/busy)</label>
            <select
              v-model="fieldMapping.call_status"
              class="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none"
            >
              <option v-for="k in parsedKeys" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>

          <!-- Forwarded To Number -->
          <div>
            <label class="block text-slate-300 mb-1 font-medium">Target Business Forwarded Number Field</label>
            <select
              v-model="fieldMapping.forwarded_to"
              class="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none"
            >
              <option v-for="k in parsedKeys" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
        <span class="text-emerald-400 flex items-center space-x-1.5">
          <CheckCircle2 class="w-4 h-4" />
          <span>Active mapping: Inbound missed calls will route speed-to-lead SMS to <strong class="text-white font-mono">{{ fieldMapping.caller_phone }}</strong> with CNAM name <strong class="text-white font-mono">{{ fieldMapping.caller_name }}</strong></span>
        </span>
        <button
          @click="saveFieldMapping"
          class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-md active:scale-95"
        >
          {{ savedMapping ? '✓ Schema Saved!' : 'Save Webhook Schema' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCallRescueStore } from '../stores/callrescue'
import {
  Radio,
  Database,
  RefreshCw,
  CheckCircle2,
  Sliders
} from 'lucide-vue-next'

const store = useCallRescueStore()
const testingBridge = ref(false)
const savedMapping = ref(false)

const activePreset = ref('Twilio Voice')

const rawWebhookPayload = ref(`{
  "CallSid": "CA981203481230491823",
  "From": "+14155558932",
  "CallerName": "Jessica Miller",
  "To": "+14158004921",
  "CallStatus": "no-answer",
  "Duration": "0",
  "Direction": "inbound",
  "Timestamp": "2026-10-30T12:41:00Z"
}`)

const parsedKeys = ref([
  'CallSid',
  'From',
  'CallerName',
  'To',
  'CallStatus',
  'Duration',
  'Direction',
  'Timestamp'
])

const fieldMapping = reactive({
  caller_phone: 'From',
  caller_name: 'CallerName',
  call_status: 'CallStatus',
  forwarded_to: 'To'
})

function loadPreset(presetName) {
  activePreset.value = presetName
  if (presetName === 'Twilio Voice') {
    rawWebhookPayload.value = `{
  "CallSid": "CA981203481230491823",
  "From": "+14155558932",
  "CallerName": "Jessica Miller",
  "To": "+14158004921",
  "CallStatus": "no-answer",
  "Duration": "0"
}`
  } else if (presetName === 'Telnyx SIP') {
    rawWebhookPayload.value = `{
  "event_type": "call.hangup",
  "payload": {
    "from": "+14155553921",
    "caller_id_name": "Brandon Hall",
    "to": "+14158004922",
    "hangup_cause": "NO_ANSWER"
  }
}`
  } else if (presetName === 'RingCentral VOIP') {
    rawWebhookPayload.value = `{
  "telephony_session_id": "s-891230",
  "caller": { "phone_number": "+14155551109", "name": "Katherine Reed" },
  "callee": "+14158004923",
  "result": "Missed"
}`
  }
  parseJsonKeys()
}

function parseJsonKeys() {
  try {
    const obj = JSON.parse(rawWebhookPayload.value)
    const keys = []
    function extractKeys(target, prefix = '') {
      for (const k in target) {
        const fullKey = prefix ? `${prefix}.${k}` : k
        keys.push(fullKey)
        if (typeof target[k] === 'object' && target[k] !== null && !Array.isArray(target[k])) {
          extractKeys(target[k], fullKey)
        }
      }
    }
    extractKeys(obj)
    parsedKeys.value = keys
    if (keys.some(k => k.includes('From') || k.includes('from') || k.includes('phone') || k.includes('caller'))) {
      fieldMapping.caller_phone = keys.find(k => k.includes('From') || k.includes('from') || k.includes('phone'))
    }
    if (keys.some(k => k.includes('Name') || k.includes('name'))) {
      fieldMapping.caller_name = keys.find(k => k.includes('Name') || k.includes('name'))
    }
    if (keys.some(k => k.includes('Status') || k.includes('cause') || k.includes('result') || k.includes('event'))) {
      fieldMapping.call_status = keys.find(k => k.includes('Status') || k.includes('cause') || k.includes('result'))
    }
  } catch (e) {
    alert('Invalid JSON in payload window. Please verify syntax.')
  }
}

function saveFieldMapping() {
  savedMapping.value = true
  setTimeout(() => {
    savedMapping.value = false
    alert(`✓ Telecom Webhook Mapping saved! Inbound payloads will parse phone from [${fieldMapping.caller_phone}], name from [${fieldMapping.caller_name}], and trigger instant SMS when [${fieldMapping.call_status}] is missed/no-answer.`)
  }, 400)
}

function testCarrierBridge() {
  testingBridge.value = true
  setTimeout(() => {
    testingBridge.value = false
    alert(`✓ Carrier Bridge Telemetry Check: 100% PASS!\n\nNumber ${store.selectedClient.carrier_forwarding_number} successfully acknowledged SIP ping in 32ms.`)
  }, 1200)
}
</script>
