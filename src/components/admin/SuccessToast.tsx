'use client';

import { CheckCircle2, X } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  onClose: () => void;
}

export default function SuccessToast({ message, onClose }: SuccessToastProps) {
  return (
    <div className="fixed top-24 right-6 z-50 bg-green-900 text-white border-2 border-green-400 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 max-w-md animate-bounce">
      <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
      <div className="flex-1 font-extrabold text-sm text-green-100">
        {message}
      </div>
      <button onClick={onClose} className="p-1 hover:text-green-300">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
