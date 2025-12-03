---
title: "Building a REST API with Python and FastAPI"
date: "2024-11-15"
description: "A detailed guide on how to build a high-performance REST API using Python and the FastAPI framework."
tags: ["Python", "FastAPI", "API"]
author: "Your Name"
---

# Building a REST API with Python and FastAPI

FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. In this comprehensive guide, we'll explore how to build a production-ready REST API.

## Why FastAPI?

FastAPI has gained massive popularity in the Python community for several compelling reasons:

- **Fast**: Very high performance, on par with NodeJS and Go
- **Fast to code**: Increase the speed to develop features by about 200% to 300%
- **Fewer bugs**: Reduce about 40% of human (developer) induced errors
- **Intuitive**: Great editor support with auto-completion everywhere
- **Easy**: Designed to be easy to use and learn
- **Short**: Minimize code duplication

## Getting Started

First, let's install FastAPI and an ASGI server:

```bash
pip install fastapi uvicorn[standard]
```

## Creating Your First API

Here's a simple example to get you started:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```

## Path Parameters and Validation

FastAPI uses Python type hints for automatic validation:

```python
from fastapi import FastAPI, Path
from typing import Optional

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(
    item_id: int = Path(..., title="The ID of the item", ge=1),
    q: Optional[str] = None
):
    return {"item_id": item_id, "q": q}
```

## Request Body with Pydantic

One of FastAPI's most powerful features is its integration with Pydantic:

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

app = FastAPI()

@app.post("/items/")
async def create_item(item: Item):
    return item
```

## Database Integration

Here's how to integrate with a database using SQLAlchemy:

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

## Dependency Injection

FastAPI has a powerful dependency injection system:

```python
from fastapi import Depends, FastAPI

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/")
async def read_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users
```

## Authentication and Security

Implementing JWT authentication:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username
```

## Testing Your API

FastAPI makes testing easy with TestClient:

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}
```

## Conclusion

FastAPI is an excellent choice for building modern APIs with Python. Its automatic documentation, type safety, and high performance make it ideal for both small projects and large-scale applications.

Key takeaways:
- Use type hints for automatic validation
- Leverage Pydantic for data modeling
- Implement proper dependency injection
- Always add authentication for production APIs
- Write tests for your endpoints

Happy coding!
