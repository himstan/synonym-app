/**
 * Data transfer object for responding to synonym get request.
 *
 * @param word      The requested word.
 * @param synonyms  The synonyms for the requested word.
 */
export interface SynonymGetResponseDto {
  word: string;
  synonyms: string[];
}