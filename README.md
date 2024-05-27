# CodeVault

## Overview

I'm sure at some point you must have felt the need to save your small code snippets when working on someone else's machine, like in a lab or a shared workspace, and found GitHub too complicated for such small snippets.
Well , you've found the perfect repository.<br><br>
**CodeVault** is a web application designed for developers to store, manage, and share small code snippets. It offers features that go beyond simple storage, making it a versatile tool for developers who need quick access to reusable code pieces without the overhead of using platforms like GitHub for small snippets.

## Features

1. **JWT Authorization** - Secure your sessions with JSON Web Tokens.
2. **OAuth 2.0** - Login using Google or GitHub through Passport.js.
3. **Multi-language Support** - Save snippets in multiple programming languages.
4. **Code Editor** - Enjoy language-specific autocomplete suggestions.
5. **Image Downloads** - Download beautiful images of your code snippets.
6. **Clipboard Copy** - Copy your code snippets to the clipboard with one click.
7. **Pin Snippets** - Pin your favorite snippets to see them first.
8. **Community Building** - Follow other users and build your network.
9. **Explore Section** - Post your thoughts and share them with the community.
10. **Star/Favourite** - Star and favorite public snippets from other users.
11. **Rich Posts** - Use images in your posts.
12. **Engagement** - Upvote, downvote, and comment on posts.
13. **ChatRoom** - A Chatroom built using Websockets:
    designed with memory efficiency in mind and without the need for a
    database or browser caching for fast and efficient communication.
14. **Email Notifications** - Get notified via email using Nodemailer.
15. **Tech News** - Stay updated with the latest tech news.
16. **Tags** - Add tags to your snippets and posts for better visibility.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, Passport.js (OAuth 2.0)
- **Email Service**: Nodemailer
- **Deployment**: Vercel

## Architecture

The backend follows a Model-View-Controller (MVC) architecture, ensuring a clean separation of concerns and better maintainability.

## Deployed on

- [vercel](https://code-vault-new-frontend.vercel.app/)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YashwantBhosale/code-vault-new.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd code-vault-new
   ```

3. **Set up the server:**

   ```bash
   cd server
   npm install
   nodemon server.js
   ```

4. **Set up the client:**

   ```bash
   cd ../client
   npm install
   npm start
   ```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

- If you have suggestions for adding or removing features, feel free to [open an issue](https://github.com/YashwantBhosale/code-vault-new/issues/new) to discuss it, or directly create a pull request with necessary changes.
- Create individual PR for each suggestion.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## About the Developers

CodeVault is developed by **Yashwant Bhosale** and **Mehmood Deshmukh**

### Connect with Us

- LinkedIn: [Mehmood Deshmukh](https://www.linkedin.com/in/mehmood-deshmukh-93533a2a7/)
- LinkedIn: [Yashwant Bhosale](https://www.linkedin.com/in/yashwant-bhosale-4ab062292/)
- GitHub: [Mehmood Deshmukh](https://github.com/Mehmood-Deshmukh)
- GitHub: [Yashwant Bhosale](https://github.com/YashwantBhosale)

Feel free to reach out for collaboration, feedback, or just to say hi!

## Fun Fact

The first version of CodeVault, when it was just an initial concept, is still hosted and available [Here](https://code-vault-beta.vercel.app/). Check it out to see how far we've come!
