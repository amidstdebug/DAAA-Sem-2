CREATE DATABASE  IF NOT EXISTS `sp_air` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sp_air`;
-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: sp_air
-- ------------------------------------------------------
-- Server version	8.0.25

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
-- Table structure for table `airport`
--

DROP TABLE IF EXISTS `airport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airport` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `insertDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airport`
--

LOCK TABLES `airport` WRITE;
/*!40000 ALTER TABLE `airport` DISABLE KEYS */;
INSERT INTO `airport` VALUES (1,'Changi Airport','Singapore','Singapore','Singapore Changi Airport','2021-10-26 03:05:07'),(2,'Sydney Kingsford Smith Airport','Australia','Sydney','Sydney Airport','2021-10-26 03:05:07'),(3,'Perth Airport','Australia','Perth','Perth Airport','2021-10-26 03:05:07'),(4,'Narita Airport','Japan','Tokyo','Tokyo Narita Airport','2021-10-26 03:05:07');
/*!40000 ALTER TABLE `airport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight`
--

DROP TABLE IF EXISTS `flight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight` (
  `flightid` int NOT NULL AUTO_INCREMENT,
  `flightcode` varchar(45) NOT NULL,
  `departAirportId` int NOT NULL,
  `arrivalAirportId` int NOT NULL,
  `departTime` varchar(45) DEFAULT NULL,
  `duration` varchar(45) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `insertionDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`flightid`),
  KEY `fk_arrival_idx` (`arrivalAirportId`),
  KEY `fk_depart_idx` (`departAirportId`),
  CONSTRAINT `fk_arrival` FOREIGN KEY (`arrivalAirportId`) REFERENCES `airport` (`id`),
  CONSTRAINT `fk_depart` FOREIGN KEY (`departAirportId`) REFERENCES `airport` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight`
--

LOCK TABLES `flight` WRITE;
/*!40000 ALTER TABLE `flight` DISABLE KEYS */;
INSERT INTO `flight` VALUES (1,'SP100',1,4,'20/12/2021 11:00','7 hrs 50 mins',750,'2021-10-26 03:10:10'),(2,'SP120',1,4,'20/12/2021 23:00','8 hrs 10 mins',720,'2021-10-26 03:10:10'),(3,'SP050',1,4,'21/12/2021 02:00','8 hrs 05 mins',700,'2021-10-26 03:10:10'),(4,'SP009',1,4,'21/12/2021 16:00','7 hrs 55 mins',680,'2021-10-26 03:10:10'),(5,'SP123',1,2,'22/12/2021 12:00','7 hrs 50 mins',730,'2021-10-26 03:32:55'),(6,'SP011',4,1,'21/12/2021 18:00','8 hrs 15 mins',850,'2021-10-26 04:18:06'),(7,'SP110',4,1,'20/12/2021 23:00','8 hrs 05 mins',780,'2021-10-26 04:24:53'),(8,'SP125',4,1,'21/12/2021 11:00','7 hrs 55 mins',700,'2021-10-26 04:24:53'),(9,'SP055',4,1,'22/12/2021 02:00','7 hrs 45 mins',690,'2021-10-26 04:24:53');
/*!40000 ALTER TABLE `flight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'sp_air'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-26 14:52:39
