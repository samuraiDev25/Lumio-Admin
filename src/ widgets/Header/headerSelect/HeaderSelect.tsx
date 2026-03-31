'use client';

import s from './HeaderSelect.module.scss';
import { useEffect, useRef, useState } from 'react';
import { FlagRussia, FlagUnitedKingdom } from '@jstrommash/ui-kit-lumio';

const languageOptions = [
  { icon: FlagUnitedKingdom, label: 'English', value: 'en' },
  { icon: FlagRussia, label: 'Russian', value: 'ru' },
];

export function HeaderSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const selectedLanguage =
    languageOptions.find(option => option.value === language) ?? languageOptions[0];
  const SelectedIcon = selectedLanguage.icon;

  const selectLanguage = (value: string) => {
    setLanguage(value);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={s.wrapper}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={s.trigger}
        type="button"
        onClick={() => setIsOpen(current => !current)}
      >
        <span className={s.value}>
          <SelectedIcon />
          <span>{selectedLanguage.label}</span>
        </span>
        <span className={s.chevron}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={s.content} role="listbox">
          {languageOptions.map(option => {
            const Icon = option.icon;
            const isSelected = option.value === language;

            return (
              <button
                key={option.value}
                aria-selected={isSelected}
                className={isSelected ? `${s.item} ${s.itemSelected}` : s.item}
                role="option"
                type="button"
                onClick={() => selectLanguage(option.value)}
              >
                <span className={s.option}>
                  <Icon />
                  <span>{option.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
