// import {buildPhoneNumber,oneUIDRequest} from "./utils.js";

const {buildPhoneNumber,oneUIDRequest} =require("./utils")


exports.handler = async (event) => {
  try {
    console.log("1",event);
   const phonenumber=event.Details.Parameters.Phonenumber;
   const countryCode=event.Details.Parameters.CountryCode;
   const whichapi=event.Details.Parameters.whichapi;
  // const phonenumber=event.Phonenumber;
  // const countryCode=event.CountryCode;
  // const whichapi=event.whichapi;
   console.log("2",phonenumber);
   console.log("3",countryCode);
   console.log("4",whichapi);
   if(phonenumber ===null || phonenumber ===undefined)
   {
      return{
        statusCode: 500,
        body: JSON.stringify({ error: 'phonenumber is missing' }),
      }
   }
  let params;
   let fullPhoneNumber = buildPhoneNumber(phonenumber, countryCode);
    console.log("phonenumber",fullPhoneNumber);
    
    if(whichapi === "validatePN")
    {
      console.log("calling validatePN");
          params={  
            ServiceName : "Routing3",
            Operation :"ValidatePhoneN",
                Data :{  
                    CountryCode: countryCode,
                    PhoneNumber: phonenumber
                }   
        };
    }
    else if(whichapi === "validateSN")
    {
      console.log("calling validateSn");
      const serialNumber=event.Details.Parameters.serialNumber;
      const productNumber=event.Details.Parameters.productNumber;
      // const serialNumber=event.serialNumber;
      // const productNumber=event.productNumber;
      if(serialNumber === null)
      {
        return{
          statusCode: 500,
          body: JSON.stringify({ error: 'serial number is missing' }),
        }
      }
        params={  
          ServiceName : "Routing3",
          Operation :"ValidateSN",
              Data :{  
                  CountryCode: countryCode,
                  PhoneNumber: phonenumber,
                  SerialNumber: serialNumber,
                  ProductNumber: productNumber
              }   
      }; 
    }
    else if(whichapi ==="validateCaseId")
    {
       console.log("calling validateCaseID");
        const caseId=event.Details.Parameters.CaseId;
       //const caseId=event.CaseId;
       params={  
        ServiceName : "Routing3",
        Operation :"ValidateCaseId",
            Data :{  
                CountryCode: countryCode,
                PhoneNumber: phonenumber,
                CaseId: caseId
            }   
      };
      let caseData =await oneUIDRequest(params);
      console.log("|21|",caseData.data.Data.Products);
      let productName=Object.values(caseData.data.Data.Products[0])[0]['Name'];
      console.log("22",productName);
      let category=Object.values(caseData.data.Data.Products[0])[0]['Category'];
      console.log("23",category);
      if (caseData.data.Data.ServiceNames[1] && Object.values(caseData.data.Data.ServiceNames[1]).length === 1) 
      {
        const service=Object.values(caseData.data.Data.ServiceNames)[0][0].toString();
        console.log("24",service);
        const result={
          productName:productName,
          category:category,
          servicename:caseData.data.Data.ServiceNames,
          servicereturned:true
        }
        return result;

      }
      else if (caseData.data.Data.ServiceNames[1] && Object.values(caseData.data.Data.ServiceNames[1]).length > 1){
        console.log("afasfasf");
        const firstService=caseData.data.Data.ServiceNames['1'][0];
        const secondService=caseData.data.Data.ServiceNames['1'][1];
        const result={
          firstService:firstService,
          secondService:secondService,
          productName:productName,
          category:category,
          servicereturned:true
        }
        return result;
      }
      else{
        const result={
          productName:productName,
          category:category,
          servicereturned:false
        }
        return result;
      }

    }
    else{
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'please mention the api that you are calling' }),
      };
    }


    let res =await oneUIDRequest(params);
    console.log("|10|",res);
    console.log("|9|",res.data);

    console.log("|11|",res.data.Data.Cases);
    console.log("|12|",res.data.Data.ServiceNames);
    console.log("|13|",res.data.Data.Products);
    console.log("|14|",res.data.StatusCode);

    let caseArray=[];
    let productNameArray= []
    let productCategoryArray= []
    let product_Name_Category= new Map();
    for (let i = 0; i < Object.keys(res.data.Data.Cases).length; i++) {
      caseArray.push(Object.keys(res.data.Data.Cases)[i]);
  }

    for (let i = 0; i < Object.keys(res.data.Data.Products).length; i++) {
      productNameArray.push(Object.values(res.data.Data.Products[i])[0]['Name']);
      productCategoryArray.push(Object.values(res.data.Data.Products[i])[0]['Category']);
      product_Name_Category.set( productCategoryArray[i] , productNameArray[i])
    }
  console.log("|54",caseArray);
  console.log("|55",productNameArray);
  console.log("|56",productCategoryArray);
  console.log("|57",product_Name_Category)

    let caseArrayLength = caseArray.length
    console.log("|543|",caseArrayLength);

    const result={
      caselenght : caseArrayLength,
      cases:caseArray,
      servicename:res.data.Data.ServiceNames,
      statuscode:res.data.StatusCode,
      PhoneN_product_name:productNameArray,
      PhoneN_product_Category: productCategoryArray,
      Product_Name_Category: product_Name_Category
    }
    console.log("34",result);


    // Return the token in the response
    return result;
  } catch (error) {
    console.error('Error generating JWT token:', error);

    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

// handler({
//     Phonenumber:"447989688118",
//     CountryCode: "UK",
//     whichapi:"validateSN",
//     serialNumber:"CN32G472M2"
// });

