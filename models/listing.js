const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review.js")
const { required } = require("joi")
const listingSchema = new  Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
      type:String,
      required:true
    },
    image: {
        filename: {
      type: String,
    },
    url: {
      type: String,
    },
    },
    price: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    Owner:{
      type:Schema.Types.ObjectId,
      ref:"user",
    },
    geometry:{
      type:{
        type:String,
        enum:['Point'],
        required:true,
      },
      coordinates:{
        type:[Number],
        required:true
      }
    },
    category: {
  type: String,
  enum: [
    "Farms",
    "Rooms",
    "Amazing views",
    "Iconic cities",
    "Surfing",
    "Amazing pools",
    "Beach",
    "Cabins",
    "OMG!",
    "Lakefront"
  ],
  required: true
}
})
listingSchema.post("findOneAndDelete",async(listing) => {
  if(listing){
     await Review.deleteMany({_id:{$in : listing.reviews}})
  }
})
const listing = mongoose.model("listing", listingSchema)
module.exports = listing