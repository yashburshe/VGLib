# Design Document for VGLib

By Ben Piperno and Yash Mahesh Burshe

## Project Description

VGLib is a web platform that provides a comprehensive catalogue of videogames across multiple platforms such as the PlayStation Store, Steam, Epic Games, Nintendo eShop, Xbox, and other physical editions. Users can browse through data on games and create personalized lists for their own purposes, such as owned games, wishlists, and games they enjoy watching streamed.

## User Personas

### Alex - Videogame Collector
- Likes to compare games they've enjoyed playing with their friends
- Owns several consoles and would like to shop across all platforms

### Jordan - Birthday e-Shopper
- Wants to keep a wishlist of games handy to buy when they get the opportunity
- Wants to track games they already bought so as to not buy them again on different platforms accidentally

### Riley - Stream Watcher
- Follows a variety of games on different streaming platforms
- Likes to share recommendations and discover new games and streamers
- Would like a platform to explore what games are popular and are being played

## User Stories

### 1. Lists (Alex)

* As Alex, I want to have predefined “Favorites”, “Wishlist”, “Owned” lists, so that I can quickly add games to my favorites and wishlist.

* As Alex, I want to be able to create a custom list and have it show up on my profile and the universal lists list page, so that I can organize my games

* As Alex, As I browse games, I want to add them to my recently used lists with 1 or 2 clicks

* As Alex, I want to be able to delete games from my lists, so that I can keep my lists up to date

* As Alex, I want to be able to view list details and all the games added to that list, so I can keep track of which games I have in which list

### 2. User Accounts (Jordan)

* As Jordan, I want to sign up for an account to access my personal lists

* As Jordan, I want to login to my account

* As Jordan, I want to update my account information

* As Jordan, I want to view my account information

* As Jordan, I want to delete my account.

### 3. Pre-defined public lists (Riley)

* As Riley, I want to view pre-defined lists of videogames based on the data of other users without logging in including “Favorites”, “Wishlist”, “Popular”

    * Favorites -games included in user’s “Favorites” list, ordered in descending order of count when aggregated across all users

    * Wishlist - Games sorted by descending of how many times they were added to the default wishlist list

    * Popular - Games sorted by descending order of how many times they were added to any list

### 4. Videogame Search (Alex)

* As Alex, I want to be able to search for video games by name, platform, and other metadata

* As Alex, once I search for a videogame, I want to view details related to it on a videogame page.

* As Alex, I want to add new and obscure videogames to the data repository once they’re available

* As Alex, I want to be able to delete a videogame I create from the data repository

* As Alex, I want to be able to update a videogame’s information that I created from the data repository

## API Routes

### Videogames

TBD

### Lists

TBD

### Users

TBD

## Design Mockups

![Home Page]("/assets/images/Home.jpg")
![Top Games]("/assets/images/Top_Games.jpg")
![Lists Page]("/assets/images/List.jpg)
![Users Page]("/assets/images/users_Page.jpg")
![Profile]("/assets/images/Profile.jpg")

![VideoGame]("/assets/images/Videogame.jpg)
![New Game]("/assets/images/New_Game.jpg")
![Edit Game]("/assets/images/Edit_Game.jpg")
![Delete Game]("/assets/images/Delete_Game.jpg)

![Lists]("/assets/images/List.jpg")
![Add to List]("/assets/images/Add_to_List.jpg")
![Edit List]("/assets/images/Edit_List.jpg)
![New List]("/assets/images/New_List.jpg")
![Delete List]("/assets/images/Delete_List.jpg")


