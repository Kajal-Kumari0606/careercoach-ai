import React from 'react';
import { BookOpenCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpenCheck className="h-8 w-8 text-green-500" />
          <span className="text-xl font-bold text-navy-900 tracking-tight">
            CareerCoach <span className="text-green-500">AI</span>
          </span>
        </div>
      </div>
    </nav>
  );
}
