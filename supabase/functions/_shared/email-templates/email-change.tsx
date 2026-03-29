/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={brandText}>LUX TOUR TRAVEL</Text>
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Confirm your email change</Heading>
        <Text style={text}>
          You requested to change your email address for {siteName} from{' '}
          <Link href={`mailto:${email}`} style={link}>
            {email}
          </Link>{' '}
          to{' '}
          <Link href={`mailto:${newEmail}`} style={link}>
            {newEmail}
          </Link>
          .
        </Text>
        <Text style={text}>
          Click the button below to confirm this change:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Email Change
        </Button>
        <Text style={footer}>
          If you didn't request this change, please secure your account
          immediately.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '32px 24px', maxWidth: '520px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, marginBottom: '8px' }
const brandText = { fontSize: '18px', fontWeight: 'bold' as const, color: '#1a1a0e', letterSpacing: '3px', margin: '0' }
const divider = { borderColor: '#e8e0d0', margin: '16px 0' }
const h1 = { fontSize: '22px', fontWeight: '600' as const, color: '#1a1a0e', margin: '24px 0 16px', fontFamily: "'Cormorant Garamond', Georgia, serif" }
const text = { fontSize: '14px', color: '#555', lineHeight: '1.5', margin: '0 0 20px' }
const link = { color: '#8b7a5e', textDecoration: 'underline' }
const button = { backgroundColor: '#c4a265', color: '#1a1a0e', fontSize: '14px', borderRadius: '4px', padding: '12px 24px', textDecoration: 'none', fontWeight: '600' as const }
const footer = { fontSize: '12px', color: '#999', margin: '30px 0 0' }
