import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { topLabel } from '@/lib/demographics'
import type { Category, Demographics } from '@/lib/types'

interface SkinstricState {
  name: string
  location: string
  /** The photo that was analysed, as a data URL. Kept in memory only (too big for localStorage). */
  image: string | null
  /** What the A.I. returned. */
  results: Demographics | null
  /** The user's corrections. A missing category means "go with the A.I.". */
  picks: Partial<Record<Category, string>>

  setIntro: (name: string, location: string) => void
  setAnalysis: (image: string | null, results: Demographics) => void
  pick: (category: Category, label: string) => void
  resetPicks: () => void
}

export const useSkinstric = create<SkinstricState>()(
  persist(
    (set) => ({
      name: '',
      location: '',
      image: null,
      results: null,
      picks: {},

      setIntro: (name, location) => set({ name, location }),
      // New results make old corrections meaningless, so they're cleared.
      setAnalysis: (image, results) => set({ image, results, picks: {} }),
      pick: (category, label) =>
        set((s) => ({ picks: { ...s.picks, [category]: label } })),
      resetPicks: () => set({ picks: {} }),
    }),
    {
      name: 'skinstric',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ name, location, results, picks }) => ({
        name,
        location,
        results,
        picks,
      }),
    },
  ),
)

/** What the left sidebar shows for a category: the user's pick, or else the A.I.'s top score. */
export function selectedLabel(
  results: Demographics,
  picks: Partial<Record<Category, string>>,
  category: Category,
): string {
  return picks[category] ?? topLabel(results[category])
}
