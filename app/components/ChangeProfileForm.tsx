'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateProfile } from '@/lib/actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getData } from 'country-list';

type Props = {
  user: {
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    address?: string;
  };
};

export default function ChangeProfileForm({ user }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    undefined
  );
  const [country, setCountry] = useState<string>(user.country || '');
  const countries = getData();
  useEffect(() => {
    if (state === 'success') {
      toast.success('Profile updated successfully', {
        position: 'top-center',
        className: '!bg-green-50 !text-green-700 !border-green-200',
      });

      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <FieldGroup>
        {/* Hidden country input для FormData */}
        <input type="hidden" name="country" value={country} />

        {/* Name */}
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            defaultValue={user.name || ''}
            required
          />
        </Field>

        {/* Email (disabled, не меняется) */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            defaultValue={user.email || ''}
            disabled
          />
        </Field>

        {/* Phone & Country */}
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              defaultValue={user.phone || ''}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="country">Country</FieldLabel>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Address */}
        <Field>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder="123 Main St"
            defaultValue={user.address || ''}
          />
        </Field>

        {/* Error Alert */}
        {state && state !== 'success' && (
          <Field>
            <Alert variant="destructive">
              <AlertCircleIcon className="size-4" />
              <AlertTitle>{state}</AlertTitle>
            </Alert>
          </Field>
        )}

        {/* Submit Button */}
        <Field className="flex justify-end pt-2">
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="cursor-pointer"
            variant="outline"
          >
            {isPending ? (
              <>
                <Spinner className="size-4" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
