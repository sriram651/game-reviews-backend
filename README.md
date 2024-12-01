# Game Review App (Backend)

This repository contains the backend for a game review application, built using **Apollo Server** and **MongoDB**. It provides an API for managing user authentication, game listings, user reviews, and ratings.

## Features

- **User Authentication**:
  - Users can register and log in with a username and password (no email verification).
  - The backend generates and verifies JWT tokens for secure user sessions.

- **Game Listings**:
  - Manages and serves a list of games with associated details.

- **Game Details**:
  - Provides detailed information about each game, including:
    - Description of the game.
    - User reviews.
    - Overall rating of the game.

- **User Reviews**:
  - Users can submit reviews for games.
  - Reviews can be upvoted or downvoted by other users.

- **Rating System**:
  - The overall rating of a game is calculated based on user star ratings.

## Technologies Used

- **Apollo Server** (GraphQL server)
- **MongoDB** (Database for storing users, games, reviews, and ratings)
- **JWT** (For user authentication)
- **GraphQL** (For querying and mutating data)

## Setup

### Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v14 or above)
- **npm** or **yarn** (package managers)
- **MongoDB** (Local or cloud instance)

### Installation

1. Clone the repository:
   ```bash
   git clone [<repository-url>](https://github.com/sriram651/graphql-server.git)
   ```
2. Install Dependencies:
   ```bash
   cd graphql-server
   npm install
   ```
3. Run the Development server:
   ```bash
   npm start
   ```
4. Add Env:
   - Create a Mongo DB Cluster of your own and place it in the `.env` file for the variable `MONGODB_URI`
