# movie-recommender
An AI movies recommender based on the users' mood.

<img width="320" alt="screenshot 29" src="https://user-images.githubusercontent.com/42312407/45672583-344c3000-bb31-11e8-9845-a9d8e2bb0c2d.png">

[Try The Demo](https://techfatenproject.mybluemix.net/)


This chtbot will interacts with the user trying to extract her/his mood. The user input will be analyzed by [Waston Tone Analyzer](https://console.bluemix.net/docs/services/tone-analyzer/index.html#about) to understand users’ emotions and mood. Based on the resulting analysis, suggested movies will be presented in the chatbot.


## Flow

![picture1](https://user-images.githubusercontent.com/42312407/45677192-454e6e80-bb3c-11e8-955d-77c9280cce2a.png)

1. The user writes a message to the chatbot.
2. The chatbot uses the Watson Assistant service to interact with the user. 
3. The Watson Tone Analyzer service analyze user mood.
4. The application request a specific movies genders based on user mood. 


## Included components

* [IBM Watson Assistant](https://www.ibm.com/watson/developercloud/conversation.html): Build, test and deploy a bot or virtual agent across mobile devices, messaging platforms, or even on a physical robot.
* [Waston Tone Analyzer](https://console.bluemix.net/docs/services/tone-analyzer/index.html#about): Understand emotions and communication style in text.
* [Cloud Foundry](http://cloudfoundry.org/): Build, deploy, and run applications on an open source cloud platform.

## Featured technologies

* [Cognitive](https://developer.ibm.com/watson/): Watson is a cognitive technology that can think like a human.
* [Node.js](https://nodejs.org/): An open-source JavaScript run-time environment for executing server-side JavaScript code.

# Steps

1. [Sign up on IBM Cloud](#1-sign-up-on-ibm-cloud)
2. [Clone the repo](#2-clone-the-repo)
3. [Create Watson Assistant service with IBM Cloud](#3-create-watson-assistant-service-with-ibm-cloud)
4. [Create Watson Tone Analyzer service with IBM Cloud](#4-create-watson-tone-analyzer-service-with-ibm-cloud)
5. [Run the application](#5-run-the-application)

### 1. Sign up on IBM Cloud

If you do not already have an IBM Cloud account, [sign up for IBM Cloud](https://ibm.biz/clouddayalfaisal).

### 2. Clone the repo

1. Click `Clone or download` button. Then, `Download ZIP`.

<img width="264" alt="screenshot 30" src="https://user-images.githubusercontent.com/42312407/45756057-9a67ae80-bc28-11e8-8e4b-7b3fe54434f3.png">

2. Right click on the downloaded `.zip` folder and click `Extract All`.

### 3. Create watson assistant service with IBM Cloud

1. Log into [IBM Cloud](http://bluemix.net/) with your account.
2. Create `Conversation` service.
  - From the top bar menu, click `Catalog`.
  - On the left menu, select `AI`.
  - Select `Watson Assistant`.
  - Click `Create`.
3. Once the application is created, click `View credentials` to copy your username and password into the code in `.env`:

```
CONVERSATION_USERNAME= {username}
CONVERSATION_PASSWORD= {password}
```
![ezgif com-crop](https://user-images.githubusercontent.com/42312407/45741801-3087de80-bc01-11e8-8e22-fe1542972709.gif)


4. Click on `Launch tool` to open the tool.
5. Import Jason file to your workspace
- Select Workspace.
- Click on import icon to import the wrokspace.
- Click on `Choose a file` and choose the Jason file.
    
```
C:\Users\%username%\Downloads\movie-matching\workspace.json
```


- Click on `Import`



![ezgif com-video-to-gif 2](https://user-images.githubusercontent.com/37486654/45158475-cdec1700-b1ec-11e8-8e07-1f0bed598265.gif)


### 4. Create watson tone analyzer service with IBM Cloud

1. Log into [IBM Cloud](http://bluemix.net/) with your account.
2. Create `Tone Analyzer` service.
  - From the top bar menu, click `Catalog`.
  - On the left menu, select `AI`.
  - Select `Tone Analyzer`.
  - Click `Create`.
3. Once the application is created, go into the application and select `Service credentials`.
4. Click `View credentials` to copy your username and password into the code in `.env`:

```
TONE_ANALYZER_USERNAME= {username}
TONE_ANALYZER_PASSWORD= {password}
```

![ezgif com-crop](https://user-images.githubusercontent.com/42312407/45741801-3087de80-bc01-11e8-8e22-fe1542972709.gif)

### 5. Run the application
 
1. In the project root directory, open the `manifest.yml` file:

  * In the `applications` section of the `manifest.yml` file, change the `name` value to a unique name for your version of the demo app.
  * In the `services` section, specify the name of the Assistant service instance and Tone Analyzer service instance that you created. If you do not remember the service name, use the `cf services` command to list all services you have created.

  The following example shows a modified `manifest.yml` file:

  ```
---
declared-services:
    my-conversation-service:
      label: conversation
      plan: free
    my-tone-service:
      label: tone_analyzer
      plan: lite
applications:
- name: appName
    command: npm start
    path: .
    memory: 512M
    instances: 1
    services:
    - my-conversation-service
    - my-tone-service
  env:
    NPM_CONFIG_PRODUCTION: false
  ```


2. Download and install the [Bluemix CLI](https://console.bluemix.net/docs/cli/reference/bluemix_cli/get_started.html#getting-started) tool.

3. Now open `Command Prompt` app and go to the directory of `movie-matching` folder in your computer.

```
cd C:\Users\%username%\Downloads\movie-matching
```

4. Then, connect to IBM Cloud and follow the prompts to log in.

  ```
  bx login
  ```
5. Specify your targeted organization and space. You can find it in IBM Cloud Dashboard or use the following command.

 ```
 bx target --cf
 ```

6. Push the app to IBM Cloud.

  ```
  bx app push
  ```
  Access your app on IBM Cloud at the URL specified in the command output.
  
  



