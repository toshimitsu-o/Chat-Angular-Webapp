# Assignment 1: Chatty - Chat System

# Git repository Organisation

Github: [https://github.com/toshimitsu-o/3813ICT-assignment](https://github.com/toshimitsu-o/3813ICT-assignment)

The git repository of this project contains code files and a readme file. The root branch is "main" and other branches exist for experimental features. Successful implementations will be merged to the main branch.

There are a few branches that remained unmerged to the main branch due to incomplete feature development. Commits and pushes were made regularly to maintain the repository trackable in case of issues.

# Data Structure

The following diagram depicts the data structure in this program. Each is stored as a JSON file in the Node server which will be replaced by MongoDB data collections at later stage of the development. These files are read and saved via the Express server.

![](RackMultipart20220911-1-1wlrag_html_9f383e3bfa47c9aa.png)Client side

The data of the extended user from the server will be saved to the local session storage when users sign in. The session storage will be cleared when users log out.

# REST API

The followings are the APIs that the program utilises to communicate between the server and the client to retrieve and save data. The data will be saved to the server when anything is modified.

## Auth

| _ **Route** _ | /auth/login |
| --- | --- |
| _ **Method** _ | POST |
| _ **Parameters** _ | username: string, pwd: string |
| _ **Return values** _ | user: object {username: string, email: string, role: string} |
| _ **Description** _ | User authentication with password and return user details. |

## Update

| _ **Route** _ | /auth/update |
| --- | --- |
| _ **Method** _ | POST |
| _ **Parameters** _ | user: object {username: string, email: string, role: string} |
| _ **Return values** _ | user: object {username: string, email: string, role: string} |
| _ **Description** _ | Update user details. |

## Users Admin

| _ **Route** _ | /admin/users |
| --- | --- |
| _ **Method** _ | GET |
| _ **Parameters** _ | None |
| _ **Return values** _ | Array of user: object {username: string, email: string, role: string} |
| _ **Description** _ | Retrieves all user data for super admin and group admin users. |

## Users Admin

| _ **Route** _ | /admin/users |
| --- | --- |
| _ **Method** _ | POST |
| _ **Parameters** _ | user: object {username: string, email: string, role: string} |
| _ **Return values** _ | Array of user: object {username: string, email: string, role: string} |
| _ **Description** _ | Create a new user and get user data as return. |

## Users Admin

| _ **Route** _ | /admin/users/:id |
| --- | --- |
| _ **Method** _ | PUT |
| _ **Parameters** _ | user: object {username: string, email: string, role: string} |
| _ **Return values** _ | Array of user: object {username: string, email: string, role: string} |
| _ **Description** _ | Update user data |

## Users Admin

| _ **Route** _ | /admin/users/:id/:by |
| --- | --- |
| _ **Method** _ | DELETE |
| _ **Parameters** _ | none |
| _ **Return values** _ | Array of user: object {username: string, email: string, role: string} |
| _ **Description** _ | Delete one user or all users except the current user. The current username will be passed through :by. |

## Groups

| _ **Route** _ | /group/:gid |
| --- | --- |
| _ **Method** _ | GET |
| _ **Parameters** _ | None |
| _ **Return values** _ | Array of group: object {id: string, name: string} |
| _ **Description** _ | Retrieves one or all group data. |

## Groups

| _ **Route** _ | /group/:gid |
| --- | --- |
| _ **Method** _ | PUT |
| _ **Parameters** _ | Array of group: object {id: string, name: string} |
| _ **Return values** _ | Array of group: object {id: string, name: string} |
| _ **Description** _ | Update one or all group data. |

## Channels

| _ **Route** _ | /channel/:cid |
| --- | --- |
| _ **Method** _ | GET |
| _ **Parameters** _ | None |
| _ **Return values** _ | Array of channel: object {id: string, name: string, gid: string} |
| _ **Description** _ | Retrieves one or all channel data. |

## Channels

| _ **Route** _ | /channel/:cid |
| --- | --- |
| _ **Method** _ | PUT |
| _ **Parameters** _ | Array of channel: object {id: string, name: string, gid: string} |
| _ **Return values** _ | Array of channel: object {id: string, name: string, gid: string } |
| _ **Description** _ | Update one or all channel data. |

## Group Member

| _ **Route** _ | /member/group/:gid |
| --- | --- |
| _ **Method** _ | GET |
| _ **Parameters** _ | None |
| _ **Return values** _ | Array of group member: object {username: string, gid: string} |
| _ **Description** _ | Retrieves one or all group member data. |

## Group Member

| _ **Route** _ | /member/group/:gid |
| --- | --- |
| _ **Method** _ | PUT |
| _ **Parameters** _ | Array of group member: object {username: string, gid: string} |
| _ **Return values** _ | Array of group member: object {username: string, gid: string} |
| _ **Description** _ | Update one or all group member data. |

## Channel Member

| _ **Route** _ | /member/channel/:gid/:cid |
| --- | --- |
| _ **Method** _ | GET |
| _ **Parameters** _ | None |
| _ **Return values** _ | Array of channel member: object {username: string, cid: string} |
| _ **Description** _ | Retrieves one or all channel member data. |

## Group Member

| _ **Route** _ | / member/channel/:gid/:cid |
| --- | --- |
| _ **Method** _ | PUT |
| _ **Parameters** _ | Array of channel member: object {username: string, cid: string} |
| _ **Return values** _ | Array of channel member: object {username: string, cid: string} |
| _ **Description** _ | Update one or all channel member data. |

# Angular Architecture

The followings explain the structure of Angular framework that the program uses for the front end.

## Components

### Admin

This is to control and display the page for admin users to manage the groups, channels, and users. Modal views are utilised for users to control sections to view and update data.

### Chat

This is to display and provide the chat messaging functionalities. Vertical tab navigation is used to display channels.

### Login

This is the first view that users will interact to login to the system. The side navigation will be hidden in this section.

### Profile

Users can see and update their details. The image file selector will be in this section to update users' profile picture.

### Sidenav

The side navigation column will be stored in this component. After login, users will see groups that they belong to and they can access to profile page and logoff link.

## Services

### Auth

The functionalities to read and save user authentication data are stored in this section for other components to access.

### Socket

The connection and setup functionalities related to Socket.io are stored in this section for other components to access.

## Models

### Group

Classes and interfaces for group and channel will be defined in this section.

### User

Class and interface for user will be defined in this section.
