import React from 'react';

interface UserBadgeProps {
  role?: string;
  isVerified?: boolean;
  size?: number;
  style?: React.CSSProperties;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ role = 'member', isVerified = false, size = 18, style = {} }) => {
  if (!isVerified) return null;

  const showStandardTick = role !== 'healthcareProfessional' && role !== 'organization';

  const baseStyle = {
    marginLeft: '6px',
    filter: 'drop-shadow(0 1px 3px rgba(255,215,0,0.4))',
    display: 'inline-flex',
    verticalAlign: 'middle',
    ...style
  };

  // The base starburst path for the material verified icon
  const starburstPath = "M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12z";

  if (showStandardTick) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={baseStyle} >
        <title>Verified</title>
        <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#FFD700" />
      </svg>
    );
  }

  if (role === 'healthcareProfessional') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={baseStyle} >
        <title>Verified Professional</title>
        <defs>
          <mask id="doctorMask">
            <rect width="24" height="24" fill="white" />
            <path d="M14 10h3v4h-3v3h-4v-3H7v-4h3V7h4v3z" fill="black" />
          </mask>
        </defs>
        <path d={starburstPath} fill="#FFD700" mask="url(#doctorMask)" />
      </svg>
    );
  }

  if (role === 'organization') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={baseStyle} >
        <title>Verified Organization</title>
        <defs>
          <mask id="orgMask">
            <rect width="24" height="24" fill="white" />
            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" fill="black" transform="scale(0.7) translate(3.6, 3.6)" />
          </mask>
        </defs>
        <path d={starburstPath} fill="#FFD700" mask="url(#orgMask)" />
      </svg>
    );
  }

  return null;
};
