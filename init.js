const mongoose=require("mongoose");
const Chat=require("./models/chat.js");

main()
.then(() =>{
     console.log('connection successful');
 })
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let allChats=[
    {
    from:"Rajkumar",
    to:"Pammi",
    message:"hello",
    created_at:new Date()
    },
    {
        from:"Pari",
        to:"Rajkumar",
        message:"hi Rajkumar how are you",
        created_at:new Date()
    },
    {
       from:"Rajukumar",
       to:"Rajni",
       message:"how was today your day",
       created_at:new Date()
    },
    {
        from:"prince",
        to:"Sangita",
        message:"good",
        created_at:new Date()
    }

];
Chat.insertMany(allChats)

// chat1.save()
// .then((result)=>{
//     console.log(result);
// })
// .catch((err)=>{
//     console.log(err); 
// })