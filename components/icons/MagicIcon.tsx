import React from 'react';

const MagicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4-2.4 3 3 0 001.128-5.78 2.25 2.25 0 012.4-2.4 3 3 0 005.78-1.128 2.25 2.25 0 012.4 2.4 3 3 0 00-1.128 5.78 2.25 2.25 0 01-2.4 2.4zM13.5 10.5l2.25 2.25 2.25-2.25m-2.25 2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25h6.75a2.25 2.25 0 002.25-2.25z" />
  </svg>
);

export default MagicIcon;