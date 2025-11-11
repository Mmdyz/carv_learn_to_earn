import { PublicKey } from "@solana/web3.js";
import questLogIdl from "../idl/quest_log.json";
//import rewardsManagerIdl from "../idl/rewards_manager.json";


export const QUEST_LOG_PROGRAM_ID = new PublicKey("BYoPk2Ef4pWZJrspQNnKM8ZFLkwFU3wrS2HSEqDYmbzL");
//export const REWARDS_MANAGER_PROGRAM_ID = new PublicKey("8Qz5ArQJcRtCbdXSoD94Rw5nWJ2st94xgqwbCKWo2fJc");

export const IDLs = {
  questLog: questLogIdl,
  //rewardsManager: rewardsManagerIdl,
};
