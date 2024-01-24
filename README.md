# Chat Room System - Chatty

The chat system allows users to communicate with each other in real-time within different groups and channels. Some users will have admin permission to add users to channels and groups, whilst a super admin has access to the entire site.

## Tech Stack

Node.js: Serves as the backend for the application.
Express: A web application framework for Node.js.
MongoDB: Used for storing user, group, and channel data, as well as chat history.
Socket.io: Enables real-time bidirectional event-based communication.
Angular: The frontend framework for building the user interface.
PeerJS: Utilized for video chat functionality.
Jasmine and Protractor: Employed for unit and end-to-end testing on the Angular side.
Bootstrap: Used for UI.

## Demonstration Video

https://github.com/toshimitsu-o/Chat-Angular-Webapp/assets/89127228/fa210813-1272-48b3-8a55-4ff6ab73fc26

## Key Features

### MongoDB Integration
- Utilise MongoDB for storing user, group, and channel data, along with chat history.
### Real-time Chat
- Socket will be employed to facilitate real-time chat communication within channels.
- Users can select a group and then a specific channel to engage in chat communication.
- Chat history will be updated in real-time as users send and receive messages.
- Notifications will be displayed when users join or leave a channel.
### User Authentication
- Password user authentication.
- In case of incorrect passwords, users will be prompted to log in again, ensuring secure access to the application.
### Image Support
- Users can specify a profile image (avatar), displayed alongside their username in the chat history.
- The chat system will support sending and displaying images as chat messages.
- Image storage on the server will be handled as files in a specified directory, with file paths stored in MongoDB.
### Video Chat Functionality
- PeerJS on the Angular side and implementing a Peer server on the server side.
- Users can engage in video chat sessions within the application, enhancing the overall communication experience.

## Data Structure

The following diagram depicts the data structure in this program. Each is stored in MongoDB cluster database collections. These MongoDB collections are read and saved via API provided by the Express server.

![Class Diagram](https://github.com/toshimitsu-o/Chat-Angular-Webapp/blob/main/Chatsystemdiagram.png "Class Diagram")

### Client side

The data of the user from the server will be saved to the local session storage when users sign in. The session storage will be cleared when users log out.

## REST API

The followings are the APIs that the program utilises to communicate between the server and the client to retrieve and save data. The data will be saved to the server when anything is modified.

### Auth

| **Route** | /auth/login |
| --- | --- |
| **Method** | POST |
| **Parameters** | username: string, pwd: string |
| **Return values** | user: object {username: string, email: string, role: string} |
| **Description** | User authentication with password and return user details. |

### Update

| **Route** | /auth/update |
| --- | --- |
| **Method** | POST |
| **Parameters** | user: object { username: user.username, email:  user.email, role: user.role, pwd: user.pwd, avatar: user.avatar} |
| **Return values** | user: object { username: user.username, email:  user.email, role: user.role, pwd: user.pwd, avatar: user.avatar} |
| **Description** | Update user details. |

### Users Admin

| **Route** | /admin/users |
| --- | --- |
| **Method** | GET |
| **Parameters** | None |
| **Return values** | Array of user: object { username: user.username, email:  user.email, role: user.role, pwd: user.pwd, avatar: user.avatar} |
| **Description** | Retrieves all user data for super admin and group admin users. |

### Users Admin

| **Route** | /admin/users |
| --- | --- |
| **Method** | POST |
| **Parameters** | user: object { username: user.username, email:  user.email, role: user.role, pwd: user.pwd, avatar: user.avatar} |
| **Return values** | Number of item added |
| **Description** | Create a new user. |

### Users Admin

| **Route** | /admin/users/ |
| --- | --- |
| **Method** | PUT |
| **Parameters** | user: object { username: user.username, email:  user.email, role: user.role, pwd: user.pwd, avatar: user.avatar}} |
| **Return values** | Array of user: object { username: user.username, email:  user.email, role: user.role, pwd: user.pwd, avatar: user.avatar} |
| **Description** | Update user data |

### Users Admin

| **Route** | /admin/users/:username/:by |
| --- | --- |
| **Method** | DELETE |
| **Parameters** | none |
| **Return values** | Array of user: object { username: user.username, email:  user.email, role: user.role, pwd: user.pwd, avatar: user.avatar}} |
| **Description** | Delete one user or all users except the current user (super admin). The current username will be passed through :by. |

### Groups

| **Route** | /group |
| --- | --- |
| **Method** | GET |
| **Parameters** | None |
| **Return values** | Array of group: object {id: string, name: string} |
| **Description** | Retrieves all group data. |

### Groups

