import { DropIndicatorProps } from '@/typings';
import React from 'react'


export const DropIndicator = ({ beforeId, id }: DropIndicatorProps) => {
    return (
      <div
        data-before={beforeId || "-1"}
        data-id={id}
        className="my-0.5 h-0.5 w-full bg-violet-600 opacity-0"
      />
    );
  };