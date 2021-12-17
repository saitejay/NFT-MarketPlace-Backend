# New-NFT-MarketPlace

## Backend

### User Section

#### API paths

-   GET <http://localhost:5000/user?user_id=&keyword=&page=>

    To get the list of users by a normal user, or searching a specific user.

    If the URL doesn't specify any kind of query parameters (i.e. <http://localhost:5000/user>), then it would fetch the full list of users. We should not display the admin users (i.e. the users with **role equal to 1**).

    If the keyword user_id is specified (i.e. <http://localhost:5000/user?user_id=>), all the users, except the user with mongodb \_id equal to user_id would be fetched.

    The keyword query variable is used for the searching keyword (i.e. <http://localhost:5000/user?keyword=>). The query keyword can include display_name, username, email. If any of the user have the details with the given search keyword, it will fetch that user's data. (N.B. If the keyword have spaces in between, convert spaces into '+')

    The keyword page is for pagination process (i.e. <http://localhost:5000/user?page=>).

-   POST <http://localhost:5000/user>

    Used to register a user, if the user is connecting to the app for the first time.

    The req.body must include **display_name**, **username**, **email**, **public_key**.

    The response will contain a **JWT token**, which can be used for authentication and authorization purposes.

-   POST <http://localhost:5000/user/login>

    If the user is not connecting for the first time, we can use this path.

    The req.body must contain **public_key**.

    The response will contain a **JWT token**, which can be used for authentication and authorization purposes.

-   PUT <http://localhost:5000/user/update>

    This path is used for updating the user data.

    For using this path, the current JWT token, which is stored in the local storage is required to pass as the request header along with the request.

    Here the req.body must include **public_key**. It can also include:

    -   username
    -   display_name
    -   email
    -   profile_image
    -   profile_cover
    -   bio
    -   facebook_username
    -   twitter_username
    -   instagram_username

    What ever the fields are specified, those fields would be updated, and will response with a new JWT token, which can replace the older JWT token which is stored in local storage.

-   GET <http://localhost:5000/user/profile?public_key=>

    Path for retrieving the data of a profile.

    The req.query must contain **public_key** of the user in we desire to retrieve the data.

    The response will contain the details of that user with the given public_key

-   POST <http://localhost:5000/user/chat>

    Path for chatting purpose. (Chatting process is still under maintenance).

    The req.body must contain \_id of the user which we desire.

    The response will contain only a few details of the user. i. e.

    -   _id
    -   username
    -   profile_image
    -   public_key
