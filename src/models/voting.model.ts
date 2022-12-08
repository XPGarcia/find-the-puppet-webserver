const VotingTypes = {
  approveLaw: 'approveLaw',
  presidentElection: 'presidentElection',
  eliminatePlayer: 'eliminatePlayer'
} as const;

type ApproveLawOptions = {
  type: 'approveLaw';
  params: {
    playerId: string;
    cardId: string;
  };
};

type PresidentElectionOptions = {
  type: 'presidentElection';
  params: {
    playerId: string;
  };
};

export type VotingOptions = ApproveLawOptions | PresidentElectionOptions;

export type VotingType = typeof VotingTypes[keyof typeof VotingTypes];
