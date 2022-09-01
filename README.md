## This is the backend of the booking.io app

Website Link :- [](https://booking-io.vercel.app/)

### Services used

Frontend - Vercel
Backend - Azure App Service
Database - MongoDB

# Schema for DB

<hr>

**City Schema**

displayName:

country:

    code:

    displayName:

    currency:

    code:

    currencyName:

    timeZone:

thumbnailSrc:

**Experience Schema**

cityId:

displayName:

startingPrice:

highlights: [String]

nextAvailable:

duration:

thumbnailSrc:

**Variant Schema**

experienceId:

displayName:

startingTime:

duration:

startingPrice:

price:

    adult:

    children:

    infants:

unavailableDates:[Date]

highlights:[String]

availableTimeSlots:[String]

ticketsLeft:
