import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
}

export const Shield = (props: IconProps) => <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></Icon>;
export const Mail = (props: IconProps) => <Icon {...props}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-10 5L2 7" /></Icon>;
export const Lock = (props: IconProps) => <Icon {...props}><rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>;
export const ArrowRight = (props: IconProps) => <Icon {...props}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>;
export const Sparkles = (props: IconProps) => <Icon {...props}><path d="m12 3-1.9 5.8L4 10.7l6.1 1.9L12 18.5l1.9-5.9 6.1-1.9-6.1-1.9L12 3Z" /></Icon>;
