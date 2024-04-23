<template>
  <div>
    <button @click="toggleState">{{ buttonText }}</button>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      buttonText: 'Not Pressed',
      isPressed: false,
      socket: null // Initialize socket to null
    };
  },
  methods: {
    toggleState() {
      this.isPressed = !this.isPressed;
      this.buttonText = this.isPressed ? 'Pressed' : 'Not Pressed';
      this.emitStateChange();
    },
    emitStateChange() {
      // Check if this.socket is defined before calling emit
      if (this.socket) {
        this.socket.emit('buttonStateChange', this.isPressed);
      } else {
        console.error('Socket is not initialized');
      }
    }
  },
  mounted() {
    // Assign this.socket to the result of io() when component is mounted
    this.socket = io('http://localhost:3000', { transports : ['websocket'] });


    // Handle socket event only if this.socket is defined
    if (this.socket) {
    this.socket.on('buttonStateChange', (state) => {
      this.isPressed = state;
      this.buttonText = state ? 'Pressed' : 'Not Pressed';
    });
  }
  }
};
</script>

<style>
/* Add your CSS styles here */
</style>
