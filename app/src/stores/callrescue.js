import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, isConfigured, setCustomSupabaseCredentials, testSupabaseConnection } from '../services/supabase'

export const useCallRescueStore = defineStore('callrescue', () => {
  const isSupabaseActive = ref(isConfigured)
  const isSyncing = ref(false)
  const syncError = ref(null)

  // Agency Profile / White-Label
  const agency = ref({
    agency_name: 'Apex Call Care & Lead Growth',
    agency_tagline: 'Speed-to-Lead & Missed-Call Recovery Infrastructure',
    brand_color: '#f59e0b', // Amber 500
    custom_domain: 'rescue.apexleadgrowth.com',
    contact_email: 'concierge@apexleadgrowth.com',
    logo_icon: 'PhoneCall'
  })

  // Simulated Client View Mode
  const clientPortalViewMode = ref(false)

  // Safe Default Client Structure
  const fallbackClient = {
    id: 'placeholder',
    business_name: 'Demo Client Account',
    slug: 'demo-client',
    owner_name: 'Practice Manager',
    phone: '+1 (415) 555-0100',
    carrier_forwarding_number: '+1 (415) 800-4900',
    industry: 'Healthcare & Local Services',
    monthly_retainer: 199,
    status: 'active',
    calls_rescued_month: 0,
    total_missed_calls: 0,
    rescue_rate: 100,
    revenue_saved_month: 0,
    avg_latency_sec: 3.4,
    card_brand: 'Visa',
    card_last4: '4242',
    next_billing: 'Nov 1, 2026'
  }

  // Client Accounts (Loaded from Supabase)
  const clients = ref([])
  const selectedClientId = ref('')

  const selectedClient = computed(() => {
    return clients.value.find(c => c.id === selectedClientId.value) || clients.value[0] || fallbackClient
  })

  // Live Call Radar Logs
  const recentCalls = ref([])

  // Two-Way SMS Thread Messages
  const messages = ref([])

  // Automation Settings
  const automations = ref({
    instant_sms_template: 'Hi {first_name}, this is Dr. Robert Dental Studio. We missed your call — how can we help you right now? Reply here for priority booking.',
    typing_delay_sec: 4,
    enable_webchat_widget: true,
    keyword_escalation: 'emergency'
  })

  // Integrations Config
  const integrations = ref({
    twilioSms: {
      account_sid: 'AC_CALLRESCUE_PROD_9918',
      sender_phone: '+1 (415) 800-4921',
      status: 'verified'
    },
    carrierForwarding: {
      carrier_type: 'AT&T / Verizon / T-Mobile / Comcast VoIP',
      forwarding_code: '*71 +1 (415) 800-4921',
      status: 'active'
    },
    crmSync: {
      dentrix_webhook: 'https://api.callrescue.app/v1/sync/dentrix/webhook',
      status: 'connected'
    }
  })

  // Retainer Billing
  const billing = ref({
    wholesaleSubscription: {
      plan_name: 'Agency Pro (Unlimited Clients)',
      price: 89,
      accounts_used: computed(() => clients.value.length),
      accounts_included: 25,
      payment_method: 'Visa •••• 9921',
      next_billing_date: 'Nov 1, 2026'
    },
    stripeConnect: {
      charges_enabled: true,
      balance_available: 3490.00
    },
    clientRetainers: [
      { client_id: 'client-1', client_name: 'Dr. Robert Dental Studio', monthly_fee: 199, card_brand: 'Visa', card_last4: '4242', status: 'paid', next_charge_date: 'Nov 1, 2026', dunning_attempts: 0 }
    ]
  })

  // White-Label DNS
  const whiteLabelDns = ref({
    custom_cname: 'rescue.apexleadgrowth.com',
    cname_target: 'app.callrescue.io',
    status: 'verified',
    sender_name: 'Apex Speed-to-Lead Hub',
    sender_email: 'dispatch@apexleadgrowth.com'
  })

  // Computed Totals
  const totalMonthlyRetainers = computed(() => {
    return clients.value.reduce((acc, c) => acc + (Number(c.monthly_retainer) || 0), 0)
  })

  const totalCallsRescued = computed(() => {
    return clients.value.reduce((acc, c) => acc + (Number(c.calls_rescued_month) || 0), 0)
  })

  const totalRevenueSaved = computed(() => {
    return clients.value.reduce((acc, c) => acc + (Number(c.revenue_saved_month) || 0), 0)
  })

  // --- SUPABASE DATA SYNC ---
  async function fetchFromSupabase() {
    if (!supabase) return
    isSyncing.value = true
    syncError.value = null

    try {
      // 1. Fetch Client Accounts
      const { data: clientRows, error: clientErr } = await supabase
        .from('client_accounts')
        .select('*')
        .order('created_at', { ascending: false })

      if (clientErr) throw clientErr

      if (clientRows && clientRows.length > 0) {
        clients.value = clientRows.map(r => ({
          id: r.id,
          business_name: r.business_name,
          slug: r.slug,
          owner_name: r.owner_name,
          phone: r.owner_phone || r.phone,
          carrier_forwarding_number: r.forward_number || r.carrier_forwarding_number,
          industry: r.category || r.industry || 'Local Services',
          monthly_retainer: Number(r.monthly_retainer) || 199,
          status: r.status || 'active',
          calls_rescued_month: Number(r.leads_rescued_month || r.calls_rescued_month || 0),
          total_missed_calls: Number(r.missed_calls_month || r.total_missed_calls || 0),
          rescue_rate: Number(r.rescue_rate || 94.2),
          revenue_saved_month: Number(r.estimated_pipeline_saved || r.revenue_saved_month || 0),
          avg_latency_sec: Number(r.avg_rescue_seconds || r.avg_latency_sec || 3.4),
          card_brand: r.card_brand || 'Visa',
          card_last4: r.card_last4 || '4242',
          next_billing: r.next_billing || 'Nov 1, 2026'
        }))
        if (!selectedClientId.value || !clients.value.find(c => c.id === selectedClientId.value)) {
          selectedClientId.value = clients.value[0].id
        }
      }

      // 2. Fetch Call Logs
      const { data: callRows, error: callErr } = await supabase
        .from('call_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)

      if (!callErr && callRows && callRows.length > 0) {
        recentCalls.value = callRows.map(c => ({
          id: c.id,
          caller_name: c.caller_name,
          caller_number: c.caller_number,
          time_ago: formatTimeAgo(c.created_at),
          call_status: c.call_status,
          latency_sec: Number(c.latency_seconds || 3.2),
          lead_recovered: c.call_status === 'rescued',
          estimated_value: Number(c.estimated_value || 450)
        }))
      }

      // 3. Fetch SMS Threads
      const { data: msgRows, error: msgErr } = await supabase
        .from('sms_threads')
        .select('*')
        .order('created_at', { ascending: true })

      if (!msgErr && msgRows && msgRows.length > 0) {
        messages.value = msgRows.map(m => ({
          id: m.id,
          sender: m.sender_role === 'staff' ? (m.staff_name || 'Staff') : (m.sender_role === 'bot' ? 'CallRescue Bot' : 'Caller'),
          role: m.sender_role,
          message: m.message_text,
          timestamp: formatTime(m.created_at),
          channel: 'sms'
        }))
      }

      isSupabaseActive.value = true
    } catch (err) {
      console.warn('Supabase fetch notice:', err.message)
      syncError.value = err.message
    } finally {
      isSyncing.value = false
    }
  }

  // --- ACTIONS (Write to Supabase + Real-Time Local State) ---
  async function simulateMissedCall(callerName = 'David Miller', callerPhone = '+1 (415) 555-0819') {
    const activeClient = selectedClient.value
    const newCall = {
      id: 'call-' + Date.now(),
      caller_name: callerName,
      caller_number: callerPhone,
      time_ago: 'Just now',
      call_status: 'rescued',
      latency_sec: 3.2,
      lead_recovered: true,
      estimated_value: 450
    }

    recentCalls.value.unshift(newCall)
    if (activeClient) {
      activeClient.calls_rescued_month++
      activeClient.total_missed_calls++
      activeClient.revenue_saved_month += 450
    }

    const botReply = {
      id: 'msg-' + Date.now(),
      sender: 'CallRescue Bot',
      role: 'bot',
      message: `Hi ${callerName}, this is ${activeClient?.business_name || 'Front Desk'}. We missed your call — how can we help you right now? Reply here for priority booking.`,
      timestamp: 'Just now',
      channel: 'sms'
    }
    messages.value.push(botReply)

    // Persist to Supabase if connected
    if (supabase && activeClient && activeClient.id !== 'placeholder') {
      try {
        await supabase.from('call_logs').insert({
          client_id: activeClient.id,
          caller_name: callerName,
          caller_number: callerPhone,
          call_status: 'rescued',
          latency_seconds: 3.2,
          estimated_value: 450
        })
        await supabase.from('sms_threads').insert({
          client_id: activeClient.id,
          caller_number: callerPhone,
          sender_role: 'bot',
          message_text: botReply.message
        })
      } catch (e) {
        console.warn('Supabase log insert notice:', e.message)
      }
    }

    return newCall
  }

  async function dispatchStaffReply(messageText, staffName = 'Dr. Sarah Robert') {
    const reply = {
      id: 'msg-' + Date.now(),
      sender: staffName,
      role: 'staff',
      message: messageText,
      timestamp: 'Just now',
      channel: 'sms'
    }
    messages.value.push(reply)

    if (supabase && selectedClient.value && selectedClient.value.id !== 'placeholder') {
      try {
        await supabase.from('sms_threads').insert({
          client_id: selectedClient.value.id,
          caller_number: selectedClient.value.phone || '+14155550100',
          sender_role: 'staff',
          staff_name: staffName,
          message_text: messageText
        })
      } catch (e) {
        console.warn('Supabase sms dispatch notice:', e.message)
      }
    }
  }

  async function addClient(newClientData) {
    const clientRecord = {
      id: 'client-' + Date.now(),
      business_name: newClientData.business_name,
      slug: newClientData.slug || newClientData.business_name.toLowerCase().replace(/\s+/g, '-'),
      owner_name: newClientData.owner_name || 'Account Owner',
      phone: newClientData.phone,
      carrier_forwarding_number: newClientData.carrier_forwarding_number || '+1 (415) 800-4999',
      industry: newClientData.industry || 'Local Services',
      monthly_retainer: Number(newClientData.monthly_retainer) || 199,
      status: 'active',
      calls_rescued_month: 0,
      total_missed_calls: 0,
      rescue_rate: 100,
      revenue_saved_month: 0,
      avg_latency_sec: 3.4,
      card_brand: 'Visa',
      card_last4: '4242',
      next_billing: 'Nov 1, 2026'
    }

    clients.value.unshift(clientRecord)
    selectedClientId.value = clientRecord.id

    if (supabase) {
      try {
        const { data, error } = await supabase.from('client_accounts').insert({
          business_name: clientRecord.business_name,
          slug: clientRecord.slug,
          owner_name: clientRecord.owner_name,
          owner_phone: clientRecord.phone,
          forward_number: clientRecord.phone,
          tracking_number: clientRecord.carrier_forwarding_number,
          category: clientRecord.industry,
          monthly_retainer: clientRecord.monthly_retainer,
          status: 'active'
        }).select().single()

        if (!error && data) {
          clientRecord.id = data.id
        }
      } catch (e) {
        console.warn('Supabase client insert notice:', e.message)
      }
    }

    return clientRecord
  }

  // 1-Click Database Seed into Supabase (Populates live tables in Supabase)
  async function seedSupabaseDatabase() {
    if (!supabase) {
      alert('Please configure your Supabase URL & Anon Key first!')
      return
    }

    isSyncing.value = true
    try {
      const demoClients = [
        {
          business_name: 'Dr. Robert Dental Studio',
          slug: 'dr-robert-dental',
          owner_name: 'Dr. Sarah Robert',
          owner_phone: '+1 (415) 555-0199',
          forward_number: '+1 (415) 555-0199',
          tracking_number: '+1 (415) 800-4921',
          category: 'Cosmetic & Emergency Dentistry',
          monthly_retainer: 199.00,
          missed_calls_month: 46,
          leads_rescued_month: 42,
          avg_rescue_seconds: 3.4,
          estimated_pipeline_saved: 16800.00,
          status: 'active'
        },
        {
          business_name: 'Apex Heating & Air HVAC',
          slug: 'apex-hvac',
          owner_name: 'Dave Vance',
          owner_phone: '+1 (415) 555-0144',
          forward_number: '+1 (415) 555-0144',
          tracking_number: '+1 (415) 800-4922',
          category: 'Residential & Emergency HVAC',
          monthly_retainer: 249.00,
          missed_calls_month: 61,
          leads_rescued_month: 58,
          avg_rescue_seconds: 2.9,
          estimated_pipeline_saved: 26100.00,
          status: 'active'
        },
        {
          business_name: 'Horizon Injury Law Group',
          slug: 'horizon-law',
          owner_name: 'Marcus Sterling',
          owner_phone: '+1 (415) 555-0177',
          forward_number: '+1 (415) 555-0177',
          tracking_number: '+1 (415) 800-4923',
          category: 'Personal Injury & Civil Litigation',
          monthly_retainer: 299.00,
          missed_calls_month: 20,
          leads_rescued_month: 19,
          avg_rescue_seconds: 2.1,
          estimated_pipeline_saved: 45000.00,
          status: 'active'
        }
      ]

      const { data: insertedClients, error: insertErr } = await supabase
        .from('client_accounts')
        .insert(demoClients)
        .select()

      if (insertErr) throw insertErr

      alert('✅ Successfully populated Supabase database with initial client accounts!')
      await fetchFromSupabase()
    } catch (err) {
      alert('Seed Error: ' + err.message)
    } finally {
      isSyncing.value = false
    }
  }

  function updateAgency(newProfile) {
    agency.value = { ...agency.value, ...newProfile }
  }

  function toggleClientPortalMode(force) {
    clientPortalViewMode.value = force !== undefined ? force : !clientPortalViewMode.value
  }

  function sendDunningNotice(clientId) {
    const item = billing.value.clientRetainers.find(c => c.client_id === clientId)
    if (item) {
      item.dunning_attempts++
    }
  }

  function formatTimeAgo(dateString) {
    if (!dateString) return 'Just now'
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  function formatTime(dateString) {
    if (!dateString) return 'Just now'
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Load from Supabase on startup
  fetchFromSupabase()

  return {
    isSupabaseActive,
    isSyncing,
    syncError,
    agency,
    clientPortalViewMode,
    clients,
    selectedClientId,
    selectedClient,
    recentCalls,
    messages,
    automations,
    integrations,
    billing,
    whiteLabelDns,
    totalMonthlyRetainers,
    totalCallsRescued,
    totalRevenueSaved,
    fetchFromSupabase,
    simulateMissedCall,
    dispatchStaffReply,
    addClient,
    seedSupabaseDatabase,
    updateAgency,
    toggleClientPortalMode,
    sendDunningNotice,
    setCustomSupabaseCredentials,
    testSupabaseConnection
  }
})
