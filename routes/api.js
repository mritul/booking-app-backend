const express = require("express");
const Booking = require("../models/Booking");
const router = express.Router();
const City = require("../models/City");
const Experience = require("../models/Experience");
const User = require("../models/User");
const Variant = require("../models/Variant");

// For testing purposes to post new data to DB
router.get("/post-city-test", async (req, res) => {
  const city = new City({
    displayName: "Delhi",
    country: {
      code: "IN",
      displayName: "India",
      currency: {
        code: "INR",
        currencyName: "Rupee",
      },
      timeZone: "Asia/Kolkata",
    },
    thumbnailSrc: "https://picsum.photos/150/150/",
  });
  const response = await city.save();
  res.send("Successs");
});

router.get("/post-experience-test", async (req, res) => {
  const experience = new Experience({
    cityId: "63034bbd0373fc4212802628",
    displayName: "Louvre visit",
    startingPrice: 4500,
    highlights: [
      "Lorem ipsum dolor sit amet 1 ",
      "Lorem ipsum dolor sit amet 2 ",
    ],
    nextAvailable: new Date(2022, 7, 23),
    duration: "1hr. - 1.5hr.",
    thumbnailSrc: "https://picsum.photos/200/200",
  });
  const response = await experience.save();
  res.send("Success");
});

router.get("/post-variant-test", async (req, res) => {
  const variant = new Variant({
    experienceId: "63035cd3bcc229d8b394bd98",
    displayName: "Lorem ipsum 2",
    startingTime: "20:00",
    duration: "1hr",
    startingPrice: 6500,
    price: {
      adult: 6500,
      children: 4000,
      infants: 1000,
    },
    unavailableDates: [new Date(2022, 7, 23), new Date(2022, 7, 27)],
    highlights: [
      "Skip the line access to the 2nd level of the Eiffel Tower",
      "Expert bilingual (English and French-speaking) tour guide ",
      "1.5-hr guided tour",
      "Free exploration time post-tour (on your own)",
    ],
    availableTimeSlots: ["10:00 AM", "2:00 PM", "9:00 PM"],
    ticketsLeft: 5,
  });
  const response = await variant.save();
  res.send("Success");
});

// GET - /api/cities -> To find all cities from DB

router.get("/cities", async (req, res) => {
  try {
    const result = await City.find();
    res.send(result);
  } catch (err) {
    throw err;
  }
});

// GET - /api/experiences -> To find all experiences from DB

router.get("/experiences", async (req, res) => {
  try {
    const cityId = req.query.cityId;
    const result = await Experience.find({ cityId: cityId });
    res.send(result);
  } catch (err) {
    throw err;
  }
});

// GET - /api/variants -> To find all variants from DB

router.get("/variants", async (req, res) => {
  try {
    const experienceId = req.query.experienceId;
    const result = await Variant.find({ experienceId: experienceId });
    res.send(result);
  } catch (err) {
    throw err;
  }
});

// GET - /api/experience/:experienceId -> To find all experiences from DB
router.get("/experience/:experienceId", async (req, res) => {
  try {
    const experienceId = req.params.experienceId;
    const result = await Experience.find({ _id: experienceId });
    res.send(result);
  } catch (err) {
    throw err;
  }
});

// GET - /api/variant/:variantId -> To find all variants from DB
router.get("/variant/:variantId", async (req, res) => {
  try {
    const variantId = req.params.variantId;
    const result = await Variant.find({ _id: variantId });
    res.send(result);
  } catch (err) {
    throw err;
  }
});

// GET - /api/bookings/:emailId
router.get("/bookings/:emailId", async (req, res) => {
  try {
    const email = req.params.emailId;
    const userResponse = await User.findOne({ email: email });
    if (userResponse == null) {
      res.json({ bookings: null, message: "This email has no bookings yet" });
    } else {
      const bookingIdsArray = userResponse.bookings;

      // Using the booking ids in the bookingIdsArray, running a forEach and creating a booking details array
      const bookingsArray = [];

      const fetchBookingInfo = async () => {
        return new Promise(async (resolve, reject) => {
          try {
            const bookings = await Booking.find({
              _id: { $in: bookingIdsArray },
            });
            console.log(bookings);
            bookings.forEach(async (booking, idx) => {
              const date = booking.details.date;
              const time = booking.details.time;
              const pax = booking.pax;
              const amount = booking.amount;
              const id = booking.id;
              const experienceId = booking.details.experienceId;
              const variantId = booking.details.variantId;
              const experienceResponse = await Experience.findOne({
                _id: experienceId,
              });
              const cityId = experienceResponse.cityId;
              const variantResponse = await Variant.findOne({ _id: variantId });
              const experience = experienceResponse.displayName;
              const variant = variantResponse.displayName;
              const cityResponse = await City.findOne({ _id: cityId });
              const city = cityResponse.displayName;

              bookingsArray.push({
                id: id,
                experience: experience,
                variant: variant,
                pax: pax,
                date: date,
                time: time,
                amount: amount,
                city: city,
              });

              // Checking if all booking data has been pushed and resolving the promise if yes
              if (idx == bookingIdsArray.length - 1) {
                resolve();
              }
            });
          } catch (error) {
            reject();
          }
        });
      };

      // const fetchBookingInfo = async () => {
      //   return new Promise(async (resolve, reject) => {
      //     try {
      //       const bookings = await Booking.find({
      //         _id: { $in: bookingIdsArray },
      //       });
      //       const experiences = await Experience.find({
      //         _id: { $in: bookings.map((x) => x.details.experienceId) },
      //       });
      //       const variants = await Variant.find({
      //         _id: { $in: bookings.map((x) => x.details.variantId) },
      //       });
      //       const cities = await City.find({
      //         _id: { $in: experiences.map((x) => x.cityId) },
      //       });

      //       for (let i = 0; i < bookingIdsArray.length; i++) {
      //         bookingsArray.push({
      //           id: bookingIdsArray[i],
      //           experience: experiences[i].displayName,
      //           variant: variants[i].displayName,
      //           pax: bookings[i].details.pax,
      //           date: bookings[i].details.date,
      //           time: bookings[i].details.time,
      //           amount: bookings[i].amount,
      //           city: cities[i].displayName,
      //         });

      //         // To know when the fetching operation has completed
      //         if (i == bookingIdsArray.length - 1) {
      //           resolve();
      //         }
      //       }
      //     } catch (error) {
      //       reject(error);
      //     }
      //   });
      // };

      await fetchBookingInfo();

      res.json({
        bookings: bookingsArray,
        message: "Bookings successfully fetched",
      });
    }
  } catch (err) {
    throw err;
  }
});

module.exports = router;
