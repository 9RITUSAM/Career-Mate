import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { BarChart, BarChart3, BookOpen, ChevronDown, ClipboardCheck, Compass, FileText, FileTextIcon, GraduationCap, Heart, LayoutDashboard, Lightbulb, List, PenBox, PieChart, PlusCircle, Smile, StarIcon, Wallet } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { checkUser } from '@/lib/checkUser';


const Header = async () => {
  await checkUser();
  return (
    <header className="fixed-top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between ">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Career-mate Logo"
            width={200}
            height={40}
            style={{
              height: 'auto',
              width: 'auto',
              maxWidth: '200px'
            }}
          />
        </Link>

        <div className="flex item-center space-x-2 md:space-x-4">
          <Link href="/dashboard">
            <Button varient="outline">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:block">Dashboard</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden md:block">Academic Insights</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link
                  href={"/document-manager"}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Document Manager</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/skill-gap"} className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Personal Records</span>
                </Link>
              </DropdownMenuItem>
             <DropdownMenuItem>
                <Link
                  href={"https://time-table-schedular-gdfocuebstv2jzowjgepdn.streamlit.app/"}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Smart Schedule Planner</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <StarIcon className="h-4 w-4" />
                <span className="hidden md:block">Career Builder</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={"https://ats-resume-analyzer-zupvtdtyevkb68cw2xg36u.streamlit.app/"} className="flex item-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span> Resume Analyzer</span>
                </Link>
              </DropdownMenuItem>  
             <DropdownMenuItem asChild>
  <Link href="https://aimockinterview-icuvhgwktp86kvemzu2j79i.streamlit.app/" className="flex items-center gap-2">
    <GraduationCap className="h-4 w-4" />
    <span>Interview Prep</span>
  </Link>
</DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

         

        

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default Header
