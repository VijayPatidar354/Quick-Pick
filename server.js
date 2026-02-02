const express = require("express");
const app = express();
app.use(express.static("public"));

const PORT = process.env.PORT || 8080;

const expressServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const level1Arr = [
  { clue: "I keep the doctor away if you eat me daily", name: "Apple" },
  { clue: "I buzz and love flowers", name: "Bee" },
  { clue: "I purr and love chasing mice", name: "Cat" },
  { clue: "I bark and wag my tail", name: "Dog" },
  { clue: "I have big ears and a long trunk", name: "Elephant" },
  { clue: "I swim in water and breathe through gills", name: "Fish" },
  { clue: "I climb hills and give milk", name: "Goat" },
  { clue: "I am big and live in water, but I'm not a fish", name: "Hippo" },
  { clue: "I melt when it’s hot", name: "Ice" },
  { clue: "I'm sweet and wobbly, often found at parties", name: "Jelly" },
  { clue: "I hop and carry my baby in a pouch", name: "Kangaroo" },
  { clue: "I am the king of the jungle", name: "Lion" },
  { clue: "I love cheese and squeak", name: "Mouse" },
  { clue: "You wear me around your neck in winter", name: "Scarf" },
  { clue: "I live in the ocean and have eight legs", name: "Octopus" },
  { clue: "I can’t fly but I waddle and love snow", name: "Penguin" },
  { clue: "I lay eggs and can fly, but I'm not a plane", name: "Quail" },
  { clue: "I have long ears and hop fast", name: "Rabbit" },
  { clue: "I carry my house on my back", name: "Snail" },
  { clue: "I have stripes and a loud roar", name: "Tiger" },
  { clue: "I'm magical, have a horn, and kids love me", name: "Unicorn" },
  { clue: "I soar in the sky and eat dead animals", name: "Vulture" },
  { clue: "I howl at the moon and live in packs", name: "Wolf" },
  { clue: "I'm a noble gas, but I sound mysterious", name: "Xenon" },
  { clue: "I'm big, hairy, and moo on farms", name: "Yak" },
  { clue: "I have black and white stripes and run fast", name: "Zebra" }
];

const level2Arr = [
  { clue: "What barks and loves to play fetch?", name: "Dog" },
  { clue: "What purrs and loves to chase things?", name: "Cat" },
  { clue: "What has two wheels and you ride it?", name: "Bicycle" },
  { clue: "What round thing do you kick or throw?", name: "Ball" },
  { clue: "What do you sit on?", name: "Chair" },
  { clue: "What do you put your food on?", name: "Table" },
  { clue: "Where do you sleep at night?", name: "Bed" },
  { clue: "What makes light when it is dark?", name: "Lamp" },
  { clue: "What do you wear on your feet?", name: "Shoes" },
  { clue: "What do you watch cartoons on?", name: "TV" },
  { clue: "What do you read to learn new things?", name: "Book" },
  { clue: "What do you lay your head on while sleeping?", name: "Pillow" },
  { clue: "What floats in the air and is colorful at parties?", name: "Balloon" },
  { clue: "What stuffed animal do you hug when you're feeling sleepy?", name: "Teddy Bear" },
  { clue: "What do you use to stay dry when it rains?", name: "Umbrella" },
  { clue: "What do you use to write or draw on paper?", name: "Pen" },
  { clue: "What tells you what time it is?", name: "Clock" },
  { clue: "What do you wear on your feet inside shoes?", name: "Socks" },
  { clue: "What do you drink from when you have juice or milk?", name: "Cup" },
  { clue: "What do you use to clean your teeth?", name: "Toothbrush" },
  { clue: "What do you use to cut paper or fabric?", name: "Scissors" },
  { clue: "What do you write in during school?", name: "Notebook" },
  { clue: "What do you carry your books and lunch in?", name: "Backpack" },
  { clue: "What do you use to unlock doors?", name: "Key" },
  { clue: "What do you use to cool yourself when it is hot?", name: "Fan" },
  { clue: "What do you use to sweep the floor?", name: "Broom" },
  { clue: "What do you use to eat soup?", name: "Spoon" },
  { clue: "What do you use to eat pasta or salad?", name: "Fork" },
  { clue: "What do you use to cut food?", name: "Knife" },
  { clue: "What do you use to call someone or text them?", name: "Phone" },
  { clue: "What do you use to play games or do school work online?", name: "Computer" },
  { clue: "What do you watch cartoons and movies on?", name: "Television" },
  { clue: "What do you wear on your head when riding a bike?", name: "Helmet" },
  { clue: "What do you wear on your hands when it is cold?", name: "Glove" },
  { clue: "What do you use to dig in the garden or sand?", name: "Shovel" },
  { clue: "What do you drink from when you are thirsty?", name: "Water Bottle" },
  { clue: "What do you use to comb your hair?", name: "Brush" },
  { clue: "What musical instrument has strings you pluck to make music?", name: "Guitar" },
  { clue: "What do you pop to make a loud sound at a party?", name: "Balloon" },
  { clue: "What helps you find places when you are traveling?", name: "Map" },
  { clue: "What do you use to attach papers together?", name: "Stapler" },
  { clue: "What do you use to write or draw that you can erase?", name: "Pencil" },
  { clue: "What do you use to see in the dark?", name: "Flashlight" }
];


