# Playwright Tests for Ploom Websites

## Overview
This test suite is designed to verify core functionalities of the Ploom e-commerce websites while ensuring scalability for multiple markets. The tests are implemented using [Playwright](https://playwright.dev/) with TypeScript.

## Supported Markets
Currently, the tests are configured to run on the following Ploom websites:
- [Ploom UK](https://www.ploom.co.uk/en)
- [Ploom Poland](https://www.ploom.pl/pl)

The test design allows easy extension to additional country-specific Ploom websites.

## Prerequisites
### Installation
Ensure you have Node.js and npm installed. Then, install dependencies:
```sh
npm install
```
### Playwright Setup
To install Playwright dependencies and browsers:
```sh
npx playwright install
```

## Test Cases
### 1. Add Product to Cart
**Objective:** Verify that a product can be successfully added to the cart.

**Steps:**
1. Visit the Ploom website.
2. Click on "Shop".
3. Open the product page using SKU (e.g., 'ploom-x-advanced').
4. Add the product to the cart.
5. Verify the basket count is updated.
6. Open the basket.
7. Verify that the product appears in the basket.

### 2. Remove Product from Cart
**Objective:** Verify that a product can be successfully removed from the cart.

**Precondition:** At least one product is already in the cart.

**Steps:**
1. Open the cart.
2. Remove the product from the cart.
3. Verify that the product is no longer in the cart.
4. Ensure the basket count is updated correctly.

### 3. Check for Broken Links and Images on Product Page
**Objective:** Ensure that all links and images on the product page function correctly.

**Steps:**
1. Visit the Ploom website.
2. Click on "Shop".
3. Open the product page using SKU (e.g., 'ploom-x-advanced').
4. Check all links on the product page to ensure none are broken.
5. Verify that all images load correctly.

## Running Tests
To execute the tests, use the following command:
```sh
npx playwright test
```

For a specific test file:
```sh
npx playwright test tests/cart.spec.ts
```

To generate and view the test report:
```sh
npx playwright show-report
```

## Extending the Tests to New Markets
To add a new market:
1. Identify the new Ploom website URL.
2. Update the configuration file to include the new base URL.
3. Ensure tests dynamically adjust based on the selected market.

## Reporting Issues
If you encounter any issues or have suggestions for improvement, please open an issue in this repository.

---
This test suite ensures smooth e-commerce operations for Ploom across different markets while maintaining flexibility and scalability.

