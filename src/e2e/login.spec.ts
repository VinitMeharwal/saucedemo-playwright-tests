import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { readJsonData } from '../utils/dataUtils';
import path from 'path';

const users = readJsonData<{ username: string; password: string; type: string }[]>(
    path.resolve(__dirname, '../test-data/users.json')
);
const validUsers = users.filter((u) => u.type === 'valid');
const invalidUsers = users.filter((u) => u.type === 'invalid');

test.describe('Login Functionality', () => {
    for (const user of validUsers) {
        test(`should login successfully with valid credentials: ${user.username}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(user.username, user.password);
            await expect(page).toHaveURL(/inventory/);
        });
    }

    for (const user of invalidUsers) {
        test(`should not login with invalid credentials: ${user.username}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(user.username, user.password);
            await expect(loginPage.getErrorMessageLocator()).toBeVisible();
        });
    }
});
