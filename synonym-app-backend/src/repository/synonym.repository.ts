/**
 * Repository interface for storing and fetching synonyms.
 */
export interface SynonymRepository {

  /**
   * Gets all the synonyms for a word.
   *
   * @param word The word the synonyms are for.
   *
   * @return  The set of synonyms for the word.
   */
  getSynonymsFor(word: string): Set<string>;

  /**
   * Adds a synonym for a word.
   *
   * @param word    The word the synonym is going to be for.
   * @param synonym The synonym for the word.
   */
  addSynonymFor(word: string, synonym: string): void;

  /**
   * Returns if the words has any synonyms or not.
   *
   * @param word  The word the synonyms are for.
   *
   * @return Returns true if there are any synonyms for the word, false if there are not.
   */
  hasSynonyms(word: string): boolean;
}