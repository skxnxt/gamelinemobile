/*
 Navicat Premium Data Transfer

 Source Server         : testgame
 Source Server Type    : MySQL
 Source Server Version : 100427 (10.4.27-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : mmorpg_game

 Target Server Type    : MySQL
 Target Server Version : 100427 (10.4.27-MariaDB)
 File Encoding         : 65001

 Date: 17/10/2024 19:19:59
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for char_type
-- ----------------------------
DROP TABLE IF EXISTS `char_type`;
CREATE TABLE `char_type`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `char_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `char_img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rarity` tinyint NOT NULL DEFAULT 0,
  `effect_type_1` int NULL DEFAULT 0,
  `effect_value_1` int NULL DEFAULT 0,
  `effect_type_2` int NULL DEFAULT 0,
  `effect_value_2` int NULL DEFAULT 0,
  `effect_type_3` int NULL DEFAULT 0,
  `effect_value_3` int NULL DEFAULT 0,
  `effect_type_4` int NULL DEFAULT 0,
  `effect_value_4` int NULL DEFAULT 0,
  `effect_type_5` int NULL DEFAULT 0,
  `effect_value_5` int NULL DEFAULT 0,
  `can_create` int NULL DEFAULT 0,
  `min_damage` int NOT NULL,
  `min_defence` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_char_type`(`id` ASC, `can_create` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of char_type
-- ----------------------------
INSERT INTO `char_type` VALUES (1, 'Wolf', 'wolf.gif', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 2);
INSERT INTO `char_type` VALUES (2, 'Fox', '2', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 2);
INSERT INTO `char_type` VALUES (3, 'Deer', '3', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 2);
INSERT INTO `char_type` VALUES (4, 'Dragon', 'dragon', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- ----------------------------
-- Table structure for character
-- ----------------------------
DROP TABLE IF EXISTS `character`;
CREATE TABLE `character`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `char_type` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `level` int NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `is_del` int NOT NULL DEFAULT 0,
  `is_online` int NOT NULL DEFAULT 0,
  `exp` int NOT NULL DEFAULT 0,
  `gold` int NOT NULL DEFAULT 0,
  `stats_point` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `char_type`(`char_type` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_is_del`(`is_del` ASC) USING BTREE,
  CONSTRAINT `character_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `character_ibfk_2` FOREIGN KEY (`char_type`) REFERENCES `char_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of character
-- ----------------------------
INSERT INTO `character` VALUES (24, 11, 1, 'aaa', 1, '2024-10-17 11:43:00', 1, 0, 0, 0, 0);
INSERT INTO `character` VALUES (25, 11, 1, '&lt;?a', 1, '2024-10-17 11:47:05', 1, 0, 0, 0, 0);
INSERT INTO `character` VALUES (26, 11, 1, '&lt;?php ?&gt;', 1, '2024-10-17 11:47:19', 1, 0, 0, 0, 0);
INSERT INTO `character` VALUES (27, 11, 1, 'ฟฟฟ', 1, '2024-10-17 12:56:28', 0, 0, 0, 0, 0);

SET FOREIGN_KEY_CHECKS = 1;
