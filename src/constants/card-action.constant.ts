export type MKUltraAction = {
  name: 'MKUltra';
  payload: {
    selectedPlayerId: string;
  };
};

export type CoupAction = {
  name: 'Coup';
  payload: {
    playerId: string;
  };
};

export type CorruptionInvestigationAction = {
  name: 'CorruptionInvestigation';
  payload: {
    selectedPlayerId: string;
  };
};

export type CardAction = MKUltraAction | CoupAction | CorruptionInvestigationAction;
