import React from 'react';

export function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

export function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
    </svg>
  );
}

export const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/goodbee.skincare',
    icon: InstagramIcon
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/goodbee.skincare',
    icon: FacebookIcon
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@goodbee-skincare',
    icon: YoutubeIcon
  }
];

export default function SocialLinksRow({ className = "flex items-center gap-3", iconClassName = "w-4 h-4" }) {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Follow Good Bee on ${item.name}`}
            className="p-2 rounded-full bg-brand-charcoal-soft/80 border border-brand-gold/30 text-brand-gold hover:text-brand-ivory hover:bg-brand-gold hover:border-brand-gold transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-sm"
          >
            <Icon className={iconClassName} />
            <span className="sr-only">{item.name}</span>
          </a>
        );
      })}
    </div>
  );
}
