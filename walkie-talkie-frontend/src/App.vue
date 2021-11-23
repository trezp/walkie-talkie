<template>
  <div>
    <button v-if="ready"
      v-on:mousedown="connect"
      v-on:mouseup="disconnect">
      Press To Talk
    </button>
    <div v-else>
      <form v-on:submit="setUp">
        <p><label for="chooseHandle">Choose a Handle To Begin</label></p>
        <select name="selectedIdentity" id="chooseHandle" v-model="identity">
          <option disabled>Choose a Handle</option>
          <option value="friend1">friend1</option>
          <option value="friend2">friend2</option>
        </select>
        <button type="submit">Begin Session</button>
      </form>
    </div>
    <p v-if="status">Status: {{ status }}</p>
    <p v-if="identity">Handle: {{ identity }} </p>
  </div>
</template>

<script>
import { Device } from 'twilio-client';

export default {
  name: 'App',
  data(){
    return {
      identity: '',
      status: '',
      ready: false,
      device: null
    }
  },
  methods: {
    setUp(event){
      event.preventDefault();
  
      fetch(`https://walkie-talkie-service-3809-dev.twil.io/token?identity=${this.identity}`)
      .then(response => response.json())
      .then(data => {
        this.device.setup(data.accessToken, {debug: false});
        this.device.audio.incoming(false);
        this.device.audio.outgoing(false);
        this.device.audio.disconnect(false);
    })
    .catch(err => console.log(err))
    },
    connect(){
      console.log('connect')
      const recipient = this.identity === 'friend1' ? 'friend2' : 'friend1';
      this.device.connect({recipient: recipient});
    },
    disconnect(){
      this.device.disconnectAll();
    }
  },
  mounted(){
    this.device = new Device();

    this.device.on('incoming', connection => {
      // immediately accepts incoming connection
      console.log('incoming')
      connection.accept();
      this.status = connection.status();
    });

    this.device.on('ready', () => {
      console.log('ready')
      this.status = "device ready"; 
      this.ready = true; 
    });

    this.device.on('connect', connection => {
      console.log('connect')
      this.status = connection.status();
    });

    this.device.on('disconnect', connection => {
      console.log('disconnect')
      this.status = connection.status();
    });
  },
  components: {}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
