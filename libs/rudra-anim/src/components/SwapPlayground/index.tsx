'use client';

import React, { useState } from 'react';
import  SwapTransition from '../SwapTransition'; 
import * as LucideIcons from 'lucide-react';

export default function SwapPlayground() {
  const [activeTab, setActiveTab] = useState('profile');
  const [animationType, setAnimationType] = useState<'fade' | 'slide-up' | 'scale' | 'flip'>('slide-up');

  // Mock content for our tabs
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <LucideIcons.User size={16} /> },
    { id: 'security', label: 'Security', icon: <LucideIcons.Shield size={16} /> },
    { id: 'billing', label: 'Billing', icon: <LucideIcons.CreditCard size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 md:p-12 font-sans flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8">
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">SwapTransition Test</h1>
          <p className="text-zinc-500">Test the AnimatePresence unmount/remount transitions.</p>
        </div>

        {/* --- CONTROLS --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          
          {/* Tab Navigation */}
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-950 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Animation Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Animation:</label>
            <select
              value={animationType}
              onChange={(e: any) => setAnimationType(e.target.value)}
              className="text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fade">Fade</option>
              <option value="slide-up">Slide Up</option>
              <option value="scale">Scale</option>
              <option value="flip">Flip</option>
            </select>
          </div>
        </div>

        {/* --- THE SWAP TRANSITION WRAPPER --- */}
        {/* Notice how we bind activeKey to the state. This triggers the animation! */}
        <div className="relative min-h-[300px]">
          <SwapTransition 
            activeKey={activeTab} 
            animation={animationType}
            duration={0.4}
          >
            {/* Everything inside here is what gets animated in and out. 
              When activeTab changes, Framer Motion takes a snapshot of the old DOM, 
              animates it out, and animates this new DOM in. 
            */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 h-full flex flex-col">
              
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <LucideIcons.User size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Profile Details</h2>
                  <p className="text-zinc-500 dark:text-zinc-400">Manage your public profile and personal information.</p>
                  <div className="h-24 bg-zinc-100 dark:bg-zinc-950 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 mt-4 flex items-center justify-center text-zinc-400 text-sm">
                    Mock Form Fields Here
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <LucideIcons.Shield size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Security Settings</h2>
                  <p className="text-zinc-500 dark:text-zinc-400">Update your password and secure your account with 2FA.</p>
                  <div className="h-24 bg-zinc-100 dark:bg-zinc-950 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 mt-4 flex items-center justify-center text-zinc-400 text-sm">
                    Mock Password Inputs Here
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center mb-6">
                    <LucideIcons.CreditCard size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Billing & Invoices</h2>
                  <p className="text-zinc-500 dark:text-zinc-400">Manage your payment methods and download past invoices.</p>
                  <div className="h-24 bg-zinc-100 dark:bg-zinc-950 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 mt-4 flex items-center justify-center text-zinc-400 text-sm">
                    Mock Credit Card Details Here
                  </div>
                </div>
              )}

            </div>
          </SwapTransition>
        </div>

      </div>
    </div>
  );
}