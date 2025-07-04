import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { YourCartPage } from '../pages/YourCartPage';
import { CheckoutYourInformationPage } from '../pages/CheckoutYourInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
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

test('should validate product price on Products, YourCart, and Checkout Overview pages', async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validUsers[0].username, validUsers[0].password);

    // Products page
    const productsPage = new ProductsPage(page);
    const product = products[0];
    const productPriceOnProducts = await productsPage.getProductPrice(product.name);
    expect(Number(productPriceOnProducts)).toBeCloseTo(Number(product.price), 2);
    await productsPage.clickAddToCart(product.name);
    await productsPage.goToCart();

    // YourCart page
    const cartPage = new YourCartPage(page);
    const productPriceOnCart = await cartPage.getProductPrice(product.name);
    expect(Number(productPriceOnCart)).toBeCloseTo(Number(product.price), 2);
    await cartPage.clickCheckout();

    // Checkout info page
    const checkoutInfoPage = new CheckoutYourInformationPage(page);
    const { firstName, lastName, postalCode } = checkoutData.valid;
    await checkoutInfoPage.fillCheckoutInfo(firstName, lastName, postalCode);
    await checkoutInfoPage.clickContinue();

    // Checkout overview page
    const overviewPage = new CheckoutOverviewPage(page);
    const productPriceOnOverview = await overviewPage.getItemPrice(product.name);
    expect(Number(productPriceOnOverview)).toBeCloseTo(Number(product.price), 2);
});
