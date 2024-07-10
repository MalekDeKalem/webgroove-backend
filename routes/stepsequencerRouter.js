const express = require('express');

const { stepSequencerService } = require('../services/stepSequencerService');

const stepSequenceRouter = express.Router();

const stepSequenceService = new stepSequencerService;

// unvollständig
stepSequenceRouter.post("/save", async (req, res) => {
    try {
        // ADSR, Effekte fehlen noch
        const { patternName, stepSequence, bpm, isPublic, userId} = req.body
            let {transpose, scale, volume, adsr} = ""
        const newSequencer = await stepSequenceService.createStepsequencer(userId, projectId, stepSequence, bpm, transpose, scale, volume, adsr, isPublic, likes);

        res.status(201).json({
            message: "Sequencer Pattern erfolgreich gespeichert",
            details: {
                newSequencerId: newSequencer.id
            }
        })

    } catch (error) {
        res.status(500).json({message: "Interner Serverfehler", error})
    }
})

stepSequenceRouter.get("/open", async (req, res) => {
    try {
        const { userId } = req.query;
        const openSequencer = await stepSequenceService.getStepsequencerByUserId(userId)

        res.status(200).json({openSequencer, message:"Stepsequence Pattern erfolgreich gefunden"})
    } catch(error) {
        res.status(500).json({message: "Interner Serverfehler", error})
    }
})

stepSequenceRouter.get("/:sequencerId/pattern", async (req, res) => {
    try {
        const sequencerId = req.params.sequencerId

        const stepSeqEntity = await stepSequenceService.getStepsequencerById(sequencerId)

        res.status(200).json({stepSeqEntity, message:"Stepsequence Pattern erfolgreich gefunden"})
    } catch(error) {
        res.status(500).json({message: "Interner Serverfehler", error})
    }
})

module.exports = stepSequenceRouter
