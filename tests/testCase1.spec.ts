import { test, expect } from "@playwright/test";
import { VisitPage } from "../page-objects/visitPage";

const shopTitle = /Sklep|Shop/;

test("Add product to cart", async ({ page }) => {
  const visitPage = new VisitPage(page);

  await visitPage.visitPageAndClosePopups();
  const currentUrl = page.url();
  await page
    .locator('a[data-testid^="headerItem"]', { hasText: shopTitle })
    .click();
  await page.mouse.move(0, 0);

  // For the Polish market, there is no selector with the value data-sku="ploom-x-advanced", which is why I suggested a conditional solution here
  const productSku = currentUrl.endsWith("pl")
    ? "15108712"
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
  await expect(productInBasket).toContainText("Ploom X Advanced");
});
