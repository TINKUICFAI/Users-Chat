To setUp the .env file
LOCAL_MONGO_DB = "Your Database connection link"
PORT = 9000
JWTSECRET = "you secret"

# We have Multiple apis in this project:-

# 1 Users ->

    Users will add by admin as per user role decided by the admin as isAdmin true or false

# 2 Authentications and Authorization

    Managed Status codes are
    200
    400
    401
    402
    403
    404
    Manage the Authentication with JWT token with userId and adminId to identify the user role for authorization on the apis

# 3 Groups

    i) Users will able to create, edit , get list , detail and delete the group , these are the basic functionalities given to the users
    ii) Only group admin will able to do edit and delete the group
    iii) Other members will see the list of the groups where they are added , see the list of the other members and messages in the group

# 4 Members

    i) Only group admin will add the other members of the group
    ii) Group admin will able to do => add member, edit member, assign admin role to other member
    ii) All members will see the list and detail of other members in the group

# 5 Messages

    i) All members are able to send messages in the group
    ii) will able to like the message
