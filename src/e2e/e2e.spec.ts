import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { YourCartPage } from '../pages/YourCartPage';
import { CheckoutYourInformationPage } from '../pages/CheckoutYourInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { readJsonData } from '../utils/dataUtils';
import path from 'path';

const users = readJsonData<{ username: string; password: string; type: string }[]>(
    path.resolve(__dirname, '../test-data/users.json')
);
const validUsers = users.filter((u) => u.type === 'valid');
const checkoutDataArr = readJsonData<{ firstName: string; lastName: string; postalCode: string; type: string }[]>(
    path.resolve(__dirname, '../test-data/checkoutData.json')
);
const checkoutData = {
    valid: checkoutDataArr.find((d) => d.type === 'valid')!,
};
const products: { name: string; price: number }[] = readJsonData(
    path.resolve(__dirname, '../test-data/products.json')
);

test.describe('End-to-End Purchase Flow', () => {
    test('should perform end-to-end purchase flow and verify order completion', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(validUsers[0].username, validUsers[0].password);

        const productsPage = new ProductsPage(page);
        await productsPage.clickAddToCart(products[0].name);
        await productsPage.goToCart();
        const cartPage = new YourCartPage(page);
        await cartPage.clickCheckout();

        // Fill checkout info
        const checkoutInfoPage = new CheckoutYourInformationPage(page);
        const { firstName, lastName, postalCode } = checkoutData.valid;
        await checkoutInfoPage.fillCheckoutInfo(firstName, lastName, postalCode);
        await checkoutInfoPage.clickContinue();

        // Overview page
        const overviewPage = new CheckoutOverviewPage(page);
        await overviewPage.clickFinish();

        // Complete page
        const completePage = new CheckoutCompletePage(page);
        await expect(await completePage.getThankYouMessage()).toContain('Thank you for your order');
    });
});
