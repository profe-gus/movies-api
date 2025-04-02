import express,{ Express } from 'express';
import {db } from './lib/connectionDB';
import { userRouter } from './routes/user.route';
import { movieRouter } from './routes';
import showtimeRouter from './routes/showtime.routes';




const app:Express = express();

const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/users", userRouter);
app.use("/movies", movieRouter) ;
app.use("/showtime", showtimeRouter);

db.then(()=>{
    app.listen(port,() => {
        console.log(`Server is running on port ${port}`);
    });
});