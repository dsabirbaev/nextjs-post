'use client';
import { useState, useActionState } from 'react';
import { login } from '@/lib/actions';
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
  MoveLeft,
  KeyRound,
} from 'lucide-react';

import {
  InputGroupAddon,
  InputGroup,
  InputGroupInput,
} from '@/components/ui/input-group';
import { signIn } from 'next-auth/react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    login,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction}>
      <FieldSet className="w-full p-5 dark:bg-gray-900">
        <FieldGroup>
          <Link
            href="/"
            className="text-base font-medium text-gray-900 mb-1 dark:text-white text-xs"
          >
            <MoveLeft className="size-4 inline" /> Welcome back
          </Link>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
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
                  {showPassword ? (
                    <EyeOffIcon className="dark:text-gray-400" />
                  ) : (
                    <EyeIcon className="dark:text-gray-400" />
                  )}
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
              variant="outline"
              data-icon="inline-end"
            >
              {isPending ? (
                <>
                  <Spinner className="size-4" /> <span>Please wait</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </Field>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Google */}
            <Button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              variant="outline"
              className="border-0 cursor-pointer w-full"
            >
              <FaGoogle />
            </Button>

            {/* GitHub */}
            <Button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              variant="outline"
              className="border-0 cursor-pointer w-full"
            >
              <FaGithub />
            </Button>
          </div>
          <Field>
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircleIcon className="size-4" />
                <AlertTitle>{errorMessage}</AlertTitle>
              </Alert>
            )}
          </Field>

          <Field>
            <div className="text-center text-sm text-gray-400">
              No account?{' '}
              <Link
                href="/register"
                className="text-gray-900 font-medium hover:underline dark:text-gray-400"
              >
                Create one
              </Link>
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
