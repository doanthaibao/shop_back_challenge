# SHOP BACK NODE.JS CODE CHALLENGE
# I.Starting application
### Require: nodejs version 8.11.x or above 
### Running
  - npm install 
  - npm start 
  - application starts at http://localhost:3000
# II.Overview of project
## 1. Authentication & RESTful APIs
  ### Signup
   - Assume that user has email begin with admin@.. will get admin role otherwise by default is user role
   - Password is encrypted
  ### Signin
    - Assume that user has email begin with admin@... will get admin role otherwise by default is user role
    - Password is encrypted
  ### Logout
   - Destroy current session
  ### OTP
   - Encrypt and decrypt by 'crypto' default library of nodejs
   - OTP will expired after 2 hours 
  ### Search user and paging parameters (only for admin role)
   - Support paging with 2 parameters are: size and page
   - size: max of item in 1 request. (100 by default)
   - page: number of page order (1 by default)
   - Request: http://localhost:3000/api/user/search?name=Bao&page=1&size=1
  ### Test (For all of users)
  - Request: http://localhost:3000/api/user/test
## 2. ACL
 - There are 3 type of user roles: admin /user / anonymous (user doesn't login yet)
 - Structure
 ```json
 [
    {
        "role": "anonymous", /* the API for all of public RESTful APIs*/
        "permissions": [
        {
            "access_url": "/api/signin",
            "method": ["POST"],
            "action": "allow"
        },
        {
            "access_url": "/api/signup",
            "method": ["POST"],
            "action": "allow"
        }]
    },
    {
        "role": "admin",
        "permissions": [
        {
            "access_url": "*",
            "method": "*",
            "action": "allow"
        }]
    },
  {
      "role": "user",
      "permissions": [
      {
          "access_url": "/api/user/search",
          "method": ["POST", "GET", "PUT", "DELETE"],
          "action": "deny"
      },
      {
          "access_url": "/api/user/test",
          "method": ["POST", "GET", "PUT", "DELETE"],
          "action": "allow"
      },
      {
          "access_url": "/api/logout",
          "method": ["POST"],
          "action": "allow"
      }]
  }]
 ```
 - Explanation for acl configuration
   + access_url: the api url that role is allowed or denied (* mean every url)
   + method: http verb method
   + action: allow or deny
 - ACL process: handler by ACLHandler.js
   
## 3. Data converter 
- Configurtion file is saving at config/data_response_config.json
- There are have 2 type of devices : mobile and web_browser (could be added more)
- Device object keep the info of reponse object (user)
- In responsing object keep info of JSON key name and data type of value (they differ between devices)
- Base on devide type and differences of keys, data type using the DataConvert.js to convert to target device 
- Structure:
```json
{
    "mobile":
    {
        "user": /*Returning data when request list of users or login*/
        {
            "email": /*default key*/
            {
                "value": "email", 
                "type": "string"
            },
            "name": /*default key*/
            {
                "value": "fullname",/*custom key for mobile*/
                "type": "string"
            },
            "latest":
            {
                "value": "latest",
                "type": "number"
            },
            "createAt":
            {
                "value": "created",
                "type": "number"
            }
        }

    },
    "web_browser":
    {
        "user":
        {
            "email":
            {
                "value": "login_id",
                "type": "string"
            },
            "name": {
              "value": "full_name",
              "type": "string"
            },
            "latest": {
              "value":"latest_login",
              "type": "date-time",
              "format": "yyyy-mm-dd hh:MM:ss"
            },
            "createAt": { /*Default key*/
              "value":"created_date", /*Custom key for web*/
              "type": "date-time", /*type for web*/
              "format": "yyyy-mm-dd hh:MM:ss" /*format for this type*/
            }
        }
    }
}
```
## 4. Database

- Saving  in folder : database/Users.json 
- Reading/Writing with fs 
- Limitation: throw exception if delete folder database
- Structure: 

```json
 [
   {
    "name": "Bao", /* user name*/
    "email": "admin@email.com", /* email of user */
    "password": "$2b$10$Zz2.1QkzV/pBMvA2PCNM8ey.kb9E3o9cH5AjTT.UMSdGGmy.PP6aS", /* password is encypted with bcrypt */
    "createAt": 1555637505900, /* created time*/
    "latest": 1555744927470, /*last access*/
    "role": "admin"  /* role: admin, user or anonymous */
   }
   .
   .
   .
 ]
 ```
# III. Testing
- Using grunt to run the test:
  npm test
- Limitation: Only writing some test cases: not enough 100% code coverage
