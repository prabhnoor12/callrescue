import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCallRescueStore = defineStore('callrescue', () => {
  // Agency Profile / White-Label
  const agency = ref({
    agency_name: 'Apex Call Care & Lead Growth',
    agency_tagline: 'Speed-to-Lead & Missed-Call Recovery Infrastructure',
    brand_color: '#f59e0b', // Amber 500
    custom_domain: 'call.apexleadgrowth.com',
    contact_email: 'concierge@apexleadgrowth.com',
    logo_icon: 'PhoneCall'
  })

  // Simulated Client View Mode (for White-Label demonstration)
  const clientPortalViewMode = ref(false)

  // Client Accounts (Local businesses managed by the agency)
  const clients = ref([
    {
      id: 'client-1',
      business_name: 'Dr. Robert Dental Studio',
      slug: 'dr-robert-dental',
      owner_name: 'Dr. Sarah Robert',
      phone: '+1 (415) 555-0199',
      carrier_forwarding_number: '+1 (415) 800-4921',
      industry: 'Cosmetic & Emergency Dentistry',
      monthly_retainer: 199,
      status: 'active',
      calls_rescued_month: 42,
      total_missed_calls: 46,
      rescue_rate: 91.3,
      revenue_saved_month: 16800,
      avg_latency_sec: 3.4,
      card_brand: 'Visa',
      card_last4: '4242',
      next_billing: 'Nov 1, 2026'
    },
    {
      id: 'client-2',
      business_name: 'Apex Heating & Air HVAC',
      slug: 'apex-hvac',
      owner_name: 'Dave Vance',
      phone: '+1 (415) 555-0144',
      carrier_forwarding_number: '+1 (415) 800-4922',
      industry: 'Residential & Emergency HVAC',
      monthly_retainer: 249,
      status: 'active',
      calls_rescued_month: 58,
      total_missed_calls: 61,
      rescue_rate: 95.1,
      revenue_saved_month: 26100,
      avg_latency_sec: 2.9,
      card_brand: 'Mastercard',
      card_last4: '8910',
      next_billing: 'Nov 1, 2026'
    },
    {
      id: 'client-3',
      business_name: 'Horizon Injury Law Group',
      slug: 'horizon-law',
      owner_name: 'Marcus Sterling',
      phone: '+1 (415) 555-0177',
      carrier_forwarding_number: '+1 (415) 800-4923',
      industry: 'Personal Injury & Civil Litigation',
      monthly_retainer: 299,
      status: 'expiring_soon',
      calls_rescued_month: 19,
      total_missed_calls: 20,
      rescue_rate: 95.0,
      revenue_saved_month: 45000,
      avg_latency_sec: 2.1,
      card_brand: 'Amex',
      card_last4: '1004',
      next_billing: 'Nov 1, 2026'
    },
    {
      id: 'client-4',
      business_name: 'Bayview Auto Collision Specialists',
      slug: 'bayview-collision',
      owner_name: 'Elena Rostova',
      phone: '+1 (415) 555-0128',
      carrier_forwarding_number: '+1 (415) 800-4924',
      industry: 'Auto Collision Repair & Towing',
      monthly_retainer: 149,
      status: 'active',
      calls_rescued_month: 31,
      total_missed_calls: 34,
      rescue_rate: 91.2,
      revenue_saved_month: 12400,
      avg_latency_sec: 4.2,
      card_brand: 'Visa',
      card_last4: '3319',
      next_billing: 'Nov 1, 2026'
    }
  ])

  const selectedClientId = ref('client-1')

  const selectedClient = computed(() => {
    return clients.value.find(c => c.id === selectedClientId.value) || clients.value[0]
  })

  // Live Call Activity Feed
  const calls = ref([
    {
      id: 'call-901',
      client_id: 'client-1',
      caller_name: 'Jessica Miller',
      caller_phone: '+1 (415) 555-8932',
      status: 'booked', // 'rescued', 'missed', 'booked', 'in_progress'
      time_ago: '4m ago',
      latency_sec: 3.2,
      auto_sms: 'Hey Jessica! This is Sarah at Dr. Robert Dental Studio. Sorry we just missed your call—how can we help you right now?',
      customer_reply: 'Hi Sarah! I have severe tooth pain on my lower right molar, do you have any emergency appointments open today?',
      staff_reply: 'Yes Jessica! Dr. Robert has an emergency slot open at 2:30 PM today. We have you booked. Please bring your insurance card.',
      estimated_value: 650,
      created_at: new Date(Date.now() - 4 * 60000).toISOString()
    },
    {
      id: 'call-902',
      client_id: 'client-2',
      caller_name: 'Brandon Hall',
      caller_phone: '+1 (415) 555-3921',
      status: 'booked',
      time_ago: '18m ago',
      latency_sec: 2.8,
      auto_sms: 'Hello Brandon! Thanks for calling Apex HVAC. Our technicians are currently on emergency service calls. How can we help you?',
      customer_reply: 'My commercial walk-in cooler just failed and temp is rising! Can someone come to Mission Bay ASAP?',
      staff_reply: 'Tech Dave is dispatching in your direction right now with an estimated 25-minute ETA. Stand by Brandon!',
      estimated_value: 1250,
      created_at: new Date(Date.now() - 18 * 60000).toISOString()
    },
    {
      id: 'call-903',
      client_id: 'client-1',
      caller_name: 'Michael Chang',
      caller_phone: '+1 (415) 555-6712',
      status: 'rescued',
      time_ago: '42m ago',
      latency_sec: 3.5,
      auto_sms: 'Hey Michael! This is Sarah at Dr. Robert Dental Studio. Sorry we just missed your call—how can we help you right now?',
      customer_reply: 'Looking for a new patient exam and professional cleaning next Tuesday afternoon.',
      staff_reply: 'We have Tuesday at 3:15 PM available! Tap here to confirm: https://book.apexleadgrowth.com/confirm/0912',
      estimated_value: 380,
      created_at: new Date(Date.now() - 42 * 60000).toISOString()
    },
    {
      id: 'call-904',
      client_id: 'client-3',
      caller_name: 'Katherine Reed',
      caller_phone: '+1 (415) 555-1109',
      status: 'in_progress',
      time_ago: '1h ago',
      latency_sec: 2.1,
      auto_sms: 'Horizon Injury Law Group here. Marcus Sterling is currently in court. How can our legal team assist you?',
      customer_reply: 'I was rear-ended on Highway 101 this morning by a commercial delivery van. Need consultation.',
      staff_reply: 'Katherine, our senior case manager Elena is calling your mobile right now for a priority intake.',
      estimated_value: 8500,
      created_at: new Date(Date.now() - 65 * 60000).toISOString()
    },
    {
      id: 'call-905',
      client_id: 'client-4',
      caller_name: 'Robert Torres',
      caller_phone: '+1 (415) 555-4920',
      status: 'rescued',
      time_ago: '2h ago',
      latency_sec: 4.1,
      auto_sms: 'Hey Robert! Bayview Auto Collision here. We missed your call—how can we help you?',
      customer_reply: 'Need an estimate on a front bumper replacement for a 2024 Honda Civic. Can I text photos?',
      staff_reply: 'Yes, please text 3 photos here and our master estimator will generate your quote within 20 mins!',
      estimated_value: 950,
      created_at: new Date(Date.now() - 130 * 60000).toISOString()
    }
  ])

  // Active Conversations for the SMS Inbox
  const conversations = ref([
    {
      id: 'conv-1',
      clientId: 'client-1',
      customerName: 'Jessica Miller',
      customerPhone: '+1 (415) 555-8932',
      unread: false,
      lastMessage: 'We have you booked for 2:30 PM today.',
      lastTime: '4m ago',
      messages: [
        { sender: 'system', text: 'Missed Call Intercepted (0s latency)', time: '12:41 PM', isStatus: true },
        { sender: 'bot', text: 'Hey Jessica! This is Sarah at Dr. Robert Dental Studio. Sorry we just missed your call—how can we help you right now?', time: '12:41 PM' },
        { sender: 'customer', text: 'Hi Sarah! I have severe tooth pain on my lower right molar, do you have any emergency appointments open today?', time: '12:42 PM' },
        { sender: 'staff', staffName: 'Sarah (Receptionist)', text: 'Yes Jessica! Dr. Robert has an emergency slot open at 2:30 PM today. We have you booked. Please bring your insurance card.', time: '12:44 PM' }
      ]
    },
    {
      id: 'conv-2',
      clientId: 'client-1',
      customerName: 'Michael Chang',
      customerPhone: '+1 (415) 555-6712',
      unread: true,
      lastMessage: 'Looking for a new patient exam next Tuesday afternoon.',
      lastTime: '42m ago',
      messages: [
        { sender: 'system', text: 'Missed Call Intercepted (3.5s latency)', time: '12:02 PM', isStatus: true },
        { sender: 'bot', text: 'Hey Michael! This is Sarah at Dr. Robert Dental Studio. Sorry we just missed your call—how can we help you right now?', time: '12:02 PM' },
        { sender: 'customer', text: 'Looking for a new patient exam and professional cleaning next Tuesday afternoon.', time: '12:05 PM' }
      ]
    },
    {
      id: 'conv-3',
      clientId: 'client-2',
      customerName: 'Brandon Hall',
      customerPhone: '+1 (415) 555-3921',
      unread: false,
      lastMessage: 'Tech Dave is dispatching in your direction right now.',
      lastTime: '18m ago',
      messages: [
        { sender: 'system', text: 'Missed Call Intercepted (2.8s latency)', time: '12:28 PM', isStatus: true },
        { sender: 'bot', text: 'Hello Brandon! Thanks for calling Apex HVAC. Our technicians are currently on emergency service calls. How can we help you?', time: '12:28 PM' },
        { sender: 'customer', text: 'My commercial walk-in cooler just failed and temp is rising! Can someone come to Mission Bay ASAP?', time: '12:29 PM' },
        { sender: 'staff', staffName: 'Dave (Lead Tech)', text: 'Tech Dave is dispatching in your direction right now with an estimated 25-minute ETA. Stand by Brandon!', time: '12:31 PM' }
      ]
    }
  ])

  // Automation Triggers & Rules
  const automationRules = ref({
    instant_missed_call: {
      enabled: true,
      delay_seconds: 3,
      business_hours_template: 'Hey {caller_name}! This is {staff_name} at {business_name}. Sorry we just missed your call—how can we help you right now?',
      after_hours_template: 'Hi {caller_name}, thanks for calling {business_name}! Our office is currently closed, but our on-call team monitors urgent texts. What can we help you with?',
      smart_booking_link_enabled: true,
      booking_url: 'https://book.apexleadgrowth.com/studio'
    },
    webchat_widget: {
      enabled: true,
      headline: 'Have a question? Text our front desk!',
      accent_color: '#f59e0b',
      placeholder: 'Type your message or appointment inquiry...'
    },
    urgent_keywords: [
      { word: 'emergency', alert_sms: true, priority: 'critical' },
      { word: 'pain', alert_sms: true, priority: 'high' },
      { word: 'leak', alert_sms: true, priority: 'critical' },
      { word: 'quote', alert_sms: false, priority: 'normal' }
    ]
  })

  // Integrations & Telecom Carriers
  const integrations = ref({
    carrierForwarding: {
      provider: 'Twilio Programmable Voice & Telnyx Bridge',
      voice_number: '+1 (415) 800-4921',
      forwarding_code: '*71 / Conditional Call Forwarding',
      status: 'connected',
      uptime: '99.99%',
      last_event: 'Call intercepted 4m ago'
    },
    crmSync: {
      provider: 'Dentrix, Jobber & ServiceTitan Hub',
      account_name: 'Apex Lead Gateway Prod',
      clients_synced: 4,
      auto_create_leads: true
    },
    emergencySlack: {
      enabled: true,
      webhook_channel: '#emergency-missed-calls'
    }
  })

  // Agency Retainer Billing
  const billing = ref({
    agencySubscription: {
      plan_name: 'Agency Scale (Unlimited Locations)',
      price: 89,
      locations_used: 4,
      locations_included: 25,
      payment_method: 'Mastercard •••• 9811',
      next_billing_date: 'Nov 1, 2026'
    },
    stripeConnect: {
      charges_enabled: true,
      balance_available: 3480.00
    },
    clientRetainers: [
      { client_id: 'client-1', client_name: 'Dr. Robert Dental Studio', monthly_fee: 199, card_brand: 'Visa', card_last4: '4242', status: 'paid', next_charge_date: 'Nov 1, 2026', dunning_attempts: 0 },
      { client_id: 'client-2', client_name: 'Apex Heating & Air HVAC', monthly_fee: 249, card_brand: 'Mastercard', card_last4: '8910', status: 'paid', next_charge_date: 'Nov 1, 2026', dunning_attempts: 0 },
      { client_id: 'client-3', client_name: 'Horizon Injury Law Group', monthly_fee: 299, card_brand: 'Amex', card_last4: '1004', status: 'expiring_soon', next_charge_date: 'Nov 1, 2026', dunning_attempts: 0 },
      { client_id: 'client-4', client_name: 'Bayview Auto Collision Specialists', monthly_fee: 149, card_brand: 'Visa', card_last4: '3319', status: 'paid', next_charge_date: 'Nov 1, 2026', dunning_attempts: 0 }
    ]
  })

  // White-Label DNS & SMTP
  const whiteLabelDns = ref({
    custom_cname: 'call.apexleadgrowth.com',
    cname_target: 'ingress.callrescue.app',
    status: 'verified',
    sender_name: 'Apex Lead Dispatch',
    sender_email: 'alerts@apexleadgrowth.com'
  })

  // Computed Metrics
  const totalMonthlyRetainers = computed(() => {
    return billing.value.clientRetainers.reduce((acc, c) => acc + c.monthly_fee, 0)
  })

  const totalCallsRescued = computed(() => {
    return clients.value.reduce((acc, c) => acc + c.calls_rescued_month, 0)
  })

  const totalRevenueSaved = computed(() => {
    return clients.value.reduce((acc, c) => acc + c.revenue_saved_month, 0)
  })

  // Actions
  function simulateIncomingMissedCall(customName, customPhone, estValue = 500) {
    const callerName = customName || 'David Vance'
    const callerPhone = customPhone || '+1 (415) 555-' + Math.floor(1000 + Math.random() * 9000)
    const client = selectedClient.value

    const newCall = {
      id: 'call-' + Date.now(),
      client_id: client.id,
      caller_name: callerName,
      caller_phone: callerPhone,
      status: 'rescued',
      time_ago: 'Just now',
      latency_sec: (Math.random() * 1.5 + 2.5).toFixed(1),
      auto_sms: `Hey ${callerName.split(' ')[0]}! This is Sarah at ${client.business_name}. Sorry we just missed your call—how can we help you right now?`,
      customer_reply: 'Hi! Yes, I was calling to check your availability for an immediate appointment.',
      staff_reply: 'We can take you in today! Let me get you registered on our calendar.',
      estimated_value: estValue,
      created_at: new Date().toISOString()
    }

    calls.value.unshift(newCall)
    client.calls_rescued_month++
    client.revenue_saved_month += estValue

    // Add to conversations
    conversations.value.unshift({
      id: 'conv-' + Date.now(),
      clientId: client.id,
      customerName: callerName,
      customerPhone: callerPhone,
      unread: true,
      lastMessage: newCall.customer_reply,
      lastTime: 'Just now',
      messages: [
        { sender: 'system', text: `Missed Call Intercepted (${newCall.latency_sec}s latency)`, time: 'Just now', isStatus: true },
        { sender: 'bot', text: newCall.auto_sms, time: 'Just now' },
        { sender: 'customer', text: newCall.customer_reply, time: 'Just now' }
      ]
    })

    saveLocal()
    return newCall
  }

  function sendSmsReply(convId, text, staffName = 'Sarah (Receptionist)') {
    const conv = conversations.value.find(c => c.id === convId)
    if (!conv) return

    conv.messages.push({
      sender: 'staff',
      staffName,
      text,
      time: 'Just now'
    })
    conv.lastMessage = text
    conv.lastTime = 'Just now'
    conv.unread = false
    saveLocal()
  }

  function updateAgency(newProfile) {
    agency.value = { ...agency.value, ...newProfile }
    saveLocal()
  }

  function toggleClientPortalMode(force) {
    clientPortalViewMode.value = force !== undefined ? force : !clientPortalViewMode.value
    saveLocal()
  }

  function sendDunningNotice(clientId) {
    const item = billing.value.clientRetainers.find(c => c.client_id === clientId)
    if (item) {
      item.dunning_attempts++
      saveLocal()
    }
  }

  function updateRules(rules) {
    automationRules.value = { ...automationRules.value, ...rules }
    saveLocal()
  }

  function saveLocal() {
    try {
      localStorage.setItem('callrescue_state', JSON.stringify({
        agency: agency.value,
        clients: clients.value,
        billing: billing.value,
        automationRules: automationRules.value,
        whiteLabelDns: whiteLabelDns.value
      }))
    } catch (e) {
      // Ignore in SSR/sandbox
    }
  }

  function loadLocal() {
    try {
      const saved = localStorage.getItem('callrescue_state')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.agency) agency.value = parsed.agency
        if (parsed.clients) clients.value = parsed.clients
        if (parsed.billing) billing.value = parsed.billing
        if (parsed.automationRules) automationRules.value = parsed.automationRules
        if (parsed.whiteLabelDns) whiteLabelDns.value = parsed.whiteLabelDns
      }
    } catch (e) {
      // fallback
    }
  }

  loadLocal()

  return {
    agency,
    clientPortalViewMode,
    clients,
    selectedClientId,
    selectedClient,
    calls,
    conversations,
    automationRules,
    integrations,
    billing,
    whiteLabelDns,
    totalMonthlyRetainers,
    totalCallsRescued,
    totalRevenueSaved,
    simulateIncomingMissedCall,
    sendSmsReply,
    updateAgency,
    toggleClientPortalMode,
    sendDunningNotice,
    updateRules
  }
})
