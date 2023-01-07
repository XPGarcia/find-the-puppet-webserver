// router.post('/api/card-action/MKUltra', (req, res) => {
//   const { selectedPlayerId } = req.body;

//   const cardAction: MKUltraAction = {
//     name: 'MKUltra',
//     payload: { selectedPlayerId }
//   };

//   const selectedPlayerRol = CardActionService.mkUltra(cardAction);
//   const response = { selectedPlayerId, selectedPlayerRol };

//   res.status(200).send({ data: response });
// });

// router.post('/api/card-action/Coup', (req, res) => {
//   const { playerId } = req.body;

//   const cardAction: CoupAction = {
//     name: 'Coup',
//     payload: { playerId }
//   };

//   CardActionService.coup(cardAction);

//   res.status(200).send({});
// });

// router.post('/api/card-action/CorruptionInvestigation', (req, res) => {
//   const { selectedPlayerId } = req.body;

//   const cardAction: CorruptionInvestigationAction = {
//     name: 'CorruptionInvestigation',
//     payload: { selectedPlayerId }
//   };

//   CardActionService.corruptionInvestigation(cardAction);

//   res.status(200).send({});
// });
