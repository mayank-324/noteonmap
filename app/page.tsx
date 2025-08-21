'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default function Home() {
  const Map = useMemo(
    () =>
      dynamic(() => import('@/app/components/map'), {
        loading: () => <p>A map is loading...</p>,
        ssr: false,
      }),
    []
  );

  return <Map />;
}