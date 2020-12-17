# Study Spots!

A **responsive web application** built using **React** & utilizing **Google API's** to discover local study spots based on certain criteria. The Popular Times API is used to quickly list spots based on how busy a spot currently is. Users can create accounts to save favorite study spots. A database hosted on **Heroku** is used to store user data. **Google Firebase** authentication will be used to create accounts.

now live! https://study-spots-uark.herokuapp.com


# Running the Application

To run locally, we need to start the backend server in addition to the react app. Please use these steps:
	
1. cd into **root project** folder StudySpotsFrontEnd
2. enter `npm install` to install the new packages used in the server. this must be done in the **root folder** 
3. enter `npm test` in the terminal. this starts the backend server which will handle requests to localhost:5000/poptimes
4. open a new terminal **(do not close the first one)**
5. cd into **react-ui**
6. enter `npm install` in the terminal, then `npm start` to start the react app

