'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart3,
  BookOpen,
  Users,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  FileQuestion,
  CreditCard,
  FileQuestionIcon,
  NotebookPen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    setIsMounted(true)

    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login')
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    router.push('/login')
  }

  if (!isMounted) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    {
      name: 'Assignments',
      href: '/assignments',
      icon: NotebookPen,
    },
    {
      name: 'Questions',
      href: '/questions',
      icon: FileQuestionIcon,
    },
    {
      name: 'Posters',
      href: '/posters',
      icon: Menu,
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      submenu: [
        { name: 'All Users', href: '/users' },
        { name: 'Subscriptions', href: '/users/subscriptions' },
      ],
    },
    {
      name: 'Content',
      href: '/content',
      icon: BookOpen,
      submenu: [
        { name: 'Subjects', href: '/content/subjects' },
        { name: 'Classes', href: '/content/classes' },
        { name: 'Topics', href: '/content/topics' },
        { name: 'Plans', href: '/content/plans' },
      ],
    },
    {
      name: 'Exams',
      href: '/exams',
      icon: FileQuestion,
      submenu: [
        { name: 'All Exams', href: '/exams' },
        { name: 'Question Papers', href: '/exams/question-papers' },
        { name: 'Challenges', href: '/exams/challenges' },
      ],
    },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className='flex h-screen flex-col'>
      {/* Fixed Header */}
      <header className='fixed top-0 z-40 w-full h-16 flex items-center gap-4 border-b bg-background px-4 md:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' size='icon' className='shrink-0'>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='flex flex-col'>
            <div className='flex items-center border-b p-4'>
              <Link
                href='/dashboard'
                className='flex items-center gap-2 font-semibold'
              >
                <BookOpen className='h-6 w-6' />
                <span>EduAdmin</span>
              </Link>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='ml-auto'>
                  <X className='h-5 w-5' />
                </Button>
              </SheetTrigger>
            </div>
            <nav className='grid gap-2 p-4'>
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`sidebar-item ${
                      isActive(item.href) ? 'active' : ''
                    }`}
                  >
                    <item.icon className='h-5 w-5' />
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className='ml-9 mt-1 grid gap-1'>
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className={`text-sm py-1 px-2 rounded-md ${
                            pathname === subitem.href
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button
                variant='ghost'
                className='sidebar-item justify-start'
                onClick={handleLogout}
              >
                <LogOut className='h-5 w-5' />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <Link
          href='/dashboard'
          className='flex items-center gap-2 font-semibold'
        >
          <BookOpen className='h-6 w-6' />
          <span>EduAdmin</span>
        </Link>
        <div className='ml-auto flex items-center gap-2'>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='rounded-full'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src='/placeholder-user.jpg' alt='Admin' />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className='flex flex-1'>
        {/* Fixed Sidebar (desktop) */}
        <aside
          className={`fixed top-0 left-0 h-screen border-r bg-background transition-all duration-300 md:block hidden ${
            isSidebarOpen ? 'w-64' : 'w-16'
          }`}
        >
          <div className='flex h-16 items-center gap-2 border-b px-4'>
            {isSidebarOpen && (
              <>
                <BookOpen className='h-6 w-6' />
                <span className='font-semibold'>EduAdmin</span>
              </>
            )}
            <Button
              variant='ghost'
              size='icon'
              className='ml-auto'
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </Button>
          </div>
          <nav className='grid gap-1 p-4'>
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        className={`sidebar-item w-full ${
                          isSidebarOpen ? 'justify-between' : 'justify-center'
                        } ${isActive(item.href) ? 'active' : ''}`}
                      >
                        <span
                          className={`flex items-center ${
                            isSidebarOpen ? 'gap-3' : ''
                          }`}
                        >
                          <item.icon className='h-5 w-5' />
                          {isSidebarOpen && item.name}
                        </span>
                        {isSidebarOpen && <ChevronDown className='h-4 w-4' />}
                      </Button>
                    </DropdownMenuTrigger>
                    {isSidebarOpen && (
                      <DropdownMenuContent
                        className='w-56'
                        align='start'
                        side='right'
                      >
                        {item.submenu.map((subitem) => (
                          <DropdownMenuItem key={subitem.name} asChild>
                            <Link href={subitem.href}>{subitem.name}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    )}
                  </DropdownMenu>
                ) : (
                  <Link
                    href={item.href}
                    className={`sidebar-item ${
                      isActive(item.href) ? 'active' : ''
                    } ${isSidebarOpen ? '' : 'justify-center'}`}
                  >
                    <item.icon className='h-5 w-5' />
                    {isSidebarOpen && item.name}
                  </Link>
                )}
              </div>
            ))}
            <Button
              variant='ghost'
              className={`sidebar-item ${
                isSidebarOpen ? 'justify-start' : 'justify-center'
              }`}
              onClick={handleLogout}
            >
              <LogOut className='h-5 w-5' />
              {isSidebarOpen && 'Logout'}
            </Button>
          </nav>
        </aside>

        {/* Main Content  */}
        <main className='flex-1 flex flex-col max-h-screen'>
          <div
            className={`w-full border-b bg-background px-6 py-3 hidden md:flex items-center justify-between transition-all duration-300 ${
              isSidebarOpen ? 'pl-64' : 'pl-16'
            }`}
          >
            <h1 className='text-xl font-semibold pl-5 capitalize'>
              {pathname === '/dashboard'
                ? 'Dashboard'
                : pathname.split('/').filter(Boolean).join(' / ')}
            </h1>
            <div className='flex items-center gap-4'>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='rounded-full'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src='/placeholder-user.jpg' alt='Admin' />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div
            className={`flex-1 overflow-y-scroll transition-all duration-300 ${
              isSidebarOpen ? 'ml-64' : 'ml-16'
            }`}
          >
            <div className='p-4 md:p-6'>{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
