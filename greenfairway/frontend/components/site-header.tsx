'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Leaf, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from './auth-modal'

const navLinks = [
  { label: 'Problem', href: '#problem' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Assessment', href: '#assessment' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Biodiversity', href: '#biodiversity' },
]

export function SiteHeader() {
  const { user, logout } = useAuth()
  const [modal, setModal] = useState<'login' | 'register' | null>(null)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="size-5" />
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
              GreenFairway
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/bees"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Bees on Course
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
                  <User className="size-4" />
                  {user.username}
                </span>
                <Button variant="ghost" onClick={logout} className="text-foreground">
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setModal('login')}
                  className="hidden text-foreground sm:inline-flex"
                >
                  Sign in
                </Button>
                <Button onClick={() => setModal('register')}>Start Assessment</Button>
              </>
            )}
          </div>
        </div>
      </header>
      {modal && <AuthModal onClose={() => setModal(null)} defaultTab={modal} />}
    </>
  )
}