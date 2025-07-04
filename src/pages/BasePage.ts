import { Page, Locator } from '@playwright/test';

export class BasePage {
    private cartLinkLocator: Locator;

    constructor(protected page: Page) {
        this.page = page;
        this.cartLinkLocator = page.locator('[data-test^="shopping-cart-link"]');
    }

    async logout() {
        const menuButton = this.page.locator('#react-burger-menu-btn');
        await menuButton.click();
        const logoutButton = this.page.locator('#logout_sidebar_link');
        await logoutButton.click();
    }

    async goToCart() {
        await this.cartLinkLocator.click();
    }

    async getCartItemCount() {
        const countText = await this.cartLinkLocator.textContent();
        return countText ? parseInt(countText.replace(/\D/g, ''), 10) : 0;
    }
}
