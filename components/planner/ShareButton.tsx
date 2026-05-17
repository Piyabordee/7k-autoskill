'use client';

import { useState } from 'react';
import type { Skill } from '@/lib/types';
import { encodeBuild } from '@/lib/sharing';

interface ShareButtonProps {
  characterName: string;
  skills: Skill[];
  className?: string;
}

export function ShareButton({ characterName, skills, className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleCopyFullUrl = async () => {
    if (skills.length === 0) {
      showToast('กรุณาเลือกสกิลก่อน');
      return;
    }

    const hash = encodeBuild(characterName, skills);
    const fullUrl = `${window.location.origin}/planner#${hash}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      showToast('คัดลอก URL แล้ว!');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('ไม่สามารถคัดลอกได้');
    }
  };

  const handleCopyShortUrl = async () => {
    if (skills.length === 0) {
      showToast('กรุณาเลือกสกิลก่อน');
      return;
    }

    setIsLoading(true);

    try {
      const hash = encodeBuild(characterName, skills);

      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash }),
      });

      if (!response.ok) {
        throw new Error('Failed to create short URL');
      }

      const { shortUrl } = await response.json();
      await navigator.clipboard.writeText(shortUrl);
      showToast('คัดลอก Short Link แล้ว!');
      setIsOpen(false);
    } catch (error) {
      console.error('Shorten error:', error);
      showToast('ไม่สามารถสร้าง Short Link ได้');
    } finally {
      setIsLoading(false);
    }
  };

  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-6 py-3 bg-[#ffd700] text-[#1a1a2e] font-bold rounded-lg
                   hover:bg-[#ffea00] transition-colors ${className}`}
        aria-label="แชร์ Build"
      >
        📤 แชร์ Build
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-[#16213e] border-2 border-[#0f3460]
                       rounded-lg shadow-lg z-50 min-w-[200px]">
          <button
            onClick={handleCopyFullUrl}
            className="w-full px-4 py-3 text-left text-white hover:bg-[#0f3460]
                     transition-colors first:rounded-t-lg last:rounded-b-lg"
          >
            🔗 คัดลอก URL
          </button>
          <button
            onClick={handleCopyShortUrl}
            disabled={isLoading}
            className="w-full px-4 py-3 text-left text-white hover:bg-[#0f3460]
                     transition-colors first:rounded-t-lg last:rounded-b-lg
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ กำลังสร้าง...' : '✂️ สร้าง Short Link'}
          </button>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3
                       bg-[#4ecdc4] text-white font-bold rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}