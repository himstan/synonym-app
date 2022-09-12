import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { InputError } from "../../core/enum/input-error.enum";
import { getInputValue, isKeyEnter, validateInput } from "../../core/util/form.util";
import * as synonymService from "../../service/synonym.service";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

export interface AddSynonymDialogProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  word: string;
  onSave: (savedSynonym: string) => void;
  synonyms?: string[]
}

export function AddSynonymDialog(props: AddSynonymDialogProps) {

  const [synonym, setSynonym] = useState<string>('');
  const [inputErrors, setInputErrors] = useState<InputError[]>([]);

  const toast = useRef(null);

  const saveSynonym = (): void => {
    if (validateInput(synonym, setInputErrors, props.synonyms)) {
      synonymService.saveSynonym(props.word, synonym).subscribe({
        next: () => {
          showSuccessToast();
          hideDialog();
          props.onSave(synonym);
        },
        error: () => showErrorToast()
      })
    }
  }

  const handleKeyPress = (event: any): void => {
    if (isKeyEnter(event)) {
      saveSynonym();
    }
  }

  const hasError = (error: InputError): boolean => {
    return inputErrors.includes(error);
  }

  const isInputValid = (): boolean => {
    return inputErrors.length === 0;
  }

  const showSuccessToast = (): void => {
    if (!!toast) {
      // @ts-ignore
      toast.current.show({severity: 'success', detail: 'Synonym saved successfully!', life: 3000})
    }
  }

  const showErrorToast = (): void => {
    if (!!toast) {
      // @ts-ignore
      toast.current.show({severity: 'error', detail: 'There was an error while saving the synonym.', life: 3000})
    }
  }

  const hideDialog = (): void => {
    setSynonym('');
    setInputErrors([]);
    props.setIsVisible(false);
  }

  return (
    <div>
      <Dialog draggable={false} header={<span>Add synonym for <span className="word">{props.word}</span></span>} visible={props.isVisible} onHide={() => hideDialog()}>
        <div className="p-inputgroup">
          <input
            type="text"
            className="synonym-input"
            placeholder={"Add synonym..."}
            value={synonym}
            onChange={(e) => setSynonym(getInputValue(e))}
            onKeyDown={handleKeyPress}
          />
          <Button label="Add" onClick={saveSynonym}/>
        </div>

        <div className="input-error-container">
          {
            !isInputValid() && (
              <div className="input-errors">
                {
                  hasError(InputError.MIN_LENGTH) && (
                    <span>The word is required.</span>
                  )
                }
                {
                  hasError(InputError.MAX_LENGTH) && (
                    <span>The word can't be longer than 20 letters.</span>
                  )
                }
                {
                  hasError(InputError.ALREADY_EXISTS) && (
                    <span>This synonym already exists.</span>
                  )
                }
              </div>
            )
          }
        </div>
      </Dialog>
      <Toast ref={toast} />
    </div>
  );
}