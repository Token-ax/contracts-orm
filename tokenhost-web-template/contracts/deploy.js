const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('https://chain.tokenhost.com');
const Handlebars = require('handlebars')


const bytecode = fs.readFileSync('App_sol_App.bin','utf8');
var abi = JSON.parse(fs.readFileSync('App_sol_App.json', 'utf8'));

async function main(){
  const ganacheAccounts = await web3.eth.getAccounts();
  const helloWorld = new web3.eth.Contract(abi);

  helloWorld.deploy({
    data: bytecode
  }).send({
    from: ganacheAccounts[0],
  }).then((deployment) => {
    console.log('Contract was deployed at the following address:');
    console.log(deployment.options.address);
    
    let web3helper_template = Handlebars.compile(
      fs.readFileSync('../helpers/Web3Helper.hbs', 'utf-8'),
    )


  fs.writeFileSync(
    `../../site/helpers/Web3Helper.js`,
    web3helper_template({ contract_address:deployment.options.address }),
  )


  }).catch((err) => {
    console.error(err);
  });
}

main().then(function(){
  console.log("DONE")
})

//Contract was deployed at the following address:
//0xbd6959D258c24b0922505859E6aCAA700858f18e
