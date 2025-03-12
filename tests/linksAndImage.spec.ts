import { test, expect } from "@playwright/test";
import { VisitPage } from "../page-objects/visitPage";
import { GetProduct } from "../page-objects/getProduct";

test.describe("Links and image", () => {
  test.beforeEach(async ({ page }) => {
    const visitPage = new VisitPage(page);
    await visitPage.visitPageAndClosePopups();
    await visitPage.visitShopPage();
    const getProduct = new GetProduct(page);
    const productSku = await getProduct.getProductSku();
    await page.locator(`div[data-sku="${productSku}"]`).click();
  });

  test("Broken links on the product page", async ({ page }) => {
    const links = await page.locator("a").all();
    for (const link of links) {
      const href = await link.getAttribute("href");
      if (href && !href.startsWith("#")) {
        const response = await page.request.get(href);
        expect(response.status()).toBeLessThan(400);
      }
    }
  });

  test("Broken images on the product page", async ({ page }) => {
    const images = await page.locator("img").all();
    for (const img of images) {
      const src = await img.getAttribute("src");
      if (src) {
        const response = await page.request.get(src);
        expect(response.status()).toBe(200);
      }
    }
  });
});
