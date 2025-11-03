use anchor_lang::prelude::*;

declare_id!("BYoPk2Ef4pWZJrspQNnKM8ZFLkwFU3wrS2HSEqDYmbzL");

#[program]
pub mod quest_log {
    use super::*;

    pub fn complete_quest(ctx: Context<CompleteQuest>, quest_id: u64) -> Result<()> {
        let quest_log = &mut ctx.accounts.quest_log;
        quest_log.user = *ctx.accounts.user.key;
        quest_log.quest_id = quest_id;
        quest_log.timestamp = Clock::get()?.unix_timestamp;

        msg!(
            "✅ Quest completed by {:?}, quest_id: {}, timestamp: {}",
            quest_log.user,
            quest_log.quest_id,
            quest_log.timestamp
        );

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(quest_id: u64)]
pub struct CompleteQuest<'info> {
    /// PDA initialized for each quest completion per user
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 8,
        seeds = [b"quest_log", user.key().as_ref(), &quest_id.to_le_bytes()],
        bump
    )]
    pub quest_log: Account<'info, QuestLog>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct QuestLog {
    pub user: Pubkey,
    pub quest_id: u64,
    pub timestamp: i64,
}
