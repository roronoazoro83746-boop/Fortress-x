from app.api.routes import predict, alerts

api_router = APIRouter()
api_router.include_router(predict.router, prefix="/predict", tags=["prediction"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
