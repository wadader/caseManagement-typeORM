// add more case types here.
// we can create a function that runs on startup that checks/loads them into the caseType table on startup

export const CASE_CATEGORIES = ['civil', 'criminal'] as const;

export type CaseCategoryType = (typeof CASE_CATEGORIES)[number];

export const CASE_RESULTS = ['guilty', 'innocent'] as const;

export type CaseResultType = (typeof CASE_RESULTS)[number];
