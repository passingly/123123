import React from 'react';

const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.534a.75.75 0 0 1-.634-.235 2.25 2.25 0 0 0-3.164 0 .75.75 0 0 1-.634.235l-3.722-.534A2.097 2.097 0 0 1 3 14.894V10.607c0-.97.616-1.813 1.5-2.097m14.25 0a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25m13.5 0-1.612-1.612a2.25 2.25 0 0 1 0-3.182l1.612-1.612a2.25 2.25 0 0 1 3.182 0l1.612 1.612a2.25 2.25 0 0 1 0 3.182L19.5 7.5h-1.612Z" />
  </svg>
);

export default ChatBubbleLeftRightIcon;
