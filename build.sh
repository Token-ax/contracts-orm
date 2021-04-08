set -eux

node index.js > tokenhost-web-template/contracts/App.sol
npx prettier --write 'tokenhost-web-template/contracts/App.sol'
#build site

#rm -rf site
cp -r tokenhost-web-template site
(
cd site
yarn)


node handlebar.js


cd tokenhost-web-template/contracts; solcjs --bin --abi -o . App.sol; cp App_sol_App.abi App_sol_App.json


node deploy.js
