const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./models/chat.js");
const methodOverride=require("method-override");
const ExpressError=require("./ExpressError");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main()
.then(() =>{
     console.log('connection successful');
 })
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//Index Route:---

app.get("/chats",asyncWrap(async(req,res,next)=>{
   
    let chats=await Chat.find();
   //console.log(chats);
   res.render("index.ejs",{chats});

  })); 

//New Route:------
   app.get("/chats/new",(req,res)=>{
    // throw new ExpressError("page not found",404);
       res.render("new.ejs");
   });

//Create Route:----
  app.post("/chats", asyncWrap(async(req,res,next)=>{
    
        let {from,to,message}=req.body;
      let newChat=new Chat({
          from:from,
          to:to,
          message:message,
          created_at:new Date()
         
      });
         await newChat.save();
          res.redirect("/chats");
    
}));
      
    //WrapAsync Function:----

    function asyncWrap(fn){
        return function(req,res,next){
            fn(req,res,next).catch(err=>next(err));
        };
    }

    // NEW:--Show Route:----
    app.get("/chats/:id",asyncWrap(async(req,res,next)=>{
        
            let{id}=req.params;
        let chat=await Chat.findById(id);
        if(!chat){
            next( new ExpressError("chat not found",404));
        }
        res.render("edit.ejs",{chat});
        
    }))

    // Edit Route:----
    
    app.get("/chats/:id/edit",asyncWrap(async(req,res)=>{
        
            let{id}=req.params;
        let chat=await Chat.findById(id);
        res.render("edit.ejs",{chat});
        
    }))

    //Update Route:----

    app.put("/chats/:id",asyncWrap(async(req,res)=>{
        
            let{id}=req.params;
        let {message: newmessage}=req.body;
        console.log(newmessage);
        let updatedChat=await Chat.findByIdAndUpdate(
            id,{message: newmessage},
            {runValidators:true, new:true});
        console.log(updatedChat);
        res.redirect("/chats");
        
    }));


    //Delete Route:----

    app.delete("/chats/:id",asyncWrap(async(req,res)=>{
       
            let{id}=req.params;
       let deletedChat= await Chat.findByIdAndDelete(id);
       console.log(deletedChat);
       res.redirect("/chats");
        
    }))

    // .then((result)=>{
    //     res.render("index",{chats:result});
    // })
    // .catch((err)=>{
    //     console.log(err);
    // })


            // let chat1=new Chat({
            //     from:"Rajkumar",
            //     to:"Pammi",
            //     message:"hello",
            //     created_at:new Date()
            // })

            // chat1.save()
            // .then((result)=>{
            //     console.log(result);
            // })
            // .catch((err)=>{
            //     console.log(err); 
            // })

app.get("/",(req,res)=>{
    res.send("hello world");
});

//Mongoose Error Handling:---

const handleValidationError=(err)=>{
    console.log("this is validation error,please check");
    console.dir(err.message)
    return err;  
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name==="ValidationError"){
       err= handleValidationError(err);
    }
    next(err)
})

//error handling middleware
app.use((err,req,res,next)=>{
    let {status=404,message="something error occurred"}=err;
    res.status(status).send(message);
})

app.listen(3000,()=>{
    console.log("server is running on port 3000");
});