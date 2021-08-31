
# StreamDeck

<p align="center">
  <img src="https://user-images.githubusercontent.com/721001/131522182-63675405-35db-46e9-aa5a-3ea909348e64.png" height="200">
  <img src="https://user-images.githubusercontent.com/721001/131512494-eea05f05-bb1c-4182-a4ce-901dce93cdc1.png" height="200">
</p>

Simple server that captures raw keyboard inputs and broadcasts them via socket. \
Made for my `Raspberry PI zero W`, the peripheral's name is configured here <a href="https://github.com/Durss/StreamDeck/blob/master/src_back/utils/Config.ts#L21" target="_blank">here</a>. \
Also, the binary data from my periphal may not be the same as yours, i'm using the <a href="http://www.reiie.com/product/mini/44.html" target="_blank">REiiE Mini H9+</a> bluetooth keyboard. \
 \
Once server is running *(read everything bellow first)* it provides a webpage that should log keyboard events at this url : \
`http://IP_OF_YOUR_RASPBERRY_PI:3013`


## Project setup
```
> npm install
```

Install PM2 globally (will run the script as a service) :
```
> npm i -g pm2
```

## Project dev/build

### Compile front with hot-reloads for development
```
> npm run front/serve
```

### Compile front for production
```
> npm run front/build
```

### Compile server with hot-reloads for development
```
> npm run server/watch
```

### Compile server for production
```
> npm run server/build
```

### Shortcut for developpement
```
> npm run dev
``` 
Starts front and server with hot reload.\
Node process has to be started manually. See [Starting services section](#starting-services).

### Compile server+front for production
```
> npm run build
``` 


## Starting services
Execute this inside project folder's root
```
> pm2 start bootstrap-pm2.json
```

To view process logs via PM2, execute :
```
> pm2 logs --raw ProtopotesRaider
```

## Start on boot (DOESN'T work on windows)
First start the client as explained above.  
Then execute these commands:
```
> pm2 save
> pm2 startup
```
Now, the service should automatically start on boot 


## Keyboard config
The keyboard's name and path is configured [there](https://github.com/Durss/StreamDeck/blob/master/src_back/utils/Config.ts#L21). \
Yours might be different. Plug your keyboard an list the available devices with this command :
```
> ls -la /dev/input/by-id/
```
The keyboard device might endup with "kbd". \
Not sure it's necessary but you may want to give access to that device to the user `pi` :
```
> sudo setfacl -m u:pi:r /dev/input/by-id/usb-0513_0318-event-kbd
```
*(replace the device's name by yours)*

## Deploy to Raspberry and run project
Build the project via :
```
> npm run build
``` 
Put the files from the `server/` folder anywhere you like on your raspberry. \
Put the `package.json` file next to these files and run this to install dependencies:
```
> npm install
``` 
Create a `public/` folder in the same place and put the content of the `dist/` folder inside it. \
Create an `env.conf` file still in the same place and just write `prod` inside it. \
 \
Run the server either manually or via PM2 *(see above)*:
```
> node bootstrap.js
``` 
Open this URL on your browser and if everything's ok you should see keyboard events live like bellow:
```
http://RASPBERRY_PI_IP:3013
```
<p align="center">
  <img src="https://user-images.githubusercontent.com/721001/131586317-dbd9fa1d-12bf-4d1e-bb22-b9232e24dd46.png" height="200">
</p>