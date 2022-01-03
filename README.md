# App Details

This is a simple Posting application which shows how to do CRUD (Create, Read, Update, Delete) functions
using ReactJS + Redux + Firestore stack.

**A. Technologies Used**

1. ReactJS
2. Redux
3. Firebase - Firestore DB
4. Material UI + Bootstrap

**B. Features**

1. Advanced CRUD (Create, Read, Update, Delete)
2. Infinite Scrolling
3. Realtime Data synchronization
4. Mobile Responsive

**C. Demo**

https://simplepostingapp-mg.web.app/login
(There are chances that demo site might not be working due to daily quota restriction - I'm just using free Firebase plan lol)

Please feel free to use my code in this repository.
Note: You can't push changes in my repository due to resctriction. Please clone it or download it locally.

# Running in local environment

Before cloning repository, make sure to have Node.js installed in your machine.
You can check the latest stable node version in the link below.
[https://nodejs.org/en/download/]

After cloning repository,
In the project directory, do the ff. respectively:

1. Run **npm install**

This installs packages needed in the project.

2. Update **src/config/firebaseConfig.js**

This connects your own firebase-firestore database to this project.
Please check below links for references.

[https://firebase.google.com/docs/firestore/quickstart#web-version-8]
[https://sebhastian.com/react-firestore/#:~:text=Integrating%20Firestore%20to%20React%20app%201%20Signup%20for,Firestore%20is%20done%20through%20the%20get%20function.%20]

3. In your Firebase storage console, please create the following directories:
<pre>
📁 profilePhotos
   📁 defaultPhotos 
      (please upload all images under src/images in this folder)
      (please update image links in src/config/constants.js (DEFAULT_AVATAR_OPTIONS) w/ your own firebase storage links)
📁 postPhotos
</pre>

4. Run **npm start**

This runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Firestore DB Structure

<pre>
1. users
   → username [string]
   → password [string]
   → firstName [string]
   → lastName [string]
   → avatar [string]
   → initials [string]
   → createdAt [string]
   
2. posts
   → author [string]
   → content [string]
   → image [string]
   → createdAt [string]
   → updatedAt [string]
   → likes [array - string]
   → hiddenFrom [array - string]
   → comments [array - object]
      ↪︎ id [string]
      ↪︎ author [string]
      ↪︎ content [string]
      ↪︎ hiddenFrom [array - string]
      ↪︎ createdAt [string]
      ↪︎ updatedAt [string]
 </pre>

# Firestore Storage Structure

<pre>
1. profilePhotos - this is where uploaded profile photos are stored
2. postsPhotos - this is where uploaded photos from posts are stored
 </pre>

# Developer Information

I'm Mark Anjo S. Galisa, a senior developer in Accenture PH.
You can view more info about me in my portfolio below.

https://markanjogalisa.web.app/

Thank you and Happy coding!
