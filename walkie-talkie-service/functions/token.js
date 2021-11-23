exports.handler = function(context, event, callback) {
  const twilioAccountSid = context.ACCOUNT_SID;
  const twilioApiKey = context.API_KEY;
  const twilioApiSecret = context.API_SECRET;
  const outgoingApplicationSid = context.OUTGOING_SID;

  const AccessToken = Twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;
  const response = new Twilio.Response();

  const identity = event.identity;

  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    {identity: identity}
  );

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: outgoingApplicationSid,
    incomingAllow: true
  });

  token.addGrant(voiceGrant);
   
  response.setHeaders(headers);

  response.setBody({
    accessToken: token.toJwt() 
  });

  return callback(null, response);
}
