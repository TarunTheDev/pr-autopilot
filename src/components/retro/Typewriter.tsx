import React, { useEffect, useState } from 'react';

interface TypewriterProps {
  words: string[];
  className?: string;
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
}

/**
 * Cycling typewriter: types a word, holds, deletes, moves to the next.
 * Ends with a blinking block caret from the retro system.
 */
export const Typewriter: React.FC<TypewriterProps> = ({
  words,
  className = '',
  typeMs = 70,
  deleteMs = 34,
  holdMs = 1700,
}) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];

    if (!deleting && subIndex === current.length) {
      const hold = setTimeout(() => setDeleting(true), holdMs);
      return () => clearTimeout(hold);
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const tick = setTimeout(
      () => setSubIndex((s) => s + (deleting ? -1 : 1)),
      deleting ? deleteMs : typeMs
    );
    return () => clearTimeout(tick);
  }, [subIndex, deleting, index, words, typeMs, deleteMs, holdMs]);

  return (
    <span className={className} aria-label={words.join(', ')}>
      <span aria-hidden="true">{words[index % words.length].substring(0, subIndex)}</span>
      <span className="retro-caret" aria-hidden="true" />
    </span>
  );
};
