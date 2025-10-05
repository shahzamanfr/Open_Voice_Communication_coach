import React from 'react';

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.365a.562.562 0 01.321.988l-4.204 3.055a.563.563 0 00-.182.635l1.578 4.87a.562.562 0 01-.84.61l-4.72-3.442a.563.563 0 00-.652 0l-4.72 3.442a.562.562 0 01-.84-.61l1.578-4.87a.563.563 0 00-.182-.635L2.05 9.92a.562.562 0 01.321-.988h5.365a.563.563 0 00.475-.321L11.48 3.5z" />
  </svg>
);

export default StarIcon;
