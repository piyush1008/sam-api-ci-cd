const {buildPhoneNumber,oneUIDRequest,getCaseResult} =require("./utils1")


exports.handler = async (event) => {
  try {
    console.log("1",event);
    const FirstName=event.firstname;
    const LastName=event.lastname;
    const EmailAddress=event.EmailAddress;
    const CountryCode=event.countryCode;
    const SessionId=event.SessionId;
    const PhoneNumber=event.phoneNumber;
    const Description=event.Description;
    let intentresult = await getCaseResult(Description);
    console.log("|1213123as1|->>", intentresult.predictedIntent);
    console.log("|1213123cx2|->>", intentresult.conversationId);

    let params={  
        ServiceName : "Routing3",
        Operation :"CreateCase",
            Data :{  
                CountryCode: CountryCode,
                PhoneNumber: PhoneNumber,
                LastName: FirstName,
                FirstName: LastName,
                SessionId: SessionId,
                Intent: intentresult.predictedIntent,
                Description: Description
            }   
    };
    let res =await oneUIDRequest(params);
    console.log("09",res);
    console.log("10",res.data);

    const result={
        statuscode:res.statuscode
    }
    return result;

  }
  catch{
    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
  }
};

