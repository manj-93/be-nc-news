# Northcoders News API

<h1>To run this project locally, you will set up environment variables in order to connect to your local databases.</h1>

Requirements:

<ul>
  <li>Node.js</li>
  <li>PostgreSQL</li>
  <li>dotenv (package that manages environment variables)</li>
</ul>

Run the following command to install dotenv:

```npm install -D dotenv```

Setting up environment variables:

You will need to create your own .env files to store your configuration as these are .gitignored and not included in the repository.

Create the following files in the root of your project and add the necessary code to connect to your local databases:
<ol>
<li><b>.env.test</b></li>
<li><b>.env.development</b></li>
</ol>

For example:

```.env.test includes "PGDATABASE=<your database>"```

Ensure that both files are linked correctly with the appropriate databases.

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
