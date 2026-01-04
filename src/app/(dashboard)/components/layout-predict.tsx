'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FallingNumbers from '@/components/FallingNumbers';

interface DashboardSplitLayoutProps {
  sidebarTitle: string;
  sidebarContent: ReactNode;
  headerContent?: ReactNode;
  children: ReactNode;
  showBackground?: boolean;
}

export default function PredictLayout({
  sidebarTitle,
  sidebarContent,
  headerContent,
  children,
  showBackground = true,
}: DashboardSplitLayoutProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black flex overflow-hidden">
      {showBackground && <FallingNumbers count={30} speed={1.5} fontSize={24} />}
      <aside 
        className="
          w-[350px] h-full flex flex-col shrink-0
          bg-black/40 backdrop-blur-xl border-r border-white/10
          p-6 z-20
          overflow-y-auto custom-scrollbar
        "
      >
        <div className="flex items-center gap-2 mb-8 shrink-0">
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => router.back()}
                sx={{ 
                  color: '#9ca3af', 
                  minWidth: '40px', 
                  padding: 0, 
                  '&:hover': { color: 'white', backgroundColor: 'transparent' } 
                }}
            />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
              {sidebarTitle}
            </h2>
        </div>

        <div className="flex-1 flex flex-col">
          {sidebarContent}
        </div>
      </aside>

      <main className="flex-1 h-full flex flex-col relative z-10 min-w-0">
        {headerContent && (
          <header className="px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-sm flex justify-between items-center shrink-0 animate-slide-down">
            {headerContent}
          </header>
        )}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar animate-fade-in">
           {children}
        </div>

      </main>
    </div>
  );
}