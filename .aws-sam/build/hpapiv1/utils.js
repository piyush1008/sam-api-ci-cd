
const axios = require('axios');
const qs = require("qs");
// import axios from "axios";

const NodeCache = require("node-cache");


const myCacher = new NodeCache({ stdTTL: 600 });

let countryCodes = {
    "US": 1,
    "us": 1,
    "GB": 44,
    "gb": 44,
    "UK": 44,
    "uk": 44,
    "IE": 353,
    "ie": 353,
    "FR": 33,
    "fr": 33,
    "DE": 49,
    "de": 49,
    "AU": 61,
    "au": 61,
    "NZ": 64,
    "nz": 64,
    "za": 27,
    "ZA": 27,
    "ES": 34,
    "es": 34,
    "MX": 52,
    "mx": 52,
    "CO": 57,
    "co": 57
}



const buildPhoneNumber=(phoneNumber,countryCode)=>{
    let countryPrefix = countryCodes[countryCode];
    return phoneNumber.startsWith(countryPrefix)
        ? phoneNumber
        : countryPrefix + phoneNumber;
}


 const oneUIDRequest=async(requestBody)=>{
    console.log("|1|",requestBody);
   let credsname="/Connect/OauthCredentials"
    let endpoint="https://hpcs-crm-itg.hpcloud.hp.com/v1/telephony"

//     let credString =  await getSecret(credsname);
//    console.log("|2|",credString);

   const credString={
        url:"https://login-itg.external.hp.com/as/token.oauth2",
        grant_type:"client_credentials",
        client_id:"nl-ivr-itg",
        client_secret:"ktM9alTh9Oqv7K1ZKdpoW3TmAvmyUPGpDP6ekXFx6HTjpWgYH67wVzFK95xZuV6q"
    }

    //let sessionToken = await getAuthToken(credString);
    let sessionToken = await getAuthToken1(credString);
    console.log("|3|",sessionToken);

   // let sessionToken="eyJhbGciOiJSUzI1NiIsImtpZCI6IktleSIsInBpLmF0bSI6IjN1d3AifQ.eyJjbGllbnRfaWQiOiJubC1pdnItaXRnIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi1pdGcuZXh0ZXJuYWwuaHAuY29tIiwiZXhwIjoxNjk3NTI0NDYwfQ.r5oqtfzv93wvnUhswcnIJmQWTHvduAYpGtF_sFsQG5EEGolsYRAA4orp4T8SOgoS-rZB9ERdHWvavsglaOQiBh7dq7yvP2zmzUAuP-xdSt-PnSpLSPCwQQXJE7vaBxdrtBw7w9yWCrrlrdkZ9Vh8uG8oHRoo44WfhRouZYm9NSmFrz8Sb5ktTDVhhh8S3unUJMxsg1YW3oZF7KYqfILbg-KHHEOej2LdhCm5L7IzeD0fP2sqWMx78U_aj4CqupzqidUhlgChUrBQWrFcCy_2440jHsJui_puY6GkwxFBHdG8Enb6wMHYUZJM8ndUsACtSZ47LVeDaVZN79IylY7IMg"
    
    let apiPath =
    '/' +
        endpoint
        .split('/')
        .slice(3)
        .join('/');

console.log('|0013|- >OneUID credName', apiPath);

let requestOptions = {
    host: endpoint.split('/')[2],     // "po1tnlcn76.execute-api.us-west-2.amazonaws.com",   ///replace with parameter - no hardcoded URLS!
    method: 'POST',
    url: endpoint,
    path: apiPath,
    data: requestBody,
    body: JSON.stringify(requestBody),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + sessionToken
    },
    region: 'us-west-2',
};
console.log(`|0003|-> ${apiPath} REQUEST`, requestOptions);
return await sendApiCommand(apiPath, requestBody, requestOptions);

}


const sendApiCommand=async(apiPath, requestBody, request)=>{
    let response;

    try {
        let apiStartTime = Number(Date.now());
        console.log(`${apiPath} API REQUESTBODY: ${JSON.stringify(requestBody, null, 4)}`);
        console.log(`${apiPath} API STARTTIME: ${apiStartTime}`);
        console.log('Sending ', request);
        response = await axios(request);
        let apiEndTime = Number(Date.now());
        console.log(`${apiPath} API ENDTIME: ${apiEndTime}`);
        let apiDuration = apiEndTime - apiStartTime;
        console.log(`${apiPath} API DURATION: ${apiDuration}ms`);
        console.log(`${apiPath} API RESPONSE: ${JSON.stringify(response.data, null, 4)}`);
    } catch (e) {
        console.log(`${apiPath} HPIAPISERVICE:: API ERROR: ${JSON.stringify(e, null, 4)}`);
        console.log(e);
    }

    return response;
}

const getOauthAccessToken=async(credString)=>{
    if (myCacher.has("token")) {
        console.log("6501-> returnning from the cache");
        return myCacher.get("token");
    }
    else {
        try {
            const auth = await getAuthToken(credString);
            console.log(auth)
            console.log("6502-> returnning token from the authenticator");
            console.log("6503->", auth.access_token);
            console.log("|6504| -> Auth Token Expires in " + auth.expires_in);
            myCacher.set("token", auth.access_token);
            return auth.access_token;
        } catch (error) {
            console.log("An error occurred getting auth token");
            console.log(error)
            throw error;
        }

    }

}



const getAuthToken = async (credString) => {
    try {
        console.log(credString);
        const params = {
            url: credString.url,
            grant_type: credString.grant_type,
            client_id: credString.client_id,
            client_secret: credString.client_secret
        }
        console.log("|OAUTH| => Get token from secret ", params)

        const getClientCredentials  = oauth.clientCredentials(
            axios.create(),
            credString.url, // OAuth 2.0 token endpoint
            credString.client_id,
            credString.client_secret
          )

          const auth = await getClientCredentials ('OPTIONAL_SCOPES')
          console.log("auth", auth);
          return auth.access_token



        // const getAuth = oauth.client(axios.create(), params);
        // return await getAuth();
    }
    catch (error) {
        console.error("Could not retrieve Oauth Token: " + JSON.stringify(error, null, 2));
        throw error
    }
}



const getAuthToken1 = async (credString) => {
    try {
        const url = "https://login-itg.external.hp.com/as/token.oauth2";

        const data = {
        grant_type: "client_credentials",
        };

        const auth = {
        username: "nl-ivr-itg",
        password: "ktM9alTh9Oqv7K1ZKdpoW3TmAvmyUPGpDP6ekXFx6HTjpWgYH67wVzFK95xZuV6q",
        };

        const options = {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: qs.stringify(data),
            auth: auth,
            url,
        };
        const res= await axios(options);
        console.log("res",res);
        console.log("token",res.data.access_token);
        return res.data.access_token;

        // const getAuth = oauth.client(axios.create(), params);
        // return await getAuth();
    }
    catch (error) {
        console.error("Could not retrieve Oauth Token: " + JSON.stringify(error, null, 2));
        throw error
    }
}

module.exports={
    buildPhoneNumber,
    oneUIDRequest
}



