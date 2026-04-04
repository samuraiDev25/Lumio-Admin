export const PAGE_SIZE = 8;

export const BAN_REASONS = ['Reason for ban', 'Bad behavior', 'Advertising placement', 'Another reason'] as const;

export type BanReason = (typeof BAN_REASONS)[number];
