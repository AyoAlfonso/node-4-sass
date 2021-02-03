Requirements:
1. Should be able to login with social signup
2. Should be able to login with email/username and password
3. Should be able to lookup other collections and load data that belongs to a user with the user object on successful login.
4. Fields should be validated before reaching "login" controller
5. Should not expose user password and should check if user is verified
6. Should inform the user of the correct sign up menthod for them
7. Proper error handling
8. Google signup flow [with passport, without passport]
9. Bycrypt to confirm password
10. GenerateToken and DecodeToken flow to create a new login token

The first line above is receiving the request and response object from the router in `router/index.js` .Check the "Routers" chapter.

We need to make it an asynchronous function `async` because if you take a quick look at the entire function it has a couple of helpers or functions with the `await` doing some asynchronous work and having to pause the flow at those points till the promise being processed is resolved.

Line 4 extracts the object from the request body
and passes this object into the `getUserByAggregate()` function. In normal situations this function would just be a simple User find:

#MongoDB
```js
User.findOne()
```
However this is a `login` process that will need to look up other collections. Take a Sales talent that signed up on our ATS-CMS, we need to be able to  pull up information about the talent's `skills`, `talents`, `job experiences` and `special abilities` [like being able to do small talk or manage large people] 

Also, we are sending in three user attributes to find the user; we are using the `email` or `username` or the `google_id_token`. These attributes are all unique if you check the user model out in the chapter about #models

On line 8 of the login function we check if we got a user object, if nothing is returned after a search from the `getUserByAggregate` function. 

```
Technically the mongoDB `User.aggregate()` method will return an empty array, if a user object with the specified attributes doesn't exist. And it returns the first element from the return array.
```

In line 47 of the getUserByAggregate function we return null if no result is sent to mimick the behaviour a normal User.find() method. This might not be encouraged in other parts of the application but this is what the case is right now, as we only need one user or nothing.

On line 14 of the `getUserByAggregate()` function we do a look up from other collections stated with `from` and using the `localField` for the user ID in the user object and what the field is called in the other collection using the `foreignField` to match the values we are looking for.

Doing this will load the user we need and the attributes that belongs to it. However we are not done authenticating.

The [bycypt](https://www.npmjs.com/package/bcrypt) module has a number of methods exposed by the API, we are using the .compare method here to confirm the login by comparing the encrypted password of the user in the DB vs the bare password of the client attempting to login.

```js
   let passwordMatch = 
   await bcrypt.compare(
        req.body.password,
        userObject.password
    );
```

On line 42 of the `getJWT.decodeToken()` method. We also generate a token for the user after logging in successfully. Here the token is generated and sent with the body but we can attach it to the header of the request `req.header.Authorization` attributes for a more cleaner/secure approach. The user can then attach it to thier headers and use it to authenticate their connection to the server consecutively until the token expires.


End of chapter.