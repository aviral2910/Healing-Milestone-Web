import React from 'react';
import { QuestLoader } from '../../QuestLoader';

export default function ClueLoading() {
  return (
    <QuestLoader
      title="Decrypting Clue Card..."
      subtitle="Checking your scan and unlocking your next riddle..."
    />
  );
}
