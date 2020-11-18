### This is json mock server for 'WHAT' project

> Init server: 
- run `npm install`
> Run server:
- run `npm run start`

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

