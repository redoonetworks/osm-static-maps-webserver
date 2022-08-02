const express = require('express');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const chalk = require("chalk");
const StaticMaps = require('staticmaps');
const bodyParser = require('body-parser');

const exists = fs.existsSync('./config.js');
if(exists === false) {
    fs.copyFile(`${__dirname}/config.dist.js`, `${__dirname}/config.js`, (err) => {
        if (err) throw err;
        console.log('source.txt was copied to destination.txt');
    });
}

const config = require('./config.js');

const port = config.httpPort;

const imgFolder = `${__dirname}/img/`;
const cacheFolder = config.cachePath;

const app = express();
const httpServer = http.createServer(app);

app.use(cors())
app.use(bodyParser.json({limit: '16mb', extended: true}));

if (!fs.existsSync(cacheFolder)){
    fs.mkdirSync(cacheFolder);
}

/**
 * Format:
 * {
 *  width: 800,
 *  height: 1024,
 *  "zoom": { 
 *      "max": 10 
 *  },
 *  marker: [{
 *      coords: [13, 54], 
 *      icon: 'grey',
 *      text: '12',
 * }],
 *  legs: [
 *      {
 *          color: '#51789b88',
 *          width: 6,
 *          polyline: [[13,54], [13,54], [13,54], [13,54], ...],
 *          
 *      }
 *  ]
 * 
 * }
 */
app.get('/', async (_request, response) =>  {
    response.send('OSM Static Map Generator');
});

app.post('/', async (request, response) =>  {
    let body = request.body;

    const start = new Date()

    let options = {
        width: body.width ? +body.width : 800,
        height: body.height ? +body.height : 800,
        tileUrl: process.env.TILEURL || config.tileUrl,

        tileCacheFolder: cacheFolder,
        tileCacheLifetime: 86400 * 14,
        tileCacheAutoPurge: true,

        zoomRange: { 
            'min': body.zoom && body.zoom.min ? +body.zoom.min : 3, 
            'max': body.zoom && body.zoom.max ? +body.zoom.max : 17, 
        }
    };

    let legs = body.legs;
    let marker = body.marker;

    let map = new StaticMaps(options);    

    if(legs) {
        legs.forEach(route => {
            map.addLine({
                coords: route.polyline,
                color: route.color ? route.color : '#51789b88',
                width: route.width ? +route.width : 6 ,
            });
        });
    }

    if(marker) {
        marker.forEach(single => {
            let image = single.icon ? single.icon : 'grey';

            let markerOptions = {
                img: imgFolder + 'marker-' + image + '.png', // can also be a URL
                offsetX: 16,
                offsetY: 32,
                width: 32,
                height: 32,
                drawWidth:100,
                drawHeight:100,
                coord : single.coords
            };

            map.addMarker(markerOptions); 

            if(single.text) {
                let text = {
                    coord : single.coords,
                    text: single.text,
                    size: 12,
                    width: 0,
                    fill: '#000',
                    color: '#fff',
                    font: 'Arial',
                    anchor: 'middle',
                    offsetY: 16,
                };

                map.addText(text);
            }
        });
    }

    await map.render();
    
    response.contentType('image/png');
    response.end(Buffer.from(await map.image.buffer('image/png'), 'binary'));
	
    let end = new Date() - start;
    
    console.log('Route Image Generated: %dms', end);
});

httpServer.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(chalk.bgGreenBright.black(`[OK] HTTP Server is listening on Port ${port}`));
});
