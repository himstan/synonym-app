import { InputError } from "../enum/input-error.enum";
import { MAX_LENGTH } from "../constant/validation.constant";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

export const validateInput = (
  word: string,
  setErrors: Dispatch<SetStateAction<InputError[]>>,
  addingFor?: string,
  synonyms?: string[]
  ): boolean => {
  const errors = [];
  if (!word || word.length === 0) {
    errors.push(InputError.MIN_LENGTH);
  }
  if (word.length > MAX_LENGTH) {
    errors.push(InputError.MAX_LENGTH);
  }
  if (!!synonyms && synonyms.includes(word)) {
    errors.push(InputError.ALREADY_EXISTS);
  }
  if (!!addingFor && word === addingFor) {
    errors.push(InputError.SYNONYM_CANT_BE_ITSELF);
  }
  setErrors(errors);
  return errors.length === 0;
}

export const isKeyEnter = (event: any): boolean => {
  return event.key === 'Enter';
}

export const getInputValue = (event: ChangeEvent<HTMLInputElement>): string => {
  return event?.target?.value.toLowerCase();
}