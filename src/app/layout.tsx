import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChoiceGuard (ช้อยส์การ์ด) — รู้ก่อนกิน เลือกให้ตรงกับตัวเอง ปลอดภัยทุกล็อต',
  description: 'นวัตกรรมผู้ช่วยเลือกอาหารเพื่อสุขภาพเฉพาะบุคคล และระบบตรวจสอบย้อนกลับความปลอดภัยอาหารรายล็อต (FSMA 204 & ประกาศ สธ. ฉบับที่ 420) สำหรับการแข่งขัน WELLNEXT Future Pitching สำนักงานคณะกรรมการอาหารและยา (อย.)',
  keywords: [
    'ChoiceGuard',
    'WELLNEXT',
    'อย.',
    'ทางเลือกสุขภาพ',
    'ลดโซเดียม',
    'NCDs',
    'FoodTraceability',
    'FSMA204',
    'สสส',
    'HealthTech'
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0d9488',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* SVG Displacement Filter for Liquid Glass Refraction (Apple HIG WWDC 2025 Tier 2) */}
        <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
          <filter id="liquid-glass-refract" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feDisplacementMap in2="blur" in="SourceGraphic" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        {/* Ambient background glowing orbs */}
        <div className="ambient-glow-mesh" aria-hidden="true">
          <div className="ambient-orb-1" />
          <div className="ambient-orb-2" />
          <div className="ambient-orb-3" />
        </div>

        {children}
      </body>
    </html>
  );
}
