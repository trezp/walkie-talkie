<template>
  <div>
    <button v-if="status === ready">Press To Talk</button>
    <div v-else>
      <p>Enter your name to begin.</p>
      <form>
        <input type="text" placeholder="What's your name?">
        <input type="submit" value="Begin Session">
      </form>
    </div>
    <p>{{ status }}</p>
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
      ready: false
    }
  },
  methods: {
    setUp(event){
      event.preventDefault();
    }
  },
  mounted(){
    const device = new Device();
    console.log(device)

    device.on('incoming', connection => {
      // immediately accepts incoming connection
      connection.accept();
      this.status = connection.status();
    });

    device.on('ready', () => {
      this.status = "device ready"; 
      this.ready = true; 
    });

    device.on('connect', connection => {
      this.status = connection.status();
    });

    device.on('disconnect', connection => {
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
