# Test Scenarios and Prioritization for SauceDemo E-commerce Website

## 1. Login Functionality (High Priority)

- **Positive:** User can log in with valid credentials.
- **Negative:** User cannot log in with invalid credentials (wrong password, locked user, etc.).


## 2. Add to Cart, Cart Verification, and Removal (High Priority)

- **Positive:** User can add one product to the cart and see it listed.
- **Positive:** User can add multiple products to the cart and see all listed.
- **Positive:** User cannot add the same product multiple times (duplicate prevention).
- **Positive:** User can remove one product from the cart and the cart updates accordingly.
- **Positive:** User can remove all products from the cart and the cart becomes empty.
- **Positive:** Cart badge/count updates correctly after add/remove.
- **Positive:** User can use "Continue Shopping" from the cart to return to the products page.
- **Positive:** Cart state is checked after logout/login (should persist or clear as per app logic).
- **Negative:** Cart remains empty if no products are added, or after all products are removed.


## 3. Checkout Process and Price Validation (Medium Priority)

- **Positive:** User can complete the checkout process with valid information.
- **Positive:** Item total and final total (including tax) on the checkout page match the sum of product prices and tax.
- **Positive:** Product price is validated on Products, Cart, and Checkout Overview pages.
- **Negative:** Checkout fails with missing or invalid information (e.g., missing postal code).

## Rationale for Prioritization

- **Login** is the entry point for all users and must work for any further actions.
- **Add to Cart** is core to the shopping experience and must be reliable.
- **Checkout** is essential for completing purchases, but depends on the previous steps.

These scenarios cover the most critical user flows and include both positive and negative cases for robust coverage. Test cases are optimized to combine related behaviors (e.g., add, verify, prevent duplicates, and remove in a single flow) for efficiency and maintainability.
