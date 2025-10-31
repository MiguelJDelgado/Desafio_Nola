import sequelize from "../config/database.js";
import Store from "./Store.js";
import Channel from "./Channel.js";
import Customer from "./Customer.js";
import Product from "./Product.js";
import Item from "./Item.js";
import Sale from "./Sale.js";
import ProductSale from "./ProductSale.js";
import ItemProductSale from "./ItemProductSale.js";
import ItemItemProductSale from "./ItemItemProductSale.js";
import Payment from "./Payment.js";
import OptionGroup from "./OptionGroup.js";
import DeliveryAddress from "./DeliveryAddress.js";

Store.hasMany(Sale, { foreignKey: "store_id" });
Sale.belongsTo(Store, { foreignKey: "store_id" });

Channel.hasMany(Sale, { foreignKey: "channel_id" });
Sale.belongsTo(Channel, { foreignKey: "channel_id" });

Customer.hasMany(Sale, { foreignKey: "customer_id" });
Sale.belongsTo(Customer, { foreignKey: "customer_id" });

Sale.hasMany(ProductSale, { foreignKey: "sale_id" });
ProductSale.belongsTo(Sale, { foreignKey: "sale_id" });

Product.hasMany(ProductSale, { foreignKey: "product_id" });
ProductSale.belongsTo(Product, { foreignKey: "product_id" });

ProductSale.hasMany(ItemProductSale, { foreignKey: "product_sale_id" });
ItemProductSale.belongsTo(ProductSale, { foreignKey: "product_sale_id" });

Item.hasMany(ItemProductSale, { foreignKey: "item_id" });
ItemProductSale.belongsTo(Item, { foreignKey: "item_id" });

OptionGroup.hasMany(ItemProductSale, { foreignKey: "option_group_id" });
ItemProductSale.belongsTo(OptionGroup, { foreignKey: "option_group_id" });

ItemProductSale.hasMany(ItemItemProductSale, { foreignKey: "item_product_sale_id" });
ItemItemProductSale.belongsTo(ItemProductSale, { foreignKey: "item_product_sale_id" });

Item.hasMany(ItemItemProductSale, { foreignKey: "item_id" });
ItemItemProductSale.belongsTo(Item, { foreignKey: "item_id" });

OptionGroup.hasMany(ItemItemProductSale, { foreignKey: "option_group_id" });
ItemItemProductSale.belongsTo(OptionGroup, { foreignKey: "option_group_id" });

Sale.hasMany(DeliveryAddress, { foreignKey: "sale_id" });
DeliveryAddress.belongsTo(Sale, { foreignKey: "sale_id" });

Sale.hasMany(Payment, { foreignKey: "sale_id" });
Payment.belongsTo(Sale, { foreignKey: "sale_id" });

export {
  sequelize,
  Store,
  Channel,
  Customer,
  Product,
  Item,
  Sale,
  ProductSale,
  ItemProductSale,
  ItemItemProductSale,
  Payment,
  OptionGroup,
  DeliveryAddress
};
