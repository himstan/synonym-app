import { SynonymMemoryRepository } from "../repository/impl/synonym-memory.repository";
import { SynonymRepository } from "../repository/synonym.repository";

export class SynonymService {

  private repository: SynonymRepository;

  constructor() {
    this.repository = new SynonymMemoryRepository();
  }

  public getSynonymsFor(word: string): Set<string> {
    return this.repository.getSynonymsFor(word);
  }

  public addSynonymFor(word: string, synonym: string): void {
    return this.repository.addSynonymFor(word, synonym);
  }

  public hasSynonyms(word: string): boolean {
    return this.repository.hasSynonyms(word);
  }
}