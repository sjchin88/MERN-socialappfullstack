<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** markdown "reference style" links 
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!--<a href="">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>-->

  <h1 align="center">SociusApp-backend</h1>

  <p align="center">
    An ongoing, experimental social media app project from me
    <br />
    <a href="https://github.com/sjchin88/SociusApp-backend/tree/develop/docs"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <!--<a href=>View Demo</a>
    ·
    <a href=>Report Bug</a>
    ·
    <a href=>Request Feature</a>-->
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<!--[![Product Name Screen Shot][product-screenshot]](https://example.com)-->

This is the backend for a social media application project built mainly based on MERN (Mongo DB, Express, React, Node.js). 

The project structure followed the following course in Udemy: https://www.udemy.com/course/node-with-react-build-deploy-a-fullstack-web-application/ 
with some ongoing improvement feature of my own.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

#### Development Environment
| Environment      | Description |
| ----------- | ----------- |
| Operating System      | Windows 10 Home Edition (for main code) and Ubuntu 22.04.1 LTS (to run the redis server)      |
| IDE                |visual studio code |
|Browser            | Chrome |
|Main language     | typescript (note the front-end is developed using javascript)|

#### Main Tools 
| Main Tool      | Description of Usage |
| ----------- | ----------- |
| AWS | Cloud computing platform, used for hosting the backend and frontend |
| CircleCI | CI/CD platform |
| Cloudinary | for image and video upload |
| MongoDB | for database |
| NodeJS | for Javascript runtime development |
| Redis | In-memory cache management |
| Sendgrid| for email delivery |
| Terraform  | Infrastructure as code tool for AWS |

#### Main npm libraries used

For complete lists of dependencies and development dependencies you can refer to the package.json file here (https://github.com/sjchin88/chatapp-backend/blob/develop/package.json). 

Figure below illustrate hows the main tools and libraries work together to deliver the core functionality of the back end. 

| NPM Library      | Description of Usage |
| ----------- | ----------- |
| bull, bullmq, @bull-board/express, @bull-board/ui  | manage the jobs involving database in queue |
| @faker-js/faker   | generate test data for testing |
| @jest/types   | main testing tool |
| axios  | make http requests from node.js, used for health check and seeding random data |
| bcryptjs  | for password encryption |
| bunyan  | for json logging |
| compression  | compression middleware for node.js, used to compress (and thus decrease) the downloadable amount of data send to users |
| cookie-session, cors, helmet, hpp  | cookie-session : store client's cookie on server side,  cors: for CORS, helmet: setting secure options for various HTTP headers, hpp: Express middleware to protect against HTTP Parameter Pollution attacks |
| dotenv  | manage environment keys |
| ejs, nodemailer  | ejs: render email templates, nodemailer: handling email communications |
| ip  | get the ip address |
| joi  | for form input validations |
| jsonwebtoken  | for JSON Web Token (JWT) |
| lodash   | javascript tools help with common data structures operations around arrays, strings, objects |
| moment  | to manipulate date |
| socket.io   | manage socket connection, can be used to send immediate feedback to client's request |
| swagger-stats  | manage website traffic statistic to the backend  |
| typedoc  | generate documentation |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

You can run the backend on your local machine for testing. 
The following installation and set up guides is for running the backend app using visual studio code. 

### Prerequisites

1. Install NodeJS.  https://nodejs.org/en/
2. Installing npm
* npm
  ```sh
  npm install npm@latest -g
  ```
3. Install MongoDB. https://www.mongodb.com/docs/manual/administration/install-community/
4. Install MongoDB Compass. https://www.mongodb.com/try/download/compass
5. Install Redis. https://redis.io/docs/getting-started/installation/ (Useful video to install - https://www.youtube.com/watch?v=_nFwPTHOMIY)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages 
   ```sh
   npm install
   ```
3. Create a .env file under project root folder. With the following settings

### .env configuration
| .env key     | value |
| ----------- | ----------- |
|DATABASE_URL | 'mongodb://127.0.0.1:27017/chatapp-backend'|
|JWT_TOKEN | 'thisisatokenfromme' |
|NODE_ENV | 'development'|
|SECRET_KEY_ONE | 'thisisasecretcookiekey'|
|SECRET_KEY_TWO | 'thisisanothersecretcookiekey'|
|CLIENT_URL | 'http://localhost:3000'|
|API_URL | 'http://localhost:5000/api/v1'|
|REDIS_HOST| = 'redis://127.0.0.1:6379' |
|CLOUD_NAME| <your cloudinary cloud name> |
|CLOUD_API_KEY|<your cloudinary API key> |
|CLOUD_API_SECRET|<your cloudinary API secret key> |
|SENDER_EMAIL| <your email account used for testing> |
|SENDER_EMAIL_PASSWORD|<your email account password> |
|SENDGRID_API_KEY| < your sendgrid api key> |
|SENDGRID_SENDER|< your sendgrid account> |
|EC2_URL|http://169.254.169.254/latest/meta-data/instance-id|

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## TODO Roadmap

- [ ] Deploy backend application to AWS (target by end of Jan)
- [ ] Features Addition:
    - [ ] delete comments
- [ ] Improvements:
    - [ ] on how datas are add, retrieve and edit in the backend
- [ ] Multi-language Support
    - [ ] Chinese

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

My linkedin - [https://www.linkedin.com/in/shiang-jin-chin-b1575944/](https://www.linkedin.com/in/shiang-jin-chin-b1575944/)

Project Link: [https://github.com/sjchin88/SociusApp-backend](https://github.com/sjchin88/SociusApp-backend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [An awesome README template](https://github.com/othneildrew/Best-README-Template)
* [Udemy: Node with React: Build & Deploy a Fullstack Web Application](https://www.udemy.com/course/node-with-react-build-deploy-a-fullstack-web-application/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
