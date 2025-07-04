import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { YourCartPage } from '../pages/YourCartPage';
import { readJsonData } from '../utils/dataUtils';
import path from 'path';

const users = readJsonData<{ username: string; password: string; type: string }[]>(
    path.resolve(__dirname, '../test-data/users.json')
);
const validUsers = users.filter((u) => u.type === 'valid');
const products: { name: string; price: number }[] = readJsonData(
    path.resolve(__dirname, '../test-data/products.json')
);

test.describe('Add to Cart, Cart Verification, and Removal', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(validUsers[0].username, validUsers[0].password);
    });

    test('should add one product to cart', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const product = products[0];
        await productsPage.clickAddToCart(product.name);
        await expect(await productsPage.getCartItemCount()).toBe(1);
        await productsPage.goToCart();

        const cartPage = new YourCartPage(page);
        const cartItems = cartPage.getCartItemsLocator();
        await expect(cartItems).toHaveCount(1);
        await expect(cartItems.filter({ hasText: product.name })).toBeVisible();
    });

    test('should add multiple products to cart', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        for (const product of products) {
            await productsPage.clickAddToCart(product.name);
        }
        await await expect(await productsPage.getCartItemCount()).toBe(products.length);
        await productsPage.goToCart();

        const cartPage = new YourCartPage(page);
        const cartItems = cartPage.getCartItemsLocator();
        await expect(cartItems).toHaveCount(products.length);
        for (const product of products) {
            await expect(cartItems.filter({ hasText: product.name })).toBeVisible();
        }
    });

    test('should remove one product from cart', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        // Add two products
        await productsPage.clickAddToCart(products[0].name);
        await productsPage.clickAddToCart(products[1].name);
        await productsPage.goToCart();

        const cartPage = new YourCartPage(page);
        let cartItems = cartPage.getCartItemsLocator();
        await expect(cartItems).toHaveCount(2);
        // Remove one product
        await cartPage.clickRemoveFromCart(products[0].name);
        cartItems = cartPage.getCartItemsLocator();
        await expect(cartItems).toHaveCount(1);
        await expect(cartItems.filter({ hasText: products[1].name })).toBeVisible();
    });

    test('should remove all products from cart', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        for (const product of products) {
            await productsPage.clickAddToCart(product.name);
        }
        await productsPage.goToCart();

        const cartPage = new YourCartPage(page);
        let cartItems = cartPage.getCartItemsLocator();
        await expect(cartItems).toHaveCount(products.length);
        // Remove all products
        for (const product of products) {
            await cartPage.clickRemoveFromCart(product.name);
        }
        cartItems = cartPage.getCartItemsLocator();
        await expect(cartItems).toHaveCount(0);
    });

    test('should show empty cart when no products are added', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        await productsPage.goToCart();
        const cartPage = new YourCartPage(page);
        await expect(cartPage.getCartItemsLocator()).toHaveCount(0);
    });

    test('should return to products page when continue shopping is clicked from cart', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        await productsPage.clickAddToCart(products[0].name);
        await productsPage.goToCart();
        const cartPage = new YourCartPage(page);

        await cartPage.clickContinueShopping();
        // Verify we are back on the products page (e.g., by checking a product is visible)
        await expect(productsPage.getRemoveFromCartButtonLocator(products[0].name)).toBeVisible();
    });

    test('should reflect cart state after login and logout', async ({ page, context }) => {
        // Login and add a product
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(validUsers[0].username, validUsers[0].password);
        const productsPage = new ProductsPage(page);
        await productsPage.clickAddToCart(products[0].name);
        await productsPage.goToCart();
        const cartPage = new YourCartPage(page);
        await expect(cartPage.getCartItemsLocator()).toHaveCount(1);

        // Log out (assume ProductsPage has a logout method or use UI steps)
        await productsPage.logout();

        // Log back in
        await loginPage.goto();
        await loginPage.login(validUsers[0].username, validUsers[0].password);
        await productsPage.goToCart();
        await expect(cartPage.getCartItemsLocator()).toHaveCount(1);
    });
});
