# yelpCamp
YelpCamp is a Node.js web application that follows the functionalities of yelp for camping locations.

## Live Demo
To run the app, go to [https://hmalik.herokuapp.com/](https://hmalik.herokuapp.com/)

## Features

* Responsive Web Design
  - The web application is responsive and can be viewed appropriately via various types of devices.

* Authentication
  - A user can sign-up/sign-in with username and password.

* Authorization
  - Campgrounds can only be edited/deleted by the user who posted them.
  - Comments can only be edited/deleted by the user who posted them.
  
* Functionalities of Campground posts
  - A Campground contains a title, price, image, description and location.
  - A user can create, edit and delete campgrounds and the comments associated with it.
  - Campground locations are show via Google Maps.
  
## Getting Started
Within the app are API secrets and passwords that have been hidden for security reasons due to which the google maps feature may not work on your local machine.

### Install dependencies

```sh
npm install
```

or

```sh
yarn install
```

## Built with

### Front-end
* [ejs](http://ejs.co/)
* [Google Maps APIs](https://developers.google.com/maps/)
* [Bootstrap](https://getbootstrap.com/docs/3.3/)

### Back-end
* [express](https://expressjs.com/)
* [express-session](https://github.com/expressjs/session#express-session)
* [method-override](https://github.com/expressjs/method-override#method-override)
* [mongoDB](https://www.mongodb.com/)
* [mongoose](http://mongoosejs.com/)
* [connect-flash](https://github.com/jaredhanson/connect-flash#connect-flash)
* [passport](http://www.passportjs.org/)
* [passport-local](https://github.com/jaredhanson/passport-local#passport-local)
* [moment](https://momentjs.com/)
* [geocoder](https://github.com/wyattdanger/geocoder#geocoder)

### Platforms
* [Heroku](https://www.heroku.com/)
* [Cloud9](https://aws.amazon.com/cloud9/?origin=c9io)
