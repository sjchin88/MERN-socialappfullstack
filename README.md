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
    <a href=><strong>Explore the docs »</strong></a>
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

[![Product Name Screen Shot][product-screenshot]](https://example.com)

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

<ul>
<li> AWS                   - Cloud computing platform </li>
<li> CircleCI              - CI/CD platform </li>
<li> Cloudinary            - for image and video upload </li>
<li> MongoDB(v6.0.3)       - for database </li>
<li> NodeJS (v19.3.0)      - for Javascript runtime development</li>
<li> Redis                 - In-memory cache (Useful video to install - https://www.youtube.com/watch?v=_nFwPTHOMIY) </li>
<li> Sendgrid              - for email delivery </li>
<li> Terraform             - Infrastructure as code tool for AWS </li>
</ul>

#### Main npm libraries used

For complete lists of dependencies and development dependencies you can refer to the package.json file here (https://github.com/sjchin88/chatapp-backend/blob/develop/package.json). 

Figure below illustrate hows the main tools and libraries work together to deliver the core functionality of the back end. 

<ul>
<li> bull, bullmq, @bull-board/express, @bull-board/ui               - manage the jobs involving database in queue </li>
<li> @faker-js/faker                                                 - generate test data for testing </li>
<li> @jest/types                                                     - main testing tool </li>
<li> axios                                                           - make http requests from node.js, used for health check and seeding random data </li>
<li> bcryptjs                                                        - for password encryption </li>
<li> bunyan                                                          - for json logging </li>
<li> compression                                                     - compression middleware for node.js, used to compress (and thus decrease) the downloadable amount of data send to users </li>
<li> cookie-session, cors, helmet, hpp,                              - cookie-session : store client's cookie on server side,  cors: for CORS, helmet: setting secure options for various HTTP headers, hpp: Express middleware to protect against HTTP Parameter Pollution attacks</li>
<li> dotenv                             - manage environment keys</li>
<li> ejs, nodemailer  - ejs: render email templates, nodemailer: handling email communications</li>
<li> ip                             - get the ip address</li>
<li> joi                             - for form input validations</li>
<li> jsonwebtoken                             - for JSON Web Token (JWT)</li>
<li> lodash                             - javascript tools help with common data structures operations around arrays, strings, objects</li>
<li> moment                            - to manipulate date</li>
<li> socket.io                           </li>
<li> swagger-stats                       </li>
</ul>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

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
