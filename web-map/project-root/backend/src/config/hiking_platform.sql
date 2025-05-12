/*
 Navicat Premium Data Transfer

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 80033
 Source Host           : localhost:3306
 Source Schema         : hiking_platform

 Target Server Type    : MySQL
 Target Server Version : 80033
 File Encoding         : 65001

 Date: 12/05/2025 20:47:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for hiking_routes
-- ----------------------------
DROP TABLE IF EXISTS `hiking_routes`;
CREATE TABLE `hiking_routes`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `difficulty` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `difficulty_class` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `duration` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `distance` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `elevation` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `rating` decimal(2, 1) NOT NULL,
  `reviews` int NULL DEFAULT 0,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `seasons` json NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_popular` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hiking_routes
-- ----------------------------
INSERT INTO `hiking_routes` VALUES (1, '龙虎山观景徒步路线', '初级', 'easy', '3小时', '5.8公里', '320米', '适合初学者的经典路线，景色优美，路况良好，可欣赏山景和溪流。', 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1470&auto=format&fit=crop', 4.5, 128, '四川 成都', '[\"春季\", \"秋季\"]', '2025-05-11 20:33:27', '2025-05-11 20:33:27', 0);
INSERT INTO `hiking_routes` VALUES (2, '青龙峡谷探险路线', '中级', 'medium', '5小时', '9.5公里', '580米', '中等难度的峡谷路线，包含部分攀爬段，沿途有多处壮观的峡谷景观。', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop', 4.8, 97, '云南 丽江', '[\"春季\", \"夏季\", \"秋季\"]', '2025-05-11 20:33:27', '2025-05-11 20:33:27', 0);
INSERT INTO `hiking_routes` VALUES (3, '雪山高原长线徒步', '高级', 'hard', '8小时', '16.2公里', '1200米', '挑战性强的高海拔路线，需要良好的体能和户外经验，风景壮丽。', 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1471&auto=format&fit=crop', 4.9, 76, '西藏 林芝', '[\"夏季\"]', '2025-05-11 20:33:27', '2025-05-11 20:33:27', 0);
INSERT INTO `hiking_routes` VALUES (4, '松林湖泊环线', '初级', 'easy', '2.5小时', '4.2公里', '150米', '平缓的湖泊环线，全程树荫遮盖，非常适合夏季徒步和亲子活动。', 'https://images.unsplash.com/photo-1465311530779-5241f5a29892?q=80&w=1470&auto=format&fit=crop', 4.3, 156, '浙江 杭州', '[\"春季\", \"夏季\", \"秋季\"]', '2025-05-11 20:33:27', '2025-05-11 20:33:27', 0);
INSERT INTO `hiking_routes` VALUES (5, '黄山西海大峡谷', '中级', 'medium', '6小时', '8.7公里', '750米', '穿越壮观的峡谷和山脉，欣赏黄山奇松怪石，沿途风景秀丽，适合徒步爱好者。', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1574&auto=format&fit=crop', 4.7, 112, '安徽 黄山', '[\"春季\", \"秋季\"]', '2025-05-11 20:33:27', '2025-05-11 20:33:27', 0);
INSERT INTO `hiking_routes` VALUES (6, '海岸线礁石路线', '中级', 'medium', '4小时', '7.3公里', '210米', '沿海岸线穿行，经过多处礁石和海蚀地貌，可以欣赏壮观的海景。', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1470&auto=format&fit=crop', 4.6, 88, '福建 厦门', '[\"春季\", \"秋季\", \"冬季\"]', '2025-05-11 20:33:27', '2025-05-11 20:33:27', 0);

-- ----------------------------
-- Table structure for post_images
-- ----------------------------
DROP TABLE IF EXISTS `post_images`;
CREATE TABLE `post_images`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sort_order` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `post_id`(`post_id` ASC) USING BTREE,
  CONSTRAINT `post_images_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of post_images
-- ----------------------------
INSERT INTO `post_images` VALUES (1, 1, 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1470&auto=format&fit=crop', 0);
INSERT INTO `post_images` VALUES (2, 2, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop', 0);
INSERT INTO `post_images` VALUES (3, 3, 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1471&auto=format&fit=crop', 0);
INSERT INTO `post_images` VALUES (4, 4, 'https://images.unsplash.com/photo-1465311530779-5241f5a29892?q=80&w=1470&auto=format&fit=crop', 0);
INSERT INTO `post_images` VALUES (5, 5, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1574&auto=format&fit=crop', 0);

-- ----------------------------
-- Table structure for post_likes
-- ----------------------------
DROP TABLE IF EXISTS `post_likes`;
CREATE TABLE `post_likes`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_like`(`post_id` ASC, `user_id` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `post_likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `post_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of post_likes
-- ----------------------------

-- ----------------------------
-- Table structure for posts
-- ----------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `summary` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `likes` int NULL DEFAULT 0,
  `comments` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of posts
-- ----------------------------
INSERT INTO `posts` VALUES (1, '分享我的莫干山徒步经历', '上周末和朋友一起去了莫干山徒步，风景真的太美了！路线难度适中，适合初学者。沿途可以看到很多竹林和茶园，空气非常清新。建议早上出发，避开中午的高温。', '上周末和朋友一起去了莫干山徒步，风景真的太美了！路线难度适中，适合初学者。沿途可以看到很多竹林和茶园，空气非常清新。建议早上出发，避开中午的高温。', 1, '2024-03-15 10:00:00', '2024-03-15 10:00:00', '浙江省湖州市德清县莫干山', 15, 5);
INSERT INTO `posts` VALUES (2, '黄山徒步装备推荐', '作为一个经常徒步的爱好者，我想分享一下我的装备清单。首先是登山鞋，一定要选择防滑、透气的专业登山鞋。其次是背包，建议选择30-40L的容量，要带有防水功能。', '作为一个经常徒步的爱好者，我想分享一下我的装备清单。首先是登山鞋，一定要选择防滑、透气的专业登山鞋。其次是背包，建议选择30-40L的容量，要带有防水功能。', 2, '2024-03-14 15:30:00', '2024-03-14 15:30:00', '安徽省黄山市', 23, 8);
INSERT INTO `posts` VALUES (3, '杭州周边最适合初学者的5条徒步路线', '1. 龙井村-九溪烟树：全程约5公里，路况良好，适合亲子活动。2. 云栖竹径：约3公里，竹林环绕，空气清新。3. 虎跑公园：约4公里，有泉水景观。4. 玉皇山：约6公里，可以俯瞰西湖。5. 吴山：约3公里，城市中的徒步好去处。', '1. 龙井村-九溪烟树：全程约5公里，路况良好，适合亲子活动。2. 云栖竹径：约3公里，竹林环绕，空气清新。3. 虎跑公园：约4公里，有泉水景观。4. 玉皇山：约6公里，可以俯瞰西湖。5. 吴山：约3公里，城市中的徒步好去处。', 3, '2024-03-13 09:15:00', '2024-03-13 09:15:00', '浙江省杭州市', 45, 12);
INSERT INTO `posts` VALUES (4, '徒步安全注意事项', '1. 提前查看天气预报，避免恶劣天气出行。2. 准备充足的饮用水和干粮。3. 穿着合适的衣物和鞋子。4. 带上急救包和必要的药品。5. 结伴而行，不要单独行动。6. 保持手机电量充足。', '1. 提前查看天气预报，避免恶劣天气出行。2. 准备充足的饮用水和干粮。3. 穿着合适的衣物和鞋子。4. 带上急救包和必要的药品。5. 结伴而行，不要单独行动。6. 保持手机电量充足。', 4, '2024-03-12 14:20:00', '2024-03-12 14:20:00', NULL, 67, 15);
INSERT INTO `posts` VALUES (5, '我的第一次高原徒步经历', '上个月去了西藏林芝，体验了人生第一次高原徒步。虽然海拔较高，但景色真的震撼。建议提前一周服用红景天，准备充足的氧气瓶。高原徒步最重要的是要循序渐进，不要急于求成。', '上个月去了西藏林芝，体验了人生第一次高原徒步。虽然海拔较高，但景色真的震撼。建议提前一周服用红景天，准备充足的氧气瓶。高原徒步最重要的是要循序渐进，不要急于求成。', 5, '2024-03-11 11:45:00', '2024-03-11 11:45:00', '西藏自治区林芝市', 89, 20);

-- ----------------------------
-- Table structure for post_comments
-- ----------------------------
DROP TABLE IF EXISTS `post_comments`;
CREATE TABLE `post_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `post_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `post_comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of post_comments
-- ----------------------------
INSERT INTO `post_comments` VALUES (1, 1, 2, '风景真不错，我也想去！', '2024-03-15 10:30:00', '2024-03-15 10:30:00', NULL);
INSERT INTO `post_comments` VALUES (2, 1, 3, '请问具体路线怎么走？', '2024-03-15 11:00:00', '2024-03-15 11:00:00', NULL);
INSERT INTO `post_comments` VALUES (3, 2, 4, '装备清单很详细，谢谢分享！', '2024-03-14 16:00:00', '2024-03-14 16:00:00', NULL);
INSERT INTO `post_comments` VALUES (4, 3, 5, '这些路线都很适合初学者，收藏了！', '2024-03-13 10:00:00', '2024-03-13 10:00:00', NULL);
INSERT INTO `post_comments` VALUES (5, 4, 1, '安全注意事项总结得很到位！', '2024-03-12 15:00:00', '2024-03-12 15:00:00', NULL);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `is_admin` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'xxx', '123456@qq.com', '$2a$10$t3UaxRTCh8Qfb4g8bfzvoOxwJObMGi3m.1oEvVJFg8U2hf6sA6zqS', 'http://localhost:3000/uploads/1746868040833-OIP-C.jpg', '2025-05-10 13:32:19', '2025-05-11 15:31:12', NULL, 1);
INSERT INTO `users` VALUES (2, 'xxxx', '1234567@qq.com', '$2a$10$HeUANKSZVZ/I701qv8uSyOAZzErmctFNjULvzctJ8G.h.GSjersYm', NULL, '2025-05-10 13:33:08', '2025-05-10 13:33:08', NULL, 0);
INSERT INTO `users` VALUES (3, 'admin', '1981178578@qq.com', '$2a$10$Df/3fYjiy6SBuwR1VtwAR.LHUCjnFD5k/B25xZplZ.dE0vPY9yciW', NULL, '2025-05-10 13:39:55', '2025-05-10 13:39:55', NULL, 0);
INSERT INTO `users` VALUES (4, 'ddd', '1988578@qq.com', '$2a$10$ONTNMjKlAprwt13aEKQR1ePosoEtf5O5kFZE2n2w1WmJwx1nZCeEG', NULL, '2025-05-10 13:44:17', '2025-05-10 13:44:17', NULL, 0);
INSERT INTO `users` VALUES (5, 'daddy', '224455@qq.com', '$2a$10$sfqryMch3vpWMliUg16XXe3WR3eGzafiUwXY7VbaigR2d23wqRRO6', NULL, '2025-05-10 13:46:12', '2025-05-10 13:46:12', NULL, 0);
INSERT INTO `users` VALUES (6, 'werrr', '222222@qq.com', '$2a$10$ETUTivcWtz/G.kWhgOFYyuDbU80cFiDvodLtJoeXP2omy.n8a1H3a', NULL, '2025-05-10 13:57:51', '2025-05-10 13:57:51', NULL, 0);

SET FOREIGN_KEY_CHECKS = 1;
