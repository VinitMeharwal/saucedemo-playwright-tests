import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutOverviewPage extends BasePage {

    private itemsLocator: Locator;
    private itemNamesLocator: Locator;
    private itemPricesLocator: Locator;
    private totalPriceLocator: Locator;
    private finishButtonLocator: Locator;


    constructor(protected page: Page) {
        super(page);
        this.itemsLocator = page.locator('[data-test="inventory-item"]');
        this.itemNamesLocator = page.locator('[data-test="inventory_item_name"]');
        this.itemPricesLocator = page.locator('[data-test="inventory_item_price"]');
        this.totalPriceLocator = page.locator('[data-test="subtotal-label"]');
        this.finishButtonLocator = page.locator('[data-test="finish"]');
    }

    async getItemNames() {
        return await this.itemNamesLocator.allTextContents();
    }

    async getItemPrices() {
        return await this.itemPricesLocator.allTextContents();
    }

    async getItemPrice(productName: string) {
        const priceLocator = await this.itemsLocator.filter({ hasText: productName }).locator('[data-test="inventory-item-price"]');
        const priceText = await priceLocator.textContent();
        return priceText ? parseFloat(priceText.replace('$', '').trim()) : 0;
    }

    async getTotalPrice() {
        const totalPriceText = await this.totalPriceLocator.allTextContents();
        return totalPriceText[0];;
    }
    async clickFinish() {
        await this.finishButtonLocator.click();
    }
}