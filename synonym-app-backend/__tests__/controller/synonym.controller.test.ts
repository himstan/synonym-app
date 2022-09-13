import 'jest';
import request from 'supertest';
import { StatusCodes, } from 'http-status-codes';
import { Application } from "express";
import { IntegrationHelpers } from "../helper/integration.helper";


describe('Synonym controller tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = await IntegrationHelpers.getApp(true);
  });

  afterAll(async () => {
    await IntegrationHelpers.closeApp();
  })

  it('Get synonyms for word without any', async () => {
    const word = 'A';

    await request(app)
      .get('/api/synonym/' + word)
      .set('Accept', 'application/json')
      .expect((res: request.Response) => {
        const body = res.body;
        expect(body.word).toBe(word);
        expect(body.synonyms.length).toBe(0);
      })
      .expect(StatusCodes.OK);
  });

  it('Get synonyms for word with too many letters', async () => {
    const word = 'A'.repeat(21);

    await request(app)
      .get('/api/synonym/' + word)
      .set('Accept', 'application/json')
      .expect((res: request.Response) => {
        const errors = res.body.errors;
        expect(errors.length).toBe(1);
        expect(errors[0].value).toBe(word);
      })
      .expect(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('Get synonyms without a word', async () => {
    await request(app)
      .get('/api/synonym/')
      .set('Accept', 'application/json')
      .expect(StatusCodes.NOT_FOUND);
  });

  it('Adds a synonym for a word', async () => {
    await request(app)
      .post('/api/synonym/')
      .send({
        word: 'high',
        synonym: 'tall'
      })
      .set('Accept', 'application/json')
      .expect(StatusCodes.OK);
  });

  it('Adds a synonym for a word with too many letters', async () => {
    const word = 'A'.repeat(21);
    const synonym = 'B'.repeat(21);

    await request(app)
      .post('/api/synonym/')
      .send({
        word,
        synonym
      })
      .set('Accept', 'application/json')
      .expect((res: request.Response) => {
        const errors = res.body.errors;
        expect(errors.length).toBe(2);
        expect(errors[0].value).toBe(word);
        expect(errors[1].value).toBe(synonym);
      })
      .expect(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('Get synonyms for a word', async () => {
    await testAndVerifySuccessfulGetSynonym('high', 'tall');
  });

  it('Get synonyms for a word (reversed)', async () => {
    await testAndVerifySuccessfulGetSynonym('tall', 'high');
  });

  async function testAndVerifySuccessfulGetSynonym(word: string, synonym: string) {
    await request(app)
      .get('/api/synonym/' + word)
      .set('Accept', 'application/json')
      .expect((res: request.Response) => {
        const body = res.body;
        expect(body.word).toBe(word);
        expect(body.synonyms.length).toBe(1);
        expect(body.synonyms[0]).toBe(synonym);
      })
      .expect(StatusCodes.OK);
  }
});