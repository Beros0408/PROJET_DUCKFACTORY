from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import characters as characters_router

APP_VERSION = "0.1.0"
APP_NAME = "DuckFactory"


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title=f"{APP_NAME} API",
    description="Studio IA de production de contenus viraux — API Backend",
    version=APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(characters_router.router)


@app.get("/")
async def root():
    return {"message": f"{APP_NAME} API", "version": APP_VERSION, "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "ok", "service": f"{APP_NAME} API"}


@app.get("/api/v1/version")
async def version():
    return {"version": APP_VERSION, "name": APP_NAME}
