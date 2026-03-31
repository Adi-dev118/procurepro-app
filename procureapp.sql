CREATE DATABASE  IF NOT EXISTS `procureapp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `procureapp`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: procureapp
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (6,1,5,2,200),(7,8,5,2,200),(8,9,5,1,200);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `uodated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,1,'2026-03-01 12:59:18',NULL),(2,2,'2026-03-01 12:59:52',NULL),(5,5,'2026-03-01 18:16:16',NULL),(6,3,'2026-03-01 18:19:36',NULL),(7,4,'2026-03-01 19:13:43',NULL),(8,75,'2026-03-03 15:29:11',NULL),(9,80,'2026-03-03 15:31:20',NULL),(10,7,'2026-03-03 16:52:56',NULL),(11,21,'2026-03-03 16:56:41',NULL),(12,18,'2026-03-05 11:13:07',NULL),(13,22,'2026-03-05 11:15:58',NULL),(14,28,'2026-03-05 11:17:11',NULL);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `badge_color` varchar(45) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electronics','Electronic gadgets and devices','2026-03-03 23:18:43','bg-primary','active'),(2,'Furniture','Home and office furniture','2026-03-03 23:18:43','bg-success','active'),(3,'Computer Parts','Hardware and accessories','2026-03-03 23:18:43','bg-info','active'),(4,'Stationery','Office and school supplies','2026-03-03 23:18:43','bg-warning','active'),(5,'Home & Kitchen','Various items related to household and kitchens','2026-03-03 23:18:43','bg-danger','active');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disputes`
--

DROP TABLE IF EXISTS `disputes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disputes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `description` text,
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `status` enum('open','in progress','resolved','closed') DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disputes`
--

