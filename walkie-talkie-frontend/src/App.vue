<template>
  <div>
    <button type="button" v-if="ready" 
      @mousedown="startTalking"
      @mouseup="disconnect">
      Hold to Talk
    </button>
    <div v-else>
      <form @submit="handleSubmit">
        <p><label for="chooseHandle">Choose a Handle To Begin</label></p>
        <select name="identity" id="chooseHandle" v-model="identity">
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

const device = new Device();

export default {
  name: 'App',
  data(){
    return {
      identity: '',
      status: '',
      ready: false,
      device: null,
    }
  },
  methods: {
    handleSubmit(event){
      event.preventDefault();

      fetch(`https://walkie-talkie-service-3809-dev.twil.io/token?identity=${this.identity}`)
      .then(response => response.json())
      .then(data => {
        device.setup(data.accessToken, {debug: true});
        device.audio.incoming(false);
        device.audio.outgoing(false);
        device.audio.disconnect(false);
    })
    .catch(err => console.log(err))
    },
    startTalking(){
      this.identity === 'friend1' ? 'friend2' : 'friend1';
      device.connect({recipient: this.identity});
    },
    disconnect(){
      device.disconnectAll();
    }
  },
  mounted(){
    device.on('incoming', connection => {
      // immediately accepts incoming connection
      connection.accept();
      this.status = connection.status();
    });

    device.on('ready', () => {
      console.log('ready')
      this.status = "device ready"; 
      this.ready = true; 
    });

    device.on('connect', connection => {
      console.log('connect')
      this.status = connection.status();
    });

    device.on('disconnect', connection => {
      this.status = connection.status();
    });
  }
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
