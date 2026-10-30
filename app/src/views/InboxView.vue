<template>
  <div class="space-y-6 pb-16">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2 text-xs text-slate-400 mb-1">
          <router-link to="/" class="hover:text-white">← Call Radar</router-link>
          <span>/</span>
          <span class="text-amber-400 font-medium">Two-Way SMS Hub</span>
        </div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight font-display">Two-Way Speed-to-Lead SMS Hub</h1>
        <p class="text-xs text-slate-400">
          Seamlessly continue conversations with callers after the initial 4-second automated text-back.
        </p>
      </div>

      <!-- Live Two-Way Gateway Status -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-slate-300">Twilio 2-Way Gateway:</span>
          <span class="font-bold text-white font-mono">Online</span>
        </div>
      </div>
    </div>

    <!-- MAIN TWO-COLUMN INBOX LAYOUT -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
      
      <!-- LEFT COLUMN: CONVERSATION LIST (4 COLS) -->
      <div class="lg:col-span-4 glass-panel rounded-3xl border border-slate-800 p-4 space-y-4 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Conversations</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {{ store.conversations.length }} Active
            </span>
          </div>

          <!-- Thread Cards -->
          <div class="space-y-2">
            <button
              v-for="conv in store.conversations"
              :key="conv.id"
              @click="activeConvId = conv.id"
              class="w-full text-left p-3.5 rounded-2xl border transition-all"
              :class="activeConvId === conv.id ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-md' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-sm text-white flex items-center space-x-2">
                  <span>{{ conv.customerName }}</span>
                  <span v-if="conv.unread" class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                </span>
                <span class="text-[10px] text-slate-400 font-mono">{{ conv.lastTime }}</span>
              </div>
              <div class="text-[11px] text-slate-400 font-mono mb-1.5">{{ conv.customerPhone }}</div>
              <p class="text-xs text-slate-300 line-clamp-1">
                {{ conv.lastMessage }}
              </p>
            </button>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
          ⚡ Automated responses mimic natural human typing
        </div>
      </div>

      <!-- RIGHT COLUMN: ACTIVE CONVERSATION THREAD (8 COLS) -->
      <div class="lg:col-span-8 glass-panel rounded-3xl border border-slate-800 flex flex-col justify-between overflow-hidden">
        
        <!-- Thread Header -->
        <div class="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <User class="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="text-base font-bold text-white">{{ currentConv?.customerName || 'Select Conversation' }}</h3>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {{ currentConv?.customerPhone }}
                </span>
              </div>
              <p class="text-xs text-slate-400">
                Routed to: <strong class="text-white">{{ store.selectedClient.business_name }}</strong>
              </p>
            </div>
          </div>

          <!-- 1-Click Phone Call Back Button -->
          <button
            @click="dialCustomer"
            class="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Phone class="w-3.5 h-3.5" />
            <span>Call Customer Now</span>
          </button>
        </div>

        <!-- Chat Bubble Stream -->
        <div class="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[420px] flex-1">
          <template v-if="currentConv">
            <div
              v-for="(msg, idx) in currentConv.messages"
              :key="idx"
              class="flex flex-col"
              :class="{
                'items-center my-2': msg.isStatus,
                'items-start': msg.sender === 'customer' || msg.sender === 'bot',
                'items-end': msg.sender === 'staff'
              }"
            >
              <!-- System Intercept Pill -->
              <div
                v-if="msg.isStatus"
                class="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-400 flex items-center space-x-1.5"
              >
                <Zap class="w-3 h-3 text-amber-400" />
                <span>{{ msg.text }}</span>
              </div>

              <!-- Message Bubble -->
              <div
                v-else
                class="max-w-lg p-3.5 rounded-2xl text-xs space-y-1 shadow-md"
                :class="{
                  'bg-slate-900 border border-slate-800 text-slate-200': msg.sender === 'customer',
                  'bg-amber-500/10 border border-amber-500/20 text-amber-200': msg.sender === 'bot',
                  'bg-amber-500 text-slate-950 font-medium': msg.sender === 'staff'
                }"
              >
                <!-- Staff / Sender Label -->
                <div class="flex items-center justify-between text-[10px] opacity-75 font-mono mb-0.5">
                  <span v-if="msg.sender === 'bot'">⚡ Automated 4s Text-Back</span>
                  <span v-else-if="msg.sender === 'staff'">👤 {{ msg.staffName }}</span>
                  <span v-else>📱 Customer SMS</span>
                  <span>{{ msg.time }}</span>
                </div>
                <p class="leading-relaxed">{{ msg.text }}</p>
              </div>
            </div>
          </template>
        </div>

        <!-- Compose & Snippet Footer -->
        <div class="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
          <!-- Quick Response Snippet Chips -->
          <div class="flex items-center gap-1.5 flex-wrap text-xs">
            <span class="text-[10px] text-slate-400 uppercase font-mono mr-1">Quick Snippets:</span>
            <button
              v-for="s in [
                { label: '📅 Booking Link', text: 'Tap here to pick your exact appointment time: https://book.apexleadgrowth.com/studio' },
                { label: '📍 Directions', text: 'We are located at 450 Sutter St, Suite 800 with validated patient parking in the garage.' },
                { label: '📝 Emergency Intake', text: 'Please complete this 60-second emergency form so the doctor is prepped: https://forms.apexleadgrowth.com/intake' },
                { label: '💵 Insurance Accepted', text: 'Yes! We accept all major PPO insurance plans as well as flexible financing with 0% APR.' }
              ]"
              :key="s.label"
              @click="replyText = s.text"
              class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] transition-colors"
            >
              {{ s.label }}
            </button>
          </div>

          <!-- Input Bar -->
          <div class="flex items-center space-x-2">
            <input
              v-model="replyText"
              type="text"
              placeholder="Type your message or click a snippet above..."
              class="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              @keydown.enter="sendReply"
            />
            <button
              @click="sendReply"
              class="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center space-x-1.5 shadow-md shrink-0 active:scale-95"
            >
              <Send class="w-3.5 h-3.5" />
              <span>Send SMS</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCallRescueStore } from '../stores/callrescue'
import {
  User,
  Phone,
  Send,
  Zap
} from 'lucide-vue-next'

const store = useCallRescueStore()
const activeConvId = ref(store.conversations[0]?.id || '')
const replyText = ref('')

const currentConv = computed(() => {
  return store.conversations.find(c => c.id === activeConvId.value) || store.conversations[0]
})

function sendReply() {
  if (!replyText.value.trim() || !activeConvId.value) return
  store.sendSmsReply(activeConvId.value, replyText.value.trim())
  replyText.value = ''
}

function dialCustomer() {
  if (!currentConv.value) return
  alert(`📞 Twilio WebRTC Dialer Initiated:\n\nConnecting front desk phone to ${currentConv.value.customerName} (${currentConv.value.customerPhone})...\n\nCaller ID masked with business phone: ${store.selectedClient.phone}`)
}
</script>