const socketio = require("socket.io");
const io = socketio(expressServer);

let users = [];
let roomno = 1;

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);
  socket.emit("welcome");

  socket.on("add", (user) => {
    socket.user = user;
    users.push(socket);

    if (users.length < 2) {
      socket.emit("wait", "Waiting for an opponent...");
    } else {
      const p1 = users.shift();
      const p2 = users.shift();

      console.log(`Match Found: ${p1.user} vs ${p2.user}`);
      p1.emit("match_found", p2.user);
      p2.emit("match_found", p1.user);

      const room = roomno++;
      p1.join(room);
      p2.join(room);

      // Score sharing
      p1.on("score", (data) => p2.emit("oscore", data));
      p2.on("score", (data) => p1.emit("oscore", data));

    
      const totalQuestions = Math.min(p1.level || 5, p2.level || 10); // fallback to level 1 count
      const levelArr = (totalQuestions === 5) ? level1Arr : level2Arr;
      const n = levelArr.length;

      // Generate unique question number
      const usedCorrectIndices = new Set();
      while (usedCorrectIndices.size < totalQuestions) {
        usedCorrectIndices.add(Math.floor(Math.random() * n));
      }
      const correctIndices = [...usedCorrectIndices];

      for (let x = 0; x <= totalQuestions; x++) {
        setTimeout(() => {
          if (x === totalQuestions) {
            p1.emit("result");
            p2.emit("result");
          } else {
            const correctIndex = correctIndices[x];
            let optionIndices = new Set([correctIndex]);
            while (optionIndices.size < 4) {
              optionIndices.add(Math.floor(Math.random() * n));
            }
            const options = [...optionIndices].map(i => levelArr[i].name);
            const clue = levelArr[correctIndex].clue;

            io.to(room).emit("quiz", { clue, options });
          }
        }, x * 10000);
      }
    }
  });

  // Level selection
  socket.on("level", (data) => {
    socket.level = data;
  });

  socket.on("exit_game", (username) => {
    console.log(`${username} has exited the game.`);

    const opponent = users.find(u => u.user !== username); 
    if (opponent) {
     
      opponent.emit("challenger_left", "Your Challenger Ran Away, You Won!");
    }


    users = users.filter(s => s !== socket);
  });

 
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user}`);
    users = users.filter(s => s !== socket);

    const opponent = users.find(u => u.user !== socket.user);
    if (opponent) {
      opponent.emit("challenger_left", "Your Challenger Ran Away, You Won!");
    }
  });
});
