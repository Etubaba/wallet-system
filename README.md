# Lendsqr-Assessment-BE


This is a documentation for wallet system using nest js framework of node js to create  REST
API to create user, authenticate user, fund wallet, transfer fund, withdraw funds and so much more.

Other stack include, MySQL,KnexJS ORM, Passport JS . <br/>

View the database structure with dbdesigner <p><a href="https://dbdesigner.page.link/a5FZDoTMLMXwqSFT7">here</a></p>



## Install

    npm install

## Run the app

    npm run dev 
    
    
## View database structure with https://app.dbdesigner.net/
    https://dbdesigner.page.link/a5FZDoTMLMXwqSFT7

## Run the tests

    yarn test:dev 
    
    P (to select pattern)
    file name (for unit testing)

# REST API

The REST API to the this app is described below.

## Sign up/create user

### Request

`POST /user/create`

    curl -i -H 'Accept: application/json' -d 'email=lamus@gmail.com&password=12345' http://localhost:3000/user/create

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

    curl -i -H 'Accept: application/json' -d 'email=Foo&password=new' http://localhost:3000/auth

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

`POST /wallet/fund`

    curl -i -H 'Accept: application/json' -d 'user_email=koko@gmail&amount=4000' http://localhost:3000/wallet/fund

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 36

   {
  "status": true,
  "msg": "User wallet funded successfull"
}

## Transfer Fund 

### Request

`Post /wallet/transfer/fund`

    curl -i -H 'Accept: application/json' -d 'sender_email=Foo@gmail.com&receiver=new@gmail.com&amount=200' http://localhost:3000/wallet/transfer/fund

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

    curl -i -H 'Accept: application/json' -d 'user_email=Bar@gmail.com&amount=400' http://localhost:3000/wallet/withdrawer

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

## Get User wallet balance

### Request

`GET /wallet/balance/{user email or wallet number}`

    curl -i -H 'Accept: application/json' http://localhost:3000/thing/wallet/balance/{user email or wallet number}

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 74

  {
  "status": true,
  "data": {
    "id": 6,
    "wallet_number": 642627,
    "user_email": "tired@gmail.com",
    "amount": 2000,
    "created_at": "2022-11-07T19:25:29.000Z",
    "updated_at": "2022-11-07T19:25:29.000Z"
  }
}

## Get Transaction History

### Request

`Get /transaction/history/{user email or wallet number}`

    curl -i -H 'Accept: application/json'  http://localhost:3000/transaction/history/{user email or wallet number}

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

## Get User List (for admin and debug)

### Request

`GET /user/all`

    curl -i -H 'Accept: application/json' http://localhost:3000/user/alll

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
      "email": "etubaba@gmail.com",
      "password": "$argon2id$v=19$m=65536,t=3,p=4$kg9cY/9kGAXgWpGx7DXxJg$66KpO4ge7J828j9ckEJZYbsSLZ14owK/AyfDaFabGB4",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV0dWJhYmFAZ21haWwuY29tIiwiaWQiOjEsImlhdCI6MTY2NzgxNjY2OCwiZXhwIjoxNjY3OTAzMDY4fQ.MYXF5jpSLyPlHPjPIX151HmwHChA1UtKmaLTIvlDqSw",
      "wallet_balance": 2700,
      "created_at": "2022-11-05T08:18:48.000Z",
      "updated_at": "2022-11-05T08:18:48.000Z"
    },
    {
      "id": 2,
      "email": "jamesjaga@gmail.com",
      "password": "$argon2id$v=19$m=65536,t=3,p=4$Nw/NYVa8iONmmfstWltdoQ$a3eWf3iVwm5kN1IjgZT9wvXMRHfv981CTP9/c/4JigY",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWVzamFnYUBnbWFpbC5jb20iLCJpZCI6MiwiaWF0IjoxNjY3NjM2MzY2LCJleHAiOjE2Njc3MjI3NjZ9.9zUOV2TqLkmqYDQroQtZY6qSDG90EICirq7K732YQZ4",
      "wallet_balance": 500,
      "created_at": "2022-11-05T08:19:15.000Z",
      "updated_at": "2022-11-05T08:19:15.000Z"
    },
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
  "message": "Unauthorized"
}
