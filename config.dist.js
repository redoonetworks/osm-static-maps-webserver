module.exports = {
    /*
    Define the URL, where OSM maps should be loaded
    Blue Marble by NASA: https://map1.vis.earthdata.nasa.gov/wmts-webmerc/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg    
    */
    
    tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    httpPort: process.env.HTTPPORT || 3001,
    
    cachePath: process.env.CACHEFOLDER || `${__dirname}/cache`,
}