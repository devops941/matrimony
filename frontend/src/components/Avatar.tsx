import React from 'react';
import { AvatarGradients, Surface, Static } from '../theme';

interface AvatarProps {
  type: string;
  className?: string;
}

export default function Avatar({ type, className = "h-12 w-12" }: AvatarProps) {
  // Check if type is an image URL (http/https), absolute/relative path, or base64 data URL
  const isImage = type && (
    type.startsWith('data:image/') || 
    type.startsWith('http://') || 
    type.startsWith('https://') || 
    type.startsWith('/') || 
    type.includes('.')
  );

  if (isImage) {
    return (
      <div className={`rounded-xl overflow-hidden shadow-md shrink-0 ${Surface.opacity.bd_200_50} dark:border-white/10 ${className}`}>
        <img 
          src={type} 
          alt="Candidate Photograph" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  const isFemale = type ? type.includes('female') : false;
  
  // Pick a stable background index based on type string length
  const bgIdx = type ? type.length % AvatarGradients.length : 0;
  const gradientClass = AvatarGradients[bgIdx];

  return (
    <div className={`rounded-xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white overflow-hidden shadow-md shrink-0 ${Static.borderWhite_10} ${className}`}>
      {isFemale ? (
        <svg className="w-4/5 h-4/5 text-pink-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14c1.49-1.46 3-3.21 3-5.5a5 5 0 00-10 0" opacity={0.6} />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 14c-1.49-1.46-3-3.21-3-5.5a5 5 0 0110 0" opacity={0.6} />
        </svg>
      ) : (
        <svg className="w-4/5 h-4/5 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 17l2.5 3 2.5-3" opacity={0.5} />
        </svg>
      )}
    </div>
  );
}
