    const express=require("express");
    const app=express();
    const mongoose=require("mongoose");
    const methodOverride=require("method-override");
    const session=require("express-session");
    const MongoStore = require('connect-mongo');
    const engine=require("ejs-mate");
    const passport=require("passport");
    const localStat=require("passport-local");
    const User=require("./models/user.js")
    const path=require("path");
    const flash=require("connect-flash");
    const ExpressError=require("./utils/ExpressError.js")
    const listingRouters=require("./routers/Listingroutes.js");
    const reviewsrouters=require("./routers/reviewroutes.js");
    const userRouters=require("./routers/users.js");
    require('dotenv').config(); // always load first
    console.log(process.env.CLOUD_NAME)
    const dburl=process.env.ATLAS_URL;
    const secretkey=process.env.SECRET;
    app.use(methodOverride("_method"))
    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended:true})); 
    app.engine("ejs",engine);
    app.use(express.static(path.join(__dirname,"/public")));
  
    main().then((res)=>{
        console.log("connection sucessful");
    }).catch((err)=>{
        console.log(err);
    })





    async function main(){
        await mongoose.connect(dburl);
    }

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:secretkey
    },
    touchAfter:24*3600

});

store.on("error",(err)=>{
    console.log("Error in mongo store",err);
})
    app.use(session({
        store,
        secret:secretkey
        ,resave:false
        ,saveUninitialized:true
        ,cookie:{
            expires:Date.now()+7*24*60*60*1000,
            maxAge:7*24*60*60*1000,
            httpOnly:true
        }}));
        
        app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localStat(User.authenticate()));   

    passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

        app.use((req,res,next)=>{
            res.locals.success=req.flash("success");
            res.locals.deleted=req.flash("delete");
            res.locals.error=req.flash("error");
            res.locals.currUser=req.user;
            next();
          

        })
        

        // app.get("/user",async(req,res)=>{
        //     let Fakeuser=new User({
        //         email:"jainsparsh231@gmail.com",
        //         username:"Sup_2308"
        //     });

        //    let newUser = await User.register(Fakeuser,"helloworld");
        //    res.send(newUser);

        // })

    app.use("/listings",listingRouters);
    app.use("/listings/:id/reviews",reviewsrouters);
    app.use("/",userRouters);
  


    // app.get("/",(req,res)=>{
    //     res.send("root directory");
    // })

    app.all("*",(req,res,next)=>{
        next(new ExpressError(404,"Page not found")); 
    })


    app.use((err,req,res,next)=>{
        let{status=404,message="Something Went Wrong"}=err;
        res.render("error.ejs",{message});
    });



    app.listen(8080,()=>{
        console.log("Server is listening at",8080);
    })