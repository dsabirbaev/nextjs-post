import { CardsSkeleton } from '@/ui/skeletons';
import Container from '@/components/Container';
export default function Loading() {
  return (
    <Container>
      <div className="flex flex-col gap-4">
        {/* <CardsSkeleton /> */}
        loading ...
      </div>
    </Container>
  );
}
