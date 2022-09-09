export interface SynonymRepository {
  getSynonymsFor(word: string): Set<string>;
  addSynonymFor(word: string, synonym: string): void;
  hasSynonyms(word: string): boolean;
}