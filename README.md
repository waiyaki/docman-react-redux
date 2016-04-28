# docman

[![codecov.io](https://codecov.io/github/andela-jmuturi/docman/coverage.svg?branch=master)](https://codecov.io/github/andela-jmuturi/docman/)
[![Build Status](https://travis-ci.org/andela-jmuturi/docman.svg?branch=master)](https://travis-ci.org/andela-jmuturi/docman)

Andela JS Curriculum Checkpoint 3 - Document Manager.

## Description
This is a simple API that allows authenticated users to create and manage
simple documents. `Document` here is used with a grain of salt to mean any kind
of object with a string title and a string body content.

# Installation
Make sure you have NodeJS and MongoDB installed, then:
1. Clone this repository

    $ git clone https://github.com/andela-jmuturi/docman.git && cd docman

2. Install the project's dependencies

    $ npm install

3. Ensure you have a `SECRET_KEY` set in your environment by exporting one.
Alternatively, you can create an environment file that will be read by the
project everytime it starts up by running:

    $ echo "SECRET_KEY=yoursecretkeyhere" >> .env

Replace "yoursecretkeyhere" with any random string.

4. Run a development server

    $ npm run start:dev

The server will run at http://localhost:3000

# API endpoints.

## Users
* ```/users```

    Send a POST request with an object containing a `username`, `password` and
    `email` to signup.

* ```/users/login```

    Send a POST request with an object containing a `username` and `password`
    to login. The API will give you an authentication token if the credentials
    are valid

* ```/users/profile``` [GET|PUT|DELETE]

    Send requests to this endpoint with an `x-access-token` header containing
    the authentication token obtained from `/users/login`.
    - `GET` - Get the authenticated user's profile.

    - `PUT` - Update the authenticated user's profile.

    - `DELETE` - Delete the authenticated user's profile.


* ```/users/:username/documents``` [GET]
    - `HEADER` - `x-access-token`

    Returns documents created by the user with this username

* ```/users``` [GET]
    - `HEADER` - `x-access-token`

    Returns all users in the system. This route is restricted to admin users only.

## Documents
* ```/documents``` [POST]

     Create a new document.
     - `HEADER` - `x-access-token`

     - `title` - Document title. Required.

     - `content` - Document content. Required.

     - `role` - Role that can access this document. Options are `public`, `private`, `admin` and `user`. Defaults to `public`.

    Returns the created document.

* ```/documents/:document_id``` [GET|PUT|DELETE]
    - `HEADER` - `x-access-token`

    - `GET` - Get the document with this document_id.

    - `PUT` - Update the document with this document_id.

    - `DELETE` - Delete the document with this document_id.


* ```/documents``` [GET]

    Get all documents accessible to you, based on your permissions.
    By default, it will return all documents belonging to the authenticated user
    as well as any other public documents.

    You can filter the documents to return only the ones that matter to you.
    - ```/documents?limit=2``` - Returns the accessible documents limited to the latest 2.

    - ```/documents?user=test``` - Returns the public documents created by `test`.

    - ```/documents?role=public``` - Returns all documents accessible to the authenticated user that are public (whether the user owns them or not).

    - ```/documents?created=2016-04-25``` - Returns the documents created on the
    25th of April, 2016.

    - ```/documents?created_min=2016-04-25&created_max=2016-04-27``` - Returns the accessible documents created between the 25th and 27th of April, 2016. The `created_max` date is inclusive.

    The filters can be mixed and matched to fit the specific need at that moment. For example:
    - ```/documents?created_min=2016-04-24&created_max=2016-04-28&=user=test&role=public&limit=2``` - Will return the latest `2` documents created by `test` `between` the 24th and 28th of April 2016, inclusive, and are accessible by the `public`.

# Testing
You can run tests by ensuring you have the project set up then running:

    $ npm test


*Cheers*
