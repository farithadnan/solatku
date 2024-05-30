@echo off

set IMAGE_NAME=solatku-image
set CONTAINER_NAME=solatku-container
set PORT=8888

echo Starting deployment...

echo.
echo Stopping the existing container...
docker stop %CONTAINER_NAME%

echo.
echo Removing the existing container...
docker rm %CONTAINER_NAME%

echo.
echo Removing the existing image...
docker rmi %IMAGE_NAME%

echo.
echo Building the image...
docker build -t %IMAGE_NAME% .

echo.
echo Running the container...
docker run -d -p %PORT%:80 --name %CONTAINER_NAME% %IMAGE_NAME%

echo.
echo Deployment complete!
pause
