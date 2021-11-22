exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.VoiceResponse();

  const recipient = event.recipient;

  var dial = twiml.dial();
  dial.client({},recipient);
    
  return callback(null, twiml);
}