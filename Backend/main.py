import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from schema import User, Create_user, Update_user
from db import supabase

load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("URL")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get('/')
def welcome():
    return {'message':'Welcome to the USER CRUD API'}

@app.get('/health')
def health():
    return {'Satus': 200,'message': 'OK'}


@app.get('/api/users/')
def get_allusers():
    response = supabase.table('users').select('*').execute()
    return response.data


@app.get('/api/users/{id}')
def get_user_by_id(id:int):
    response = supabase.table('users').select('*').eq('id', id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail='User Not Found!!!')
    return {"users":response.data[0],"message":"User Fetched Successfully"}
    
@app.delete('/api/users/{id}')
def delet_user(id:int):
    existing = supabase.table('users').select('*').eq('id', id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail='User Not Found!!!')
    supabase.table('users').delete().eq('id', id).execute()
    return {"message":"User Deleted Successfully"}


@app.post('/api/users/')
def create_user(user:Create_user):
    user_email = supabase.table('users').select('email').eq('email',user.email.lower().strip()).execute()
    if user_email.data:
        raise HTTPException(status_code=409,detail="Email Already Exists!!!")
    user_data = user.model_dump(mode='json')
    result = supabase.table('users').insert(user_data).execute()
    return {"user": result.data[0], "message": "User Created Successfully"}
    
@app.put('/api/users/{id}')
def update_user(id:int , update_user:Update_user):

    existing = supabase.table('users').select('*').eq('id', id).execute()

    if not existing.data:
        raise HTTPException(status_code=404, detail='User Does Not Exist!!!')
    
    user_email = supabase.table('users').select('email').eq('email',update_user.email.lower().strip()).neq('id', id).execute()
    if user_email.data:
        raise HTTPException(status_code=409,detail="Email Already Exists!!!")

    updated_fields = update_user.model_dump(exclude_unset=True)
    updated_fields["updatedAt"] = datetime.now().isoformat()
    supabase.table('users').update(updated_fields).eq('id', id).execute()
    
    all_users = supabase.table('users').select('*').execute()
    return {"users": all_users.data, "message": "User Updated Successfully"}
