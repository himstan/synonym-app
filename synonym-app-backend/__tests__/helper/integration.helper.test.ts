import { IntegrationHelpers } from "./integration.helper";
import { Application } from "express";

describe('Integration helper test', () => {

  let app: Application;

  it('Test get app',  async () => {
    app = await IntegrationHelpers.getApp();
    expect(app).toBeDefined();
  });

  it('Test get app after it\'s been instantiated',  async () => {
    const localApp = await IntegrationHelpers.getApp();
    expect(app).toBe(localApp);
  });
});