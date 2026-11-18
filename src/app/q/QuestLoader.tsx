"use client";

import React from 'react';

interface QuestLoaderProps {
  title?: string;
  subtitle?: string;
  accentColor?: string;
  fullScreen?: boolean;
}

export function QuestLoader({
  title = 'Loading...',
  subtitle,
  accentColor = 'var(--primary)',
  fullScreen = false,
}: QuestLoaderProps) {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '1.25rem' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(255, 255, 255, 0.12)',
            borderTopColor: accentColor,
            borderRightColor: accentColor,
            animation: 'quest-spin 0.85s linear infinite',
            boxShadow: `0 0 18px ${accentColor === 'var(--primary)' ? 'var(--glow)' : `${accentColor}44`}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '12px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
            fontSize: '1.25rem',
            animation: 'quest-pulse 1.4s ease-in-out infinite',
          }}
        >
          ✦
        </div>
      </div>

      <div
        style={{
          fontSize: '1.1rem',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '0.5px',
          marginBottom: subtitle ? '0.4rem' : 0,
        }}
      >
        {title}
      </div>

      {subtitle && (
        <div
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            maxWidth: '280px',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          backgroundColor: 'rgba(9, 9, 11, 0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
        }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        padding: '4rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {spinner}
    </div>
  );
}
