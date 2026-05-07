import { CardSkeleton } from '@/ui/skeletons';
import Container from '@/components/Container';
export default function Loading() {
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <CardSkeleton />
      </div>
    </Container>
  );
}
