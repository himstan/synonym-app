import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import nock from "nock";
import { SynonymGetResponseDto } from "./model/dto/synonym-get-response.dto";

const SERVER_URL = process.env.REACT_APP_BACKEND_URL || '';
const path = '/api/synonym/';
const mockSynonyms = [
  'test1',
  'test2'
];

const mockPost = (word: string, synonym: string, responseCode: number): void => {
  nock(SERVER_URL)
    .defaultReplyHeaders({
    })
    .post(path, { word, synonym })
    .reply(responseCode, {},{
      'access-control-allow-origin': '*',
      'Content-Type': 'application/json'
    });
}

const mockGet = (word: string, responseCode: number, mockData: SynonymGetResponseDto): void => {
  nock(SERVER_URL)
    .get(path + word)
    .reply(responseCode, mockData, {
      'access-control-allow-origin': '*',
      'Content-Type': 'application/json'
    });
}

const getMockData = (word: string): SynonymGetResponseDto => {
  return { word, synonyms: mockSynonyms };
}

const searchForSynonym = async (
  word: string,
  responseCode: number,
  mockData = getMockData(word),
  callback?: () => (Promise<any> | any)
): Promise<void> => {
  mockGet(word, responseCode, mockData);

  render(<App />);
  const input = screen.getByRole('textbox');
  const searchButton = screen.getByRole('button');
  fireEvent.input(input, { target: { value: word } })
  fireEvent.click(searchButton);
  if (callback) {
    await waitFor(callback);
  }
};

const openSynonymAddDialog = async (
  callback: (addInput: HTMLElement | Promise<HTMLElement>) => void,
  word = 'abc'
): Promise<void> => {
  await searchForSynonym(word, 200, getMockData(word), async () => {
    const addButton = screen.getByRole('add-button');
    fireEvent.click(addButton);
    await waitFor(async () => callback(await screen.getByRole('add-input')));
  });
};

const addSynonym = async (
  word: string,
  synonym: string,
  responseCode: number,
  callback: () => (Promise<any> | any)
): Promise<void> => {
  await openSynonymAddDialog( async (addInput) => {
    mockPost(word, synonym, responseCode);

    const addButton = screen.getByRole('add-input-button');
    fireEvent.input(await addInput, { target: { value: synonym } })
    fireEvent.click(addButton);
    await waitFor(callback);
  });
};

describe('App tests', () => {

  test('Renders input', () => {
    render(<App/>);
    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button');

    expect(input).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('Input: uppercase letters turn to lowercase', () => {
    render(<App/>);
    const input = screen.getByRole('textbox');
    fireEvent.input(input, {target: {value: 'AbCDfE'}})
    const inputWithValue = screen.getByDisplayValue('abcdfe');

    expect(inputWithValue).toBeInTheDocument();
  });

  test('Invalid input: no word', () => {
    render(<App/>);
    const searchButton = screen.getByRole('button');
    fireEvent.click(searchButton);
    const error = screen.getByText('A word is required.');

    expect(error).toBeInTheDocument();
  });

  test('Invalid input: word too long', () => {
    render(<App/>);
    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button');
    fireEvent.input(input, {target: {value: 'aaaaaaaaaaaaaaaaaaaaa'}});
    fireEvent.click(searchButton);
    const error = screen.getByText('The word can\'t be longer than 20 letters.');

    expect(error).toBeInTheDocument();
  });

  test('On search: Internal server error', () => {
    searchForSynonym('abc', 500, getMockData('abc'), () => {
      expect(async () =>
        await screen.findByText('There was an internal error while fetching the synonyms.')
      ).toBeInTheDocument();
    });
  });

  test('On search: Successful empty synonym fetch', () => {
    searchForSynonym('abc', 200, getMockData('abc'), () => {
      expect(
        screen.getByText('If you happen to know any, feel free to add it!')
      ).toBeInTheDocument();
    });
  });

  test('On search: Successful synonym fetch', () => {
    searchForSynonym('abc', 200, getMockData('abc'), () => {
      expect(
        screen.getByText('test1')
      ).toBeInTheDocument();
      expect(
        screen.getByText('test2')
      ).toBeInTheDocument();
    });
  });

  test('Before search: No add button', () => {
    render(<App/>);
    const addButton = screen.queryByRole('add-button');
    expect(addButton).not.toBeInTheDocument();
  });

  test('After successful search: There is an add button',  () => {
    searchForSynonym('abc', 200, getMockData('abc'), () => {
      expect(
        screen.getByRole('add-button')
      ).toBeInTheDocument()
    });
  });

  test('After pressing the add button, a dialog pops up', async () => {
    await searchForSynonym('abc', 200, getMockData('abc'), () => {
      const addButton = screen.getByRole('add-button');
      fireEvent.click(addButton);
      const addInput = screen.getByRole('add-input');
      expect(addInput).toBeInTheDocument();
    });
  });

  test('Add input: uppercase letters turn to lowercase', async () => {
    await openSynonymAddDialog(async addInput => {
      fireEvent.input(await addInput, {target: {value: 'AbCDfE'}})
      const inputWithValue = screen.getByDisplayValue('abcdfe');

      expect(inputWithValue).toBeInTheDocument();
    });
  });

  test('Invalid add input: no word', async () => {
    await openSynonymAddDialog(async () => {
      const searchButton = screen.getByRole('add-input-button');
      fireEvent.click(searchButton);
      const error = await screen.findByText('A word is required.');

      expect(error).toBeInTheDocument();
    });
  });

  test('Invalid add input: word too long', done => {
    openSynonymAddDialog(async addInput => {
      const searchButton = screen.getByRole('add-input-button');
      fireEvent.input(await addInput, {target: {value: 'aaaaaaaaaaaaaaaaaaaaa'}});
      fireEvent.click(searchButton);
      const error = await screen.findByText('The word can\'t be longer than 20 letters.');

      expect(error).toBeInTheDocument();
      done();
    });
  });

  test('Invalid add input: Word is the same as the synonym',  done => {
    addSynonym('abc', 'abc', 200, async () => {
      await waitFor(async () => {
        const error = await screen.findByText('The synonym can\'t be the word itself.');

        expect(error).toBeInTheDocument();
        done();
      });
    });
  });

  test('Invalid add input: Word is already a synonym',  done => {
    addSynonym('abc', 'test1', 200, async () => {
      await waitFor(async () => {
        const error = await screen.findByText('This synonym already exists.');

        expect(error).toBeInTheDocument();
        done();
      });
    });
  });
});
