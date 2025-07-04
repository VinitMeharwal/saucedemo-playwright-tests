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
    missingPostal: checkoutDataArr.find((d) => d.type === 'missingPostal')!,
};
const products: { name: string; price: number }[] = readJsonData(
    path.resolve(__dirname, '../test-data/products.json')
);

test.describe('Checkout Process and Price Validation', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(validUsers[0].username, validUsers[0].password);
        const productsPage = new ProductsPage(page);
        await productsPage.clickAddToCart(products[0].name);
        await productsPage.goToCart();
        const cartPage = new YourCartPage(page);
        await cartPage.clickCheckout();
    });

    test('should complete checkout and validate item total and order confirmation', async ({ page }) => {
        // Fill checkout info
        const checkoutInfoPage = new CheckoutYourInformationPage(page);
        const { firstName, lastName, postalCode } = checkoutData.valid;
        await checkoutInfoPage.fillCheckoutInfo(firstName, lastName, postalCode);
        await checkoutInfoPage.clickContinue();

        // Overview page
        const overviewPage = new CheckoutOverviewPage(page);
        const addedProducts = [products[0]];
        if (addedProducts.every((p) => p.price !== undefined)) {
            const expectedTotal = addedProducts.reduce((sum, p) => sum + Number(p.price), 0);
            const actualTotal = await overviewPage.getTotalPrice();
            expect(actualTotal).toBe(`Item total: $${expectedTotal.toFixed(2)}`);
        }
        await overviewPage.clickFinish();

        // Complete page
        const completePage = new CheckoutCompletePage(page);
        await expect(await completePage.getThankYouMessage()).toContain('Thank you for your order');
    });

    test('should show error when postal code is missing during checkout', async ({ page }) => {
        const checkoutInfoPage = new CheckoutYourInformationPage(page);
        const { firstName, lastName, postalCode } = checkoutData.missingPostal;
        await checkoutInfoPage.fillCheckoutInfo(firstName, lastName, postalCode);
        await checkoutInfoPage.clickContinue();
        const errorText = await checkoutInfoPage.getErrorMessageText();
        expect(errorText).toContain('Error: Postal Code is required');
    });
});
