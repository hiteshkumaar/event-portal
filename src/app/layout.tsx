import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { Toaster } from '@/components/ui/sonner'


export default function RootLayout({ children }:{children: React.ReactNode}) {
return (
<html lang="en">
<body>
<ReactQueryProvider>
{children}
<Toaster />
</ReactQueryProvider>
</body>
</html>
)
}