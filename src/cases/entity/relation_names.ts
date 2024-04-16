export const RELATION_NAMES = {
  lawyers: {
    tableName: 'lawyers',
    fields: {
      id: 'id',
      name: 'name',
    },
  },
  judges: {
    tableName: 'judges',
    fields: {
      id: 'id',
      name: 'name',
    },
  },
  caseCategories: {
    tableName: 'case_categories',
    fields: {
      type: 'type',
    },
  },
  caseResults: {
    tableName: 'case_results',
    fields: {
      result: 'result',
    },
  },
  cases: {
    tableName: 'cases',
    fields: {
      id: 'id',
      description: 'description',
      caseCategory: 'case_category',
      caseResult: 'case_result',
      prosecutor: 'prosecutor',
      defender: 'defender',
      judge: 'judge',
    },
  },
} as const;
