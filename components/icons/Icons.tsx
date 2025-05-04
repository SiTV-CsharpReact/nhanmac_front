interface IconProps {
    width?: number;
    height?: number;
    className?: string;
  
}
export const PhoneIcon = ({ width = 24, height = 24, className }: IconProps) => (
    <img src="/icons/phone-call.svg" width={width} height={height} className={className} alt="Phone" />
  );
export const FacebookIcon = () => <img src="/icons/brand-facebook.svg" alt="Facebook" />;
export const MailIcon = () => <img src="/icons/brand-gmail.svg" alt="Mail" />;
export const ZaloIcon = () => <img src="/icons/Icon_of_Zalo.svg" alt="Zalo" />;