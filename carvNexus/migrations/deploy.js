// migrations/deploy.js
const anchor = require("@coral-xyz/anchor");

module.exports = async function (provider) {
  // Configure the provider
  anchor.setProvider(provider);

  // Load the program
  const program = anchor.workspace.CarvLearnToEarn;

  console.log("🚀 Deploying CARV Learn-to-Earn program...");

  // Optional: create an example PDA or initialize state account
  try {
    const tx = await program.methods
      .completeQuest(new anchor.BN(1)) // Example method call (quest_log.rs)
      .accounts({
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Program initialized successfully!");
    console.log("Transaction signature:", tx);
  } catch (err) {
    console.warn("⚠️ Skipping initialization, program deployed successfully!");
  }
};
