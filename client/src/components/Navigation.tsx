import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Home, Compass, ShoppingCart, Users, User, Settings, HelpCircle,
  Wallet, Zap, Gamepad2, Radio, TrendingUp, Code, Lock, Bell,
  MoreHorizontal, Menu, X
} from "lucide-react";
import { useState } from "react";

const navCategories = {
  "E-Commerce": [
    { name: "Marketplace", path: "/marketplace" },
    { name: "Shopping Cart", path: "/shoppingcart" },
    { name: "Checkout", path: "/checkout" },
    { name: "Orders", path: "/ordertracking" },
  ],
  "Finance": [
    { name: "Wallet", path: "/walletoverview" },
    { name: "Trading", path: "/tokenswap" },
    { name: "Staking", path: "/stakingdashboard" },
    { name: "Portfolio", path: "/portfoliotracker" },
  ],
  "Social": [
    { name: "Feed", path: "/social" },
    { name: "Community", path: "/communityhub" },
    { name: "Messages", path: "/directmessages" },
    { name: "Notifications", path: "/notificationcenter" },
  ],
  "Gaming": [
    { name: "Games", path: "/gamelobby" },
    { name: "Tournaments", path: "/tournaments" },
    { name: "Leaderboards", path: "/leaderboards" },
    { name: "Achievements", path: "/achievements" },
  ],
  "Content": [
    { name: "Streaming", path: "/streaming" },
    { name: "Blog", path: "/blogeditor" },
    { name: "Videos", path: "/videouploader" },
    { name: "Gallery", path: "/imagegallery" },
  ],
  "Admin": [
    { name: "Dashboard", path: "/admindashboard" },
    { name: "Users", path: "/usermanagement" },
    { name: "Analytics", path: "/analyticsdashboard" },
    { name: "Logs", path: "/systemlogs" },
  ],
};

export function TopNavigation() {
  return (
    <nav className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
            SKY4444
          </a>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {Object.entries(navCategories).map(([category, items]) => (
            <DropdownMenu key={category}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  {category}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>{category}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {items.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <a>
                      <DropdownMenuItem className="cursor-pointer">
                        {item.name}
                      </DropdownMenuItem>
                    </a>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/settings">
            <a>
              <Button size="icon" variant="ghost">
                <Settings className="w-5 h-5" />
              </Button>
            </a>
          </Link>
          <Link href="/profile">
            <a>
              <Button size="icon" variant="ghost">
                <User className="w-5 h-5" />
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function BottomNavigation() {
  const items = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Explore", icon: Compass, path: "/explore" },
    { label: "Shop", icon: ShoppingCart, path: "/marketplace" },
    { label: "Community", icon: Users, path: "/communityhub" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950 md:hidden">
      <div className="flex items-center justify-between px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <a className="flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex flex-col items-center gap-1 h-auto py-2"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </a>
            </Link>
          );
        })}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 flex flex-col items-center gap-1 h-auto py-2"
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-xs">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mb-20">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(navCategories).map(([category]) => (
              <Link key={category} href={`/${category.toLowerCase()}`}>
                <a>
                  <DropdownMenuItem className="cursor-pointer">
                    {category}
                  </DropdownMenuItem>
                </a>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
