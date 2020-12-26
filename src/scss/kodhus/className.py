class ClassName:
    def __init__(self):
        self.verified = True
        self.identified_by = self.get_identified_by("USER_ACCOUNT")
    
    
    def get_identified_by(user_id_source):
        if self.verified:
            return 'Logged-in user'
        elif user_id_source == "USER_ACCOUNT":
            return 'Provided Email'
        elif user_id_source == 'USER_CHANGES':
            return 'Provided Email was earlier linked to this account'
        else:
            return 'N/A'


x = ClassName()
print x.identified_by