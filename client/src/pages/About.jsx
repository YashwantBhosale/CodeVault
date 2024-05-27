import React from "react";

const About = () => {
  return (
    <div className="w-[90%] md:w-[60%] mt-[12vh] mx-auto mb-[10vh]">
      <h1 className="text-4xl text-center font-bold mb-8">About CodeVault</h1>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Overview</h2>
        <p className="text-lg leading-relaxed">
          At some point, every developer has felt the need to save small code
          snippets while working on someone else's machine, like in a lab or a
          shared workspace, only to find GitHub too cumbersome for such small
          tasks.<br></br>
          <br></br>
          <strong>CodeVault</strong> is the perfect solution. CodeVault is a web
          application designed specifically for developers to store, manage, and
          share small code snippets efficiently. It provides features that
          extend beyond simple storage, making it a versatile tool for
          developers needing quick access to reusable code without the overhead
          of more complex platforms like GitHub.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Features</h2>
        <ul className="list-disc pl-5 space-y-2 text-lg">
          <li>
            <strong>JWT Authorization:</strong> Secure your sessions with JSON
            Web Tokens.
          </li>
          <li>
            <strong>OAuth 2.0:</strong> Login using Google or GitHub through
            Passport.js.
          </li>
          <li>
            <strong>Multi-language Support:</strong> Save snippets in multiple
            programming languages.
          </li>
          <li>
            <strong>Code Editor:</strong> Enjoy language-specific autocomplete
            suggestions.
          </li>
          <li>
            <strong>Image Downloads:</strong> Download beautiful images of your
            code snippets.
          </li>
          <li>
            <strong>Clipboard Copy:</strong> Copy your code snippets to the
            clipboard with one click.
          </li>
          <li>
            <strong>Pin Snippets:</strong> Pin your favorite snippets to see
            them first.
          </li>
          <li>
            <strong>Community Building:</strong> Follow other users and build
            your network.
          </li>
          <li>
            <strong>Explore Section:</strong> Post your thoughts and share them
            with the community.
          </li>
          <li>
            <strong>Star/Favourite:</strong> Star and favorite public snippets
            from other users.
          </li>
          <li>
            <strong>Rich Posts:</strong> Use images in your posts.
          </li>
          <li>
            <strong>Engagement:</strong> Upvote, downvote, and comment on posts.
          </li>
          <li>
            <strong>Chatroom:</strong>A Chatroom built using Websockets:
            designed with memory efficiency in mind and without the need for a
            database or browser caching for fast and efficient communication.
          </li>
          <li>
            <strong>Email Notifications:</strong> Get notified via email using
            Nodemailer.
          </li>
          <li>
            <strong>Tech News:</strong> Stay updated with the latest tech news.
          </li>
          <li>
            <strong>Tags:</strong> Add tags to your snippets and posts for
            better visibility.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
        <ul className="list-disc pl-5 space-y-2 text-lg">
          <li>
            <strong>Frontend:</strong> React, Tailwind CSS
          </li>
          <li>
            <strong>Backend:</strong> Node.js, Express
          </li>
          <li>
            <strong>Database:</strong> MongoDB
          </li>
          <li>
            <strong>Authentication:</strong> JWT, Passport.js (OAuth 2.0)
          </li>
          <li>
            <strong>Email Service:</strong> Nodemailer
          </li>
          <li>
            <strong>Deployment:</strong> Vercel
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Architecture</h2>
        <p className="text-lg leading-relaxed">
          The backend follows a Model-View-Controller (MVC) architecture,
          ensuring a clean separation of concerns and better maintainability.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
        <ol className="list-decimal pl-5 space-y-2 text-lg">
          <li>
            <strong>Clone the repository:</strong>
          </li>
          <pre className="bg-gray-100 w-fit p-2 rounded text-wrap">
            git clone https://github.com/ YashwantBhosale/code-vault-new.git
          </pre>
          <li>
            <strong>Navigate to the project directory:</strong>
          </li>
          <pre className="bg-gray-100 p-2 rounded">cd code-vault-new</pre>
          <li>
            <strong>Set up the server:</strong>
          </li>
          <pre className="bg-gray-100 p-2 rounded">
            cd server
            <br />
            npm install
            <br />
            nodemon server.js
          </pre>
          <li>
            <strong>Set up the client:</strong>
          </li>
          <pre className="bg-gray-100 p-2 rounded">
            cd ../client
            <br />
            npm install
            <br />
            npm start
          </pre>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Contributing</h2>
        <p className="text-lg leading-relaxed">
          Contributions are what make the open source community such an amazing
          place to learn, inspire, and create. Any contributions you make are{" "}
          <strong>greatly appreciated</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-lg">
          <li>
            If you have suggestions for adding or removing features, feel free
            to{" "}
            <a
              href="https://github.com/YashwantBhosale/code-vault-new/issues/new"
              className="text-blue-600 hover:underline"
            >
              open an issue
            </a>{" "}
            to discuss it, or directly create a pull request with necessary
            changes.
          </li>
          <li>Create individual PR for each suggestion.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Creating A Pull Request</h2>
        <ol className="list-decimal pl-5 space-y-2 text-lg">
          <li>Fork the Project</li>
          <li>
            Create your Feature Branch (
            <code>git checkout -b feature/AmazingFeature</code>)
          </li>
          <li>
            Commit your Changes (
            <code>git commit -m 'Add some AmazingFeature'</code>)
          </li>
          <li>
            Push to the Branch (
            <code>git push origin feature/AmazingFeature</code>)
          </li>
          <li>Open a Pull Request</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">About the Developers</h2>
        <p className="text-lg leading-relaxed">
          CodeVault is developed by <strong>Yashwant Bhosale</strong> and{" "}
          <strong>Mehmood Deshmukh</strong>.
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-lg">
            <strong>Connect with Us:</strong>
          </p>
          <p className="text-lg">
            <a
              href="https://www.linkedin.com/in/mehmood-deshmukh-93533a2a7/"
              className="text-blue-600 hover:underline"
            >
              Mehmood Deshmukh
            </a>{" "}
            (LinkedIn)
          </p>
          <p className="text-lg">
            <a
              href="https://www.linkedin.com/in/yashwant-bhosale-4ab062292/"
              className="text-blue-600 hover:underline"
            >
              Yashwant Bhosale
            </a>{" "}
            (LinkedIn)
          </p>
          <p className="text-lg">
            <a
              href="https://github.com/Mehmood-Deshmukh"
              className="text-blue-600 hover:underline"
            >
              Mehmood Deshmukh
            </a>{" "}
            (GitHub)
          </p>
          <p className="text-lg">
            <a
              href="https://github.com/YashwantBhosale"
              className="text-blue-600 hover:underline"
            >
              Yashwant Bhosale
            </a>{" "}
            (GitHub)
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Fun Fact</h2>
        <p className="text-lg leading-relaxed">
          The first version of CodeVault, when it was just an initial concept,
          is still hosted and available{" "}
          <a
            href="https://code-vault-beta.vercel.app/"
            className="text-blue-600 hover:underline"
          >
            Here
          </a>
          . Check it out to see how far we've come!
        </p>
      </section>
    </div>
  );
};

export default About;
