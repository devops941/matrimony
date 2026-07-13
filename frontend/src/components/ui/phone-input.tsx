import React from 'react';
import { PhoneInput as IntlPhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Label } from '@/components/ui/label';
import { Composites, Surface, Primary } from '../../theme';

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  defaultCountry?: string;
  className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  defaultCountry = 'in',
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <Label className={Composites.filterLabel}>{label}</Label>}
      <IntlPhoneInput
        defaultCountry={defaultCountry}
        value={value}
        onChange={onChange}
        className="!w-full"
        inputProps={{
          required,
          className: `flex h-10 w-full rounded-md border ${Surface.border[200]} ${Surface[50]} bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:${Surface.text[400]} focus-visible:outline-none focus-visible:ring-1 ${Primary.focus.ring} disabled:cursor-not-allowed disabled:opacity-50 font-semibold`,
        }}
        countrySelectorStyleProps={{
          className: '!border-0 !bg-transparent !h-10 !rounded-l-md',
          buttonClassName: `!h-10 !border-r ${Surface.border[200]} !rounded-l-md !bg-transparent hover:!bg-transparent`,
        }}
      />
    </div>
  );
};

export default PhoneInput;
