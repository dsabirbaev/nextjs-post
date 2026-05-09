import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { auth } from '@/../auth';

export default async function ProfileForm() {
  const session = await auth();

  return (
    <form>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-name">Name</FieldLabel>
          <Input
            id="form-name"
            type="text"
            placeholder="Evil Rabbit"
            defaultValue={session?.user?.name ?? ''}
            disabled
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="form-email">Email</FieldLabel>
          <Input
            id="form-email"
            type="email"
            defaultValue={session?.user?.email ?? ''}
            disabled
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
            <Input
              id="form-phone"
              type="tel"
              defaultValue={session?.user?.phone}
              disabled
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="form-country">Country</FieldLabel>
            <Input
              id="form-country"
              type="text"
              defaultValue={session?.user?.country ?? ''}
              disabled
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="form-address">Address</FieldLabel>
          <Input
            id="form-address"
            type="text"
            defaultValue={session?.user?.address}
            disabled
          />
        </Field>
      </FieldGroup>
    </form>
  );
}
