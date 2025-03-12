import { Page } from "@playwright/test";

export class GetProduct {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  async getProductSku() {
    const currentUrl = this.page.url();
    // For the Polish market, there is no selector with the value data-sku="ploom-x-advanced", which is why I suggested a conditional solution here
    return currentUrl.endsWith("pl/sklep") ? "15147889" : "ploom-x-advanced";
  }
}
