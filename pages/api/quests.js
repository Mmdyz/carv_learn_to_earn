// pages/api/quests.js
import quests from "../../lib/questsData";

export default function handler(req, res) {
  res.status(200).json(quests);
}
