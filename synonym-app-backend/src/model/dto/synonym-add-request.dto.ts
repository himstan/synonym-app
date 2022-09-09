/**
 * Data transfer object for adding a synonym for a word.
 *
 * @param word    The word you are adding the synonym for.
 * @param synonym The synonym you are adding for the word.
 */
export interface SynonymAddRequestDto {
  word: string;
  synonym: string;
}