# Ejercio de BackEnd para Sirena

# Prerequisitos 
node.js >= 10

MongoDb

# Intalacion

Base de datos
-------------

```# mongorestore --host [host] --port [host] ./Ganymede/db/dump/```


Dependencias
-------------

```
# cd Ganymede
# npm install
```

```
# cd Themito
# npm install
```

# Configurar Ganymede 

Editar /Ganymade/config/config.js
```
  name: "Ganymede",
  port: 3002, # Puerto de la aplicacion
  secretKey: "GANYMEDE", # Clave secreta para el token
  host: "http://localhost", # Host de la aplicacion
  themistoAPI: "http://localhost:3003/api", # host de themisto
  db: {
    server: '127.0.0.1', # Servidor de db
    name: 'Ganymede', # Nombre de Db
    port: 27017 # Puerto de DB
  }
```

# Configurar Themisto 

Editar /Themisto/config/config.js
```
  name: "Themisto",
  username: "admin", # Usuario para conectar con Ganymede (configurado como admin en la base de datos default)
  password: "admin", # password para conectar con Ganymede
  port: 3003, # Puerto de la aplicacion
  publicApi: "http://localhost:3002/api",  # host de la api publica de Ganymede
  privateApi: "http://localhost:3002/private", # host de la api publica de Ganymede
  crawling: {
    parallel: 12  # Numero de procesos en paralelo para el web crawling
  }
```

# Ejecucion

* Ejecutar Ganymede
```node Ganymade/src/index.js```

* Ejecutar Themisto
```node Themisto/src/index.js```

# API Ganymede

* POST /api/product/search
Se le envia un paquete como en el del ejemplo, para inciar una nueva busqueda de productos sobre el provider

- Paquete Ejemplo
```
{
  searchQuery: 'tv', # String de busqueda
  provider: 'easy', # Permitido unicamente Ebay
  options: {
    user: "themisto@piojon.33mail.com", # Usuario del provider
    password: "themisto" # Password del provider
  },
  callbackUrl: "http://localhost:3002/api/testCallback" # Url a donde enviar la respuesta
};
```
 - Se tiene que mandar a '/api/product/search' de Ganymede
 - Se precreo en Ebay el siguiente usuario y password 
  ```
  Username: themisto@piojon.33mail.com  -  Password: themisto
  ```


 - Envio del ejemplo en Curl
  ```
  curl -X POST -H 'Content-Type: application/json' -d '{"searchQuery":"tv","provider":"easy","options":{"user":"themisto@piojon.33mail.com","password": "themisto"},"callbackUrl":"http://localhost:3003/api/testCallback"}' http://localhost:3002/api/product/search
  ```

* GET /api/product/search-order/{searchOrderId}
  Devuelve la orden de busqueda pedida.

* GET /api/product/search-order/List
  Devuelve la una lista con todas las ordenes.

* GET /api/product/category/{categoryId}
  Devuelve todos los productos que esten el la categoria categoryId.

# API Themisto

* POST /api/testCallback
  Ruta creada para poder testear el callbackUrl, el cual imprime la informacion que llegue en el post request.
