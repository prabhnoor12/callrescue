import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import InboxView from '../views/InboxView.vue'
import AutomationsView from '../views/AutomationsView.vue'
import IntegrationsView from '../views/IntegrationsView.vue'
import BillingView from '../views/BillingView.vue'
import SettingsView from '../views/SettingsView.vue'
import KioskView from '../views/KioskView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { title: 'Call Radar & Recovery' }
  },
  {
    path: '/inbox',
    name: 'inbox',
    component: InboxView,
    meta: { title: 'Two-Way SMS Inbox' }
  },
  {
    path: '/automations',
    name: 'automations',
    component: AutomationsView,
    meta: { title: 'Speed-to-Lead Rules' }
  },
  {
    path: '/integrations',
    name: 'integrations',
    component: IntegrationsView,
    meta: { title: 'Carrier & CRM Integrations' }
  },
  {
    path: '/billing',
    name: 'billing',
    component: BillingView,
    meta: { title: 'Client Retainer Billing' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { title: 'White-Label Branding' }
  },
  {
    path: '/kiosk',
    name: 'kiosk',
    component: KioskView,
    meta: { title: 'Front-Desk Reception Kiosk' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
