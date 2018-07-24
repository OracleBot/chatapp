SET DEBUG=chatapp:* & npm start
SET DEBUG=chatapp:* & npm run devstart

$env:DEBUG=chatapp:* & npm run devstart

$env:GOOGLE_APPLICATION_CREDENTIALS= "C:\Users\dipverma\Node\chatapp\ardysdev1-f045d2c6330e.json"
set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\dipverma\Node\chatapp\ardysdev1-f045d2c6330e.json

Mac
export GOOGLE_APPLICATION_CREDENTIALS=/Users/diprish/Documents/Node/chatapp/config/ardysdev1-dfe2e5d8e15b.json

Heroku--
https://warm-refuge-85840.herokuapp.com/ | https://git.heroku.com/warm-refuge-85840.git

git push heroku master
heroku ps:scale web=1
heroku config:set GOOGLE_APPLICATION_CREDENTIALS=config/ardysdev1-dfe2e5d8e15b.json
heroku open
heroku restart
heroku logs --tail
https://medium.com/@naz_islam/how-to-authenticate-google-cloud-services-on-heroku-for-node-js-app-dda9f4eda798