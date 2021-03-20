const fs = require('fs');

let rawdata = fs.readFileSync('tweet.json');
let program = JSON.parse(rawdata);
//console.log(JSON.stringify(program,null,4));

let contracts = program.contracts
let template = `
pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;
`
for (const ContractName in contracts) {
    const contract = contracts[ContractName]
    const fields = contract.fields

    template += `contract ${ContractName}{\n\n`
    for (const field in contract.fields) {
        const field_type = fields[field]
        template += `\t${field_type} ${field};\n`
    }

    //now create init method

    //define function name
    template += `\n\tfunction ${ContractName}(`

    //add all the pass-in methods
    contract['initRules']['passIn'].forEach((element, index) => {
        const type = fields[element]
        template += `${type} _${element}`
        if (index != contract['initRules']['passIn'].length - 1) {
            template += `, `
        }
    });

    template += `){\n`

    //create all the auto definitions

    for (const autofield in contract.initRules.auto) {
        const value = contract.initRules.auto[autofield]
        template += `\t\t${autofield} = ${value};\n`
    }

    //assign all the pass in variables using the _ hack
    contract.initRules.passIn.forEach(autofield => {
        template += `\t\t${autofield} = _${autofield};\n`
    })

    //end init

    template += `\t}\n`


    //read rules
    const get_all_types = [];
    const get_all_fields = [];
    contract.readRules.gets.forEach(field => {
        const type = fields[field]
        get_all_types.push(type);
        get_all_fields.push(field)
    });
    get_all_fields_string = get_all_fields.join(", ")
    get_all_types_string = get_all_types.join(", ")

    template +=`
    function getall() returns (${get_all_types_string}){
        return (${get_all_fields_string});
    }`
    

    contract.readRules.gets.forEach(field => {
        const type = fields[field]
        template += `\tfunction get_${field}() returns (${type}){return ${field};}\n`
    });
    template += `\n}`

}

template += `
contract App {\n`

for (const ContractName in contracts) {
    const contract = contracts[ContractName]
    const fields = contract.fields
    template += `
  address[] ${ContractName}_list; 
  uint256 ${ContractName}_list_length;

function get_${ContractName}_list_length() returns (uint256){
    return ${ContractName}_list_length;
}`


  //get all

  const get_all_types = [];
  const get_all_types_array = []
  const get_all_fields = [];
  contract.readRules.gets.forEach(field => {
      const type = fields[field]
      get_all_types.push(type);
      get_all_types_array.push(type+"[]")
      get_all_fields.push(field)
  });
  const get_all_fields_string = get_all_fields.join(", ")
  const get_all_types_string = get_all_types.join(", ")
  const get_all_types_array_string = get_all_types_array.join(", ")

  template +=`
  function get_${ContractName}_N(uint256 index) returns (${get_all_types_string}){
      return ${ContractName}(${ContractName}_list[index]).getall();
  }


  
  function get_last_${ContractName}_N(uint256 count, uint256 offset) returns (${get_all_types_array_string}){`
  contract.readRules.gets.forEach(field => {
    const type = fields[field]
    template += `${type}[] memory ${field} = new ${type}[](count);`
  })
    template +=   `for (uint i = offset; i < count; i++) {
        ${ContractName}  my${ContractName} = ${ContractName}(${ContractName}_list[i+offset]);`
        contract.readRules.gets.forEach(field => {
            template += `${field}[i+offset] = my${ContractName}.get_${field}();`
        })
    template += `}
    return (${get_all_fields_string});
    }`
  
  

}

//create the equivalent of the users tables
// but include references to the contracts they've created for easy access
template += `

  struct UserInfo {
    address owner;
    bool exists;
    \n`
for (const ContractName in contracts) {
    template += `\taddress[] ${ContractName}_list;
  uint256 ${ContractName}_list_length;
`
}



template += `
}
mapping(address => UserInfo) public user_map;
\taddress[] UserInfoList;
uint256 UserInfoListLength;
`;


for (const ContractName in contracts) {
    const contract = contracts[ContractName]
    const fields = contract.fields

    template += `

    event New${ContractName}(address sender); 

function new_${ContractName}(`


    //add all the pass-in methods
    contract['initRules']['passIn'].forEach((element, index) => {
        const type = fields[element]
        template += `${type} ${element}`
        if (index != contract['initRules']['passIn'].length - 1) {
            template += `, `
        }
    });

    template += `)returns (address){\n
  
  
        
  address mynew = address(new ${ContractName}({`
 
    //add all the pass-in methods
    contract['initRules']['passIn'].forEach((element, index) => {
        const type = fields[element]
        template += `_${element} : ${element}` 
        if (index != contract['initRules']['passIn'].length - 1) {
            template += `, `
        }
    });

template +=`
}));
  if(!user_map[tx.origin].exists){
    user_map[tx.origin]=create_user_on_new_${ContractName}(mynew);
  }
  user_map[tx.origin].${ContractName}_list.push(mynew);

${ContractName}_list.push(mynew);
${ContractName}_list_length+=1;


  emit New${ContractName}(tx.origin);

  return mynew;
  
}


function  create_user_on_new_${ContractName}(address addr) private returns (UserInfo){
    address[]storage ${ContractName}_list;
    UserInfoList.push(addr);
    return UserInfo({exists:true, owner:addr,  
        
      
    `
    for (const ContractName in contracts) {
        template += `${ContractName}_list : ${ContractName}_list, 
       ${ContractName}_list_length : 0,
    `
    }
    
  template +=  `});
}




`

}

template += '}'
console.log(template)

//todo create the parent contract and the events