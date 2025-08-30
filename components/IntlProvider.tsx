'use client';

import React, { useState, useEffect } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';

// Import messages
import enMessages from '@/messages/en.json';
import koMessages from '@/messages/ko.json';

const messages: Record<string, Record<string, string>> = {
  en: enMessages,
  ko: koMessages,
};

interface IntlProviderProps {
  children: React.ReactNode;
}

function getLocale(): string {
  if (typeof window === 'undefined') return 'en';
  
  // Get browser language
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  
  // Extract language code (e.g., 'ko-KR' -> 'ko')
  const langCode = browserLang.split('-')[0];
  
  // Check if we support this language
  return messages[langCode] ? langCode : 'en';
}

export function IntlProvider({ children }: IntlProviderProps) {
  const [locale, setLocale] = useState('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setLocale(getLocale());
  }, []);

  // Avoid hydration mismatch by rendering with default locale on server
  if (!isClient) {
    return (
      <ReactIntlProvider locale="en" messages={messages.en} defaultLocale="en">
        {children}
      </ReactIntlProvider>
    );
  }

  return (
    <ReactIntlProvider
      locale={locale}
      messages={messages[locale]}
      defaultLocale="en"
      onError={(err) => {
        if (err.code === 'MISSING_TRANSLATION') {
          console.warn('Missing translation:', err.message);
          return;
        }
        throw err;
      }}
    >
      {children}
    </ReactIntlProvider>
  );
}