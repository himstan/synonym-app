import { SynonymMemoryRepository } from "../repository/impl/synonym-memory.repository";
import { SynonymRepository } from "../repository/synonym.repository";

/**
 * @classdesc Service class for providing data from and into the repository.
 */
export class SynonymService {

  private repository: SynonymRepository;

  constructor() {
    this.repository = new SynonymMemoryRepository();
  }

  /**
   * Gets all the synonyms for a word.
   *
   * @param word The word the synonyms are for.
   *
   * @return  The set of synonyms for the word.
   */
  public getSynonymsFor(word: string): Set<string> {
    return this.repository.getSynonymsFor(word);
  }

  /**
   * Adds a synonym for a word.
   *
   * @param word    The word the synonym is going to be for.
   * @param synonym The synonym for the word.
   */
  public addSynonymFor(word: string, synonym: string): void {
    return this.repository.addSynonymFor(word, synonym);
  }

  /**
   * Returns if the words has any synonyms or not.
   *
   * @param word  The word the synonyms are for.
   *
   * @return Returns true if there are any synonyms for the word, false if there are not.
   */
  public hasSynonyms(word: string): boolean {
    return this.repository.hasSynonyms(word);
  }
}