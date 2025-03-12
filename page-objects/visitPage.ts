import { Page } from "@playwright/test";

export class VisitPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async visitPageAndClosePopups() {
    await this.page.goto("/");

    await this.page.context().addCookies([
      {
        name: "OptanonAlertBoxClosed",
        value: "true",
        domain: ".ploom.co.uk",
        path: "/",
      },
      {
        name: "isAgeConfirmed",
        value: "true",
        domain: ".ploom.co.uk",
        path: "/",
      },
      {
        name: "OptanonAlertBoxClosed",
        value: "true",
        domain: ".ploom.pl",
        path: "/",
      },
      {
        name: "isAgeConfirmed",
        value: "true",
        domain: ".ploom.pl",
        path: "/",
      },
    ]);
    await this.page.reload()
    // await this.page.locator("#onetrust-accept-btn-handler").click();
    // await this.page.locator(".ageconfirmation__confirmBtn").click();
  }
}
