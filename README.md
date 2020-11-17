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


