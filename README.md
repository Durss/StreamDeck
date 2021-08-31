
# StreamDeck

<p align="center">
  <img src="https://user-images.githubusercontent.com/721001/131522182-63675405-35db-46e9-aa5a-3ea909348e64.png" height="200">
  <img src="https://user-images.githubusercontent.com/721001/131512494-eea05f05-bb1c-4182-a4ce-901dce93cdc1.png" height="200">
</p>

Simple server that captures raw keyboard inputs and broadcasts them via socket. \
Made for my `Raspberry PI zero W`, the peripheral's name is hardcoded <a href="https://github.com/Durss/StreamDeck/blob/master/src_back/controllers/HIDController.ts" target="_blank">here</a>. \
Also, the binary data from my periphal may not be the same as yours, i'm using the <a href="http://www.reiie.com/product/mini/44.html" target="_blank">REiiE Mini H9+</a> bluetooth keyboard. \
 \
Once server is running it provides a webpage that should log keyboard events at this url : \
http://localhost:3013


## Project setup
```
npm install
```

Install PM2 globally (will run the script as a service) :
```
npm i -g pm2
```

## Project dev/build

### Compile front with hot-reloads for development
```
npm run front/serve
```

### Compile front for production
```
npm run front/build
```

### Compile server with hot-reloads for development
```
npm run server/watch
```

### Compile server for production
```
npm run server/build
```

### Shortcut for developpement
```
npm run dev
``` 
Starts front and server with hot reload.\
Node process has to be started manually. See [Starting services section](#starting-services).

### Compile server+front for production
```
npm run build
``` 


### Starting services
Execute this inside project folder's root
```
pm2 start bootstrap-pm2.json
```

To view process logs via PM2, execute :
```
pm2 logs --raw ProtopotesRaider
```

## Start on boot (DOESN'T work on windows)
First start the client as explained above.  
Then execute these commands:
```
pm2 save
pm2 startup
```
Now, the service should automatically start on boot 
