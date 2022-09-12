import HashMap from "hashmap";
import { SynonymRepository } from "../synonym.repository";

/**
 * @classdesc Repository class for storing synonyms in memory.
 */
export class SynonymMemoryRepository implements SynonymRepository{

  private lookupMap = new HashMap<string, string>();
  private synonimMap = new HashMap<string, Set<string>>();

  /**
   * @inheritDoc
   */
  public getSynonymsFor(word: string): Set<string> {
    if (this.hasSynonyms(word)) {
      const lookupKey = this.getLookupKey(word);
      return this.getSynonymsWithoutWord(word, lookupKey);
    } else {
      return new Set<string>();
    }
  }

  /**
   * @inheritDoc
   */
  public addSynonymFor(word: string, synonym: string): void {
    const lookupKey = this.getLookupKey(word);
    const synonyms = this.getSynonymsFor(word);
    synonyms.add(word);
    synonyms.add(synonym);
    this.addToLookupMap(word, lookupKey);
    this.addToLookupMap(synonym, lookupKey);
    this.synonimMap.set(lookupKey, synonyms);
  }

  /**
   * @inheritDoc
   */
  public hasSynonyms(word: string): boolean {
    return this.lookupMap.has(word);
  }

  private addToLookupMap(word: string, lookupKey: string): void {
    this.lookupMap.set(word, lookupKey);
  }

  private getLookupKey(word: string): string {
    const lookupKey = this.lookupMap.get(word);
    return !!lookupKey ? lookupKey : word;
  }

  private getSynonymsWithoutWord(word: string, lookupKey: string): Set<string> {
    const synonyms = new Set(this.synonimMap.get(lookupKey));
    synonyms.delete(word);
    return synonyms;
  }
}