import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';
const login = (world: CustomWorld) => {
  if (!world.page) throw new Error('Page was not initialized');
  return new LoginPage(world.page);
};
Given('I open the customer login page', async function (this: CustomWorld) { await login(this).open(); });
When('I submit email {string} and password {string}', async function (this: CustomWorld, email: string, password: string) { await login(this).login(email, password); });
Then('a login error should be displayed', async function (this: CustomWorld) { await login(this).expectError(); });
