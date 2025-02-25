import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
import categoryRoute from './routes/categoryRoute.js'
import productRoute from './routes/productRoute.js'
import cors from "cors"
import path from 'path';
import Stripe from "stripe";



// configure env
dotenv.config();

// database config
connectDB();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json()) // json data can be send in req and res
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'client/dist')));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);


// Payment Route
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.post("/api/payment/create-checkout-session", async (req, res) => {
    try {
        const { cart } = req.body;

        const line_items = cart.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Convert to paisa (Stripe requires amounts in smallest currency unit)
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/dashboard/user/orders`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ error: error.message });
    }
});


app.use('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// port
const PORT = process.env.PORT;

// server listen
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`.bgCyan.white);
})


