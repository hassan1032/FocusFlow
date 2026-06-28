
const Card =require("../models/Cards.models.js");

const { cardSchema }=require("../schemas/cardSchema.js");
const mongoose=require("mongoose");

module.exports.createCard = async (req, res,next) => {

    try {
      const parsedBody = cardSchema.parse(req.body);
      console.log("Parsed body:", parsedBody);      
  
      // Create new card
      const newCard = new Card({
        ...parsedBody,
        userId: req.user._id,
      })
      await newCard.save();
  
      return res.status(201).json({
        message: "Card created successfully",
        card: newCard,
      });
    } catch (error) {
      console.log("error from createCard")
      console.log(error)
      next(error);
      
      return res.status(400).json({
        message: error.errors || "Invalid data",
      });
    }
  };


  module.exports.getFlashcardDetails = async (req, res) => {
    try {
      console.log("User Object:", req.user);
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - User not found in request" });
      }
      const { deckid, id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(deckid) || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
    console.log("Requested deckId:", deckid);
    console.log("Requested userId:", id);
  
      // Find the flashcard in the deck
      const flashcard = await Card.findOne({ userId: req.user._id, deckName: deckid });
  
      if (!flashcard) {
        return res.status(404).json({ message: "Flashcard not found" });
      }
      res.status(200).json(flashcard);
    } catch (error) {
      console.error("Error fetching flashcard:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  module.exports.getAllUserFlashcards = async (req, res) => {
  try {
    const userId = req.user._id;
    const cards = await Card.find({ userId });
    if (!cards.length) {
      return res.status(404).json({ message: "No cards found" });
    }
    res.status(200).json({ cards });
  } catch (err) {
    console.error("Error fetching all user cards:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });
    if (card.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (req.body.term !== undefined) card.term = req.body.term;
    if (req.body.defination !== undefined) card.defination = req.body.defination;
    if (req.body.isImage !== undefined) card.isImage = req.body.isImage;
    await card.save();
    res.status(200).json({ message: "Card updated", card });
  } catch (err) {
    console.error("updateCard error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });
    if (card.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Card.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Card deleted" });
  } catch (err) {
    console.error("deleteCard error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getCardsByDeck = async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.user._id, deckName: req.params.deckId });
    res.status(200).json({ cards });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};