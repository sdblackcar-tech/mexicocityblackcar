import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Lux Tour Travel"
const ADMIN_EMAIL = "info@luxtourtravel.com"

interface AdminBookingNotificationProps {
  guest_name?: string
  guest_email?: string
  guest_phone?: string
  service_type?: string
  vehicle_type?: string
  pickup_location?: string
  dropoff_location?: string
  requested_date?: string
  requested_time?: string
  hours?: number
  miles?: number
  quoted_total?: number
  conversation_summary?: string
}

const AdminBookingNotificationEmail = (props: AdminBookingNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New booking request from {props.guest_name || 'a guest'} — {props.service_type || 'inquiry'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={brandText}>LUX TOUR TRAVEL</Text>
          <Text style={brandSubtext}>MIKEY CONCIERGE</Text>
        </Section>

        <Hr style={divider} />

        <Heading style={h1}>New Booking Request</Heading>

        <Section style={detailsSection}>
          <Text style={label}>Guest</Text>
          <Text style={value}>{props.guest_name || 'Not provided'}</Text>

          {props.guest_email && <>
            <Text style={label}>Email</Text>
            <Text style={value}>{props.guest_email}</Text>
          </>}

          {props.guest_phone && <>
            <Text style={label}>Phone</Text>
            <Text style={value}>{props.guest_phone}</Text>
          </>}
        </Section>

        <Hr style={divider} />

        <Section style={detailsSection}>
          <Text style={label}>Service</Text>
          <Text style={value}>{props.service_type || 'Inquiry'}</Text>

          {props.vehicle_type && <>
            <Text style={label}>Vehicle</Text>
            <Text style={value}>{props.vehicle_type}</Text>
          </>}

          {props.pickup_location && <>
            <Text style={label}>Pickup</Text>
            <Text style={value}>{props.pickup_location}</Text>
          </>}

          {props.dropoff_location && <>
            <Text style={label}>Dropoff</Text>
            <Text style={value}>{props.dropoff_location}</Text>
          </>}

          {props.requested_date && <>
            <Text style={label}>Date</Text>
            <Text style={value}>{props.requested_date}{props.requested_time ? ` at ${props.requested_time}` : ''}</Text>
          </>}

          {(props.hours && props.hours > 0) ? <>
            <Text style={label}>Duration</Text>
            <Text style={value}>{props.hours}h</Text>
          </> : null}

          {(props.miles && props.miles > 0) ? <>
            <Text style={label}>Distance</Text>
            <Text style={value}>~{props.miles} mi</Text>
          </> : null}
        </Section>

        {props.quoted_total ? <>
          <Hr style={divider} />
          <Section style={totalSection}>
            <Text style={totalLabel}>QUOTED TOTAL</Text>
            <Text style={totalValue}>${props.quoted_total.toFixed(2)}</Text>
          </Section>
        </> : null}

        {props.conversation_summary ? <>
          <Hr style={divider} />
          <Text style={label}>Conversation Summary</Text>
          <Text style={summaryText}>{props.conversation_summary.slice(0, 800)}</Text>
        </> : null}

        <Hr style={divider} />
        <Text style={footer}>This request was submitted via the Mikey AI concierge on mexicocityblackcar.com</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminBookingNotificationEmail,
  subject: (data: Record<string, any>) =>
    `New booking: ${data.guest_name || 'Guest'} — ${data.service_type || 'inquiry'}`,
  to: ADMIN_EMAIL,
  displayName: 'Admin booking notification',
  previewData: {
    guest_name: 'John Smith',
    guest_email: 'john@example.com',
    service_type: 'airport',
    vehicle_type: 'Executive SUV',
    pickup_location: 'AICM Terminal 1',
    dropoff_location: 'W Hotel Polanco',
    requested_date: '2026-04-15',
    requested_time: '14:00',
    miles: 12,
    quoted_total: 170.00,
    conversation_summary: 'user: I need an airport transfer from AICM to Polanco\nassistant: I can arrange that for you...',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '32px 24px', maxWidth: '520px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, marginBottom: '8px' }
const brandText = { fontSize: '18px', fontWeight: 'bold', color: '#1a1a0e', letterSpacing: '3px', margin: '0' }
const brandSubtext = { fontSize: '10px', color: '#8b7a5e', letterSpacing: '4px', margin: '4px 0 0' }
const h1 = { fontSize: '20px', fontWeight: '600', color: '#1a1a0e', margin: '24px 0 16px' }
const divider = { borderColor: '#e8e0d0', margin: '16px 0' }
const detailsSection = { margin: '0' }
const label = { fontSize: '11px', color: '#8b7a5e', letterSpacing: '1px', textTransform: 'uppercase' as const, margin: '12px 0 2px', fontWeight: '600' }
const value = { fontSize: '14px', color: '#1a1a0e', margin: '0 0 4px', lineHeight: '1.4' }
const totalSection = { textAlign: 'center' as const, padding: '12px 0' }
const totalLabel = { fontSize: '11px', color: '#8b7a5e', letterSpacing: '2px', margin: '0 0 4px' }
const totalValue = { fontSize: '28px', fontWeight: 'bold', color: '#8b7a5e', margin: '0' }
const summaryText = { fontSize: '12px', color: '#555', lineHeight: '1.5', margin: '4px 0', whiteSpace: 'pre-wrap' as const }
const footer = { fontSize: '11px', color: '#999', textAlign: 'center' as const, margin: '24px 0 0' }
