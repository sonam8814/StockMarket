import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InputField({
  name,
  label,
  placeholder,
  type = 'text',
  register,
  error,
  validation,
  disabled = false,
  value,
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        className="form-input"
        disabled={disabled}
        value={value}
        {...register(name, validation)}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}