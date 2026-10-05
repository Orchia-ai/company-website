type AnalyticsWindow = Window & {
  gtag?: (command: 'event', name: string, parameters: Record<string, string>) => void
}

function trackEvent(name: string, parameters: Record<string, string>) {
  if (!['orchia.studio', 'www.orchia.studio'].includes(window.location.hostname)) return

  try {
    const gtag = (window as AnalyticsWindow).gtag
    gtag?.('event', name, {
      ...parameters,
      send_to: 'G-51XMBQ2Q9N',
    })
  } catch {
    // Analytics must never interrupt a successful submission or navigation.
  }
}

// Send only fixed form names, never visitor names, emails, messages or websites.
export function trackLead(formName: 'promotion_video' | 'workspace_request' | 'studio_contact') {
  trackEvent('generate_lead', { form_name: formName })
}

export function trackBookingClick(page: 'promotion_video' | 'house_tour') {
  trackEvent('booking_click', { booking_page: page })
}
