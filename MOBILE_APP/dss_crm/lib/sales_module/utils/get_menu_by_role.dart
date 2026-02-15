

import '../sales_hod/menu/sales_hod_menu.dart';

List<MenuItemModel> getMenuItemsByRole(String role) {
  switch (role) {
    case "SalesHOD":
      return getSalesHODMenu();
    case "SalesTL":
      return getSalesHODMenu();
    case "SaleEmployee":
      return getSalesHODMenu();
    default:
      return [];
  }
}
