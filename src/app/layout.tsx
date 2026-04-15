import type { Metadata } from 'next'
import { Playfair_Display, Lora } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/layout/Navbar'
import DustParticles from '@/components/layout/DustParticles'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BookShelf — A Private Study for Readers',
  description: 'Step into a quiet study. Search millions of books, curate your collection, and discover what the community treasures.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable}`}>
      <body className="wood-bg min-h-screen" style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}>
        <ClerkProvider appearance={{
          variables: {
            colorPrimary: '#b8860b',
            colorBackground: '#2a2018',
            colorText: '#e8dcc8',
            colorTextOnPrimaryBackground: '#1a1410',
            colorTextSecondary: '#c9a84c',
            colorInputBackground: '#3d2e1e',
            colorInputText: '#e8dcc8',
            colorNeutral: '#e8dcc8',
            colorDanger: '#8a3a4e',
            borderRadius: '3px',
            fontFamily: 'Lora, Georgia, serif',
          },
          elements: {
            card: {
              background: 'linear-gradient(170deg, #2a2018 0%, #1a1410 100%)',
              border: '1px solid #5a4530',
              boxShadow: '0 8px 32px rgba(10, 8, 5, 0.6)',
            },
            headerTitle: {
              fontFamily: 'var(--font-playfair), Georgia, serif',
              color: '#f0e4cf',
            },
            headerSubtitle: {
              color: '#8b7340',
            },
            profileSectionTitle: {
              fontFamily: 'var(--font-playfair), Georgia, serif',
              color: '#f0e4cf',
            },
            profileSectionTitleText: {
              color: '#f0e4cf',
            },
            profileSectionContent: {
              color: '#e8dcc8',
            },
            userPreviewMainIdentifier: {
              color: '#f0e4cf',
            },
            userPreviewSecondaryIdentifier: {
              color: '#8b7340',
            },
            userButtonPopoverCard: {
              background: 'linear-gradient(170deg, #2a2018 0%, #1a1410 100%)',
              border: '1px solid #5a4530',
            },
            userButtonPopoverActionButton: {
              color: '#e8dcc8',
            },
            userButtonPopoverActionButtonText: {
              color: '#e8dcc8',
            },
            userButtonPopoverActionButtonIcon: {
              color: '#b8860b',
            },
            userButtonPopoverFooter: {
              display: 'none',
            },
            formButtonPrimary: {
              background: 'linear-gradient(135deg, #b8860b 0%, #8b7340 100%)',
              color: '#1a1410',
              fontFamily: 'Lora, Georgia, serif',
            },
            formFieldLabel: {
              color: '#e8dcc8',
            },
            formFieldInput: {
              background: '#3d2e1e',
              borderColor: '#5a4530',
              color: '#e8dcc8',
            },
            footerActionLink: {
              color: '#b8860b',
            },
            dividerLine: {
              background: '#5a4530',
            },
            dividerText: {
              color: '#8b7340',
            },
            socialButtonsBlockButton: {
              background: '#3d2e1e',
              borderColor: '#5a4530',
              color: '#e8dcc8',
            },
            badge: {
              background: '#3d2e1e',
              color: '#c9a84c',
              borderColor: '#5a4530',
            },
            avatarBox: {
              borderColor: '#5a4530',
            },
            navbar: {
              background: 'transparent',
              borderColor: '#5a4530',
            },
            navbarButton: {
              color: '#e8dcc8',
            },
            pageScrollBox: {
              background: 'transparent',
            },
            page: {
              background: 'transparent',
            },
            menuButton: {
              color: '#e8dcc8',
            },
            menuList: {
              background: '#2a2018',
              borderColor: '#5a4530',
            },
            menuItem: {
              color: '#e8dcc8',
            },
            identityPreview: {
              color: '#e8dcc8',
            },
            identityPreviewText: {
              color: '#e8dcc8',
            },
            identityPreviewEditButton: {
              color: '#b8860b',
            },
            profileSectionItem: {
              color: '#e8dcc8',
            },
            profileSectionItem__emailAddresses: {
              color: '#e8dcc8',
            },
            profileSectionItem__connectedAccounts: {
              color: '#e8dcc8',
            },
            profileSectionPrimaryButton: {
              color: '#b8860b',
            },
            accordionTriggerButton: {
              color: '#e8dcc8',
            },
            accordionContent: {
              color: '#e8dcc8',
            },
            activeDevice: {
              color: '#e8dcc8',
            },
            activeDeviceListItem: {
              color: '#e8dcc8',
            },
            tableHead: {
              color: '#8b7340',
            },
            formFieldInfoText: {
              color: '#8b7340',
            },
            tagInputContainer: {
              background: '#3d2e1e',
              borderColor: '#5a4530',
              color: '#e8dcc8',
            },
            providerIcon: {
              filter: 'brightness(1.3)',
            },
            // Force cream color on all remaining text inside the profile
            rootBox: {
              color: '#e8dcc8',
            },
            cardBox: {
              color: '#e8dcc8',
            },
            main: {
              color: '#e8dcc8',
            },
            profilePage: {
              color: '#e8dcc8',
            },
            scrollBox: {
              color: '#e8dcc8',
            },
          },
        }}>
          <div className="warm-glow" />
          <DustParticles />
          <div className="relative z-10">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  )
}
