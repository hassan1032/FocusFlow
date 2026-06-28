import { Routes, Route } from "react-router-dom";
import AllDecks from "./pages/flashcard/AllDecks";
import DeckDetails from "./pages/flashcard/DeckDetails";
import Study from "./pages/flashcard/study/Study";

function FlashApp() {
  return (
    <Routes>
      <Route index element={<AllDecks />} />
      <Route path="dashboard/:id" element={<DeckDetails />} />
      <Route path="study/:id" element={<Study />} />
    </Routes>
  );
}

export default FlashApp;
