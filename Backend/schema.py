from pydantic import BaseModel,Field,EmailStr
from typing import Annotated,Literal,Optional
from datetime import datetime

UserRole = Literal['Admin', 'Member', 'Viewer']

class User(BaseModel):
    id : int
    name : Annotated[str,Field(...,min_length=2,max_length=100,description='Enter your name',examples=['Jack Jonson'])]
    email : Annotated[EmailStr,Field(...,description='Enter your valid email',examples=['jack@gmail.com'])]
    role : Annotated[UserRole,Field(...,description='Enter your role',examples=['Admin', 'Member', 'Viewer'])]
    createdAt : datetime=Field(default_factory=datetime.now)
    updatedAt : datetime=Field(default_factory=datetime.now)
    

class Create_user(BaseModel):
    name : Annotated[str,Field(...,min_length=2,max_length=100,description='Enter your name',examples=['Jack Jonson'])]
    email : Annotated[EmailStr,Field(...,description='Enter your valid email',examples=['jack@gmail.com'])]
    role : Annotated[UserRole,Field(...,description='Enter your role',examples=['Admin', 'Member', 'Viewer'])]


class Update_user(BaseModel):
    name : Annotated[Optional[str],Field(min_length=2,max_length=100,description='Enter your name',examples=['Jack Jonson'],default=None)]
    email : Annotated[Optional[EmailStr],Field(description='Enter your valid email',examples=['jack@gmail.com'],default=None)]
    role : Annotated[Optional[UserRole],Field(description='Enter your role',examples=['Admin', 'Member', 'Viewer'],default=None)]
    