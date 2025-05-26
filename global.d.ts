/* eslint-disable @typescript-eslint/no-explicit-any */
import 'react';

declare module 'react' {
  interface CSSProperties {
    // Allow all CSS properties
    [key: string]: any;
  }
}