| **Route** | /group |
| --- | --- |
| **Method** | POST |
| **Parameters** | Group object {id: string, name: string} |
| **Return values** | Number of added item. |
| **Description** | Add a new group. |

### Channels

| **Route** | /group/:id |
| --- | --- |
| **Method** | DELETE |
| **Parameters** | Group id |
| **Return values** | Array of group: object {id: string, name: string } |
| **Description** | Delete one group. |

### Channels

| **Route** | /channel |
| --- | --- |
| **Method** | GET |
| **Parameters** | None |
| **Return values** | Array of channel: object {id: string, name: string, gid: string} |
| **Description** | Retrieves all channel data. |

### Channels

| **Route** | /channel |
| --- | --- |
| **Method** | POST |
| **Parameters** | Channel object {id: string, name: string, gid: string } |
| **Return values** | Number of item added. |
| **Description** | Add a new channel. |

### Channels

| **Route** | /channel/:id |
| --- | --- |
| **Method** | DELETE |
| **Parameters** | Channel id |
| **Return values** | Array of channels: object {id: string, name: string, gid: string } |
| **Description** | Delete one channel. |

### Group Member

| **Route** | /member/group/:gid |
| --- | --- |
| **Method** | GET |
| **Parameters** | None |
| **Return values** | Array of group member: object {username: string, gid: string} |
| **Description** | Retrieves one or all group member data. |

### Group Member

| **Route** | /member/group/:gid |
| --- | --- |
| **Method** | PUT |
| **Parameters** | Array of group member: object {username: string, gid: string} |
| **Return values** | Array of group member: object {username: string, gid: string} |
| **Description** | Update one or all group member data. |

### Channel Member

| **Route** | /member/channel/:gid/:cid |
| --- | --- |
| **Method** | GET |
| **Parameters** | None |
| **Return values** | Array of channel member: object {username: string, cid: string} |
| **Description** | Retrieves one or all channel member data. |

### Group Member

| **Route** | / member/channel/:gid/:cid |
| --- | --- |
| **Method** | PUT |
| **Parameters** | Array of channel member: object {username: string, cid: string} |
| **Return values** | Array of channel member: object {username: string, cid: string} |
| **Description** | Update one or all channel member data. |

### Uploader API

| **Route** | /api/upload |
| --- | --- |
| **Method** | POST |
| **Parameters** | Form Data (File) |
| **Return values** | Result and file details. |
| **Description** | Upload files to server and return file details such as new file name. |

### Chat message API

| **Route** | /messages/:cid/:limit |
| --- | --- |
| **Method** | GET |
| **Parameters** | Channel id and limit of number of message |
| **Return values** | Array of chat message object (type, body, sender, to, date) |
| **Description** | Get chat messages from database within the cid with the limit |

## Angular Architecture

The followings explain the structure of Angular framework that the program uses for the front end.

### Components

#### Admin

This is to control and display the page for admin users to manage the groups, channels, and users. Modal views are utilised for users to control sections to view and update data.

#### Chat

This is to display and provide the chat messaging functionalities. Vertical tab navigation is used to display channels.

#### Login

This is the first view that users will interact to login to the system. The side navigation will be hidden in this section.


#### Profile

Users can see and update their details. The image file selector will be in this section to update users' profile picture.

#### Sidenav

The side navigation column will be stored in this component. After login, users will see groups that they belong to and they can access to profile page and logoff link.

#### Toast

The toast component contains templates for toast notification ng bootstrap UI feature.

#### Video

This contains video chat with screenshare functionalities and the page.

### Services

#### Auth

The functionalities to read and save user authentication data are stored in this section for other components to access.

#### Database

The functionalities to read and save data from/to the database through API calls.

#### Image upload

The functionalities to read files from local machine and upload to the server's image directory via API.

#### Socket

The connection and setup functionalities related to Socket.io are stored in this section for other components to access.

#### Toast

The functionalities to generate  ng bootstrap toast notifications.

### Models

#### Channel

Class for channel is defined in this section.

#### Group

Class for group is defined in this section.

#### Message

Class for message is defined in this section.

#### User

Class for user is defined in this section.

## Testing

### Server API Testing (Externally Facing Functions)

The test utilises Mocha, Chai, and Chai-http. In a terminal CLI app, move to chat/server directory and run the following command.

npm run-script test

Should get results after the test script running. Please make sure to change const SERVER value to your server URI.

### Angular Unit Testing

The test is implemeted with Karma and Jasmine. Rung the following command.

ng test

### E2E Testing

The test uses Protractor with Jasmine and Selenium Server.  Java Development Kit (JDK) needs to be installed.

webdriver-manager start

In a terminal CLI app, move to chat/e2e directory and run the following command.

protractor conf.js
