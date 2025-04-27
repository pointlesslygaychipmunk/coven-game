import React from 'react';
import type { BrewMove } from '../../../shared/src/types';

interface Props {
  seed: string;
  onChange(score: number, moves: BrewMove[]): void;
}

export default function RuneGrid({ onChange }: Props) {
  // TODO: replace with real grid
  React.useEffect(() => onChange(0, []), []);
  return <div className="aspect-video bg-mauve-300/30 rounded" />;
}