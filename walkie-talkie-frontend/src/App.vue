<template>
  <div>
    <button v-if="status === ready">Press To Talk</button>
    <div v-else>
      <p>Enter your name to begin.</p>
      <form v-on:submit="setUp">
        <input type="text" v-model="identity" placeholder="What's your name?">
        <input type="submit" value="Begin Session">
      </form>
    </div>
    <p>{{ status }}</p>
    <p>Identity: {{ identity }} </p>
  </div>
</template>

<script>
import { Device } from 'twilio-client';

export default {
  name: 'App',
  data(){
    return {
      identity: '',
      status: 'There is no status',
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
        console.log(data)
        this.device.setup(data.accessToken, {debug: true});
        console.log(event)
        //console.log(this.device)
        // this.device = device;
        // console.log(this.device)
        console.log(this.device.status())
       
        
        //this.device.setup(data.accessToken);
        this.device.audio.incoming(false);
        this.device.audio.outgoing(false);
        this.device.audio.disconnect(false);
    })
    .catch(err => console.log(err))
    }
  },
  mounted(){
    const device = new Device();
    this.device = device; 

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

    this.device.on('offline', connection => {
      console.log("blah")
      this.status = connection.status();
    })
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
