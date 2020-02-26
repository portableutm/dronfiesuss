# Geoserver

## Instrucciones 
 - Descargar http://geoserver.org/release/stable/

## Add layer
 - (Optional) Add a new **Worksapce** from left menu, it's easy, only need a name and a uri.
 - Add a new **store**, for example, from a geotiff.
  ![Add new store options](/doc/newDataSource.png)
 - Example from geotiff
  ![Add new store options](/doc/newDataSource.png)
 - Publish a layer as a wms from store and fill the form. You can use the deafault params.
  ![Publish layer](/doc/newLayer.png)
    

## Using from leaflet
To use from leaflet it's important get the workspace and layer name.
```
L.tileLayer.wms('http://localhost:8080/geoserver/Dronfies/wms?', {
          service: "WMS",
          version: "1.1.0",
          request: "GetMap",
          layers: "Dronfies:HYP_HR_SR_OB_DR",
          srs: "EPSG:4326",
        }
```