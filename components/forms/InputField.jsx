'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InputField({ label, name, type = 'text', placeholder, error, register }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...(register || {})}
        className={`${
          error ? 'border-red-500 focus-visible:ring-red-500' : ''
        }`}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
}