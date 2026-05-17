'use client';

import { useEffect, useState } from 'react';
import { SkillPlanner } from '@/components/planner';
import { decodeBuild, getHashFromUrl, isValidHash } from '@/lib/sharing';
import type { Skill } from '@/lib/types';

interface InitialState {
  characterName: string;
  skills: Skill[];
}

export default function PlannerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [initialState, setInitialState] = useState<InitialState | null>(null);

  useEffect(() => {
    // Check for shared build in URL hash
    const hash = getHashFromUrl();

    if (hash && isValidHash(hash)) {
      const build = decodeBuild(hash);

      if (build) {
        const skills: Skill[] = build.s.map((image, index) => ({
          id: Date.now() + index,
          image,
          name: `สกิล ${index + 1}`,
        }));

        setInitialState({
          characterName: build.n,
          skills,
        });
      } else {
        setLoadError('โหลด build ไม่สำเร็จ: ข้อมูลเสียหาย');
      }
    } else if (hash) {
      setLoadError('โหลด build ไม่สำเร็จ: URL ไม่ถูกต้อง');
    }

    setIsLoading(false);

    // Clear hash from URL after loading (for cleaner share)
    if (hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-[#ffd700] text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  return <SkillPlanner initialState={initialState} loadError={loadError} />;
}