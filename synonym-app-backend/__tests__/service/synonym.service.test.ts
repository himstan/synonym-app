import { SynonymService } from "../../src/service/synonym.service";

const synonymService = new SynonymService();

test("Get synonyms for word without any synonyms", async () => {
  const mockWord = 'word';
  const synonyms = synonymService.getSynonymsFor(mockWord);
  expect(synonyms.size).toBe(0);
});

test("Check if word has any synonym", async () => {
  const mockWord = 'word';
  expect(synonymService.hasSynonyms(mockWord)).toBe(false);
});

test("Adding a synonym then getting it back", async () => {
  const mockWord = 'A';
  const mockSynonym = 'B';
  synonymService.addSynonymFor(mockWord, mockSynonym);
  const synonyms = synonymService.getSynonymsFor(mockWord);
  const negatedSynonyms = synonymService.getSynonymsFor(mockSynonym);
  expect(synonyms.size).toBe(1);
  expect(negatedSynonyms.size).toBe(1);
  const synonymForWord = synonyms.values().next().value;
  const synonymForSynonym = negatedSynonyms.values().next().value;
  expect(synonymForWord).toBe(mockSynonym);
  expect(synonymForSynonym).toBe(mockWord);
});