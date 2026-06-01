import * as React from 'react';

import {
  CursorProvider as CursorProviderPrimitive,
  Cursor as CursorPrimitive,
  CursorFollow as CursorFollowPrimitive,
  CursorContainer as CursorContainerPrimitive,
} from '@/components/animate-ui/primitives/animate/cursor';
import { cn } from '@/lib/utils';

function CursorProvider({
  global,
  ...props
}) {
  return (
    <CursorProviderPrimitive global={global}>
      <CursorContainerPrimitive {...props} />
    </CursorProviderPrimitive>
  );
}

function Cursor({
  className,
  ...props
}) {
  return (
    <CursorPrimitive
      {...props}
    >
    </CursorPrimitive>
  );
}

function CursorFollow({
  className,
  children,
  sideOffset = 15,
  alignOffset = 5,
  ...props
}) {
  return (
    <CursorFollowPrimitive
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      {...props}
      render={<div
        className={cn('bg-foreground rounded-md text-background px-2 py-1 text-sm', className)} />}>{children}</CursorFollowPrimitive>
  );
}

export { CursorProvider, Cursor, CursorFollow };
