'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { changePassword } from '@/lib/actions';
import { FieldSet, FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, EyeIcon, EyeOffIcon, KeyRound } from 'lucide-react';
import {
  InputGroupAddon,
  InputGroup,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';

export default function ChangePasswordForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    changePassword,
    undefined
  );
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  return (
    <form action={formAction}>
      <FieldSet className="w-full">
        <FieldGroup>
          <h2 className="text-lg text-gray-500 mb-5 text-center">
            Change your password
          </h2>
          <Field>
            <FieldLabel htmlFor="oldPassword">Current Password</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <KeyRound />
              </InputGroupAddon>
              <InputGroupInput
                id="oldPassword"
                name="oldPassword"
                type={showPasswordOld ? 'text' : 'password'}
                placeholder="Enter current password"
                minLength={8}
                required
              />
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  onClick={() => setShowPasswordOld((prev) => !prev)}
                  className="cursor-pointer bg-transparent text-gray-800"
                  aria-label={
                    showPasswordOld ? 'Hide password' : 'Show password'
                  }
                >
                  {showPasswordOld ? (
                    <EyeOffIcon className="dark:text-white" />
                  ) : (
                    <EyeIcon className="dark:text-white" />
                  )}
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <KeyRound />
              </InputGroupAddon>
              <InputGroupInput
                id="newPassword"
                name="newPassword"
                type={showPasswordNew ? 'text' : 'password'}
                placeholder="Enter new password"
                minLength={8}
                required
              />
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  onClick={() => setShowPasswordNew((prev) => !prev)}
                  className="cursor-pointer bg-transparent text-gray-800"
                  aria-label={
                    showPasswordNew ? 'Hide password' : 'Show password'
                  }
                >
                  {showPasswordNew ? (
                    <EyeOffIcon className="text-white" />
                  ) : (
                    <EyeIcon className="text-white" />
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
              data-icon="inline-end"
              variant="outline"
            >
              {isPending ? (
                <>
                  <Spinner className="size-4" /> <span>Please wait</span>
                </>
              ) : (
                'Change Password'
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
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
