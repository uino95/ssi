# Pistis SSI - POCS branch
Intructions to set up web services on a server

After cloning the repo:

```
cd eid_provider && npm i
cd ..
cd poc_config && npm i
cd ..
cd itut && npm i
```

The important matter is to keep eid_provider on port 60005 as that is where the app will look for the onboarding page.
Try running the eid server:
```
cd eid_provider && node start.js
```

Other webservers can be run on any port as there is no hard-coded prior interaction with the Pistis app. 
Make sure the callback url specifies the port to go back when creating the Verifiable Credential.
Ports are currently set in the file poc_config/config.js

It is advised to run multiple processes using pm2
