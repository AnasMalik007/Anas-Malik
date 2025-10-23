import React from 'react';

export const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        {...props}
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
        </defs>
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="url(#logoGradient)" strokeWidth="1.5" />
        <path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="url(#logoGradient)" strokeWidth="1.5"/>
        <path d="M12 5L12 2" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 22L12 19" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19 12L22 12" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 12L5 12" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);


export const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

export const LoaderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

export const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="docGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#e5e7eb" /><stop offset="100%" stopColor="#9ca3af" /></linearGradient>
        </defs>
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" fill="url(#docGradient)" fillOpacity="0.2" stroke="url(#docGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="url(#docGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 13H8" stroke="url(#docGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 17H8" stroke="url(#docGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 9H8" stroke="url(#docGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const DiagnosisIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="diagGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f472b6" /><stop offset="100%" stopColor="#a855f7" /></linearGradient>
        </defs>
        <path d="M19.471 14.3932L14.3931 19.4711C13.2201 20.6441 11.2299 20.6441 10.0569 19.4711L4.52893 13.9431C3.35593 12.7701 3.35593 10.7799 4.52893 9.6069L9.60685 4.52896C10.7798 3.35596 12.7701 3.35596 13.9431 4.52896L19.471 9.6069C20.644 10.7799 20.644 12.7701 19.471 14.3932Z" fill="url(#diagGradient)" fillOpacity="0.2" stroke="url(#diagGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12L16 16" stroke="url(#diagGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 7V7.01" stroke="url(#diagGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const LabIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="labGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
        </defs>
        <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" fill="url(#labGradient)" fillOpacity="0.2" stroke="url(#labGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 7L12 12" stroke="url(#labGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="url(#labGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 7L12 12" stroke="url(#labGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 4.5L7.5 9" stroke="url(#labGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const PillIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="pillGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#facc15" /><stop offset="100%" stopColor="#fb923c" /></linearGradient>
        </defs>
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="url(#pillGradient)" fillOpacity="0.2" stroke="url(#pillGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 8L8 16" stroke="url(#pillGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 16L12 12L8 8" stroke="url(#pillGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ChecklistIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4ade80" /><stop offset="100%" stopColor="#22c55e" /></linearGradient>
        </defs>
        <path d="M14 3H18C18.5304 3 19.0391 3.21071 19.4142 3.58579C19.7893 3.96086 20 4.46957 20 5V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V5C4 4.46957 4.21071 3.96086 4.58579 3.58579C4.96086 3.21071 5.46957 3 6 3H10" fill="url(#checkGradient)" fillOpacity="0.2" stroke="url(#checkGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 3C14 3.53043 13.7893 4.03914 13.4142 4.41421C13.0391 4.78929 12.5304 5 12 5C11.4696 5 10.9609 4.78929 10.5858 4.41421C10.2107 4.03914 10 3.53043 10 3" stroke="url(#checkGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12L11 14L15 10" stroke="url(#checkGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);