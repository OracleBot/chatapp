SET DEBUG=chatapp:* & npm start
SET DEBUG=chatapp:* & npm run devstart

$env:GOOGLE_APPLICATION_CREDENTIALS= "C:\Users\dipverma\Node\chatapp\ardysdev1-f045d2c6330e.json"
set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\dipverma\Node\chatapp\ardysdev1-f045d2c6330e.json

Mac
$env:DEBUG=chatapp:* & npm run devstart
export GOOGLE_APPLICATION_CREDENTIALS=/Users/diprish/Downloads/chatapp/config/ascend-test-1-dhxwoj-e80f3d4aed0b.json

Heroku--
https://warm-refuge-85840.herokuapp.com/ | https://git.heroku.com/warm-refuge-85840.git

git push heroku master
heroku ps:scale web=1
heroku config:set GOOGLE_APPLICATION_CREDENTIALS=config/ardysdev3-d1917d25111f.json

heroku config:set GOOGLE_APPLICATION_CREDENTIALS=config/ascend-test-1-dhxwoj-e80f3d4aed0b.json
heroku open
heroku restart
heroku logs --tail
https://medium.com/@naz_islam/how-to-authenticate-google-cloud-services-on-heroku-for-node-js-app-dda9f4eda798

Cloud Functions:
Deployment:
gcloud beta functions deploy ardysDev3WebHook --trigger-http

WebHook
gcloud beta functions deploy ardysDev3WebHook --stage-bucket staging.ardysdev3.appspot.com --trigger-http

Latest Version Deployed:
https://radiant-sands-65729.herokuapp.com/?id=12345