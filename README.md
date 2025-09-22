

### Start up service
sudo docker run -it \
--name dataset-tool-website \
-e NGINX_PORT=3006 \
-e BACKEND_PORT=8080 \
-e BACKEND_SERVER=127.0.0.1 \
--net host \
-t innodiskorg/dataset-tool-website:v200