import { create } from 'zustand';

export type ThemeType = 'forest' | 'mountain' | 'city' | 'coastal' | 'default';

interface ThemeState {
  current: ThemeType;
  setCurrent: (theme: ThemeType) => void;
  cycleTheme: () => void;
}

export const useTheme = create<ThemeState>((set, get) => ({
  current: 'default',
  
  setCurrent: (theme) => set({ current: theme }),
  
  cycleTheme: () => {
    const { current } = get();
    const themes: ThemeType[] = ['forest', 'mountain', 'city', 'coastal', 'default'];
    const currentIndex = themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % themes.length;
    set({ current: themes[nextIndex] });
  }
}));