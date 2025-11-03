/** use anchor_lang::prelude::*;

declare_id!("8Qz5ArQJcRtCbdXSoD94Rw5nWJ2st94xgqwbCKWo2fJc");

#[program]
pub mod rewards_manager {
    use super::*;

    pub fn initialize_reward_account(ctx: Context<InitializeRewardAccount>) -> Result<()> {
        let reward_account = &mut ctx.accounts.reward_account;
        reward_account.user = *ctx.accounts.user.key;
        reward_account.total_rewards = 0;
        reward_account.bump = ctx.bumps.reward_account; // ✅ Fixed bump reference

        msg!("🎯 Reward account initialized for user: {:?}", reward_account.user);
        Ok(())
    }

    pub fn grant_reward(ctx: Context<GrantReward>, amount: u64) -> Result<()> {
        let reward_account = &mut ctx.accounts.reward_account;
        reward_account.total_rewards += amount;
        reward_account.last_reward_timestamp = Clock::get()?.unix_timestamp;

        msg!(
            "💰 Granted {} reward points to {:?}. Total: {}",
            amount,
            reward_account.user,
            reward_account.total_rewards
        );

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeRewardAccount<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 8 + 1,
        seeds = [b"reward_account", user.key().as_ref()],
        bump
    )]
    pub reward_account: Account<'info, RewardAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GrantReward<'info> {
    #[account(mut, seeds = [b"reward_account", user.key().as_ref()], bump = reward_account.bump)]
    pub reward_account: Account<'info, RewardAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct RewardAccount {
    pub user: Pubkey,
    pub total_rewards: u64,
    pub last_reward_timestamp: i64,
    pub bump: u8,
}
