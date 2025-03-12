import { test, expect } from "@playwright/test";
import { VisitPage } from "../page-objects/visitPage";
import { ApiRequest } from "../page-objects/apiRequest";

const shopTitle = /Sklep|Shop/;
const productName = "Ploom X Advanced";

test.describe("Card actions", () => {
  test.beforeEach(async ({ page }) => {
    const visitPage = new VisitPage(page);
    await visitPage.visitPageAndClosePopups();
  });

  test("Add product to the cart", async ({ page }) => {
    const currentUrl = page.url();
    await page
      .locator('a[data-testid^="headerItem"]', { hasText: shopTitle })
      .click();
    await page.mouse.move(0, 0);
    // For the Polish market, there is no selector with the value data-sku="ploom-x-advanced", which is why I suggested a conditional solution here
    const productSku = currentUrl.endsWith("pl")
      ? "15147889"
      : "ploom-x-advanced";
    await page.locator(`div[data-sku="${productSku}"]`).click();
    await page.getByTestId("pdpAddToProduct").click();
    const count = page
      .getByTestId("cart")
      .locator("div")
      .locator('div[class*="IconLabeled-module-label"]');
    await expect(count).toContainText("1");
    await page.getByTestId("cart").click();
    const productInBasket = page.locator(
      'strong[class^="ProductMiniature-module-productName"]'
    );
    await expect(productInBasket).toContainText(productName);
  });

  test("Remove product from the cart", async ({ page }) => {
    const apiRequest = new ApiRequest(page);
    await apiRequest.addItemToCart();
    await page.waitForTimeout(3000);
    await page.getByTestId("cart").waitFor({ state: "attached" });
    await page.getByTestId("cart").click();
    await page.getByTestId("cartRemoveButton").click();
    const basket = page.getByTestId("mini-cart-header");
    await expect(basket).not.toContainText(productName);
  });
});
