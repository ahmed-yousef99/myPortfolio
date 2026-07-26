const ANALYTICS_KEY = 'ahmed_youssef_analytics_enabled'

type EventName =
  | 'page_view'
  | 'cta_click'
  | 'whatsapp_click'
  | 'form_submit'
  | 'form_error'
  | 'project_view'
  | 'language_switch'

interface AnalyticsEvent {
  name: EventName
  properties?: Record<string, string | number | boolean>
  timestamp: number
}

function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem(ANALYTICS_KEY)
    return stored !== 'false'
  } catch {
    return true
  }
}

function sendToAnalytics(event: AnalyticsEvent) {
  if (!isAnalyticsEnabled()) return

  try {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as Record<string, unknown>).gtag as
        | ((...args: unknown[]) => void)
        | undefined
      gtag?.('event', event.name, {
        ...event.properties,
        timestamp: event.timestamp,
      })
    }

    if (typeof window !== 'undefined' && 'fbq' in window) {
      const fbq = (window as Record<string, unknown>).fbq as
        | ((...args: unknown[]) => void)
        | undefined
      fbq?.('trackCustom', event.name, event.properties)
    }
  } catch {
    // analytics should never break the app
  }
}

export function trackPageView(path: string) {
  sendToAnalytics({
    name: 'page_view',
    properties: { path },
    timestamp: Date.now(),
  })
}

export function trackCtaClick(label: string) {
  sendToAnalytics({
    name: 'cta_click',
    properties: { label },
    timestamp: Date.now(),
  })
}

export function trackWhatsappClick(location: string) {
  sendToAnalytics({
    name: 'whatsapp_click',
    properties: { location },
    timestamp: Date.now(),
  })
}

export function trackFormSubmit(status: 'success' | 'error') {
  sendToAnalytics({
    name: 'form_submit',
    properties: { status },
    timestamp: Date.now(),
  })
}

export function trackProjectView(projectTitle: string) {
  sendToAnalytics({
    name: 'project_view',
    properties: { project: projectTitle },
    timestamp: Date.now(),
  })
}

export function trackLanguageSwitch(from: string, to: string) {
  sendToAnalytics({
    name: 'language_switch',
    properties: { from, to },
    timestamp: Date.now(),
  })
}

export function initAnalytics() {
  trackPageView(window.location.pathname)

  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  history.pushState = function (...args) {
    originalPushState.apply(this, args)
    trackPageView(window.location.pathname)
  }

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args)
    trackPageView(window.location.pathname)
  }

  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname)
  })
}
