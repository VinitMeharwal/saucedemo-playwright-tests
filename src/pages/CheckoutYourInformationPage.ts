import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutYourInformationPage extends BasePage {

    private firstNameInput: Locator;
    private lastNameInput: Locator;
    private postalCodeInput: Locator;
    private continueButton: Locator;
    private errorMessage: Locator;

    constructor(protected page: Page) {
        super(page);
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }
    async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }
    async clickContinue() {
        return await this.continueButton.click();
    }
    async getErrorMessageText() {
        return await this.errorMessage.textContent();
    }
}