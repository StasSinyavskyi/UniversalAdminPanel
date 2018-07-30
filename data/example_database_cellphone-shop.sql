-- phpMyAdmin SQL Dump
-- version 4.0.10.6
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Апр 04 2017 г., 21:08
-- Версия сервера: 5.5.41-log
-- Версия PHP: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `catalog`
--
CREATE DATABASE IF NOT EXISTS `catalog` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `catalog`;

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id_category` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `image` varchar(255) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '0',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `change_date` datetime NOT NULL,
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id_category`, `title`, `image`, `status`, `sort_order`, `change_date`) VALUES
(1, 'Планшет', 'category-notepad.png', 1, 1, '2017-03-26 00:00:00'),
(2, 'Мобильник', 'category-mobile.png', 1, 2, '0000-00-00 00:00:00'),
(3, 'Ноутбук', 'category-laptop.png', 1, 3, '2017-03-19 00:00:00');

-- --------------------------------------------------------

--
-- Структура таблицы `goods`
--

CREATE TABLE IF NOT EXISTS `goods` (
  `id_goods` int(11) NOT NULL AUTO_INCREMENT,
  `id_category` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` float NOT NULL DEFAULT '0',
  `tags` int(2) NOT NULL DEFAULT '0' COMMENT '1-Новинка, 2-Популярный, 3-Спецпредложение',
  `image` varchar(255) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '0',
  `change_date` datetime NOT NULL,
  PRIMARY KEY (`id_goods`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=31 ;

--
-- Дамп данных таблицы `goods`
--

INSERT INTO `goods` (`id_goods`, `id_category`, `title`, `description`, `price`, `tags`, `image`, `status`, `change_date`) VALUES
(1, 1, 'Планшет 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 1000, 2, 'img-123-1-max.png', 1, '2017-04-03 00:00:00'),
(2, 1, 'Планшет 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 4000, 3, 'mobila.jpg', 1, '0000-00-00 00:00:00'),
(3, 1, 'Планшет 3', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 23077, 3, 'mobila.jpg', 1, '0000-00-00 00:00:00'),
(4, 1, 'Планшет 4', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 10000, 2, 'mobila.jpg', 1, '0000-00-00 00:00:00'),
(5, 1, 'Планшет 5', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 3000, 1, 'mobila.jpg', 1, '2017-02-01 00:00:00'),
(6, 1, 'Планшет 6', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 452, 3, 'mobila.jpg', 1, '0000-00-00 00:00:00'),
(7, 1, 'Планшет 7', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 22333, 0, 'mobila.jpg', 1, '2017-03-26 00:00:00'),
(8, 1, 'Планшет 8', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 3200, 1, 'mobila.jpg', 1, '0000-00-00 00:00:00'),
(9, 1, 'Планшет 9', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 1200, 0, 'mobila.jpg', 1, '0000-00-00 00:00:00'),
(10, 1, 'Планшет 10', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 350, 1, 'mobila.jpg', 1, '0000-00-00 00:00:00'),
(11, 2, 'Мобила 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 800, 2, 'mobila1.png', 1, '2017-02-24 00:00:00'),
(12, 2, 'Мобила 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 600, 3, 'mobila1.png', 1, '0000-00-00 00:00:00'),
(13, 2, 'Мобила 3', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 1500, 0, 'mobila1.png', 1, '0000-00-00 00:00:00'),
(14, 2, 'Мобила 4', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 2100, 1, 'mobila1.png', 1, '0000-00-00 00:00:00'),
(15, 2, 'Мобила 5', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 4000, 2, 'mobila1.png', 1, '0000-00-00 00:00:00'),
(16, 2, 'Мобила 6', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 1400, 2, 'mobila1.png', 1, '2017-03-01 00:00:00'),
(17, 2, 'Мобила 7', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 700, 1, 'mobila1.png', 1, '0000-00-00 00:00:00'),
(18, 2, 'Мобила 8', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 5500, 0, 'mobila1.png', 1, '2017-03-13 00:00:00'),
(19, 2, 'Мобила 9', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 2700, 3, 'mobila1.png', 1, '0000-00-00 00:00:00'),
(20, 2, 'Мобила 10', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 4345, 1, 'mobila1.png', 1, '0000-00-00 00:00:00'),
(21, 3, 'Ноутбук 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 19000, 0, 'mobila2.jpg', 1, '0000-00-00 00:00:00'),
(22, 3, 'Ноутбук 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 12999, 2, 'mobila2.jpg', 1, '0000-00-00 00:00:00'),
(23, 3, 'Ноутбук 3', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 10000, 3, 'mobila2.jpg', 1, '0000-00-00 00:00:00'),
(24, 3, 'Ноутбук 4', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 31000, 1, 'mobila2.jpg', 1, '0000-00-00 00:00:00'),
(25, 3, 'Ноутбук 5', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 13699, 3, 'mobila2.jpg', 1, '0000-00-00 00:00:00'),
(26, 3, 'Ноутбук 6', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 16888, 3, 'mobila2.jpg', 1, '2017-03-13 00:00:00'),
(27, 3, 'Ноутбук 7', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 25000, 2, 'mobila2.jpg', 1, '0000-00-00 00:00:00'),
(28, 3, 'Ноутбук 8', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 18000, 2, 'mobila2.jpg', 1, '0000-00-00 00:00:00'),
(29, 3, 'Ноутбук 9', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 21000, 1, 'mobila2.jpg', 1, '2017-03-22 00:00:00'),
(30, 3, 'Ноутбук 10', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra mattis mi ac vehicula. Vestibulum purus mi, laoreet vitae mollis vitae, congue vehicula ex. Cras non orci eget mauris elementum aliquet. Integer fringilla congue quam, ac ultrices diam placerat vel. Phasellus placerat libero eu ligula condimentum, sit amet hendrerit tortor malesuada. Etiam tempor enim nisi, quis malesuada urna vestibulum id. Integer orci lacus, sodales sed feugiat nec, iaculis non ipsum.\r\n\r\nPhasellus a neque vel mauris dignissim tristique quis id nisi. Etiam lobortis, eros quis feugiat ornare, mi nisl ullamcorper nulla, ac tempor augue ex in nisl. Sed dictum pulvinar nunc.', 45000, 3, 'mobila2.jpg', 1, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Структура таблицы `goods_attachments`
--

CREATE TABLE IF NOT EXISTS `goods_attachments` (
  `id_goods_attachment` int(11) NOT NULL AUTO_INCREMENT,
  `id_goods` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` int(1) NOT NULL COMMENT '0-image, 1-video',
  `change_date` datetime NOT NULL,
  PRIMARY KEY (`id_goods_attachment`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Дамп данных таблицы `goods_attachments`
--

INSERT INTO `goods_attachments` (`id_goods_attachment`, `id_goods`, `name`, `type`, `change_date`) VALUES
(2, 1, 'img-123-2-max.png', 0, '2017-04-02 00:00:00'),
(3, 1, 'img-123-3-max.png', 0, '2017-04-02 00:00:00'),
(4, 1, 'img-123-4-max.png', 0, '2017-04-02 00:00:00'),
(5, 1, 'img-123-5-max.png', 0, '2017-04-02 00:00:00'),
(6, 1, 'video11.mp4', 1, '2017-04-02 00:00:00');

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `id_order` int(11) NOT NULL AUTO_INCREMENT,
  `id_goods` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `date_order` datetime NOT NULL,
  `closed` int(1) NOT NULL COMMENT '0-открыт, 1-закрыт',
  `quantity` int(11) NOT NULL,
  `change_date` datetime NOT NULL,
  PRIMARY KEY (`id_order`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id_order`, `id_goods`, `name`, `email`, `phone`, `date_order`, `closed`, `quantity`, `change_date`) VALUES
(1, 2, 'eeeeeeeeeeeeeeeee', 'stas@example.com', '1221121112', '2017-03-22 15:09:38', 0, 1, '2017-03-22 15:09:38'),
(2, 10, 'Алекс', 'wwww@tt.tt', '12345678', '2017-03-28 11:08:14', 0, 1, '2017-03-28 11:08:14'),
(3, 10, 'Карбон', 'ttt@pp.tt', '123456789', '2017-03-28 11:11:55', 0, 1, '2017-03-28 11:11:55'),
(4, 10, 'wwwww', 'ww@ex.ii', '1234567899', '2017-03-28 11:16:17', 0, 1, '2017-03-28 11:16:17');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` int(1) NOT NULL,
  `image` varchar(255) NOT NULL,
  `change_date` datetime NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id_user`, `name`, `email`, `password`, `is_admin`, `image`, `change_date`) VALUES
(1, 'Test', 'test@example.com', '827ccb0eea8a706c4c34a16891f84e7b', 1, 'ava1.png', '0000-00-00 00:00:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
