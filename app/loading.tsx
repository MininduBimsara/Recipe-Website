import React from 'react';
import { ShimmerBlock } from '@/components/Skeletons';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-6 text-center">
      <ShimmerBlock className="h-10 w-44 mx-auto rounded-md" />
      <div className="space-y-3">
        <ShimmerBlock className="h-4 w-full rounded" />
        <ShimmerBlock className="h-4 w-5/6 mx-auto rounded" />
        <ShimmerBlock className="h-4 w-4/5 mx-auto rounded" />
      </div>
    </div>
  );
}
