'use client';

import { withAuthGuard } from '@components';

import Dash from '@/components/Dash';
import { useHotels } from '@/hooks';

function Hotel() {
  const { data: hotels } = useHotels();
  if (!hotels) return <p>no</p>;
  const hotelId = hotels[1].id;

  return (
    <>
      <Dash hotelId={hotelId} />
    </>
  );
}

export default withAuthGuard(Hotel);
