<template>
  <header class="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Left: Brand / Logo -->
      <div class="flex items-center space-x-4 sm:space-x-6">
        <router-link to="/" class="flex items-center space-x-3 group">
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-slate-950 shadow-md transition-transform group-hover:scale-105 shrink-0"
            :style="{ backgroundColor: store.agency.brand_color || '#f59e0b' }"
          >
            <PhoneCall class="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-bold tracking-tight text-white text-base">
                {{ store.clientPortalViewMode ? 'Client Portal' : 'CallRescue' }}
              </span>
              <span
                v-if="store.clientPortalViewMode"
                class="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20"
              >
                Client View
              </span>
              <span
                v-else
                class="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
              >
                White-Label
              </span>
            </div>
            <p class="text-xs text-slate-400 hidden sm:block truncate max-w-[200px]">
              {{ store.clientPortalViewMode ? store.selectedClient.business_name : store.agency.agency_name }}
            </p>
          </div>
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center space-x-1">
          <template v-if="!store.clientPortalViewMode">
            <router-link
              to="/"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="route.path === '/' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Call Radar
            </router-link>
            <router-link
              to="/inbox"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5"
              :class="route.path === '/inbox' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              <span>SMS Inbox</span>
              <span v-if="unreadCount > 0" class="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                {{ unreadCount }}
              </span>
            </router-link>
            <router-link
              to="/automations"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="route.path === '/automations' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Speed Rules
            </router-link>
            <router-link
              to="/integrations"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="route.path === '/integrations' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              Carrier & CRM
            </router-link>
            <router-link
              to="/billing"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5"
              :class="route.path === '/billing' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              <span>Retainers</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 font-mono">
                ${{ store.totalMonthlyRetainers }}
              </span>
            </router-link>
            <router-link
              to="/settings"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="route.path === '/settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              White-Label
            </router-link>
            <router-link
              to="/kiosk"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5"
              :class="route.path === '/kiosk' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'"
            >
              <Tablet class="w-3.5 h-3.5 text-amber-400" />
              <span>Reception Kiosk</span>
            </router-link>
          </template>

          <template v-else>
            <router-link
              to="/"
              class="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-white"
            >
              My Rescued Calls
            </router-link>
            <router-link
              to="/inbox"
              class="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white"
            >
              Front-Desk SMS Inbox
            </router-link>
          </template>
        </nav>
      </div>

      <!-- Right: Action Buttons -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <!-- Exit Simulation Button -->
        <button
          v-if="store.clientPortalViewMode"
          @click="store.toggleClientPortalMode(false)"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
        >
          <EyeOff class="w-3.5 h-3.5" />
          <span>Exit Simulation</span>
        </button>

        <!-- Instant Test Simulator Trigger -->
        <button
          @click="triggerSimulatedCall"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 transition-all shadow-md hover:brightness-110 active:scale-95"
          :style="{ backgroundColor: store.agency.brand_color || '#f59e0b' }"
        >
          <Zap class="w-3.5 h-3.5 text-slate-950" />
          <span class="hidden sm:inline">Simulate Missed Call</span>
          <span class="sm:hidden">Test Call</span>
        </button>

        <!-- Mobile Drawer Toggle -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 border border-slate-700 transition-colors focus:outline-none"
        >
          <X v-if="mobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-t border-slate-800 bg-slate-900/98 px-4 py-4 space-y-2 backdrop-blur-xl animate-fade-in"
    >
      <template v-if="!store.clientPortalViewMode">
        <router-link
          to="/"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          :class="route.path === '/' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'"
        >
          Call Radar & Lead Feed
        </router-link>
        <router-link
          to="/inbox"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          :class="route.path === '/inbox' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'"
        >
          Two-Way SMS Inbox
        </router-link>
        <router-link
          to="/automations"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          :class="route.path === '/automations' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'"
        >
          Speed Rules & Webchat
        </router-link>
        <router-link
          to="/integrations"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          :class="route.path === '/integrations' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'"
        >
          Carrier & CRM Integrations
        </router-link>
        <router-link
          to="/billing"
          @click="mobileMenuOpen = false"
          class="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          :class="route.path === '/billing' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'"
        >
          <span>Retainer Billing</span>
          <span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            ${{ store.totalMonthlyRetainers }}/mo
          </span>
        </router-link>
        <router-link
          to="/settings"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          :class="route.path === '/settings' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'"
        >
          Agency White-Label & DNS
        </router-link>
        <router-link
          to="/kiosk"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          :class="route.path === '/kiosk' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'"
        >
          Reception Kiosk (PIN Locked)
        </router-link>
      </template>

      <template v-else>
        <router-link
          to="/"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-xl text-sm font-semibold bg-amber-500 text-slate-950"
        >
          My Rescued Calls
        </router-link>
        <button
          @click="store.toggleClientPortalMode(false); mobileMenuOpen = false"
          class="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20"
        >
          ✕ Exit Client Simulation
        </button>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCallRescueStore } from '../stores/callrescue'
import {
  PhoneCall,
  Zap,
  Tablet,
  EyeOff,
  Menu,
  X
} from 'lucide-vue-next'

const route = useRoute()
const store = useCallRescueStore()
const mobileMenuOpen = ref(false)

const unreadCount = computed(() => {
  return store.conversations.filter(c => c.unread).length
})

function triggerSimulatedCall() {
  const callers = [
    { name: 'Dr. Gregory House', phone: '+1 (415) 555-9182', val: 750 },
    { name: 'Samantha Vance', phone: '+1 (415) 555-4301', val: 500 },
    { name: 'Marcus Sterling', phone: '+1 (415) 555-8821', val: 1200 },
    { name: 'Emily Thorne', phone: '+1 (415) 555-6612', val: 400 }
  ]
  const randomCaller = callers[Math.floor(Math.random() * callers.length)]
  const result = store.simulateIncomingMissedCall(randomCaller.name, randomCaller.phone, randomCaller.val)
  alert(`⚡ INCOMING CALL INTERCEPTED!\n\nCaller: ${result.caller_name} (${result.caller_phone})\nBusiness: ${store.selectedClient.business_name}\n\n✓ Automated SMS dispatched in ${result.latency_sec}s:\n"${result.auto_sms}"\n\nLead saved! Preserved est. $${result.estimated_value} in lost revenue.`)
}
</script>
