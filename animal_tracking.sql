-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2023 at 09:58 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `animal_tracking`
--

-- --------------------------------------------------------

--
-- Table structure for table `animals`
--

CREATE TABLE `animals` (
  `animal_id` int(11) NOT NULL,
  `animal_name` varchar(255) NOT NULL,
  `longitude` float NOT NULL,
  `latitude` float NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `area_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `areas`
--

CREATE TABLE `areas` (
  `area_id` int(11) NOT NULL,
  `area_name` varchar(255) NOT NULL,
  `area_location` point NOT NULL,
  `area_polygon` polygon DEFAULT NULL,
  `area_area` float NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `area_id` int(11) NOT NULL,
  `report_name` varchar(255) NOT NULL,
  `longitude` float NOT NULL,
  `latitude` float NOT NULL,
  `report_description` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `area_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `username`, `password`, `email`, `role`, `createdAt`, `updatedAt`, `area_id`) VALUES
(1, 'Carrie', 'Strosin', 'Grace Kozey', 'xeW9K7xCDQD437h', 'Arlo_Little@hotmail.com', 'Representative', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(2, 'Talon', 'Greenfelder-Gerlach', 'Ruben Marvin', 'm8KmvVwSaP_l8m9', 'Marina79@gmail.com', 'Executive', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(3, 'Otha', 'Thompson', 'Stewart Gutkowski', 'BxNYfkkN5Dhdoh4', 'Larry_Wintheiser@hotmail.com', 'Specialist', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(4, 'Lea', 'Wisoky', 'Bridget Gorczany', 'QsvzM8M7vjy4L5o', 'Ethan.Stanton@hotmail.com', 'Liaison', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(5, 'Clay', 'Botsford', 'Robin Wuckert', '5uQDXuDagHUcqx2', 'Larry_Collier-Schmidt@hotmail.com', 'Developer', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(6, 'Mariam', 'Auer', 'Jenna Bechtelar', 'yjAW986JWNCZLur', 'Maye79@hotmail.com', 'Associate', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(7, 'Earnest', 'Schultz', 'Kate Klein', '2mrkivz9Hdehy6A', 'Naomie_Larkin66@yahoo.com', 'Engineer', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(8, 'Berry', 'Nienow', 'Diana Thompson', 'hORNDgASPDGcbfh', 'Kenna97@gmail.com', 'Executive', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(9, 'Will', 'Crona', 'Wm Miller', 'pPPC6CG13ELwP0t', 'Collin_Harris@hotmail.com', 'Executive', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(10, 'Brandon', 'Schaefer', 'Melba Waelchi', 'uM45eZSBZXoNhwl', 'Demond.Medhurst87@yahoo.com', 'Assistant', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(11, 'Easton', 'Ritchie', 'Deanna Beatty', 'jKLXDxqWmXvJ5Db', 'Alexandre99@gmail.com', 'Analyst', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(12, 'Brandyn', 'Hickle', 'Milton Marquardt', 'M8QpUaycxp7JMBj', 'Lysanne24@gmail.com', 'Assistant', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(13, 'Jose', 'Leuschke', 'Dr. Sandra Feest', 'a89ayCDsih1dp3S', 'Cody30@hotmail.com', 'Architect', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(14, 'Rita', 'Harris', 'Diana Schamberger-Mitchell', 'DBRCsKGm4GnppH2', 'Rahul_Bednar81@hotmail.com', 'Engineer', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(15, 'Myrtle', 'Murray', 'Edmund Torphy', 'ah7HkaaaPc0T5L7', 'Blaze59@gmail.com', 'Agent', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(16, 'Ardella', 'Murray', 'Scott Bogisich', 'vWIqLxrHlmOVHtL', 'Steve_Powlowski30@gmail.com', 'Executive', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(17, 'Hillary', 'Schaden', 'Colin Carter', 'f3_1Ac1McVaozkM', 'Jalen_Sanford7@hotmail.com', 'Specialist', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(18, 'Burdette', 'Schulist', 'Jon Cummerata', 'ezqaSIVzDn2_Qku', 'Mayra8@yahoo.com', 'Planner', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(19, 'Camille', 'Labadie', 'Grady Renner Sr.', '90GVcivVDIQDusf', 'Mack_Frami@hotmail.com', 'Orchestrator', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(20, 'Perry', 'Lockman', 'Maxine Spencer', '_QMiOYuNf9XhixM', 'Osvaldo2@yahoo.com', 'Architect', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(21, 'Margret', 'Towne', 'Wilbert Watsica', 'TWCGpfS9GwsEE23', 'Curt30@yahoo.com', 'Facilitator', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(22, 'Selena', 'Maggio', 'Cassandra Yost', 'ddleL6SUKNMkxoy', 'Citlalli_Wintheiser63@yahoo.com', 'Administrator', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(23, 'Jayson', 'Brakus', 'Constance Franecki', 'f1472gmWDKtRyzf', 'Erica29@hotmail.com', 'Supervisor', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(24, 'Rico', 'Schmitt', 'Lynn Kuhic', '0GcHTSUVhRVZdUh', 'Jamaal_Barton@hotmail.com', 'Associate', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(25, 'Ansley', 'Mohr', 'Herbert Upton', '8zbn3NG9P3UbTVp', 'Robyn35@hotmail.com', 'Liaison', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(26, 'Ellsworth', 'Kuvalis', 'Norma Goodwin MD', 'NSvXSR6YvHS_1_F', 'Jovan_Bashirian30@hotmail.com', 'Developer', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(27, 'Orrin', 'Baumbach', 'Van Lakin', '7uyqifKl7ZrOrMH', 'Ashlee62@yahoo.com', 'Manager', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(28, 'Emmett', 'Kreiger', 'Alicia Dibbert', '7tahaPMofWW49mr', 'Edward.Kling92@yahoo.com', 'Assistant', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(29, 'Hudson', 'Gulgowski', 'Elvira Ryan', 'nWcCVs0ocLKhNCC', 'Zander.Wolf@gmail.com', 'Architect', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL),
(30, 'Abraham', 'Kassulke', 'Marjorie Mayert', 'bPjYSKGLEWQklRx', 'Lina_Mayert38@gmail.com', 'Architect', '2023-11-27 08:57:25', '2023-11-27 08:57:25', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `animals`
--
ALTER TABLE `animals`
  ADD PRIMARY KEY (`animal_id`),
  ADD UNIQUE KEY `animal_name` (`animal_name`),
  ADD UNIQUE KEY `animal_name_2` (`animal_name`),
  ADD KEY `area_id` (`area_id`);

--
-- Indexes for table `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`area_id`),
  ADD UNIQUE KEY `area_name` (`area_name`),
  ADD UNIQUE KEY `area_name_2` (`area_name`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`,`area_id`),
  ADD UNIQUE KEY `report_name` (`report_name`),
  ADD UNIQUE KEY `report_name_2` (`report_name`),
  ADD KEY `area_id` (`area_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD KEY `area_id` (`area_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `animals`
--
ALTER TABLE `animals`
  MODIFY `animal_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `areas`
--
ALTER TABLE `areas`
  MODIFY `area_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `animals`
--
ALTER TABLE `animals`
  ADD CONSTRAINT `animals_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas` (`area_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas` (`area_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas` (`area_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
