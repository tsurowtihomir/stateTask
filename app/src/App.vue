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
      socket: null
    };
  },
  methods: {
    toggleState() {
      this.isPressed = !this.isPressed;
      this.buttonText = this.isPressed ? 'Pressed' : 'Not Pressed';
      this.emitStateChange();
    },
    emitStateChange() {
      if (this.socket) {
        this.socket.emit('buttonStateChange', this.isPressed);
      } else {
        console.error('Socket is not initialized');
      }
    }
  },
  mounted() {
    this.socket = io('http://localhost:3000', { transports: ['websocket'] });
    if (this.socket) {
      this.socket.on('buttonStateChange', (state) => {
        this.isPressed = state;
        this.buttonText = state ? 'Pressed' : 'Not Pressed';
      });
    } else {
      console.error('Socket connection failed');
    }
  }
};
</script>

<style>
</style>
