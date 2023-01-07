# Lendsqr test assessmen

This is a documentation for wallet system using express JS to create REST
API to create user, authenticate user, fund wallet, transfer fund, withdraw funds and check wallet history.

Other stack include, MySQL,KnexJS ORM, Typescript, JWT. <br/>

View the database structure with dbdesigner <p><a href="https://dbdesigner.page.link/a5FZDoTMLMXwqSFT7">here</a></p>

## Install

    npm install

## Run the app

    npm run dev

## View database structure with https://app.dbdesigner.net/

    https://dbdesigner.page.link/a5FZDoTMLMXwqSFT7

## Run the tests

npx vitest

# REST API

The REST API to the this app is described below.

## Sign up/create user

### Request

`POST /signup`

    curl -i -H 'Accept: application/json' -d 'email=lamus@gmail.com&password=12345' http://localhost:8080/signup

### Response

    HTTP/1.1 201 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 created
    Connection: close
    Content-Type: application/json
    Content-Length: 2

{
"status": true,
"msg": "User created successfully"
}

## User Authentification

### Request

`POST /auth`

    curl -i -H 'Accept: application/json' -d 'email=Foo&password=new' http://localhost:8080/auth

### Response

    HTTP/1.1 200 Created
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 Created
    Connection: close
    Content-Type: application/json
    Location: /thing/1
    Content-Length: 36

{
"status": true,
"msg": "Login successful",
"user": {
"id": 6,
"email": "tired@gmail.com",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRpcmVkQGdtYWlsLmNvbSIsImlkIjo2LCJpYXQiOjE2Njc4NDkxOTEsImV4cCI6MTY2NzkzNTU5MX0.mZrwGy8AHl_53nk87Swb5uxSk1GRToDEw9iK_YEpSY4",
"wallet_balance": 0,
"created_at": "2022-11-07T19:25:29.000Z",
"updated_at": "2022-11-07T19:25:29.000Z"
}
}

## Fund User Wallet

### Request

`GET /make/payment`

    curl -i -H authorization:token 'Accept: application/json' -d 'user_email=koko@gmail&amount=4000' http://localhost:8080/make/payment

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: HTML page

## Transfer Fund

### Request

`Post /transfer/funds`

    curl -i -H 'Accept: application/json' authorization:token -d 'sender_email=Foo@gmail.com&receiver=new@gmail.com&amount=200' http://localhost:8080/transfer/fund

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 N
    Connection: close
    Content-Type: application/json
    Content-Length: 35

{
"status": true,
"msg": "Fund transfered to etubaba@gmail.com successfully"
}

## Withdraw fund from wallet

### Request

`POST /wallet/witdrawer`

    curl -i -H authorization:token 'Accept: application/json' -d 'user_email=Bar@gmail.com&amount=400' http://localhost:8080/withdrawer/funds

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200
    Connection: close
    Content-Type: application/json
    Content-Length: 35

{
"status": true,
"msg": "Withdraw completed successfully"
}

## Get Transaction History

### Request

`Post /user/wallet/history`

    curl -i -H 'Accept: application/json' -d 'user_email=Bar@gmail.com' http://localhost:3000/user/wallet/history

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 40

{
"status": true,
"data": [
{
"id": 1,
"sender": "jamesjaga@gmail.com",
"action": "Fund wallet balance",
"amount": 1000,
"receiver": null,
"created_at": "2022-11-05T08:22:16.000Z",
"updated_at": "2022-11-05T08:22:16.000Z"
},
{
"id": 2,
"sender": "jamesjaga@gmail.com",
"action": "Transfer funds",
"amount": 500,
"receiver": "etubaba@gmail.com",
"created_at": "2022-11-05T08:24:35.000Z",
"updated_at": "2022-11-05T08:24:35.000Z"
}
]
}

## When url does not exist

### Request

`PUT /nowhere/`

    curl -i -H 'Accept: application/json'  http://localhost:3000/wrongURL

### Response

    HTTP/1.1 404 not found
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 404 not found
    Connection: close
    Content-Type: application/json
    Content-Length: 41

    {"id":1,"name":"Foo","status":"changed2"}

    ## When url does not exist

## When token is invalid or not available

### Request

`GET /wallet/balance/{wallet number or user email}`

    curl -i -H 'Accept: application/json'  http://localhost:3000//wallet/balance/{wallet number or user email}

### Response

    HTTP/1.1 401 unauthorized
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 401 not found
    Connection: close
    Content-Type: application/json
    Content-Length: 41

{
"statusCode": 401,
"message": "Authorized Needed"
}
