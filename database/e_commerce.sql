/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80021
 Source Host           : localhost:3306
 Source Schema         : e_commerce

 Target Server Type    : MySQL
 Target Server Version : 80021
 File Encoding         : 65001

 Date: 20/12/2022 18:13:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cart_item
-- ----------------------------
DROP TABLE IF EXISTS `cart_item`;
CREATE TABLE `cart_item` (
  `cart_id` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of cart_item
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for order_status
-- ----------------------------
DROP TABLE IF EXISTS `order_status`;
CREATE TABLE `order_status` (
  `status_id` int NOT NULL,
  `status_name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of order_status
-- ----------------------------
BEGIN;
INSERT INTO `order_status` (`status_id`, `status_name`) VALUES (1, 'รอจ่าย');
INSERT INTO `order_status` (`status_id`, `status_name`) VALUES (2, 'เตรียมส่ง');
INSERT INTO `order_status` (`status_id`, `status_name`) VALUES (3, 'ยกเลิก');
INSERT INTO `order_status` (`status_id`, `status_name`) VALUES (4, 'เสร็จสิ้น');
COMMIT;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `total` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_id` int DEFAULT NULL,
  `status_id` int DEFAULT '1',
  `create_date` datetime DEFAULT NULL,
  `midified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of orders
-- ----------------------------
BEGIN;
INSERT INTO `orders` (`order_id`, `username`, `product_id`, `quantity`, `total`, `payment_id`, `status_id`, `create_date`, `midified_date`) VALUES (1, 'user01', 1, 1, '1', NULL, 3, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for payment_detail
-- ----------------------------
DROP TABLE IF EXISTS `payment_detail`;
CREATE TABLE `payment_detail` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `amount` int DEFAULT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0' COMMENT '0 = ไม่จ่าย, 1 = จ่ายแล้ว',
  `create_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of payment_detail
-- ----------------------------
BEGIN;
INSERT INTO `payment_detail` (`payment_id`, `amount`, `provider`, `status`, `create_date`, `update_date`, `order_id`) VALUES (1, 14500, NULL, 0, NULL, NULL, 1);
COMMIT;

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `inventory_id` int DEFAULT NULL,
  `product_desciption` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `create_date` datetime DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `product_img` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of product
-- ----------------------------
BEGIN;
INSERT INTO `product` (`product_id`, `product_name`, `price`, `category_id`, `inventory_id`, `product_desciption`, `create_date`, `modified_date`, `product_img`) VALUES (1, 'G-SHOCK GM-110EARTH-1A', 14500.00, 1, 1, 'ทะยานออกไปด้วยความทนทานของ G-SHOCK ที่สามารถนำคุณไปยังอวกาศเพื่อการมองเห็นโลกได้อย่างแท้จริง โลกของเราที่เห็นจากอวกาศได้รับการสร้างสรรค์ขึ้นใหม่อย่างโดดเด่นด้วยการเคลือบไอออนทั่วทั้งกรอบโลหะที่ผ่านกระบวนการผลิตแบบพิเศษและหน้าปัดนาฬิกาขนาดใหญ่อันเป็นเอกลักษณ์ที่หุ้มด้วยโลหะของ GM 110 แสดงความกล้าหาญและความท้าทายของคุณด้วยกรอบโลหะที่ออกแบบมาอย่างโดดเด่นในลักษณะลวดลายของโลก', NULL, NULL, 'https://www.casio.com/content/dam/casio/product-info/locales/th/th/timepiece/product/watch/G/GM/GM1/gm-110earth-1a/assets/GM-110EARTH-1A.png.transform/main-visual-pc/image.png');
INSERT INTO `product` (`product_id`, `product_name`, `price`, `category_id`, `inventory_id`, `product_desciption`, `create_date`, `modified_date`, `product_img`) VALUES (2, 'G-SHOCK GA-110Y-9A', 10500.00, 1, 1, 'ย้อนยุคไปกับ G-SHOCK ทรงสปอร์ตสุดสดใสในรูปแบบยุค 90 ที่ได้รับแรงบันดาลใจมาจากซีรีส์สปอร์ตเมื่อช่วงยุค 90 การออกแบบแสดงให้เห็นชุดสีดั้งเดิมอันเป็นเอกลักษณ์ของ DW-001 ปี 1994 มีให้เลือกสำหรับการจับคู่เพื่อแบ่งปันให้กับคนพิเศษ', NULL, NULL, 'https://www.casio.com/content/dam/casio/product-info/locales/th/th/timepiece/product/watch/G/GA/GA1/ga-110y-9a/assets/GA-110Y-9A.png.transform/main-visual-pc/image.png');
COMMIT;

-- ----------------------------
-- Table structure for product_category
-- ----------------------------
DROP TABLE IF EXISTS `product_category`;
CREATE TABLE `product_category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of product_category
-- ----------------------------
BEGIN;
INSERT INTO `product_category` (`category_id`, `category_name`, `description`, `create_date`, `modified_date`) VALUES (1, 'นาฬิกา', 'นาฬิกา เป็นเครื่องมือสำหรับใช้บอกเวลา โดยมากจะมีรอบเวลา 12 ชั่วโมง หรือ 24 ชั่วโมง สำหรับนาฬิกาทั่วไป', NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for product_inventory
-- ----------------------------
DROP TABLE IF EXISTS `product_inventory`;
CREATE TABLE `product_inventory` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`inventory_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of product_inventory
-- ----------------------------
BEGIN;
INSERT INTO `product_inventory` (`inventory_id`, `quantity`, `create_date`, `modified_date`) VALUES (1, 100, NULL, '2022-12-20 18:11:19');
INSERT INTO `product_inventory` (`inventory_id`, `quantity`, `create_date`, `modified_date`) VALUES (2, 50, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_name` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_profile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mid_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number_phone` int DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `create_date` datetime DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`username`, `password`, `role_name`, `img_profile`, `first_name`, `mid_name`, `last_name`, `email`, `address`, `number_phone`, `birthday`, `status`, `create_date`, `modified_date`) VALUES ('user01', 'user01', 'user', 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg', 'user', '', '01', '', 'user01@email.com', 811111111, '2000-12-01', 1, NULL, NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
