import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { Toaster } from '@/components/ui/sonner'
import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ReactQueryProvider>
                    {children}
                    <Toaster />
                </ReactQueryProvider>
            </body>
        </html>
    )
}