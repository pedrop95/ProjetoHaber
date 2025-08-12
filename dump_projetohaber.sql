-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: projeto_haber
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `analises_detalheanalise`
--

DROP TABLE IF EXISTS `analises_detalheanalise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analises_detalheanalise` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `resultado` decimal(10,4) NOT NULL,
  `elemento_quimico_id` bigint NOT NULL,
  `registro_analise_id` bigint NOT NULL,
  `absorbancia_medida` decimal(10,4) DEFAULT NULL,
  `massa_pesada` decimal(10,4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `analises_detalheanalise_registro_analise_id_elem_ae64e6c4_uniq` (`registro_analise_id`,`elemento_quimico_id`),
  KEY `analises_detalheanal_elemento_quimico_id_946d5ab6_fk_elementos` (`elemento_quimico_id`),
  CONSTRAINT `analises_detalheanal_elemento_quimico_id_946d5ab6_fk_elementos` FOREIGN KEY (`elemento_quimico_id`) REFERENCES `elementos_elementoquimico` (`id`),
  CONSTRAINT `analises_detalheanal_registro_analise_id_e55006db_fk_analises_` FOREIGN KEY (`registro_analise_id`) REFERENCES `analises_registroanalise` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analises_detalheanalise`
--

LOCK TABLES `analises_detalheanalise` WRITE;
/*!40000 ALTER TABLE `analises_detalheanalise` DISABLE KEYS */;
/*!40000 ALTER TABLE `analises_detalheanalise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analises_registroanalise`
--

DROP TABLE IF EXISTS `analises_registroanalise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analises_registroanalise` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `data_analise` date NOT NULL,
  `nota_fiscal` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lote` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `produto_mat_prima_id` bigint NOT NULL,
  `data_producao` date DEFAULT NULL,
  `data_validade` date DEFAULT NULL,
  `fornecedor` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `analises_registroana_produto_mat_prima_id_b85067d8_fk_produtos_` (`produto_mat_prima_id`),
  CONSTRAINT `analises_registroana_produto_mat_prima_id_b85067d8_fk_produtos_` FOREIGN KEY (`produto_mat_prima_id`) REFERENCES `produtos_produtomatprima` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analises_registroanalise`
--

LOCK TABLES `analises_registroanalise` WRITE;
/*!40000 ALTER TABLE `analises_registroanalise` DISABLE KEYS */;
/*!40000 ALTER TABLE `analises_registroanalise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_configuracaoanalise`
--

DROP TABLE IF EXISTS `api_configuracaoanalise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_configuracaoanalise` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `produto_mat_prima_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_configuracaoanalise_produto_mat_prima_id_f05a1d7e_uniq` (`produto_mat_prima_id`),
  CONSTRAINT `api_configuracaoanal_produto_mat_prima_id_f05a1d7e_fk_api_produ` FOREIGN KEY (`produto_mat_prima_id`) REFERENCES `api_produtomatprima` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_configuracaoanalise`
--

LOCK TABLES `api_configuracaoanalise` WRITE;
/*!40000 ALTER TABLE `api_configuracaoanalise` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_configuracaoanalise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_configuracaoelementodetalhe`
--

DROP TABLE IF EXISTS `api_configuracaoelementodetalhe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_configuracaoelementodetalhe` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `diluicao1_X` decimal(10,4) NOT NULL,
  `diluicao1_Y` decimal(10,4) NOT NULL,
  `diluicao2_X` decimal(10,4) DEFAULT NULL,
  `diluicao2_Y` decimal(10,4) DEFAULT NULL,
  `limite_min` decimal(10,4) DEFAULT NULL,
  `limite_max` decimal(10,4) DEFAULT NULL,
  `configuracao_analise_id` bigint NOT NULL,
  `elemento_quimico_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_configuracaoelemento_configuracao_analise_id__87cc6a6f_uniq` (`configuracao_analise_id`,`elemento_quimico_id`),
  KEY `api_configuracaoelem_elemento_quimico_id_971694e1_fk_api_eleme` (`elemento_quimico_id`),
  CONSTRAINT `api_configuracaoelem_configuracao_analise_cb83d27e_fk_api_confi` FOREIGN KEY (`configuracao_analise_id`) REFERENCES `api_configuracaoanalise` (`id`),
  CONSTRAINT `api_configuracaoelem_elemento_quimico_id_971694e1_fk_api_eleme` FOREIGN KEY (`elemento_quimico_id`) REFERENCES `api_elementoquimico` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_configuracaoelementodetalhe`
--

LOCK TABLES `api_configuracaoelementodetalhe` WRITE;
/*!40000 ALTER TABLE `api_configuracaoelementodetalhe` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_configuracaoelementodetalhe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_detalheanalise`
--

DROP TABLE IF EXISTS `api_detalheanalise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_detalheanalise` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `massa_pesada` decimal(10,4) DEFAULT NULL,
  `absorbancia_medida` decimal(10,4) DEFAULT NULL,
  `resultado` decimal(10,4) DEFAULT NULL,
  `configuracao_elemento_detalhe_id` bigint NOT NULL,
  `registro_analise_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_detalheanalise_registro_analise_id_conf_ad178552_uniq` (`registro_analise_id`,`configuracao_elemento_detalhe_id`),
  KEY `api_detalheanalise_configuracao_element_15c175b8_fk_api_confi` (`configuracao_elemento_detalhe_id`),
  CONSTRAINT `api_detalheanalise_configuracao_element_15c175b8_fk_api_confi` FOREIGN KEY (`configuracao_elemento_detalhe_id`) REFERENCES `api_configuracaoelementodetalhe` (`id`),
  CONSTRAINT `api_detalheanalise_registro_analise_id_a342c135_fk_api_regis` FOREIGN KEY (`registro_analise_id`) REFERENCES `api_registroanalise` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_detalheanalise`
--

LOCK TABLES `api_detalheanalise` WRITE;
/*!40000 ALTER TABLE `api_detalheanalise` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_detalheanalise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_elementoquimico`
--

DROP TABLE IF EXISTS `api_elementoquimico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_elementoquimico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `simbolo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `simbolo` (`simbolo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_elementoquimico`
--

LOCK TABLES `api_elementoquimico` WRITE;
/*!40000 ALTER TABLE `api_elementoquimico` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_elementoquimico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_produtomatprima`
--

DROP TABLE IF EXISTS `api_produtomatprima`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_produtomatprima` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_ou_op` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_ou_op` (`id_ou_op`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_produtomatprima`
--

LOCK TABLES `api_produtomatprima` WRITE;
/*!40000 ALTER TABLE `api_produtomatprima` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_produtomatprima` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_registroanalise`
--

DROP TABLE IF EXISTS `api_registroanalise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_registroanalise` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `data_analise` date NOT NULL,
  `analista` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `produto_mat_prima_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_registroanalise_produto_mat_prima_id_23a02fcf_fk_api_produ` (`produto_mat_prima_id`),
  CONSTRAINT `api_registroanalise_produto_mat_prima_id_23a02fcf_fk_api_produ` FOREIGN KEY (`produto_mat_prima_id`) REFERENCES `api_produtomatprima` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_registroanalise`
--

LOCK TABLES `api_registroanalise` WRITE;
/*!40000 ALTER TABLE `api_registroanalise` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_registroanalise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add Produto/Matéria-Prima',7,'add_produtomatprima'),(26,'Can change Produto/Matéria-Prima',7,'change_produtomatprima'),(27,'Can delete Produto/Matéria-Prima',7,'delete_produtomatprima'),(28,'Can view Produto/Matéria-Prima',7,'view_produtomatprima'),(29,'Can add Elemento Químico',8,'add_elementoquimico'),(30,'Can change Elemento Químico',8,'change_elementoquimico'),(31,'Can delete Elemento Químico',8,'delete_elementoquimico'),(32,'Can view Elemento Químico',8,'view_elementoquimico'),(33,'Can add Configuração de Elemento',9,'add_configuracaoanalise'),(34,'Can change Configuração de Elemento',9,'change_configuracaoanalise'),(35,'Can delete Configuração de Elemento',9,'delete_configuracaoanalise'),(36,'Can view Configuração de Elemento',9,'view_configuracaoanalise'),(37,'Can add Registro de Análise',10,'add_registroanalise'),(38,'Can change Registro de Análise',10,'change_registroanalise'),(39,'Can delete Registro de Análise',10,'delete_registroanalise'),(40,'Can view Registro de Análise',10,'view_registroanalise'),(41,'Can add Detalhe de Análise',11,'add_detalheanalise'),(42,'Can change Detalhe de Análise',11,'change_detalheanalise'),(43,'Can delete Detalhe de Análise',11,'delete_detalheanalise'),(44,'Can view Detalhe de Análise',11,'view_detalheanalise'),(45,'Can add Configuração de Análise',12,'add_configuracaoanalise'),(46,'Can change Configuração de Análise',12,'change_configuracaoanalise'),(47,'Can delete Configuração de Análise',12,'delete_configuracaoanalise'),(48,'Can view Configuração de Análise',12,'view_configuracaoanalise'),(49,'Can add configuracao analise',13,'add_configuracaoanalise'),(50,'Can change configuracao analise',13,'change_configuracaoanalise'),(51,'Can delete configuracao analise',13,'delete_configuracaoanalise'),(52,'Can view configuracao analise',13,'view_configuracaoanalise'),(53,'Can add elemento quimico',14,'add_elementoquimico'),(54,'Can change elemento quimico',14,'change_elementoquimico'),(55,'Can delete elemento quimico',14,'delete_elementoquimico'),(56,'Can view elemento quimico',14,'view_elementoquimico'),(57,'Can add produto mat prima',15,'add_produtomatprima'),(58,'Can change produto mat prima',15,'change_produtomatprima'),(59,'Can delete produto mat prima',15,'delete_produtomatprima'),(60,'Can view produto mat prima',15,'view_produtomatprima'),(61,'Can add configuracao elemento detalhe',16,'add_configuracaoelementodetalhe'),(62,'Can change configuracao elemento detalhe',16,'change_configuracaoelementodetalhe'),(63,'Can delete configuracao elemento detalhe',16,'delete_configuracaoelementodetalhe'),(64,'Can view configuracao elemento detalhe',16,'view_configuracaoelementodetalhe'),(65,'Can add registro analise',17,'add_registroanalise'),(66,'Can change registro analise',17,'change_registroanalise'),(67,'Can delete registro analise',17,'delete_registroanalise'),(68,'Can view registro analise',17,'view_registroanalise'),(69,'Can add detalhe analise',18,'add_detalheanalise'),(70,'Can change detalhe analise',18,'change_detalheanalise'),(71,'Can delete detalhe analise',18,'delete_detalheanalise'),(72,'Can view detalhe analise',18,'view_detalheanalise');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$1000000$YTX296s7ObxAhZexzPB0j4$NBdISKoEuvTOAXHMsLv9MeHF2aYcZDNWcYw/XTcgLL0=',NULL,1,'pedro','','','pedroarantes95@gmail.com',1,1,'2025-08-01 14:48:56.094157'),(2,'pbkdf2_sha256$1000000$DwmhwVtoDN1ZiOiGKdMTdv$pq7gEYOIHaXQHMLRI5Q+baq28NSA3+4eyKAQACIMpdc=','2025-08-12 11:14:22.485862',1,'brq','','','pedroarantes95@gmail.com',1,1,'2025-08-12 11:13:55.779373');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracoes_configuracaoanalise`
--

DROP TABLE IF EXISTS `configuracoes_configuracaoanalise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracoes_configuracaoanalise` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `diluicao1_X` decimal(10,4) DEFAULT NULL,
  `diluicao1_Y` decimal(10,4) DEFAULT NULL,
  `diluicao2_X` decimal(10,4) DEFAULT NULL,
  `diluicao2_Y` decimal(10,4) DEFAULT NULL,
  `elemento_quimico_id` bigint NOT NULL,
  `produto_mat_prima_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `configuracoes_configurac_produto_mat_prima_id_ele_483c222b_uniq` (`produto_mat_prima_id`,`elemento_quimico_id`),
  KEY `configuracoes_config_elemento_quimico_id_20279923_fk_elementos` (`elemento_quimico_id`),
  CONSTRAINT `configuracoes_config_elemento_quimico_id_20279923_fk_elementos` FOREIGN KEY (`elemento_quimico_id`) REFERENCES `elementos_elementoquimico` (`id`),
  CONSTRAINT `configuracoes_config_produto_mat_prima_id_80c322b9_fk_produtos_` FOREIGN KEY (`produto_mat_prima_id`) REFERENCES `produtos_produtomatprima` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracoes_configuracaoanalise`
--

LOCK TABLES `configuracoes_configuracaoanalise` WRITE;
/*!40000 ALTER TABLE `configuracoes_configuracaoanalise` DISABLE KEYS */;
/*!40000 ALTER TABLE `configuracoes_configuracaoanalise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(11,'analises','detalheanalise'),(10,'analises','registroanalise'),(13,'api','configuracaoanalise'),(16,'api','configuracaoelementodetalhe'),(18,'api','detalheanalise'),(14,'api','elementoquimico'),(15,'api','produtomatprima'),(17,'api','registroanalise'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(12,'configuracoes','configuracaoanalise'),(5,'contenttypes','contenttype'),(9,'elementos','configuracaoanalise'),(8,'elementos','elementoquimico'),(7,'produtos','produtomatprima'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-08-01 14:47:20.563360'),(2,'auth','0001_initial','2025-08-01 14:47:22.716492'),(3,'admin','0001_initial','2025-08-01 14:47:23.191295'),(4,'admin','0002_logentry_remove_auto_add','2025-08-01 14:47:23.205407'),(5,'admin','0003_logentry_add_action_flag_choices','2025-08-01 14:47:23.220609'),(6,'produtos','0001_initial','2025-08-01 14:47:23.315194'),(7,'elementos','0001_initial','2025-08-01 14:47:23.888369'),(8,'elementos','0002_alter_configuracaoanalise_options_and_more','2025-08-01 14:47:23.902768'),(9,'analises','0001_initial','2025-08-01 14:47:24.626333'),(10,'analises','0002_alter_detalheanalise_options_and_more','2025-08-01 14:47:26.796001'),(11,'analises','0003_alter_registroanalise_options_registroanalise_status_and_more','2025-08-01 14:47:27.045686'),(12,'api','0001_initial','2025-08-01 14:47:28.678753'),(13,'contenttypes','0002_remove_content_type_name','2025-08-01 14:47:29.041797'),(14,'auth','0002_alter_permission_name_max_length','2025-08-01 14:47:29.248360'),(15,'auth','0003_alter_user_email_max_length','2025-08-01 14:47:29.297929'),(16,'auth','0004_alter_user_username_opts','2025-08-01 14:47:29.312366'),(17,'auth','0005_alter_user_last_login_null','2025-08-01 14:47:29.498228'),(18,'auth','0006_require_contenttypes_0002','2025-08-01 14:47:29.507264'),(19,'auth','0007_alter_validators_add_error_messages','2025-08-01 14:47:29.523799'),(20,'auth','0008_alter_user_username_max_length','2025-08-01 14:47:29.735264'),(21,'auth','0009_alter_user_last_name_max_length','2025-08-01 14:47:29.951063'),(22,'auth','0010_alter_group_name_max_length','2025-08-01 14:47:29.993453'),(23,'auth','0011_update_proxy_permissions','2025-08-01 14:47:30.016914'),(24,'auth','0012_alter_user_first_name_max_length','2025-08-01 14:47:30.228473'),(25,'configuracoes','0001_initial','2025-08-01 14:47:30.746746'),(26,'sessions','0001_initial','2025-08-01 14:47:30.875261');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('z9003o07y6x600cgr03n30citv5d585l','.eJxVjDsOwjAQBe_iGln-ZP2hpOcM1nrX4ABypDipEHcnkVJAOzPvvUXCdalp7WVOI4uzMOL0yzLSs7Rd8APbfZI0tWUes9wTedgurxOX1-Vo_w4q9rqtQ1AxuwxElkyJHCFH0GQHUnbDFnw2HiIE49gPgOWGltlpo4NBIiU-X9LbN3Y:1ulmxS:Q5LlDD2sjmcmEpqqp5dtCBP5wXreDCJIMJef2hqNySQ','2025-08-26 11:14:22.543633');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elementos_configuracaoanalise`
--

DROP TABLE IF EXISTS `elementos_configuracaoanalise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elementos_configuracaoanalise` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `diluicao1_X` decimal(10,4) NOT NULL,
  `diluicao1_Y` decimal(10,4) NOT NULL,
  `diluicao2_X` decimal(10,4) DEFAULT NULL,
  `diluicao2_Y` decimal(10,4) DEFAULT NULL,
  `produto_mat_prima_id` bigint NOT NULL,
  `elemento_quimico_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `elementos_configuracaoan_produto_mat_prima_id_ele_c793a6ef_uniq` (`produto_mat_prima_id`,`elemento_quimico_id`),
  KEY `elementos_configurac_elemento_quimico_id_e5001268_fk_elementos` (`elemento_quimico_id`),
  CONSTRAINT `elementos_configurac_elemento_quimico_id_e5001268_fk_elementos` FOREIGN KEY (`elemento_quimico_id`) REFERENCES `elementos_elementoquimico` (`id`),
  CONSTRAINT `elementos_configurac_produto_mat_prima_id_b6516eaa_fk_produtos_` FOREIGN KEY (`produto_mat_prima_id`) REFERENCES `produtos_produtomatprima` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elementos_configuracaoanalise`
--

LOCK TABLES `elementos_configuracaoanalise` WRITE;
/*!40000 ALTER TABLE `elementos_configuracaoanalise` DISABLE KEYS */;
/*!40000 ALTER TABLE `elementos_configuracaoanalise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elementos_elementoquimico`
--

DROP TABLE IF EXISTS `elementos_elementoquimico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elementos_elementoquimico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elementos_elementoquimico`
--

LOCK TABLES `elementos_elementoquimico` WRITE;
/*!40000 ALTER TABLE `elementos_elementoquimico` DISABLE KEYS */;
INSERT INTO `elementos_elementoquimico` VALUES (4,'Alumínio'),(3,'Zinco');
/*!40000 ALTER TABLE `elementos_elementoquimico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos_produtomatprima`
--

DROP TABLE IF EXISTS `produtos_produtomatprima`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos_produtomatprima` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_ou_op` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_ou_op` (`id_ou_op`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos_produtomatprima`
--

LOCK TABLES `produtos_produtomatprima` WRITE;
/*!40000 ALTER TABLE `produtos_produtomatprima` DISABLE KEYS */;
INSERT INTO `produtos_produtomatprima` VALUES (1,'1','Óxido de Zinco 72');
/*!40000 ALTER TABLE `produtos_produtomatprima` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-12  8:33:12
