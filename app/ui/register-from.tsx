'use client';

import { lusitana } from './fonts';
import { useState } from 'react';
import { useActionState } from 'react';
import { register } from '@/lib/actions';
import Link from 'next/link';
import { FieldSet, FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircleIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
  KeyRound,
  CircleUser,
} from 'lucide-react';
import {
  InputGroupAddon,
  InputGroup,
  InputGroupInput,
} from '@/components/ui/input-group';

export default function RegisterForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form action={formAction}>
      <FieldSet className="w-full p-5">
        <FieldGroup>
          <h3 className={`${lusitana.className} mb-3 text-2xl text-center`}>
            Register Account
          </h3>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name"
                required
              />
              <InputGroupAddon>
                <CircleUser />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                required
              />
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <KeyRound />
              </InputGroupAddon>
              <InputGroupInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                minLength={8}
                required
              />
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer bg-transparent text-gray-800"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="cursor-pointer"
            >
              {isPending ? (
                <>
                  <Spinner className="size-4" /> <span>Please wait</span>
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </Field>

          <Field>
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircleIcon className="size-4" />
                <AlertTitle>{errorMessage}</AlertTitle>
              </Alert>
            )}
          </Field>

          <Field>
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-gray-900 font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
