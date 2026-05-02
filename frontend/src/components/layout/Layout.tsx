import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CompareBar } from '@/components/universities/CompareBar'

interface LayoutProps {
  children: React.ReactNode
  hideFooter?: boolean
}

export function Layout({ children, hideFooter }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <CompareBar />
      {!hideFooter && <Footer />}
    </div>
  )
}
