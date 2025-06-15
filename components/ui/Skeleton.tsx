import React from 'react';
import { cn } from '@/lib/utils'; // You'll need this utility - see step 2

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, isLoading = true, children, ...props }, ref) => {
    if (!isLoading) return <>{children}</>;

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
          className
        )}
        {...props}
      >
        {children && React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              className: 'opacity-0', // Hide content while loading
            } as React.HTMLAttributes<HTMLElement>);
          }
          return null;
        })}
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };