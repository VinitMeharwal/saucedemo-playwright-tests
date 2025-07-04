
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class YourCartPage extends BasePage {

  private cartItemsLocator: Locator;
  private checkoutButtonLocator: Locator;
  private continueShoppingButtonLocator: Locator;

  constructor(protected page: Page) {
    super(page);
    this.cartItemsLocator = page.locator('[data-test="inventory-item"]');
    this.checkoutButtonLocator = page.locator('[data-test="checkout"]');
    this.continueShoppingButtonLocator = page.locator('[data-test="continue-shopping"]');
  }

  getCartItemsLocator() {
    return this.cartItemsLocator;
  }

  async clickRemoveFromCart(productName: string) {
    await this.getCartItemsLocator()
      .filter({ hasText: productName })
      .locator('button[data-test^="remove"]')
      .click();
  }

  async clickCheckout() {
    await this.checkoutButtonLocator.click();
  }
  async clickContinueShopping() {
    await this.continueShoppingButtonLocator.click();
  }
  private getProductPriceLocator(productName: string) {
    return this.getCartItemsLocator()
      .filter({ hasText: productName })
      .locator('[data-test="inventory-item-price"]');
  }

  async getProductPrice(productName: string) {
    const priceText = await this.getProductPriceLocator(productName).textContent();
    return priceText ? priceText.replace(/[^\d.]/g, '') : '';
  }

  async getTotalPriceOfCartItems() {
    const prices = await this.cartItemsLocator.locator('[data-test="inventory-item-price"]').allTextContents();
    return prices.reduce((sum, price) => sum + parseFloat(price.replace(/[^\d.]/g, '')), 0);
  }
}
