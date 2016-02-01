# Tinder "Pls Respond"er

Problem: Many of my tinder matches forget to respond to my messages.

Solution: An automated bot that prompts matches to respond with customizable prompts.

### Configuration


Add prompts to the array in config.json

config:
```
{
  "prompts": [ 
    "pls respond"
  ]
}
```

### Usage 

Find your user id here: http://findmyfbid.com/

Facebook oauth token: Easiest way is to follow this <a href="https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token">link</a> and read facebook token from url you get redirected to. 


` export FB_USER_TOKEN={your user token}`
` export FB_USER_ID={your user id}`

```
git clone https://github.com/emars/tinder-pls-responder
npm install
npm start
```
