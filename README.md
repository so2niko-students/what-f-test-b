### This is json mock server for 'WHAT' project

> Init server: 
- run `npm install`
> Run server:
- run `npm run start`

### Endpoints: 
#### `/api/accounts/auth` 
Request Headers: 
`Content-Type: application/json`

Request Body: 
```
{
  email: string
  password: string
}
```
<-- _status 200_
Response headers: 
`Authorization: Bearer *JWT*`

Response Body:
```
{
    "firstName": string,
    "lastName": string,
    "role": int,
    "id": int
}
```
#### `/api/accounts/reg`
Request Headers: 
`Content-Type: application/json`

Request Body:
```
{
  "email": "string"
  "firstName": "string"
  "lastName": "string"
  "password": "string"
  "confirmPassword": "string"
}
```
<-- _status 201_
Response Body:
```
{
    "id": int
    "firstName": string
    "lastName": string
    "email": string
    "role": int
    "isActive": boolean
}
```

### Courses
#### Get `/api/courses`
<-- _status 200_
Response Body:
```
[
  {
    id: int,
    name: string
  },
  ...
]
```

#### Post `/api/courses`
Request Body: 
```
{
  name: string
}
```

<-- _status 200_
Response Body: 
```
{
  name: string
}
```

#### Put `/api/courses/[id]`
Request Body:
```
{
  name: string
}
```

<-- _status 200_
Response Body:
```
{
  id: int,
  name: string
}
```

#### Delete `/api/courses/[id]`

### Mentors

####  GET `/api/mentors` 
##### -->
##### Request Headers: 
 - `Authorization: Bearer *JWT*` 

##### <-- 
##### Response Body:
```
[
    {
        "id": int,
        "firstName": string,
        "lastName": string,
        "email": "string",
    },
    ...
]
```

####  POST `/api/mentors/:id` 
##### -->
##### Request Headers: 
 - `Authorization: Bearer *JWT*` 

##### <-- 
##### Response Body:
```
{
    "id": int,
    "firstName": string,
    "lastName": string,
    "email": "string",
}
```

####  PUT `/api/mentors/:id` 
##### -->
##### Request Headers: 
- `Content-Type: application/json`
 - `Authorization: Bearer *JWT*` 
##### Request Body:
```
{
    "firstName": string,
    "lastName": string,
    "email": "string",
}
```
##### <-- 
##### Response Body:
```
{
    "id": int,
    "firstName": string,
    "lastName": string,
    "email": "string",
}
```

####  DELETE `/api/mentors/:id` 
##### -->
##### Request Headers: 
 - `Authorization: Bearer *JWT*` 
##### <-- 
##### Response: 
```
Successfully deleted
```

