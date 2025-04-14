<template>
    <div v-if="!gameStarted">
      <input v-model="roomID" placeholder="ID de la salle" />
      <button @click="joinRoom">Rejoindre</button>
    </div>
  
    <div v-else>
      <h2>Temps : {{ timer }}</h2>
      <h3>{{ question.question }}</h3>
      <div v-for="(answer, i) in question.answers" :key="i">
        <button @click="handleAnswer(i)">
          {{ answer }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import socket from '../socket';
  
  const roomID = ref('');
  const timer = ref(0);
  const question = ref({});
  const gameStarted = ref(false);
  
  const joinRoom = () => {
    socket.emit('join_room', roomID.value);
  };
  
  onMounted(() => {
    socket.on('start_game', (data) => {
      timer.value = data.timer;
      question.value = data.question;
      gameStarted.value = true;
  
      // Décrémenter le timer toutes les secondes
      const interval = setInterval(() => {
        if (timer.value > 0) {
          timer.value--;
        } else {
          clearInterval(interval);
          alert("Temps écoulé !");
        }
      }, 1000);
    });
  });
  
  const handleAnswer = (index) => {
    if (index === question.value.correct) {
      alert("Bonne réponse !");
    } else {
      alert("Mauvaise réponse !");
    }
  };
  </script>
  