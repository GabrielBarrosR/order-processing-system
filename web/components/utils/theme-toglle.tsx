'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const root = document.documentElement;

        if (savedTheme) {
            const shouldBeDark = savedTheme === 'dark';
            setIsDark(shouldBeDark);

            if (shouldBeDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        } else {
            setIsDark(root.classList.contains('dark'));
        }
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="text-secondary-foreground hover:opacity-85 transition-colors flex items-center justify-center group-data-[state=expanded]:py-1 group-data-[state=expanded]:rounded-lg group-data-[state=expanded]:bg-secondary" aria-label="Alternar tema"
        >
            {isDark ? <Sun className="text-amber-400" /> : <Moon className="text-slate-700" />}
        </button>
    );
}