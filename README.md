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

