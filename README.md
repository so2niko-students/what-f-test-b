### This is json mock server for 'WHAT' project

> Init server: 
- run `npm install`
> Run server:
- run `npm run start`

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
