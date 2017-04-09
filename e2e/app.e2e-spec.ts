import { OrderManagementPage } from './app.po';

describe('order-management App', () => {
  let page: OrderManagementPage;

  beforeEach(() => {
    page = new OrderManagementPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
