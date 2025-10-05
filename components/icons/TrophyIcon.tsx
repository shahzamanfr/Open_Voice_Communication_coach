import React from 'react';

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.05-4.319A9.75 9.75 0 015.25 6.75h13.5A9.75 9.75 0 0117.55 14.43 9.75 9.75 0 0116.5 18.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6 0" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75v-3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75h6" />
  </svg>
);

export default TrophyIcon;
