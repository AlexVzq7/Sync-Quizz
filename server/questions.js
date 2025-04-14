const questions = [
    {
      question: "Capitale de l’Australie ?",
      answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correct: 2
    },
    {
      question: "Combien de pattes a une araignée ?",
      answers: ["6", "8", "10", "12"],
      correct: 1
    },
    {
      question: "Quel est le plus grand océan ?",
      answers: ["Atlantique", "Arctique", "Indien", "Pacifique"],
      correct: 3
    }
  ];
  
  module.exports.getRandomQuestion = () => {
    return questions[Math.floor(Math.random() * questions.length)];
  };
  