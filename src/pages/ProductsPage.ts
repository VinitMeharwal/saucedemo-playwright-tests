import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {


  constructor(protected page: Page) {
    super(page);
  }

  getProductCardLocator(productName: string) {
    return this.page.locator('[data-test="inventory-item"]').filter({ hasText: productName });
  }

  getAddToCartButtonLocator(productName: string) {
    return this.getProductCardLocator(productName).locator('button[data-test^="add-to-cart"]');
  }

  getRemoveFromCartButtonLocator(productName: string) {
    return this.getProductCardLocator(productName).locator('button[data-test^="remove"]');
  }

  private getProductPriceLocator(productName: string) {
    return this.getProductCardLocator(productName).locator('[data-test="inventory-item-price"]');
  }

  async getProductPrice(productName: string) {
    const priceText = await this.getProductPriceLocator(productName).textContent();
    return priceText ? priceText.replace(/[^\d.]/g, '') : '';
  }

  async clickAddToCart(productName: string) {
    const addButton = this.getAddToCartButtonLocator(productName);
    await addButton.click();
  }

  async clickRemoveFromCart(productName: string) {
    const removeButton = this.getRemoveFromCartButtonLocator(productName);
    await removeButton.click();
  }

}
