import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from './context/AppContext'

export const metadata: Metadata = {
  title: 'Plant Disease Detector',
  description: 'AI-powered plant disease detection using Google Gemini',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <style dangerouslySetInnerHTML={{
          __html: `
          body::-webkit-scrollbar { display: none; }
          /* Hide Next.js Dev Tools & Error Overlay */
          [data-nextjs-toast], [data-nextjs-toast-errors-parent], .nextjs-toast-errors-parent {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          /* Ensure no other fixed overlays at bottom-left */
          #__next-build-watcher, #__next-prerender-indicator {
            display: none !important;
          }
        `}} />
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}

