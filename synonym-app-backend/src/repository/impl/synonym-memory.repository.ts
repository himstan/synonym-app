import HashMap from "hashmap";
import { SynonymRepository } from "../synonym.repository";

export class SynonymMemoryRepository implements SynonymRepository{

  private lookupMap = new HashMap<string, string>();
  private synonimMap = new HashMap<string, Set<string>>();

  public getSynonymsFor(word: string): Set<string> {
    if (this.hasSynonyms(word)) {
      const lookupKey = this.getLookupKey(word);
      return this.getSynonymsWithoutWord(word, lookupKey);
    } else {
      return new Set<string>();
    }
  }

  public addSynonymFor(word: string, synonym: string): void {
    const lookupKey = this.getLookupKey(word);
    const synonyms = this.getSynonymsFor(word);
    synonyms.add(word);
    synonyms.add(synonym);
    this.lookupMap.set(word, lookupKey);
    this.lookupMap.set(synonym, lookupKey);
    this.synonimMap.set(lookupKey, synonyms);
  }

  public hasSynonyms(word: string): boolean {
    return this.lookupMap.has(word);
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