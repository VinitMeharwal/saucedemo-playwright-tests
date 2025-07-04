import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {

    private thankYouMessageLocator: Locator;
    private backToProductsButtonLocator: Locator;

    constructor(protected page: Page) {
        super(page);
        this.thankYouMessageLocator = page.locator('[data-test="complete-header"]');
        this.backToProductsButtonLocator = page.locator('[data-test="back-to-products"]');
    }


    async getThankYouMessage() {
        return await this.thankYouMessageLocator.textContent();
    }

    async clickBackToProducts() {
        await this.backToProductsButtonLocator.click();
    }
}