LOCK TABLES `disputes` WRITE;
/*!40000 ALTER TABLE `disputes` DISABLE KEYS */;
INSERT INTO `disputes` VALUES (1,11,18,17,'Defective Product','Prodoct was received in a bad condition','medium','open','2026-03-05 05:47:28','2026-03-05 05:47:28'),(2,6,5,12,'Wrong Item','The item delivered is wrong','low','in progress','2026-03-05 05:47:28','2026-03-05 08:12:24'),(3,8,7,4,'Late Delivery','The item was delivered late','high','resolved','2026-03-05 05:47:28','2026-03-05 05:47:28'),(4,13,22,2,'Item not Received','Status showing delivered but I didn\'t not got item','medium','in progress','2026-03-05 05:47:28','2026-03-05 08:12:24'),(5,6,5,12,'Counterfied Item','The product delivered is not original','high','open','2026-03-05 05:47:28','2026-03-05 08:11:51');
/*!40000 ALTER TABLE `disputes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price_at_purchase` double DEFAULT NULL,
  `subtotal` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,10,5,850,4250),(2,1,9,4,892.5,3570),(3,1,7,1,13125,13125),(4,1,5,1,210,210),(5,2,1,5,1155,5775),(6,2,3,15,654.15,9812.25),(7,3,20,15,630,9450),(8,3,10,154,850,130900),(9,3,3,1,654.15,654.15),(10,4,3,222,654.15,145221.3),(11,4,23,11,315,3465),(12,4,6,22,2310,50820),(13,5,6,22,2310,50820),(14,5,25,12,4200,50400),(15,5,8,2,13125,26250),(16,6,17,40,2415,96600),(17,7,17,40,2415,96600),(18,7,7,4,13125,52500),(19,7,11,41,5775,236775),(20,7,13,47,4725,222075),(21,8,13,47,4725,222075),(22,8,15,100,5250,525000),(23,9,1,10,1155,11550),(24,9,19,100,12600,1260000),(25,10,19,100,12600,1260000),(26,11,20,10,630,6300),(27,11,7,14,13125,183750),(28,11,5,7,210,1470),(29,11,13,45,4725,212625),(30,12,13,45,4725,212625),(31,12,5,7,210,1470),(32,13,5,7,210,1470),(33,14,25,120,4200,504000),(34,14,24,12,630,7560),(35,15,22,22,157.5,3465),(36,15,21,2,472.5,945);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `commission` decimal(10,2) DEFAULT '0.00',
  `payout_status` enum('pending','paid') DEFAULT 'pending',
  `rfq_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,3,21155.00,'delivered','2026-03-03 11:12:27','2026-03-05 12:05:35','paid',805.00,'paid',NULL),(2,3,15587.25,'pending','2026-03-03 11:18:05','2026-03-05 08:37:53','pending',742.25,'pending',NULL),(3,4,141004.15,'cancelled','2026-03-03 11:19:05','2026-03-05 08:37:53','pending',481.15,'pending',NULL),(4,5,199506.30,'pending','2026-03-03 11:19:52','2026-03-05 08:37:53','pending',9500.30,'pending',NULL),(5,5,127470.00,'processing','2026-03-03 11:21:18','2026-03-05 08:37:53','failed',6070.00,'pending',NULL),(6,5,96600.00,'delivered','2026-03-03 11:21:44','2026-03-05 12:05:35','paid',4600.00,'paid',NULL),(7,5,607950.00,'delivered','2026-03-03 11:22:28','2026-03-05 12:13:10','paid',28950.00,'paid',NULL),(8,7,747075.00,'delivered','2026-03-03 11:23:11','2026-03-05 12:05:35','paid',35575.00,'paid',NULL),(9,21,1271550.00,'processing','2026-03-03 11:28:09','2026-03-05 08:37:53','paid',60550.00,'pending',NULL),(10,21,1260000.00,'processing','2026-03-03 11:28:26','2026-03-05 08:37:53','pending',60000.00,'pending',NULL),(11,18,404145.00,'delivered','2026-03-05 05:43:58','2026-03-05 12:13:10','paid',19245.00,'paid',NULL),(12,4,214095.00,'pending','2026-03-05 05:45:29','2026-03-05 08:37:53','pending',10195.00,'pending',NULL),(13,22,1470.00,'delivered','2026-03-05 05:46:07','2026-03-05 12:13:10','paid',70.00,'paid',NULL),(14,22,511560.00,'pending','2026-03-05 05:46:35','2026-03-05 08:37:53','pending',24360.00,'pending',NULL),(15,28,4410.00,'pending','2026-03-05 05:47:28','2026-03-05 08:37:53','pending',210.00,'pending',NULL),(16,3,28350.00,'processing','2026-03-06 16:51:25','2026-03-06 16:51:25','pending',1350.00,'pending',6),(17,5,525000.00,'processing','2026-03-06 16:51:39','2026-03-06 16:51:39','pending',25000.00,'pending',7),(18,7,19425.00,'processing','2026-03-06 16:51:50','2026-03-06 16:51:50','pending',925.00,'pending',8),(19,9,651000.00,'processing','2026-03-06 16:52:02','2026-03-06 16:52:02','pending',31000.00,'pending',9),(20,11,414750.00,'processing','2026-03-06 16:52:13','2026-03-06 16:52:13','pending',19750.00,'pending',10);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payouts`
--

DROP TABLE IF EXISTS `payouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payouts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','paid') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payouts`
--

LOCK TABLES `payouts` WRITE;
/*!40000 ALTER TABLE `payouts` DISABLE KEYS */;
INSERT INTO `payouts` VALUES (1,9,3400.00,'paid','2026-03-05 12:10:10'),(2,17,237500.00,'paid','2026-03-05 12:10:10'),(3,2,3000.00,'paid','2026-03-05 12:10:10'),(4,12,184000.00,'paid','2026-03-05 12:10:10'),(5,1,225500.00,'paid','2026-03-05 12:10:10'),(6,6,625500.00,'paid','2026-03-05 12:10:10'),(7,4,500000.00,'paid','2026-03-05 12:10:10'),(8,3,6000.00,'paid','2026-03-05 12:10:10');
/*!40000 ALTER TABLE `payouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_flags`
--

DROP TABLE IF EXISTS `product_flags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_flags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  `reported_by` int NOT NULL,
  `reason` varchar(255) NOT NULL,
  `description` text,
  `status` enum('pending','under_review','removed','restored') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `reported_by` (`reported_by`),
  CONSTRAINT `product_flags_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `product_flags_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `product_flags_ibfk_3` FOREIGN KEY (`reported_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_flags`
--

LOCK TABLES `product_flags` WRITE;
/*!40000 ALTER TABLE `product_flags` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_flags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `review` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`,`user_id`),
  CONSTRAINT `product_reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
INSERT INTO `product_reviews` VALUES (16,10,3,5,'Great product quality and fast delivery','2026-03-06 09:40:46'),(17,9,3,3,'Great product quality and fast delivery','2026-03-06 09:40:46'),(18,7,3,5,'Great product quality and fast delivery','2026-03-06 09:40:46'),(19,5,3,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(20,1,3,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(21,3,3,3,'Great product quality and fast delivery','2026-03-06 09:40:46'),(22,20,4,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(23,10,4,5,'Great product quality and fast delivery','2026-03-06 09:40:46'),(24,3,4,5,'Great product quality and fast delivery','2026-03-06 09:40:46'),(25,3,5,3,'Great product quality and fast delivery','2026-03-06 09:40:46'),(26,23,5,3,'Great product quality and fast delivery','2026-03-06 09:40:46'),(27,6,5,5,'Great product quality and fast delivery','2026-03-06 09:40:46'),(28,25,5,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(29,8,5,5,'Great product quality and fast delivery','2026-03-06 09:40:46'),(30,17,5,3,'Great product quality and fast delivery','2026-03-06 09:40:46'),(31,7,5,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(32,11,5,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(33,13,5,5,'Great product quality and fast delivery','2026-03-06 09:40:46'),(34,13,7,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(35,15,7,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(36,1,21,3,'Great product quality and fast delivery','2026-03-06 09:40:46'),(37,19,21,3,'Great product quality and fast delivery','2026-03-06 09:40:46'),(38,20,18,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(39,7,18,3,'Great product quality and fast delivery','2026-03-06 09:40:46'),(40,5,18,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(41,13,18,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(42,13,4,4,'Great product quality and fast delivery','2026-03-06 09:40:46'),(43,5,4,3,'Great product quality and fast delivery','2026-03-06 09:40:46'),(44,5,22,3,'Great product quality and fast delivery','2026-03-06 09:40:46'),(45,25,22,3,'Great product quality and fast delivery','2026-03-06 09:40:46'),(46,24,22,5,'Great product quality and fast delivery','2026-03-06 09:40:46'),(47,22,28,5,'Great product quality and fast delivery','2026-03-06 09:40:46'),(48,21,28,5,'Great product quality and fast delivery','2026-03-06 09:40:46');
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `sku` varchar(45) NOT NULL,
  `supplier_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `final_price` decimal(10,2) DEFAULT NULL,
  `stock` varchar(45) NOT NULL,
  `verification_status` enum('pending','approved','suspended','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `moq` int DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku_UNIQUE` (`sku`),
  KEY `fk_product_supplier` (`supplier_id`),
  KEY `fk_category` (`category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_product_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Head Phones','M-401-2060',10,3,1100.00,1155.00,'150','approved','2026-03-03 23:18:43','bi-headphones','Noise cancelling, 30hr battery',10),(3,'Chairs','C-121-4123',4,2,623.00,654.15,'0','approved','2026-03-03 23:18:43','bi-usb-drive','Comfortable chairs, deluxe feeling',10),(4,'Televison','T-210-3215',1,1,220.00,231.00,'30','suspended','2026-03-03 23:18:43','bi-mouse','Dolbi atmos sound, with 46 inches scrreen',10),(5,'Necklace','N-571-2145',2,4,200.00,210.00,'1179','approved','2026-03-03 23:18:43','bi-keyboard','Affordable with premium feeling',10),(6,'Bedsheets','B-324-1247',14,5,2200.00,2310.00,'456','approved','2026-03-03 23:18:43','bi-display','Feels like home, smeels like home',10),(7,'Mouse','M-478-4147',17,1,12500.00,13125.00,'481','approved','2026-03-03 23:18:43','bi-tv',NULL,10),(8,'Laptop','L-857-1287',1,3,12500.00,13125.00,'498','approved','2026-03-03 23:18:43','bi-laptop',NULL,100),(9,'Home Theatre','H-123-5478',9,1,850.00,892.50,'496','approved','2026-03-03 23:18:43','bi-speaker',NULL,20),(11,'SSD','S-201-4256',1,3,5500.00,5775.00,'459','approved','2026-03-03 23:18:43','bi-device-ssd',NULL,5),(12,'Harddisk','H-201-1289',1,3,15000.00,15750.00,'500','suspended','2026-03-03 23:18:43','bi-device-hdd',NULL,10),(13,'Keyboard','K-401-2354',6,3,4500.00,4725.00,'316','suspended','2026-03-03 23:18:43','bi-gem',NULL,10),(14,'Pendrive','P-400-1285',1,3,1200.00,1260.00,'500','pending','2026-03-03 23:18:43','bi-usb-drive',NULL,20),(15,'Tables','T-547-4879',4,2,5000.00,5250.00,'400','pending','2026-03-03 23:18:43','bi-table',NULL,10),(16,'Bed','B-874-2478',4,2,250.00,262.50,'500','approved','2026-03-03 23:18:43','bi-bed',NULL,10),(17,'Doors','D-452-1147',12,2,2300.00,2415.00,'420','approved','2026-03-03 23:18:43','bi-door-open',NULL,100),(18,'Dustbin','D-741-4217',3,5,300.00,315.00,'500','rejected','2026-03-03 23:18:43','bi-trash',NULL,10),(19,'Refrigerator','R-123-4987',9,1,12000.00,12600.00,'300','approved','2026-03-03 23:18:43','bi-snow',NULL,10),(20,'Clock','C-654-7412',3,5,600.00,630.00,'475','approved','2026-03-03 23:18:43','bi-clock',NULL,20),(21,'Monitor','M-654-7891',17,3,450.00,472.50,'498','approved','2026-03-03 23:18:43','bi-basket',NULL,1),(22,'Bucket','B-236-4123',12,5,150.00,157.50,'478','approved','2026-03-03 23:18:43','bi-bucket',NULL,1),(23,'Containers','C-147-5412',12,5,300.00,315.00,'489','approved','2026-03-03 23:18:43','bi-box',NULL,1),(24,'Note Books','N-412-5478',4,4,600.00,630.00,'488','approved','2026-03-03 23:18:43','bi-book',NULL,1),(25,'Cooler','C-236-4125',1,1,4000.00,4200.00,'368','approved','2026-03-03 23:18:43','bi-fan',NULL,1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfq_invitations`
--

DROP TABLE IF EXISTS `rfq_invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfq_invitations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rfq_id` int DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `invited_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('invited','viewed','responded') DEFAULT 'invited',
  PRIMARY KEY (`id`),
  KEY `rfq_id` (`rfq_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `rfq_invitations_ibfk_1` FOREIGN KEY (`rfq_id`) REFERENCES `rfqs` (`id`),
  CONSTRAINT `rfq_invitations_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfq_invitations`
--

LOCK TABLES `rfq_invitations` WRITE;
/*!40000 ALTER TABLE `rfq_invitations` DISABLE KEYS */;
INSERT INTO `rfq_invitations` VALUES (1,6,1,'2026-03-06 17:39:53','responded'),(2,6,2,'2026-03-06 17:39:53','responded'),(3,6,3,'2026-03-06 17:39:53','viewed'),(4,6,4,'2026-03-06 17:39:53','invited'),(5,6,5,'2026-03-06 17:39:53','invited'),(6,6,6,'2026-03-06 17:39:53','viewed'),(7,7,5,'2026-03-06 17:39:53','responded'),(8,7,8,'2026-03-06 17:39:53','responded'),(9,7,1,'2026-03-06 17:39:53','viewed'),(10,7,2,'2026-03-06 17:39:53','invited'),(11,7,3,'2026-03-06 17:39:53','invited'),(12,7,4,'2026-03-06 17:39:53','viewed'),(13,8,6,'2026-03-06 17:39:53','responded'),(14,8,2,'2026-03-06 17:39:53','responded'),(15,8,3,'2026-03-06 17:39:53','invited'),(16,8,4,'2026-03-06 17:39:53','viewed'),(17,8,5,'2026-03-06 17:39:53','invited'),(18,8,7,'2026-03-06 17:39:53','viewed'),(19,9,7,'2026-03-06 17:39:53','responded'),(20,9,8,'2026-03-06 17:39:53','responded'),(21,9,1,'2026-03-06 17:39:53','invited'),(22,9,2,'2026-03-06 17:39:53','viewed'),(23,9,3,'2026-03-06 17:39:53','invited'),(24,9,4,'2026-03-06 17:39:53','viewed'),(25,10,1,'2026-03-06 17:39:53','responded'),(26,10,3,'2026-03-06 17:39:53','responded'),(27,10,2,'2026-03-06 17:39:53','viewed'),(28,10,4,'2026-03-06 17:39:53','invited'),(29,10,5,'2026-03-06 17:39:53','invited'),(30,10,6,'2026-03-06 17:39:53','viewed'),(31,11,4,'2026-03-07 17:39:53','invited'),(32,11,7,'2026-03-07 17:39:53','invited'),(33,11,8,'2026-03-07 17:39:53','invited'),(34,11,5,'2026-03-07 17:39:53','invited'),(35,12,1,'2026-03-07 17:39:53','invited'),(36,12,3,'2026-03-07 17:39:53','invited'),(37,12,4,'2026-03-07 17:39:53','invited'),(38,12,7,'2026-03-07 17:39:53','invited');
/*!40000 ALTER TABLE `rfq_invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfq_items`
--

DROP TABLE IF EXISTS `rfq_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfq_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rfq_id` int NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `specifications` text,
  PRIMARY KEY (`id`),
  KEY `rfq_id` (`rfq_id`),
  CONSTRAINT `rfq_items_ibfk_1` FOREIGN KEY (`rfq_id`) REFERENCES `rfqs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfq_items`
--

LOCK TABLES `rfq_items` WRITE;
/*!40000 ALTER TABLE `rfq_items` DISABLE KEYS */;
INSERT INTO `rfq_items` VALUES (11,6,'Resistors',1000,'1k Ohm resistors'),(12,6,'Capacitors',500,'10uF capacitors'),(13,7,'Laptop',25,'Intel i5, 16GB RAM'),(14,8,'Keyboard',50,'Mechanical keyboard'),(15,8,'Mouse',50,'Wireless mouse'),(16,8,'Speaker',30,'Bluetooth speakers'),(17,9,'Smart TV',20,'50 inch Android TV'),(18,10,'Desktop Computer',20,'Intel i7 workstation'),(19,10,'Monitor',20,'24 inch LED monitor'),(20,10,'Keyboard',20,'Standard USB keyboard');
/*!40000 ALTER TABLE `rfq_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfq_quotes`
--

DROP TABLE IF EXISTS `rfq_quotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfq_quotes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rfq_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `message` text,
  `status` enum('submitted','won','lost','withdrawn') DEFAULT 'submitted',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `delivery_days` int DEFAULT NULL,
  `warranty` varchar(100) DEFAULT NULL,
  `payment_terms` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rfq_id` (`rfq_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `rfq_quotes_ibfk_1` FOREIGN KEY (`rfq_id`) REFERENCES `rfqs` (`id`),
  CONSTRAINT `rfq_quotes_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfq_quotes`
--

LOCK TABLES `rfq_quotes` WRITE;
/*!40000 ALTER TABLE `rfq_quotes` DISABLE KEYS */;
INSERT INTO `rfq_quotes` VALUES (1,6,1,30000.00,'We can deliver within 7 days','lost','2026-03-05 18:31:18',25,'2','30% advance, 70% on delivery'),(2,6,2,27000.00,'Best quality components available','won','2026-03-05 18:31:18',15,'3','50% advance, 50% on delivery'),(3,6,3,29000.00,'Bulk discount available','lost','2026-03-05 18:31:18',50,'4','100% advance'),(4,7,4,520000.00,'Laptop supply available immediately','lost','2026-03-05 18:31:18',35,'5','70% advance, 30% on delivery'),(5,7,5,500000.00,'High quality laptops with warranty','won','2026-03-05 18:31:18',20,'3','50% advance, 50% on delivery'),(6,8,2,20000.00,'Retail accessories available','lost','2026-03-05 18:31:18',10,'2','30% advance, 70% on delivery'),(7,8,6,18500.00,'Discount for bulk purchase','won','2026-03-05 18:31:18',5,'5','30% advance, 70% on delivery'),(8,9,7,650000.00,'Premium smart TVs available','submitted','2026-03-04 18:31:18',3,'3','30% advance, 70% on delivery'),(9,9,8,620000.00,'Hotel grade TVs with installation','submitted','2026-03-04 18:31:18',1,'4','75% advance, 25% on delivery'),(10,10,1,420000.00,'Full computer lab setup available','lost','2026-03-05 18:31:18',1,'2','50% advance, 50% on delivery'),(11,10,3,395000.00,'Complete package with installation','won','2026-03-05 18:31:18',3,'6','100% on delivery'),(12,11,4,320000.00,'High quality ergonomic office chairs with lumbar support. Bulk order discount included.','submitted','2026-03-07 03:18:31',7,'3','40% advance, 60% on delivery'),(13,11,7,350000.00,'Standard office chairs available with good durability and support.','submitted','2026-03-07 03:18:31',14,'2','50% advance, 50% on delivery'),(14,12,1,690000.00,'Premium SSD and HDD storage devices with fast read/write speeds and reliable warranty.','submitted','2026-03-07 03:18:48',5,'5','30% advance, 70% on delivery'),(15,12,6,720000.00,'High performance storage devices suitable for enterprise laptops and desktops.','submitted','2026-03-07 03:18:48',10,'4','50% advance, 50% on delivery');
/*!40000 ALTER TABLE `rfq_quotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfq_specifications`
--

DROP TABLE IF EXISTS `rfq_specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfq_specifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rfq_id` int DEFAULT NULL,
  `spec_name` varchar(100) DEFAULT NULL,
  `spec_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rfq_id` (`rfq_id`),
  CONSTRAINT `rfq_specifications_ibfk_1` FOREIGN KEY (`rfq_id`) REFERENCES `rfqs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfq_specifications`
--

LOCK TABLES `rfq_specifications` WRITE;
/*!40000 ALTER TABLE `rfq_specifications` DISABLE KEYS */;
INSERT INTO `rfq_specifications` VALUES (1,6,'Component Type','Resistors, Capacitors, ICs'),(2,6,'Tolerance','±5%'),(3,6,'Packaging','Bulk'),(4,6,'Certification','RoHS Compliant'),(5,7,'Processor','Intel i7 / Ryzen 7'),(6,7,'RAM','16 GB'),(7,7,'Storage','512 GB SSD'),(8,7,'Warranty','3 Years'),(9,8,'Keyboard Type','Mechanical'),(10,8,'Mouse Type','Wireless Optical'),(11,8,'Connectivity','USB / Bluetooth'),(12,8,'Warranty','1 Year'),(13,9,'Display Size','55 inch'),(14,9,'Resolution','4K UHD'),(15,9,'Connectivity','WiFi + HDMI'),(16,9,'Warranty','2 Years'),(17,10,'Processor','Intel i5'),(18,10,'RAM','8 GB'),(19,10,'Storage','256 GB SSD'),(20,10,'Operating System','Windows 11 Education'),(21,11,'Chair Type','Ergonomic Office Chair'),(22,11,'Material','Mesh Back with Foam Cushion'),(23,11,'Color','Black'),(24,11,'Armrest','Adjustable Armrest'),(25,11,'Adjustable Height','Yes'),(26,12,'SSD Capacity','512 GB / 1 TB'),(27,12,'HDD Capacity','1 TB / 2 TB'),(28,12,'Read Speed','Up to 3500 MB/s'),(29,12,'Compatibility','Laptop and Desktop');
/*!40000 ALTER TABLE `rfq_specifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfqs`
--

DROP TABLE IF EXISTS `rfqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfqs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `quantity` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `budget_min` decimal(10,2) DEFAULT NULL,
  `budget_max` decimal(10,2) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `status` enum('active','closed','expired') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `rfqs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfqs`
--

LOCK TABLES `rfqs` WRITE;
/*!40000 ALTER TABLE `rfqs` DISABLE KEYS */;
INSERT INTO `rfqs` VALUES (6,3,'Electronics Components Bulk Order','Request for quotation for electronic components including resistors and capacitors.',100,1,25000.00,35000.00,'2026-03-15','Mumbai','high','closed','2026-03-05 18:27:32','2026-03-06 18:55:44'),(7,5,'Office Laptop Purchase','Need bulk laptops for office staff with minimum i5 processor and 16GB RAM.',10,3,400000.00,600000.00,'2026-03-20','Pune','medium','closed','2026-03-05 18:27:32','2026-03-06 18:55:44'),(8,7,'Retail Store Accessories','Looking for bulk order of keyboards, mouse and speakers for retail store.',30,4,15000.00,25000.00,'2026-03-18','Delhi','medium','closed','2026-03-05 18:27:32','2026-03-06 18:55:44'),(9,3,'Smart TV Bulk Purchase','Need smart TVs for hotel rooms. 50 inch minimum.',50,1,500000.00,700000.00,'2026-03-06','Bangalore','high','expired','2026-03-05 18:27:32','2026-03-07 03:31:38'),(10,18,'School Computer Lab Setup','Complete setup including desktops, keyboards and monitors.',25,3,300000.00,500000.00,'2026-03-30','Hyderabad','medium','closed','2026-03-05 18:27:32','2026-03-06 18:55:44'),(11,3,'Bulk Order of Chairs','We are lookinf for all types of chairs for our renovation ofhte new office',50,1,30000.00,35000.00,'2026-04-30','Pune','medium','active','2026-03-06 07:53:12','2026-03-06 07:53:12'),(12,3,'Storage Devices for Company','Need urgent SSDs and HSDs for updating our office laptops and computers with good quality and fast delivery',125,3,700000.00,750000.00,'2026-03-30','Pune','high','active','2026-03-07 07:53:12','2026-03-07 07:53:12');
/*!40000 ALTER TABLE `rfqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_address`
--

DROP TABLE IF EXISTS `supplier_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int NOT NULL,
  `address_line1` varchar(45) DEFAULT NULL,
  `address_line2` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `pincode` int DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `address_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_address`
--

LOCK TABLES `supplier_address` WRITE;
/*!40000 ALTER TABLE `supplier_address` DISABLE KEYS */;
INSERT INTO `supplier_address` VALUES (1,1,'Warehouse 1, Industrial Area','Block 7','Pune','Delhi',129098,'India',NULL),(2,2,'Warehouse 2, Industrial Area','Block 45','Pune','Maharashtra',514298,'India',NULL),(3,3,'Warehouse 3, Industrial Area','Block 50','Delhi','Karnataka',347548,'India',NULL),(4,4,'Warehouse 4, Industrial Area','Block 2','Pune','Maharashtra',151106,'India',NULL),(5,5,'Warehouse 5, Industrial Area','Block 7','Delhi','Telangana',278120,'India',NULL),(6,6,'Warehouse 6, Industrial Area','Block 13','Bangalore','Delhi',355652,'India',NULL),(7,7,'Warehouse 7, Industrial Area','Block 6','Bangalore','Maharashtra',461083,'India',NULL),(8,8,'Warehouse 8, Industrial Area','Block 37','Delhi','Maharashtra',643979,'India',NULL),(9,9,'Warehouse 9, Industrial Area','Block 20','Mumbai','Delhi',837319,'India',NULL),(10,10,'Warehouse 10, Industrial Area','Block 40','Delhi','Maharashtra',138343,'India',NULL),(11,11,'Warehouse 11, Industrial Area','Block 45','Pune','Maharashtra',328777,'India',NULL),(12,12,'Warehouse 12, Industrial Area','Block 5','Bangalore','Maharashtra',765153,'India',NULL),(13,13,'Warehouse 13, Industrial Area','Block 11','Hyderabad','Karnataka',916989,'India',NULL),(14,14,'Warehouse 14, Industrial Area','Block 22','Delhi','Karnataka',550331,'India',NULL),(15,15,'Warehouse 15, Industrial Area','Block 14','Hyderabad','Delhi',187725,'India',NULL),(16,16,'Warehouse 16, Industrial Area','Block 43','Hyderabad','Maharashtra',913033,'India',NULL),(17,17,'Warehouse 17, Industrial Area','Block 20','Pune','Maharashtra',965094,'India',NULL),(18,18,'Warehouse 18, Industrial Area','Block 18','Hyderabad','Maharashtra',571997,'India',NULL),(19,19,'Warehouse 19, Industrial Area','Block 49','Pune','Delhi',122579,'India',NULL),(20,20,'Warehouse 20, Industrial Area','Block 19','Bangalore','Karnataka',213024,'India',NULL),(21,21,'Warehouse 21, Industrial Area','Block 30','Delhi','Maharashtra',138325,'India',NULL),(22,22,'Warehouse 22, Industrial Area','Block 37','Delhi','Maharashtra',490549,'India',NULL),(23,23,'Warehouse 23, Industrial Area','Block 49','Delhi','Maharashtra',454457,'India',NULL),(24,24,'Warehouse 24, Industrial Area','Block 44','Mumbai','Maharashtra',944493,'India',NULL),(25,25,'Warehouse 25, Industrial Area','Block 25','Bangalore','Karnataka',950616,'India',NULL);
/*!40000 ALTER TABLE `supplier_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_bank_details`
--

DROP TABLE IF EXISTS `supplier_bank_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_bank_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `account_holder` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `routing_number` varchar(50) DEFAULT NULL,
  `swift_code` varchar(50) DEFAULT NULL,
  `payment_methods` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `supplier_bank_details_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_bank_details`
--

LOCK TABLES `supplier_bank_details` WRITE;
/*!40000 ALTER TABLE `supplier_bank_details` DISABLE KEYS */;
INSERT INTO `supplier_bank_details` VALUES (1,1,'Chase Bank','Aditya Electronics','4839201748392017','021000021','CHASUS33','Bank Transfer, PayPal','2026-03-06 07:41:44'),(2,2,'Bank of America','Ankush Computers','5392018473920184','026009593','BOFAUS3N','Bank Transfer','2026-03-06 07:41:44'),(3,3,'Wells Fargo','Anjali Traders','6012394820193847','121000248','WFBIUS6S','Bank Transfer, Stripe','2026-03-06 07:41:44'),(4,4,'Citibank','Swara Furnishings','4729102837461829','021272655','CITIUS33','Bank Transfer','2026-03-06 07:41:44'),(5,5,'HSBC','Anupam Books','5483920174839201','022000020','HSBCUS33','Bank Transfer, PayPal','2026-03-06 07:41:44'),(6,6,'HDFC Bank','User5 Jewelry','5021837461928374','HDFC0001234','HDFCINBB','Bank Transfer','2026-03-06 07:41:44'),(7,7,'ICICI Bank','User10 Cosmetics','4172837461827364','ICIC0005678','ICICINBB','Bank Transfer, UPI','2026-03-06 07:41:44'),(8,8,'Axis Bank','User15 Medicals','5483729182736451','UTIB0009101','AXISINBB','Bank Transfer','2026-03-06 07:41:44'),(9,9,'State Bank of India','User20 Electronics','4382917462839102','SBIN0002234','SBININBB','Bank Transfer','2026-03-06 07:41:44'),(10,10,'Kotak Bank','User25 Hardware','5482917462839103','KKBK0009981','KKBKINBB','Bank Transfer','2026-03-06 07:41:44'),(11,11,'Punjab National Bank','User30 Technology','4382917462839104','PUNB0123456','PUNBINBB','Bank Transfer','2026-03-06 07:41:44'),(12,12,'Canara Bank','User35 Paper','5482917462839105','CNRB0003345','CNRBINBB','Bank Transfer','2026-03-06 07:41:44'),(13,13,'Yes Bank','User40 Glasses','4382917462839106','YESB0005566','YESBINBB','Bank Transfer','2026-03-06 07:41:44'),(14,14,'Bank of Baroda','User45 Apparel','5482917462839107','BARB0PUNE01','BARBINBB','Bank Transfer','2026-03-06 07:41:44'),(15,15,'Union Bank','User50 Furniture','4382917462839108','UBIN0008899','UBININBB','Bank Transfer','2026-03-06 07:41:44'),(16,16,'IDFC Bank','User55 Electricals','5482917462839109','IDFB0022334','IDFBINBB','Bank Transfer','2026-03-06 07:41:44'),(17,17,'Standard Chartered','User60 Foods','4382917462839110','SCBL0033445','SCBLINBB','Bank Transfer','2026-03-06 07:41:44'),(18,18,'HSBC India','User65 Pharma','5482917462839111','HSBC0044556','HSBCINBB','Bank Transfer','2026-03-06 07:41:44'),(19,19,'Citibank India','User70 Plastics','4382917462839112','CITI0055667','CITIINBX','Bank Transfer','2026-03-06 07:41:44'),(20,20,'Axis Bank','User75 Steel','5482917462839113','UTIB0066778','AXISINBB','Bank Transfer','2026-03-06 07:41:44'),(21,21,'ICICI Bank','User80 Metals','4382917462839114','ICIC0077889','ICICINBB','Bank Transfer','2026-03-06 07:41:44'),(22,22,'HDFC Bank','User85 Electronics','5482917462839115','HDFC0088990','HDFCINBB','Bank Transfer','2026-03-06 07:41:44'),(23,23,'State Bank of India','User90 Hardware','4382917462839116','SBIN0099001','SBININBB','Bank Transfer','2026-03-06 07:41:44'),(24,24,'Bank of America','User95 Tools','5482917462839117','026009593','BOFAUS3N','Bank Transfer','2026-03-06 07:41:44');
/*!40000 ALTER TABLE `supplier_bank_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_documents`
--

DROP TABLE IF EXISTS `supplier_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int DEFAULT NULL,
  `document_type` enum('Tax ID','License','GST','PAN','Other') DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_documents`
--

LOCK TABLES `supplier_documents` WRITE;
/*!40000 ALTER TABLE `supplier_documents` DISABLE KEYS */;
INSERT INTO `supplier_documents` VALUES (1,1,'Tax ID','/uploads/tax_id_1.pdf','2026-03-04 08:16:09'),(2,2,'License','/uploads/license_1.pdf','2026-03-04 08:16:09'),(3,3,'Tax ID','/uploads/tax_id_2.pdf','2026-03-04 08:16:09'),(4,4,'License','/uploads/license_2.pdf','2026-03-04 08:16:09'),(5,5,'Tax ID','/uploads/tax_id_3.pdf','2026-03-04 08:16:09'),(6,6,'Tax ID','/uploads/tax_id_1.pdf','2026-03-04 08:16:09'),(7,7,'License','/uploads/license_1.pdf','2026-03-04 08:16:09'),(8,8,'Tax ID','/uploads/tax_id_2.pdf','2026-03-04 08:16:09'),(9,9,'License','/uploads/license_2.pdf','2026-03-04 08:16:09'),(10,10,'Tax ID','/uploads/tax_id_3.pdf','2026-03-04 08:16:09'),(11,11,'Tax ID','/uploads/tax_id_1.pdf','2026-03-04 08:16:09'),(12,12,'License','/uploads/license_1.pdf','2026-03-04 08:16:09'),(13,13,'Tax ID','/uploads/tax_id_2.pdf','2026-03-04 08:16:09'),(14,14,'License','/uploads/license_2.pdf','2026-03-04 08:16:09'),(15,15,'Tax ID','/uploads/tax_id_3.pdf','2026-03-04 08:16:09'),(16,16,'Tax ID','/uploads/tax_id_1.pdf','2026-03-04 08:16:09'),(17,17,'License','/uploads/license_1.pdf','2026-03-04 08:16:09'),(18,18,'Tax ID','/uploads/tax_id_2.pdf','2026-03-04 08:16:09'),(19,19,'License','/uploads/license_2.pdf','2026-03-04 08:16:09'),(20,20,'Tax ID','/uploads/tax_id_3.pdf','2026-03-04 08:16:09'),(21,21,'Tax ID','/uploads/tax_id_1.pdf','2026-03-04 08:16:09'),(22,22,'License','/uploads/license_1.pdf','2026-03-04 08:16:09'),(23,23,'Tax ID','/uploads/tax_id_2.pdf','2026-03-04 08:16:09'),(24,24,'License','/uploads/license_2.pdf','2026-03-04 08:16:09'),(25,25,'Tax ID','/uploads/tax_id_3.pdf','2026-03-04 08:16:09'),(26,2,'Tax ID','/uploads/tax_id_1.pdf','2026-03-04 08:52:52'),(27,1,'License','/uploads/license_1.pdf','2026-03-04 08:52:52'),(28,4,'Tax ID','/uploads/tax_id_2.pdf','2026-03-04 08:52:52'),(29,3,'License','/uploads/license_2.pdf','2026-03-04 08:52:52'),(30,6,'License','/uploads/tax_id_3.pdf','2026-03-04 08:52:52'),(31,5,'License','/uploads/tax_id_1.pdf','2026-03-04 08:52:52'),(32,8,'License','/uploads/license_1.pdf','2026-03-04 08:52:52'),(33,7,'Tax ID','/uploads/tax_id_2.pdf','2026-03-04 08:52:52'),(34,10,'License','/uploads/license_2.pdf','2026-03-04 08:52:52'),(35,9,'Tax ID','/uploads/tax_id_3.pdf','2026-03-04 08:52:52'),(36,12,'Tax ID','/uploads/tax_id_1.pdf','2026-03-04 08:52:52'),(37,11,'License','/uploads/license_1.pdf','2026-03-04 08:52:52'),(38,14,'Tax ID','/uploads/tax_id_2.pdf','2026-03-04 08:52:52'),(39,13,'License','/uploads/license_2.pdf','2026-03-04 08:52:52'),(40,19,'Tax ID','/uploads/tax_id_3.pdf','2026-03-04 08:52:52'),(41,18,'License','/uploads/tax_id_1.pdf','2026-03-04 08:52:52'),(42,20,'License','/uploads/license_1.pdf','2026-03-04 08:52:52'),(43,17,'Tax ID','/uploads/tax_id_2.pdf','2026-03-04 08:52:52'),(44,22,'Tax ID','/uploads/tax_id_3.pdf','2026-03-04 08:52:52'),(45,21,'License','/uploads/tax_id_1.pdf','2026-03-04 08:52:52'),(46,15,'License','/uploads/license_1.pdf','2026-03-04 08:52:52'),(47,24,'Tax ID','/uploads/tax_id_2.pdf','2026-03-04 08:52:52'),(48,23,'License','/uploads/license_2.pdf','2026-03-04 08:52:52'),(49,25,'License','/uploads/License_3.pdf','2026-03-04 08:52:52'),(50,16,'License','/uploads/License_3.pdf','2026-03-04 08:52:52');
/*!40000 ALTER TABLE `supplier_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_logistics`
--

DROP TABLE IF EXISTS `supplier_logistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_logistics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int NOT NULL,
  `primary_warehouse` varchar(150) DEFAULT NULL,
  `warehouse_size` varchar(50) DEFAULT NULL,
  `shipping_carriers` varchar(200) DEFAULT NULL,
  `processing_time` varchar(50) DEFAULT NULL,
  `shipping_regions` varchar(200) DEFAULT NULL,
  `return_policy` varchar(200) DEFAULT NULL,
  `additional_warehouses` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `supplier_logistics_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_logistics`
--

LOCK TABLES `supplier_logistics` WRITE;
/*!40000 ALTER TABLE `supplier_logistics` DISABLE KEYS */;
INSERT INTO `supplier_logistics` VALUES (1,1,'San Francisco, CA','10,000 sq ft','UPS, FedEx, DHL','1-2 business days','USA, Canada, Europe','30-day return policy','Los Angeles, CA (Secondary), New York, NY (Distribution Center), Miami, FL (International Shipping)','2026-03-06 08:52:32'),(2,2,'Los Angeles, CA','8,000 sq ft','UPS, FedEx','2-3 business days','USA, Mexico','15-day return policy','San Diego, CA (Secondary), Houston, TX (Distribution Hub)','2026-03-06 08:52:32'),(3,3,'Chicago, IL','12,000 sq ft','FedEx, DHL','1-2 business days','USA, Canada','30-day return policy','New York, NY (Distribution Center), Atlanta, GA (Secondary)','2026-03-06 08:52:32'),(4,4,'Dallas, TX','7,500 sq ft','UPS, DHL','2 business days','USA','15-day return policy','Austin, TX (Secondary), Denver, CO (Distribution Hub)','2026-03-06 08:52:32'),(5,5,'Seattle, WA','9,000 sq ft','UPS, FedEx','1-2 business days','USA, Canada','30-day return policy','Portland, OR (Secondary), Vancouver, BC (International Hub)','2026-03-06 08:52:32'),(6,6,'Miami, FL','11,000 sq ft','DHL, FedEx','2-4 business days','USA, Caribbean, South America','30-day return policy','Orlando, FL (Secondary), Atlanta, GA (Distribution Hub)','2026-03-06 08:52:32'),(7,1,'San Francisco, CA','10,000 sq ft','UPS, FedEx, DHL','1-2 business days','USA, Canada, Europe','30-day return policy','Los Angeles, CA (Secondary), New York, NY (Distribution Center), Miami, FL (International Shipping)','2026-03-06 08:52:32'),(8,2,'Los Angeles, CA','8,000 sq ft','UPS, FedEx','2-3 business days','USA, Mexico','15-day return policy','San Diego, CA (Secondary), Houston, TX (Distribution Hub)','2026-03-06 08:52:32'),(9,3,'Chicago, IL','12,000 sq ft','FedEx, DHL','1-2 business days','USA, Canada','30-day return policy','New York, NY (Distribution Center), Atlanta, GA (Secondary)','2026-03-06 08:52:32'),(10,4,'Dallas, TX','7,500 sq ft','UPS, DHL','2 business days','USA','15-day return policy','Austin, TX (Secondary), Denver, CO (Distribution Hub)','2026-03-06 08:52:32'),(11,5,'Seattle, WA','9,000 sq ft','UPS, FedEx','1-2 business days','USA, Canada','30-day return policy','Portland, OR (Secondary), Vancouver, BC (International Hub)','2026-03-06 08:52:32'),(12,6,'Miami, FL','11,000 sq ft','DHL, FedEx','2-4 business days','USA, Caribbean, South America','30-day return policy','Orlando, FL (Secondary), Atlanta, GA (Distribution Hub)','2026-03-06 08:52:32');
/*!40000 ALTER TABLE `supplier_logistics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_team`
--

DROP TABLE IF EXISTS `supplier_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `permissions` varchar(100) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `supplier_team_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_team`
--

LOCK TABLES `supplier_team` WRITE;
/*!40000 ALTER TABLE `supplier_team` DISABLE KEYS */;
INSERT INTO `supplier_team` VALUES (1,1,'Sarah Johnson','sarah.j@adityaelectronics.com','Admin','Full Access','active','2026-03-06 07:38:00'),(2,1,'Michael Brown','michael.b@adityaelectronics.com','Support','Order Management','active','2026-03-06 07:38:00'),(3,1,'Emma Wilson','emma.w@adityaelectronics.com','Inventory','Product Management','active','2026-03-06 07:38:00'),(4,2,'Rajesh Sharma','rajesh@ankushcomputers.com','Admin','Full Access','active','2026-03-06 07:38:00'),(5,2,'Priya Mehta','priya@ankushcomputers.com','Support','Order Management','active','2026-03-06 07:38:00'),(6,3,'Amit Verma','amit@anjalitraders.com','Admin','Full Access','active','2026-03-06 07:38:00'),(7,3,'Neha Kapoor','neha@anjalitraders.com','Inventory','Product Management','active','2026-03-06 07:38:00'),(8,4,'Rohit Patil','rohit@swarafurnishings.com','Admin','Full Access','active','2026-03-06 07:38:00'),(9,4,'Sneha Kulkarni','sneha@swarafurnishings.com','Support','Order Management','active','2026-03-06 07:38:00'),(10,5,'Karan Shah','karan@anupambooks.com','Admin','Full Access','active','2026-03-06 07:38:00'),(11,5,'Meera Jain','meera@anupambooks.com','Inventory','Product Management','active','2026-03-06 07:38:00'),(12,6,'Arjun Singh','arjun@user5jewelry.com','Admin','Full Access','active','2026-03-06 07:38:00'),(13,7,'Nisha Gupta','nisha@user10cosmetics.com','Support','Order Management','active','2026-03-06 07:38:00'),(14,8,'Rahul Yadav','rahul@user15medicals.com','Admin','Full Access','active','2026-03-06 07:38:00'),(15,9,'Anjali Desai','anjali@user20electronics.com','Inventory','Product Management','active','2026-03-06 07:38:00'),(16,10,'Vikas Kumar','vikas@user25hardware.com','Admin','Full Access','active','2026-03-06 07:38:00'),(17,11,'Pooja Sharma','pooja@user30technology.com','Support','Order Management','active','2026-03-06 07:38:00'),(18,12,'Rakesh Jain','rakesh@user35paper.com','Admin','Full Access','active','2026-03-06 07:38:00'),(19,13,'Simran Kaur','simran@user40glasses.com','Inventory','Product Management','active','2026-03-06 07:38:00');
/*!40000 ALTER TABLE `supplier_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `mobile_no` varchar(50) DEFAULT NULL,
  `business_name` varchar(50) NOT NULL,
  `business_type` varchar(45) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `verification_status` enum('pending','approved','rejected','suspended') DEFAULT 'pending',
  `commission_rate` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `business_registration` varchar(150) DEFAULT NULL,
  `year_established` int DEFAULT NULL,
  `employee_count` varchar(20) DEFAULT NULL,
  `company_description` text,
  `website` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_supplier_user` (`user_id`),
  CONSTRAINT `fk_supplier_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,2,'+919876543210','Aditya Electronics','electronics supplier','A shop that sells electronic items such as mobile phones, chargers, earphones, televisions, and other electronic gadgets.','approved',5.00,'2026-03-03 23:18:43',NULL,'12-3456789','Registered in Delaware, USA',2018,'25-50','Aditya Electronics is a trusted supplier of electronic components and consumer gadgets. The company focuses on quality hardware products including mobile accessories, cables, and repair parts for retailers and service centers.','www.adityaelectronics.com'),(2,6,'+91 11 3456-7890','ankush computers','computers','A store that sells computer hardware like keyboards, mouse, processors, RAM, hard drives, monitors, and other computer accessories.','approved',5.00,'2026-03-03 23:18:43',NULL,'23-4567890','Registered in California, USA',2016,'50-100','Ankush Computers specializes in computer hardware, peripherals, and IT accessories. The company supplies laptops, keyboards, networking devices, and storage solutions to small businesses and retailers.',NULL),(3,17,'+1-555-123-4567','anjali Traders','traders','A business that buys products in bulk from manufacturers or wholesalers and sells them to retailers or customers.','approved',5.00,'2026-03-03 23:18:43',NULL,'34-5678901','Registered in Texas, USA',2015,'10-25','Anjali Traders operates as a bulk distributor supplying electronics and household products to wholesalers and retailers across multiple cities.',NULL),(4,19,'+916543210','Swara furnishing','furniture','A shop that sells household and office furniture such as chairs, tables, beds, cupboards, and sofas.','suspended',5.00,'2026-03-03 23:18:43',NULL,'45-6789012','Registered in Florida, USA',2019,'25-50','Swaraj Furnishing provides furniture and home decor products including office chairs, tables, cabinets, and interior accessories for commercial and residential buyers.',NULL),(5,20,'+916543210','anupam books','stationary','A store that sells school and office supplies like notebooks, pens, pencils, files, staplers, and other writing materials.','approved',5.00,'2026-03-03 23:18:43',NULL,'56-7890123','Registered in New York, USA',2017,'50-100','Anupam Books supplies educational books, stationery, and academic materials to schools, colleges, and bookstores.',NULL),(6,25,'+919876543210','User5 jwelery','jwelery','Premium fashion retailer specializing in contemporary clothing and accessories for men and women. Established in 2018.','approved',5.00,'2026-03-03 23:18:43',NULL,'67-8901234','Registered in Illinois, USA',2014,'100+','User5 Jewelry is a premium jewelry retailer offering gold, silver, and designer jewelry collections for modern consumers.',NULL),(7,30,'+919876543210','User10 cosmetics','cosmetics','Premium fashion retailer specializing in contemporary clothing and accessories for men and women. Established in 2020\\.','pending',5.00,'2026-03-03 23:18:43',NULL,'78-9012345','Registered in Washington, USA',2020,'10-25','User10 Cosmetics distributes skincare and cosmetic products including beauty kits, makeup products, and personal care items.',NULL),(8,35,'+919876543210','User15 medicals','pharmacy',NULL,'suspended',5.00,'2026-03-03 23:18:43',NULL,'89-0123456','Registered in Arizona, USA',2013,'50-100','User15 Medicals supplies pharmaceutical products and healthcare essentials to clinics, hospitals, and pharmacies.',NULL),(9,40,'+919876543210','User20 eletronics','elctronics',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,'90-1234567','Registered in Nevada, USA',2012,'25-50','User20 Electronics deals in consumer electronics including televisions, speakers, and smart home appliances.',NULL),(10,45,'+919876543210','User25 hardware','electronics',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,'91-2345678','Registered in Colorado, USA',2011,'100+','User25 Hardware supplies industrial tools, mechanical parts, and construction hardware for contractors and workshops.',NULL),(11,50,'+919876543210','User30 technology','software',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,55,'+919876543210','User35 sagar paper','wholesaler',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,60,'+1-555-123-4567','User40 glasses','glasses',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,65,'+1-555-123-4567','User45 zara','clothes',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,70,'+1-555-123-4567','User50 ceramics','ceramics',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,75,'+1-555-123-4567','User55 suresh statinary','stationary',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,80,'+14155550132 ','User60 gita computers','computer parts',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,85,'+14155550132 ','User65 hardware','hardware',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,90,'+14155550132 ','User70 Traders','wholesaler',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,95,'+14155550132 ','User75 Traders','traders',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,100,'+14155550132 ','User80 wholesalewala','traders',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,105,'+14155550132 ','User85 whole grains','wholesalers',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,110,'+14155550132 ','User90 coffee','traders',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,115,'+14155550132 ','User95 sanju tea','traders',NULL,'approved',5.00,'2026-03-03 23:18:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_activity_logs`
--

DROP TABLE IF EXISTS `user_activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `activity` varchar(255) DEFAULT NULL,
  `detail` varchar(150) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('customer','supplier','admin') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_activity_logs`
--

LOCK TABLES `user_activity_logs` WRITE;
/*!40000 ALTER TABLE `user_activity_logs` DISABLE KEYS */;
INSERT INTO `user_activity_logs` VALUES (1,1,'Admin','127.0.0.1','Login successful','Admin logged in Successfully','Success','2026-03-03 20:18:43','admin'),(2,3,'Rajat','192.168.1.101','Password change','User rajat chamged password','Success','2026-03-03 20:18:43','customer'),(3,16,'Sonya','192.168.1.102','Profile update','User sonya updated profile','Success','2026-03-03 21:18:43','customer'),(4,17,'Anjali','192.168.1.103','Failed login attempt','User anjali Failed to Log in','Failed','2026-03-03 21:18:43','supplier'),(5,7,'Ritesh','192.168.1.104','Order placed','User ritesh placed a order','Success','2026-03-03 22:18:43','customer'),(6,6,'Ankush','192.168.1.105','Account suspended by admin','User ankush account was suspended by admin','Success','2026-03-03 23:18:43','supplier'),(7,19,'Swara','192.168.1.106','Document upload','User swara uploaded the documents','Success','2026-03-03 23:18:43','supplier'),(8,5,'Suraj','192.168.1.107','Password reset request','User Suraj request for a password change','Success','2026-03-04 00:18:43','customer'),(9,18,'Sonali','192.168.1.108','Login successful','User sonali logged in successfully','Success','2026-03-04 01:18:43','customer'),(10,30,'User10','192.168.1.109','Failed login attempt','User User 10 failed to log in','Failed','2026-03-04 05:18:43','supplier');
/*!40000 ALTER TABLE `user_activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` enum('admin','supplier','customer') DEFAULT 'customer',
  `registration_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','active','suspended') DEFAULT 'pending',
  `suspended_on` datetime DEFAULT NULL,
  `suspend_reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$12$9ncVO.eku1jJJ93BojM9hOxC60WIGeukP2gYpBqpJFHZUQSug8K/m','admin@gmail.com','admin','2026-03-02 18:19:04','active',NULL,NULL),(2,'aditya','$2b$12$eQtoxVEGDxarsHp.30.dsef1t50thtq/WEZVrdCekfPKfLE/m6l7i','aditya@gmail.com','supplier','2026-03-02 18:23:44','active',NULL,NULL),(3,'rajat','$2b$12$z3bEMelLX08je6hCpL0tJOKL4Wol4cubllnj9M0J93YbY5KH2WOW.','rajat@gmail.com','customer','2026-03-02 18:24:04','active',NULL,NULL),(4,'harshal','$2b$12$RoVUEc89n2n2opOAOsISzuLHpVo8c/KgFJqt.L.wWC4UA/EER/ot6','harshal@gmail.com','customer','2026-03-02 18:24:22','active',NULL,NULL),(5,'suraj','$2b$12$L5800yT7hhh3IfGJdF23nuQ2H0QiQ064S1yU9Pj32nfsrzpojcDCS','suraj@gmail.com','customer','2026-03-02 18:24:35','active',NULL,NULL),(6,'ankush','$2b$12$BJFVh.1GZmxgLTZw4dvUvOFcOzK6VSThiFu3wS1vrjiNJWp3.29F6','ankush@gmail.com','supplier','2026-03-02 18:24:47','active',NULL,NULL),(7,'ritesh','$2b$12$T6t5EXpi1YmHjY5D5wgIb.SP7k42Rypff7A20RifXB3S8bNsqDuTG','ritesh@gmail.com','customer','2026-03-02 18:25:00','active',NULL,NULL),(16,'sonya','$2b$12$Ipx/Cs/ava6MpT3IFz8.5Oo/tT9e46ylGNqRWQjRa6SW5DH9IRp6.','sonya@gmail.com','customer','2026-03-02 18:25:58','suspended','2026-03-04 13:49:40','Payment fraud'),(17,'anjali','$2b$12$9NWdFXkyG7fm1ukVKx.hTebRvaC5KiZZqySm.98hE1nZUMXxAhCIK','anjali@gmail.com','supplier','2026-03-02 18:26:16','active',NULL,NULL),(18,'Sonali','$2b$12$Ox4WlENR1TGg1uU5P8FGgOv9r5Po7OEgBchYOTe.arDbcnkQQzHJ.','Sonali@gmail.com','customer','2026-03-02 18:26:37','pending',NULL,NULL),(19,'Swara','$2b$12$HHWOekjldojjRqG63fYSN.LukO/y9EJkk5dOfsl5TVjJ97JnsNO0G','Swara@gmail.com','supplier','2026-03-02 18:26:52','suspended','2026-03-04 13:50:51','Spam activity'),(20,'anupam','$2b$12$0/7ZkODYFEEwCVC9aIFwgOQTGkbmsJUrd2RmPLB5l4HXZLYASK4Nu','anupam@gmail.com','supplier','2026-03-02 18:27:08','active',NULL,NULL),(21,'User1','$2b$12$abcdefghijklmnopqrstuv','user1@example.com','customer','2026-02-10 07:57:39','active',NULL,NULL),(22,'User2','$2b$12$abcdefghijklmnopqrstuv','user2@example.com','customer','2026-02-03 07:57:39','pending',NULL,NULL),(23,'User3','$2b$12$abcdefghijklmnopqrstuv','user3@example.com','customer','2026-02-12 07:57:39','active',NULL,NULL),(24,'User4','$2b$12$abcdefghijklmnopqrstuv','user4@example.com','customer','2026-02-21 07:57:39','active',NULL,NULL),(25,'User5','$2b$12$abcdefghijklmnopqrstuv','user5@example.com','supplier','2026-02-09 07:57:39','active',NULL,NULL),(26,'User6','$2b$12$abcdefghijklmnopqrstuv','user6@example.com','customer','2026-02-09 07:57:39','active',NULL,NULL),(27,'User7','$2b$12$abcdefghijklmnopqrstuv','user7@example.com','customer','2026-02-17 07:57:39','pending',NULL,NULL),(28,'User8','$2b$12$abcdefghijklmnopqrstuv','user8@example.com','customer','2026-02-26 07:57:39','active',NULL,NULL),(29,'User9','$2b$12$abcdefghijklmnopqrstuv','user9@example.com','customer','2026-02-16 07:57:39','active',NULL,NULL),(30,'User10','$2b$12$abcdefghijklmnopqrstuv','user10@example.com','supplier','2026-02-03 07:57:39','pending',NULL,NULL),(31,'User11','$2b$12$abcdefghijklmnopqrstuv','user11@example.com','customer','2026-02-23 07:57:39','active',NULL,NULL),(32,'User12','$2b$12$abcdefghijklmnopqrstuv','user12@example.com','customer','2026-02-15 07:57:39','active',NULL,NULL),(33,'User13','$2b$12$abcdefghijklmnopqrstuv','user13@example.com','customer','2026-02-03 07:57:39','active',NULL,NULL),(34,'User14','$2b$12$abcdefghijklmnopqrstuv','user14@example.com','customer','2026-03-02 07:57:39','active',NULL,NULL),(35,'User15','$2b$12$abcdefghijklmnopqrstuv','user15@example.com','supplier','2026-02-17 07:57:39','suspended','2026-03-04 13:51:17','Payment fraud'),(36,'User16','$2b$12$abcdefghijklmnopqrstuv','user16@example.com','customer','2026-02-26 07:57:39','pending',NULL,NULL),(37,'User17','$2b$12$abcdefghijklmnopqrstuv','user17@example.com','customer','2026-02-18 07:57:39','active',NULL,NULL),(38,'User18','$2b$12$abcdefghijklmnopqrstuv','user18@example.com','customer','2026-02-10 07:57:39','active',NULL,NULL),(39,'User19','$2b$12$abcdefghijklmnopqrstuv','user19@example.com','customer','2026-02-26 07:57:39','active',NULL,NULL),(40,'User20','$2b$12$abcdefghijklmnopqrstuv','user20@example.com','supplier','2026-02-07 07:57:39','active',NULL,NULL),(41,'User21','$2b$12$abcdefghijklmnopqrstuv','user21@example.com','customer','2026-02-16 07:57:39','active',NULL,NULL),(42,'User22','$2b$12$abcdefghijklmnopqrstuv','user22@example.com','customer','2026-02-25 07:57:39','active',NULL,NULL),(43,'User23','$2b$12$abcdefghijklmnopqrstuv','user23@example.com','customer','2026-02-18 07:57:39','active',NULL,NULL),(44,'User24','$2b$12$abcdefghijklmnopqrstuv','user24@example.com','customer','2026-02-12 07:57:39','pending',NULL,NULL),(45,'User25','$2b$12$abcdefghijklmnopqrstuv','user25@example.com','supplier','2026-02-06 07:57:39','active',NULL,NULL),(46,'User26','$2b$12$abcdefghijklmnopqrstuv','user26@example.com','customer','2026-02-23 07:57:39','active',NULL,NULL),(47,'User27','$2b$12$abcdefghijklmnopqrstuv','user27@example.com','customer','2026-02-03 07:57:39','active',NULL,NULL),(48,'User28','$2b$12$abcdefghijklmnopqrstuv','user28@example.com','customer','2026-02-05 07:57:39','active',NULL,NULL),(49,'User29','$2b$12$abcdefghijklmnopqrstuv','user29@example.com','customer','2026-02-16 07:57:39','pending',NULL,NULL),(50,'User30','$2b$12$abcdefghijklmnopqrstuv','user30@example.com','supplier','2026-02-04 07:57:39','active',NULL,NULL),(51,'User31','$2b$12$abcdefghijklmnopqrstuv','user31@example.com','customer','2026-03-02 07:57:39','active',NULL,NULL),(52,'User32','$2b$12$abcdefghijklmnopqrstuv','user32@example.com','customer','2026-02-16 07:57:39','pending',NULL,NULL),(53,'User33','$2b$12$abcdefghijklmnopqrstuv','user33@example.com','customer','2026-02-19 07:57:39','active',NULL,NULL),(54,'User34','$2b$12$abcdefghijklmnopqrstuv','user34@example.com','customer','2026-02-16 07:57:39','active',NULL,NULL),(55,'User35','$2b$12$abcdefghijklmnopqrstuv','user35@example.com','supplier','2026-02-20 07:57:39','active',NULL,NULL),(56,'User36','$2b$12$abcdefghijklmnopqrstuv','user36@example.com','customer','2026-02-20 07:57:39','pending',NULL,NULL),(57,'User37','$2b$12$abcdefghijklmnopqrstuv','user37@example.com','customer','2026-02-07 07:57:39','active',NULL,NULL),(58,'User38','$2b$12$abcdefghijklmnopqrstuv','user38@example.com','customer','2026-02-07 07:57:39','active',NULL,NULL),(59,'User39','$2b$12$abcdefghijklmnopqrstuv','user39@example.com','customer','2026-02-09 07:57:39','active',NULL,NULL),(60,'User40','$2b$12$abcdefghijklmnopqrstuv','user40@example.com','supplier','2026-02-25 07:57:39','active',NULL,NULL),(61,'User41','$2b$12$abcdefghijklmnopqrstuv','user41@example.com','customer','2026-02-05 07:57:39','pending',NULL,NULL),(62,'User42','$2b$12$abcdefghijklmnopqrstuv','user42@example.com','customer','2026-02-08 07:57:39','active',NULL,NULL),(63,'User43','$2b$12$abcdefghijklmnopqrstuv','user43@example.com','customer','2026-02-23 07:57:39','pending',NULL,NULL),(64,'User44','$2b$12$abcdefghijklmnopqrstuv','user44@example.com','customer','2026-03-03 07:57:39','active',NULL,NULL),(65,'User45','$2b$12$abcdefghijklmnopqrstuv','user45@example.com','supplier','2026-02-24 07:57:39','active',NULL,NULL),(66,'User46','$2b$12$abcdefghijklmnopqrstuv','user46@example.com','customer','2026-02-27 07:57:39','active',NULL,NULL),(67,'User47','$2b$12$abcdefghijklmnopqrstuv','user47@example.com','customer','2026-02-02 07:57:39','active',NULL,NULL),(68,'User48','$2b$12$abcdefghijklmnopqrstuv','user48@example.com','customer','2026-02-15 07:57:39','active',NULL,NULL),(69,'User49','$2b$12$abcdefghijklmnopqrstuv','user49@example.com','customer','2026-02-08 07:57:39','active',NULL,NULL),(70,'User50','$2b$12$abcdefghijklmnopqrstuv','user50@example.com','supplier','2026-02-23 07:57:39','active',NULL,NULL),(71,'User51','$2b$12$abcdefghijklmnopqrstuv','user51@example.com','customer','2026-03-01 07:57:39','active',NULL,NULL),(72,'User52','$2b$12$abcdefghijklmnopqrstuv','user52@example.com','customer','2026-02-15 07:57:39','active',NULL,NULL),(73,'User53','$2b$12$abcdefghijklmnopqrstuv','user53@example.com','customer','2026-02-16 07:57:39','active',NULL,NULL),(74,'User54','$2b$12$abcdefghijklmnopqrstuv','user54@example.com','customer','2026-02-03 07:57:39','active',NULL,NULL),(75,'User55','$2b$12$abcdefghijklmnopqrstuv','user55@example.com','supplier','2026-02-26 07:57:39','active',NULL,NULL),(76,'User56','$2b$12$abcdefghijklmnopqrstuv','user56@example.com','customer','2026-03-02 07:57:39','active',NULL,NULL),(77,'User57','$2b$12$abcdefghijklmnopqrstuv','user57@example.com','customer','2026-02-10 07:57:39','active',NULL,NULL),(78,'User58','$2b$12$abcdefghijklmnopqrstuv','user58@example.com','customer','2026-02-20 07:57:39','active',NULL,NULL),(79,'User59','$2b$12$abcdefghijklmnopqrstuv','user59@example.com','customer','2026-02-06 07:57:39','active',NULL,NULL),(80,'User60','$2b$12$abcdefghijklmnopqrstuv','user60@example.com','supplier','2026-03-01 07:57:39','active',NULL,NULL),(81,'User61','$2b$12$abcdefghijklmnopqrstuv','user61@example.com','customer','2026-02-04 07:57:39','suspended','2026-03-04 13:51:46','Incorrect Documents'),(82,'User62','$2b$12$abcdefghijklmnopqrstuv','user62@example.com','customer','2026-02-25 07:57:39','active',NULL,NULL),(83,'User63','$2b$12$abcdefghijklmnopqrstuv','user63@example.com','customer','2026-02-18 07:57:39','active',NULL,NULL),(84,'User64','$2b$12$abcdefghijklmnopqrstuv','user64@example.com','customer','2026-02-16 07:57:39','active',NULL,NULL),(85,'User65','$2b$12$abcdefghijklmnopqrstuv','user65@example.com','supplier','2026-02-22 07:57:39','active',NULL,NULL),(86,'User66','$2b$12$abcdefghijklmnopqrstuv','user66@example.com','customer','2026-03-03 07:57:39','active',NULL,NULL),(87,'User67','$2b$12$abcdefghijklmnopqrstuv','user67@example.com','customer','2026-03-02 07:57:39','active',NULL,NULL),(88,'User68','$2b$12$abcdefghijklmnopqrstuv','user68@example.com','customer','2026-02-23 07:57:39','active',NULL,NULL),(89,'User69','$2b$12$abcdefghijklmnopqrstuv','user69@example.com','customer','2026-02-23 07:57:39','active',NULL,NULL),(90,'User70','$2b$12$abcdefghijklmnopqrstuv','user70@example.com','supplier','2026-02-16 07:57:39','active',NULL,NULL),(91,'User71','$2b$12$abcdefghijklmnopqrstuv','user71@example.com','customer','2026-02-09 07:57:39','active',NULL,NULL),(92,'User72','$2b$12$abcdefghijklmnopqrstuv','user72@example.com','customer','2026-02-27 07:57:39','active',NULL,NULL),(93,'User73','$2b$12$abcdefghijklmnopqrstuv','user73@example.com','customer','2026-02-16 07:57:39','active',NULL,NULL),(94,'User74','$2b$12$abcdefghijklmnopqrstuv','user74@example.com','customer','2026-02-27 07:57:39','active',NULL,NULL),(95,'User75','$2b$12$abcdefghijklmnopqrstuv','user75@example.com','supplier','2026-02-27 07:57:39','active',NULL,NULL),(96,'User76','$2b$12$abcdefghijklmnopqrstuv','user76@example.com','customer','2026-02-23 07:57:39','active',NULL,NULL),(97,'User77','$2b$12$abcdefghijklmnopqrstuv','user77@example.com','customer','2026-02-02 07:57:39','active',NULL,NULL),(98,'User78','$2b$12$abcdefghijklmnopqrstuv','user78@example.com','customer','2026-02-27 07:57:39','active',NULL,NULL),(99,'User79','$2b$12$abcdefghijklmnopqrstuv','user79@example.com','customer','2026-02-10 07:57:39','active',NULL,NULL),(100,'User80','$2b$12$abcdefghijklmnopqrstuv','user80@example.com','supplier','2026-02-27 07:57:39','active',NULL,NULL),(101,'User81','$2b$12$abcdefghijklmnopqrstuv','user81@example.com','customer','2026-02-12 07:57:39','active',NULL,NULL),(102,'User82','$2b$12$abcdefghijklmnopqrstuv','user82@example.com','customer','2026-02-10 07:57:39','active',NULL,NULL),(103,'User83','$2b$12$abcdefghijklmnopqrstuv','user83@example.com','customer','2026-02-10 07:57:39','active',NULL,NULL),(104,'User84','$2b$12$abcdefghijklmnopqrstuv','user84@example.com','customer','2026-02-20 07:57:39','active',NULL,NULL),(105,'User85','$2b$12$abcdefghijklmnopqrstuv','user85@example.com','supplier','2026-02-08 07:57:39','active',NULL,NULL),(106,'User86','$2b$12$abcdefghijklmnopqrstuv','user86@example.com','customer','2026-02-09 07:57:39','active',NULL,NULL),(107,'User87','$2b$12$abcdefghijklmnopqrstuv','user87@example.com','customer','2026-02-19 07:57:39','active',NULL,NULL),(108,'User88','$2b$12$abcdefghijklmnopqrstuv','user88@example.com','customer','2026-02-07 07:57:39','suspended','2026-03-04 13:52:13','Spam Activity'),(109,'User89','$2b$12$abcdefghijklmnopqrstuv','user89@example.com','customer','2026-02-05 07:57:39','active',NULL,NULL),(110,'User90','$2b$12$abcdefghijklmnopqrstuv','user90@example.com','supplier','2026-02-03 07:57:39','active',NULL,NULL),(111,'User91','$2b$12$abcdefghijklmnopqrstuv','user91@example.com','customer','2026-03-03 07:57:39','active',NULL,NULL),(112,'User92','$2b$12$abcdefghijklmnopqrstuv','user92@example.com','customer','2026-02-22 07:57:39','suspended','2026-03-04 13:52:26','Incorrect Documents'),(113,'User93','$2b$12$abcdefghijklmnopqrstuv','user93@example.com','customer','2026-02-17 07:57:39','active',NULL,NULL),(114,'User94','$2b$12$abcdefghijklmnopqrstuv','user94@example.com','customer','2026-02-19 07:57:39','active',NULL,NULL),(115,'User95','$2b$12$abcdefghijklmnopqrstuv','user95@example.com','supplier','2026-02-11 07:57:39','active',NULL,NULL),(116,'User96','$2b$12$abcdefghijklmnopqrstuv','user96@example.com','customer','2026-02-25 07:57:39','suspended','2026-03-04 13:52:26','Incorrect Documents'),(117,'User97','$2b$12$abcdefghijklmnopqrstuv','user97@example.com','customer','2026-02-04 07:57:39','active',NULL,NULL),(118,'User98','$2b$12$abcdefghijklmnopqrstuv','user98@example.com','customer','2026-03-02 07:57:39','active',NULL,NULL),(119,'User99','$2b$12$abcdefghijklmnopqrstuv','user99@example.com','customer','2026-02-18 07:57:39','active',NULL,NULL),(120,'User100','$2b$12$abcdefghijklmnopqrstuv','user100@example.com','supplier','2026-03-01 07:57:39','suspended','2026-03-04 13:52:48','Payment Fraud');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-07 17:19:33
