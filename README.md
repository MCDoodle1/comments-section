# Frontend Mentor - Interactive comments section solution

This is a solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

The challenge is to build out an interactive comments section and get it looking as close to the design as possible.

I built the project as a full stack (MERN) application including sign up and sign in functionality.

### The challenge

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments
- **Bonus**: Create a header and a responsive menu
- **Bonus**: Create sign up and sign in functionality
- **Bonus**: Use timestamps and dynamically track the time since the comment or reply was posted.

### Screenshot

![Screenshot desktop design](../src/assets/design/screenshot-desktop.pdf)
![Screenshot mobile design](../src/assets/design/screenshot-mobile.pdf)
![Screenshot warning modal](../src/assets/design/screenshot-modale.pdf)

### Links

- Solution URL: [GitHub Page](https://github.com/MCDoodle1/comments-section)
- Live Site URL: [MERN Comments Section](https://mcdoodle1.github.io/comments-section/)

## My process

I started by creating the pages, the routes and the header. Then I connected the app to MongoDB. I created the user model and the API to sign up. I set up Redux and then I created the sign up and sign in page UI and functionality. I created a posts page to render the comments and functionality to enter a new comment. Then I created the like/dislike API, functionality and UI, and created functionality to add a reply and delete and edit comments and replies. After this I decided to change to Redux Toolkit Thunks. I added the nested reply functionality and UI and also sign out functionality and UI. Lastly I added a hamburger menu for smaller screens and added the delete warning functionality and UI.

### Built with

- MongoDB
- Express
- React
- Node.js
- Redux Toolkit
- BEM for CSS
- Flexbox
- CSS Grid
- Responsive design

### What I learned

This was the first MERN stack project that I did without help of a tuturial. It was a 3 months journey in which I leared a lot about building a full stack app. I also learned a lot from implementing Redux Toolkit into the frontend.

### Continued development

In future projects I want to continue learning about full stack apps. I am not completely comfortable yet with Redux and want to broaden my knowledge of Redux.

### Useful resources

- [StackOverflow](https://stackoverflow.com/)
- [ChatGPT](https://chatgpt.com)

## Acknowledgments

[Shahand MERN stack tutorial](https://www.youtube.com/watch?v=VAaUy_Moivw)
I used Shahand Ghavidel's tutorial as basis for the authentication functionality in this project.

## Author

- Website - [Marco Clarijs](https://github.com/MCDoodle1)
- Frontend Mentor - [@MCDoodle1](https://www.frontendmentor.io/profile/MCDoodle1)
