//jshint esversion: 6
const express =require ("express");
const bodyParser =require("body-parser");
const mongoose =require("mongoose");
const app =express();

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Titaniumbtw:Condora8@cluster0.0mckf.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name:String
};
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name:"Welcome to your todolist"
});
const item2 = new Item({
  name:"hit the + button to add a new item"
});
const item3 = new Item({
  name:"<-- hit this to delete an item"
});
 const defaultItems =[item1, item2, item3];
const listSchema ={
  name: String,
  items:[itemsSchema]
};
const List = mongoose.model("List",listSchema);


app.get("/",function(req,res){


  Item.find({}, function(err,foundItems){
    if (foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if (err){
           console.log(err);
      }else{
          console.log("Successfully Saved");
        }
      });
      res.redirect("/");
    }
    res.render("list", {kindOfDay:"Today", newitems: foundItems});
  });


});
app.get("/:customListName",function(req,res){
  const customListName =req.params.customListName;

  List.findOne({name:customListName}, function(err, foundList){
    if (err){
       console.log(err);
  }else{
    if (!foundList){
      const list = new List({
        name:customListName,
        items:defaultItems
      });
      list.save();
res.redirect("/" + customListName);
    } else{
      res.render("list",{kindOfDay: foundList.name, newitems:foundList.items});
    }

    }

  });
});
app.post("/",function(req,res){
const itemName = req.body.jadid;
const listName = req.body.list;
const item = new Item({
  name: itemName
});
if (listName === "Today"){
  item.save();
  res.redirect("/");
}else {
  List.findOne({name: listName}, function(err, foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+ listName);
  });
}


});
app.post("/delete", function(req,res){
  const checkedItemId=req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId,function(err){
    if (err){
      console.log(err);
    }else{
      console.log("Successfully deleted");
    }
  })
  res.redirect("/");
});



app.get("/work",function(req,res){
  res.render("list",{kindOfDay: "Work List", newitems: workItems});
});

app.listen(3000,function(){
  console.log("serveur is running ");
});
