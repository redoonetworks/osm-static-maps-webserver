# Open Street Map Static Map Generator

This server take a structured POST request and return an image including an OSM Map with multiple Polylines.

## Setup

- `npm i`
- copy config.dist.js to config.js and adjust tileURL
- Single execution:  
  `node server`
- Daemon execution by forever:  
  `forever start server`

## Docker Deployment

  docker run --rm -d \
    -e TILEURL="https://tile.openstreetmap.org/{z}/{x}/{y}.png"  \
    -p 3001:3001  \
    osm-static-map-webserver

## Environment variables

| Variable | Description                                                                                                                                        |
|----------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| TILEURL  | Which URL should requested for tiles? Default is taken from OSM Project. [Read usage policy](https://operations.osmfoundation.org/policies/tiles/) |
| HTTPPORT | On which port the server should listen. Default = 3001                                                                                             |
| CACHEDIR | Which folder should taken for cache files. Default "cache" in project                                                                              |

List of available tile servers: https://wiki.openstreetmap.org/wiki/Tile_servers

## Request POST Body Structure

Content-Type: application-json

```
{
    width: 800,
    height: 1024,
    zoom: { 
       min: 2,
       max: 10
    },
    marker: [
        coords: [13, 54],
        icon: 'grey'|'store',
        text: 'A',
    ],
    legs: [
        {
            color: '#51789b88',
            width: 6,
            polyline: [[13,54], [14,55], [15,56], [16,57], ...],
        }
    ]
}
```
zoom, legs and marker are optional values.

## Response Structure

You get a binary response, which include the defined map as PNG file.

## Changelog

**2022-08-02**

- complete documentation and prepare github push

**2021-11-15**

- add definition of zoomLevels

**2021-09-20**

- First version

## License

GPLv3
