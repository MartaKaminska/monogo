import { expect, Page } from "@playwright/test";

export class ApiRequest {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private getCurrentUrl(): string {
    return this.page.url();
  }

  private getUrl(): string {
    const currentUrl = this.getCurrentUrl();
    if (currentUrl.endsWith("pl/pl"))
      return "https://api.jtides.com/des-ecommerce/m24-ploom-pl/v1/graphql";
    else if (currentUrl.endsWith("uk/en"))
      return "https://api.jtides.com/des-ecommerce/m24-ploom-uk/v1/graphql";
    else return "https://api.jtides.com/des-ecommerce/m24-ploom-uk/v1/graphql";
  }

  async getCartId() {
    return await this.page.evaluate(() =>
      localStorage.getItem("main_website_store_anonymousCartId")
    );
  }

  async addItemToCart() {
    const cartId = await this.getCartId();
    const sku = this.getCurrentUrl().endsWith("uk/en")
      ? "5000143959222"
      : "15147889";
    const addItemToCardRequest = await this.page.request.post(this.getUrl(), {
      data: {
        query:
          "mutation addSimpleProductsToCart($cartId: String!, $sku: String!, $quantity: Float!) {\n  addSimpleProductsToCart(\n    input: {cart_id: $cartId, cart_items: [{data: {sku: $sku, quantity: $quantity}}]}\n  ) {\n    cart {\n      id\n    }\n  }\n}\n",
        variables: {
          cartId: cartId?.replace(/^"|"$/g, ""),
          sku: sku,
          quantity: 1,
        },
        operationName: "addSimpleProductsToCart",
      },
    });
    expect(addItemToCardRequest.status()).toEqual(200);
    await this.page.reload();
  }

  async deleteItemFromCart() {
    const cartIdData = await this.getCartId();
    const cartId = cartIdData?.replace(/^"|"$/g, "");

    const getCartItemsId = await this.page.request.post(this.getUrl(), {
      data: {
        query:
          "query getCartItems($cartId: String!) {\n  cart(cart_id: $cartId) {\n    items {\n      id\n      errors {\n        code\n        message\n      }\n      product {\n        id\n        name\n        sku\n        subscription\n        trade_in\n        type_id\n        stock_status\n        subscription_format\n        promotionalOffers {\n          code\n          limit_qty\n          eligible\n          type\n          skus\n          description {\n            title\n            description\n            hint\n            label\n          }\n        }\n        price_range {\n          minimum_price {\n            regular_price {\n              value\n              currency\n            }\n            final_price {\n              value\n              currency\n            }\n            fixed_product_taxes {\n              label\n              amount {\n                value\n                currency\n              }\n            }\n          }\n          maximum_price {\n            discount {\n              amount_off\n              percent_off\n            }\n            fixed_product_taxes {\n              label\n              amount {\n                value\n                currency\n              }\n            }\n          }\n        }\n        image {\n          url\n          label\n        }\n        short_description {\n          html\n        }\n        flavor\n        flavor_label\n        enable_order_quantity_limit\n        order_quantity_limit\n        color_label\n        categories {\n          name\n          uid\n          store_locator_name\n        }\n        free_gifts {\n          allowed_qty\n          products {\n            is_eligible\n            eligibility_description\n            product {\n              name\n              sku\n              tooltip_info\n              stock_status\n              image {\n                url\n                label\n              }\n            }\n          }\n        }\n      }\n      quantity\n      prices {\n        discounts {\n          amount {\n            currency\n            value\n          }\n          label\n        }\n        price {\n          currency\n          value\n        }\n        row_total {\n          currency\n          value\n        }\n        row_total_including_tax {\n          currency\n          value\n        }\n        total_item_discount {\n          currency\n          value\n        }\n      }\n      ... on BundleCartItem {\n        bundle_options {\n          id\n          label\n          type\n          values {\n            id\n            label\n            price\n            quantity\n            presentation_info {\n              initial_price\n              presentation_price\n              product {\n                stock_status\n                tooltip_info\n                small_image {\n                  url\n                }\n                price_range {\n                  maximum_price {\n                    final_price {\n                      currency\n                      value\n                    }\n                    regular_price {\n                      currency\n                      value\n                    }\n                  }\n                  minimum_price {\n                    final_price {\n                      currency\n                      value\n                    }\n                    regular_price {\n                      currency\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n",
        variables: { cartId: cartId },
        operationName: "getCartItems",
      },
    });
    const responseBody = await getCartItemsId.json();
    const itemId = responseBody.data.cart;

    const delateProductWithRequest = await this.page.request.post(
      this.getUrl(),
      {
        data: {
          query:
            "mutation removeItemFromCart($cartId: String!, $itemId: Int!) {\n  removeItemFromCart(input: {cart_id: $cartId, cart_item_id: $itemId}) {\n    cart {\n      id\n    }\n  }\n}\n",
          variables: {
            cartId: cartId,
            itemId: itemId,
          },
          operationName: "removeItemFromCart",
        },
      }
    );
    expect(delateProductWithRequest.status()).toEqual(200);
  }
}
