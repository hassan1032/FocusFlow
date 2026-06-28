
const express = require("express");
const { userVerification } = require("../middleware.js");
const { createCard, getFlashcardDetails, getAllUserFlashcards, updateCard, deleteCard, getCardsByDeck } = require("../Controllers/card.controller.js");
const router = express.Router();

router.get("/all", userVerification, getAllUserFlashcards);
router.post("/create", userVerification, createCard);
router.get("/deck/:deckId", userVerification, getCardsByDeck);
router.get("/deck/:deckid/card/:id", userVerification, getFlashcardDetails);
router.put("/:id", userVerification, updateCard);
router.delete("/:id", userVerification, deleteCard);

module.exports = router;
