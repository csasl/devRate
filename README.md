# Rate My Condo
![](screenshots/readme.jpg)

Rate my Condo Vancouver is a website for Vancouver residents to share information about and review their condo developments.

This project was created using Node.js, MongoDB, Express and Bootstrap. Passport.js was used to provide user authentication and deployed with Heroku.

A live demo of the app can be found here: https://damp-reef-03560.herokuapp.com/

## Features
* Users can add a new condo, sharing information about the approximate rent per month, amenities available, developer information and whether their condo is pet friendly.
* Users can edit information about a condo they have submitted
* Users can rate the development on a scale from 1-5 stars
* Users can leave comments relating to the condo development

## Run it locally
1. Install [mongodb] 
2. Create a Cloudinary account to get an API key and secret code
3. Obtain a Google Maps API key from the Google Maps platform

```
git clone https://github.com/csasl/devRate.git
cd devRate
npm install 
```
Create a .env file in the root of the project and add your Cloudinary and Google Maps API keys as follows:

```
DATABASEURL='<URL>'
API_KEY='<key>'
API_SECRET='<secret>'
GEOCODER_API_KEY='<key>'
```
Run mongod in one terminal and node app.js in another

Then go to [localhost:3000](http://localhost:3000/)
