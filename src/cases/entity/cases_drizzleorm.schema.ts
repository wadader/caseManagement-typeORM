import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { RELATION_NAMES } from './relation_names';

export const lawyers = pgTable(RELATION_NAMES.lawyers.tableName, {
  id: serial(RELATION_NAMES.lawyers.fields.id).primaryKey(),
  name: text(RELATION_NAMES.lawyers.fields.name).notNull(),
});

export const judges = pgTable(RELATION_NAMES.judges.tableName, {
  id: serial(RELATION_NAMES.judges.fields.id).primaryKey(),
  name: text(RELATION_NAMES.judges.fields.name).notNull(),
});

export const caseCategories = pgTable(RELATION_NAMES.caseCategories.tableName, {
  type: serial(RELATION_NAMES.caseCategories.fields.type).primaryKey(),
});

export const caseResults = pgTable(RELATION_NAMES.caseResults.tableName, {
  result: serial(RELATION_NAMES.caseResults.fields.result).primaryKey(),
});

export const cases = pgTable(RELATION_NAMES.cases.tableName, {
  id: serial(RELATION_NAMES.cases.fields.id).primaryKey(),
  description: text(RELATION_NAMES.cases.fields.description).notNull(),
  caseCategory: text(RELATION_NAMES.cases.fields.caseCategory).references(
    () => caseCategories.type,
  ),
  caseResult: text(RELATION_NAMES.cases.fields.caseResult).references(
    () => caseResults.result,
  ),
  prosecutor: integer(RELATION_NAMES.cases.fields.prosecutor).references(
    () => lawyers.id,
  ),
  defender: integer(RELATION_NAMES.cases.fields.defender).references(
    () => lawyers.id,
  ),
  judge: integer(RELATION_NAMES.cases.fields.judge).references(() => judges.id),
});
