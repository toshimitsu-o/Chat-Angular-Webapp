# Assignment 1: Chatty - Chat System

## Git repository Organisation

Github: [https://github.com/toshimitsu-o/3813ICT-assignment](https://github.com/toshimitsu-o/3813ICT-assignment)

The git repository of this project contains code files and a readme file. The root branch is "main" and other branches exist for experimental features. Successful implementations will be merged to the main branch.

There are a few branches that remained unmerged to the main branch due to incomplete feature development. Commits and pushes were made regularly to maintain the repository trackable in case of issues.

## Data Structure

The following diagram depicts the data structure in this program. Each is stored as a JSON file in the Node server which will be replaced by MongoDB data collections at later stage of the development. These files are read and saved via the Express server.

![Class Diagram](https://github.com/toshimitsu-o/3813ICT-assignment/blob/main/Chatsystemdiagram.png "Class Diagram")

### Client side

The data of the extended user from the server will be saved to the local session storage when users sign in. The session storage will be cleared when users log out.

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
| **Parameters** | user: object {username: string, email: string, role: string} |
| **Return values** | user: object {username: string, email: string, role: string} |
| **Description** | Update user details. |

### Users Admin

| **Route** | /admin/users |
| --- | --- |
| **Method** | GET |
| **Parameters** | None |
| **Return values** | Array of user: object {username: string, email: string, role: string} |
| **Description** | Retrieves all user data for super admin and group admin users. |

### Users Admin

| **Route** | /admin/users |
| --- | --- |
| **Method** | POST |
| **Parameters** | user: object {username: string, email: string, role: string} |
| **Return values** | Array of user: object {username: string, email: string, role: string} |
| **Description** | Create a new user and get user data as return. |

### Users Admin

| **Route** | /admin/users/:id |
| --- | --- |
| **Method** | PUT |
| **Parameters** | user: object {username: string, email: string, role: string} |
| **Return values** | Array of user: object {username: string, email: string, role: string} |
| **Description** | Update user data |

### Users Admin

| **Route** | /admin/users/:id/:by |
| --- | --- |
| **Method** | DELETE |
| **Parameters** | none |
| **Return values** | Array of user: object {username: string, email: string, role: string} |
| **Description** | Delete one user or all users except the current user. The current username will be passed through :by. |

### Groups

| **Route** | /group/:gid |
| --- | --- |
| **Method** | GET |
| **Parameters** | None |
| **Return values** | Array of group: object {id: string, name: string} |
| **Description** | Retrieves one or all group data. |

### Groups

| **Route** | /group/:gid |
| --- | --- |
| **Method** | PUT |
| **Parameters** | Array of group: object {id: string, name: string} |
| **Return values** | Array of group: object {id: string, name: string} |
| **Description** | Update one or all group data. |

### Channels

| **Route** | /channel/:cid |
| --- | --- |
| **Method** | GET |
| **Parameters** | None |
| **Return values** | Array of channel: object {id: string, name: string, gid: string} |
| **Description** | Retrieves one or all channel data. |

### Channels

| **Route** | /channel/:cid |
| --- | --- |
| **Method** | PUT |
| **Parameters** | Array of channel: object {id: string, name: string, gid: string} |
| **Return values** | Array of channel: object {id: string, name: string, gid: string } |
| **Description** | Update one or all channel data. |

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

### Services

#### Auth

The functionalities to read and save user authentication data are stored in this section for other components to access.

#### Socket

The connection and setup functionalities related to Socket.io are stored in this section for other components to access.

### Models

#### Group

Classes and interfaces for group and channel will be defined in this section.

#### User

Class and interface for user will be defined in this section.
