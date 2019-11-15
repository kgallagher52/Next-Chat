# Next-Chat
  This application is a fun application showing the full use of Next.JS with an express server with full authentication using passport & mongoDB database credit. 
  Live Site: https://fullstack-next-chat.herokuapp.com/


# Start Up

  1. Clone this repo with `git clone https://github.com/kgallagher52/Next-Chat.git`
  2. Install dependencies (`npm install` or `yarn install`)
  3. Go to [MLab](mlab.com) and create a new (free) database
  4. Copy the Database URI to connect using the Mongo Driver
  5. Change your .env.default file to just .env and paste the copied uri as the value for MONGO_URI in .env
  6. Add any random string for the SESSION_SECRET entry in your .env file
  7. Run with `npm run dev` or `yarn dev`
  8. Server should be listening on localhost:3000

## Technologies

  1. Next.JS
  2. MongoDB
  3. Passport
  4. Express
  5. Node
  6. MaterilUI
  7. Heroku

## Default .env
  ```
    MONGO_URI=
    SESSION_SECRET=
    PRODUCTION_URL=
    PORT=3000
    NODE_ENV=

  ```
### Sources

    1. Credit: https://github.com/reedbarger/next-connect
    2. https://www.udemy.com/course/universal-react-with-nextjs-the-ultimate-guide/learn/lecture/12505212#overview
    3. Mlab (mlab.com)
