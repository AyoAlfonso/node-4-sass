Requirements:
1. Should be able to signup with social signup
2. Should be able to signup with email/username and password
3. Should be able to send user a verification email with readable code to enter on signing up 
4. dateTransformer helper to normalize dates


The first problem we attempt to solve is a UX problem. We know that the clients signing up are mobile app users and they will need to input code to verify their account other than take them out of our app into their email to go do the verification.

We send a readable code to them by text and their android or iphone is able to parse the incoming text on their behalf and verify. Just the way whatsapp does it.

We attempt finding the User by their email [as this is the main unique attribute of the user]. If we do find one and we see that so so account is not verified already we remove that account from our DB to restart their journey with us again. This is the most straightforward way to go about that without compromising on data.

Next we transform the date of user being used to sign up, add that back to the user object and create a new user. Send an email with the code to be used for verification with the sendWelcomeEmail method on the sendGrid module OR send a text with the method `sendText`. 

We are consistently wrapping most of our functions especially the asynchronous functions with `try/catchs` to make sure nothing gets past us without knowing.

Pay attention to the error codes used and why they are used [200,201,400, 500]

End of chapter.