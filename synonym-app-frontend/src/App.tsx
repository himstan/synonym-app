import React, { useState } from 'react';
import './App.scss';
import * as synonymService from "./service/synonym.service";
import './core/enum/input-error.enum'
import { InputError } from "./core/enum/input-error.enum";
import { Button } from "primereact/button";
import { AddSynonymDialog } from "./component/add-synonym-dialog/add-synonym-dialog";
import { isKeyEnter, validateInput } from "./core/util/form.util";

function App() {

  const [word, setWord] = useState<string>('');
  const [searchedUpWord, setSearchedUpWord] = useState<string>('');
  const [isInputTouched, setInputTouched] = useState<boolean>(false);
  const [inputErrors, setInputErrors] = useState<InputError[]>([]);
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [isDialogVisible, setDialogVisibility] = useState<boolean>(false);

  const fetchSynonyms = (): void => {
    if (validateInput(word, setInputErrors)) {
      synonymService.fetchSynonyms(word).subscribe(result => {
        setSearchedUpWord(word);
        setWord('');
        setSynonyms(result.synonyms)
      });
    } else {
      setSynonyms([]);
      setWord('');
      setSearchedUpWord('');
    }
  }

  const handleKeyPress = (event: any): void => {
    if (isKeyEnter(event)) {
      setInputTouched(true);
      fetchSynonyms();
    }
  }

  const hasError = (error: InputError): boolean => {
    return inputErrors.includes(error);
  }

  const isInputValid = (): boolean => {
    return inputErrors.length === 0;
  }

  const handleSynonymSave = (savedSynonym: string): void => {
    synonyms.push(savedSynonym);
    setSynonyms(synonyms);
  }

  return (
    <div className="app-container">
      <div className="input-container">
        <input
          type="text"
          className="synonym-input"
          placeholder="Search for synonyms..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className="input-error-container">
          {
            !isInputValid() && (
              <div className="input-errors">
                {
                  hasError(InputError.MIN_LENGTH) && (
                    <span>The word is required..</span>
                  )
                }
                {
                  hasError(InputError.MAX_LENGTH) && (
                    <span>The word can't be longer than 20 letters.</span>
                  )
                }
              </div>
            )
          }
        </div>
      </div>
      {
        isInputTouched && isInputValid() && (
          <div className="result-container">
            <div className="result-header">
              {
                isInputTouched && isInputValid() && (
                  <span>Synonyms for <span className="word">{searchedUpWord}</span></span>
                )
              }
            </div>
            <div className="result-body">
              {isInputTouched && synonyms.length > 0 && (
                <div className="synonym-table-container">
                  {
                    synonyms.map((synonym) =>
                      <span key={synonym}>{ synonym }</span>
                    )
                  }
                </div>)
              }
              {
                isInputTouched && synonyms.length === 0 && (
                  <div className="empty-table-container">
                    <span>It seems we don't know any synonyms for { searchedUpWord }.</span>
                    <span>If you happen to know any, feel free to add it!</span>
                  </div>
                )
              }
            </div>
            <div className="result-footer">
              {
                isInputTouched && isInputValid() && (
                  <Button onClick={() => setDialogVisibility(true)}>
                    <span>
                      Add synonym for <span className="word">{searchedUpWord}</span>
                    </span>
                  </Button>
                )
              }
            </div>
          </div>
        )
      }

      <AddSynonymDialog
        word={searchedUpWord}
        isVisible={isDialogVisible}
        setIsVisible={setDialogVisibility}
        onSave={(savedSynonym: string) => handleSynonymSave(savedSynonym)}
        synonyms={synonyms}
      />
    </div>
  );
}

export default App;
