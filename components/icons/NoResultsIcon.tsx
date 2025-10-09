
import React from 'react';

export const NoResultsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m-1.125 9l-1.125 1.125a1.5 1.5 0 000 2.121l2.25 2.25a1.5 1.5 0 002.121 0l1.125-1.125m-1.125-9.75h5.625a1.125 1.125 0 011.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-5.625a1.125 1.125 0 01-1.125-1.125v-3.375c0-.621.504-1.125 1.125-1.125z" />
    </svg>
);
